import { useEffect, useState } from "react";
import {
  getPopularMoviesMultiPage,
  getPopularTvMultiPage,
  getTrending as tmdbTrending,
  getMovieGenres,
  getImageUrl,
  getDramaMovies,
  getDramaShowsMultiPage,
  getAnimeMovies,
  getAnimeShowsMultiPage,
  getMovieDetail,
  getTvDetail,
  getTvSeasonEpisodes,
  cleanToEnglishTitle,
  type TmdbMovie,
} from "./api";
import { getStreamingServers } from "./streaming.service";
import {
  mockMovies,
  mockAnime,
  mockDrama,
  mockSeries,
} from "../data/index.tsx";
import type {
  Episode,
  FilterOptions,
  MediaType,
  MovieItem,
} from "../types/movie.tsx";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

let store: MovieItem[] = [];
let loadPromise: Promise<MovieItem[]> | null = null;
let genreById = new Map<number, string>();

const genreName = (id: number): string => genreById.get(id) ?? "";

const MATURE_GENRE_IDS = [27, 80, 53]; // Horror, Crime, Thriller
const MATURE_KEYWORDS = [
  "violence",
  "blood",
  "gore",
  "sex",
  "erotic",
  "murder",
  "brutal",
  "psychological thriller",
  "revenge",
  "horror",
  "serial killer",
  "mafia",
  "drugs",
  "dark fantasy",
  "zombie",
  "bloody",
  "pembunuhan",
  "kejahatan",
];

const toItem = (t: TmdbMovie, type: MediaType, index: number): MovieItem => {
  const year =
    Number(String(t.release_date ?? "").slice(0, 4)) ||
    new Date().getFullYear();
  const rawTitle = String(t.title ?? t.name ?? "").trim() || "Untitled";
  const origTitle = String(t.original_name ?? t.original_title ?? "").trim();
  const title = cleanToEnglishTitle(rawTitle, origTitle);
  const isTv = type === "anime" || type === "drama" || type === "series";
  const tmdbId = t.id;
  const servers = getStreamingServers(tmdbId, isTv, 1, 1);

  const defaultEpisodeCount = isTv ? 12 : 0;
  const initialEpisodes: Episode[] = isTv
    ? Array.from({ length: defaultEpisodeCount }, (_, i) => ({
        id: `ep-${tmdbId}-${i + 1}`,
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        duration: type === "anime" ? "24m" : "55m",
        thumbnail:
          getImageUrl(t.backdrop_path, "w500") ??
          getImageUrl(t.poster_path, "w500") ??
          "",
        videoUrl: servers[0]?.url ?? "",
        synopsis: `Episode ${i + 1} of ${title}`,
      }))
    : [];

  const descLower = (t.overview || "").toLowerCase();
  const isAdult = Boolean(
    t.adult ||
    (t.genre_ids &&
      t.genre_ids.filter((g) => MATURE_GENRE_IDS.includes(g)).length >= 2) ||
    (t.genre_ids?.includes(27) && t.vote_average >= 6.0) ||
    MATURE_KEYWORDS.some((kw) => descLower.includes(kw)),
  );
  const ageRating = isAdult ? "18+" : year < 2010 ? "16+" : "13+";

  return {
    id: `${type}-${tmdbId}`,
    title,
    originalTitle: origTitle && origTitle !== title ? origTitle : title,
    type,
    poster: getImageUrl(t.poster_path, "w500") ?? "",
    backdrop:
      getImageUrl(t.backdrop_path, "original") ??
      getImageUrl(t.poster_path, "original") ??
      "",
    trailerUrl: "",
    rating: Number(t.vote_average.toFixed(1)),
    voteCount: t.vote_count,
    releaseYear: year,
    duration: isTv
      ? type === "anime"
        ? "24m/ep"
        : "60m/ep"
      : `${1 + (index % 3)}h 45m`,
    quality: isAdult ? "4K" : "FHD",
    genres: (t.genre_ids ?? []).map(genreName).filter(Boolean),
    country:
      type === "anime"
        ? "Japan"
        : type === "drama"
          ? "South Korea"
          : "International",
    description: t.overview || "No description available for this title yet.",
    cast: [],
    featured: index === 0,
    trending: index < 30,
    isPopular: index < 25,
    isLatest: index % 3 === 0,
    isRecommended: index % 3 === 0,
    totalEpisodes: isTv ? defaultEpisodeCount : undefined,
    currentEpisode: isTv ? 1 : undefined,
    animeStatus: isTv ? (index % 2 === 0 ? "Ongoing" : "Completed") : undefined,
    episodes: initialEpisodes,
    servers,
    subtitles: [
      { id: "sub-en", label: "English", language: "en", isDefault: true },
      { id: "sub-id", label: "Indonesian", language: "id" },
    ],
    ageRating,
    views: Math.max(0, Math.round((100 - index * 2) * 1000)),
    createdAt: `${year}-06-15`,
  };
};

async function loadCatalog(): Promise<MovieItem[]> {
  const fill = (items: MovieItem[], fallback: MovieItem[]): MovieItem[] =>
    items.length ? items : clone(fallback);
  try {
    const [
      genresRes,
      moviesRes,
      tvRes,
      trendingRes,
      animeShowsRes,
      animeMoviesRes,
      dramaShowsRes,
      dramaMoviesRes,
    ] = await Promise.allSettled([
      getMovieGenres(),
      getPopularMoviesMultiPage(3),
      getPopularTvMultiPage(2),
      tmdbTrending("week"),
      getAnimeShowsMultiPage(3),
      getAnimeMovies(1),
      getDramaShowsMultiPage(3),
      getDramaMovies(1),
    ]);

    genreById = new Map(
      genresRes.status === "fulfilled"
        ? genresRes.value.map((g) => [g.id, g.name])
        : [],
    );
    const ok = <T,>(r: PromiseSettledResult<T>): T =>
      r.status === "fulfilled" ? r.value : ([] as never);
    const unique = <T extends { id: string }>(list: T[]): T[] => {
      const seen = new Set<string>();
      return list.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    };

    const movies = fill(
      unique(ok(moviesRes).map((m, i) => toItem(m, "movie", i))),
      mockMovies,
    );

    // Combine Anime Shows (TV series) and Anime Movies
    const animeShows = ok(animeShowsRes).map((m, i) => toItem(m, "anime", i));
    const animeMovies = ok(animeMoviesRes).map((m, i) =>
      toItem(m, "anime", i + 100),
    );
    const anime = fill(unique([...animeShows, ...animeMovies]), mockAnime);

    // Combine Drama Shows (K-Drama series) and Drama Movies
    const dramaShows = ok(dramaShowsRes).map((m, i) => toItem(m, "drama", i));
    const dramaMovies = ok(dramaMoviesRes).map((m, i) =>
      toItem(m, "drama", i + 100),
    );
    const drama = fill(unique([...dramaShows, ...dramaMovies]), mockDrama);

    const series = fill(
      unique(ok(tvRes).map((m, i) => toItem(m, "series", i))),
      mockSeries,
    );
    const trendingItems = unique(
      ok(trendingRes).map((m, i) => toItem(m, "movie", i + 200)),
    );

    store = [...trendingItems, ...movies, ...anime, ...drama, ...series];
  } catch {
    store = [...mockMovies, ...mockAnime, ...mockDrama, ...mockSeries];
  }
  return clone(store);
}

export const ensureLoaded = (): Promise<MovieItem[]> => {
  if (!loadPromise) loadPromise = loadCatalog();
  return loadPromise;
};

export const reloadCatalog = (): Promise<MovieItem[]> => {
  loadPromise = loadCatalog();
  return loadPromise;
};

const initCatalog = (): Promise<MovieItem[]> => ensureLoaded();
const getStore = (): MovieItem[] => store;

export const useCatalogLoaded = (): boolean => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    ensureLoaded().then(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);
  return ready;
};

export const getCatalog = async (): Promise<MovieItem[]> =>
  clone(await ensureLoaded());

export const getMovies = async (): Promise<MovieItem[]> =>
  clone((await ensureLoaded()).filter((item) => item.type === "movie"));

export const getAnime = async (): Promise<MovieItem[]> =>
  clone((await ensureLoaded()).filter((item) => item.type === "anime"));

export const getDrama = async (): Promise<MovieItem[]> =>
  clone((await ensureLoaded()).filter((item) => item.type === "drama"));

export const getSeries = async (): Promise<MovieItem[]> =>
  clone((await ensureLoaded()).filter((item) => item.type === "series"));

export const getFeatured = async (): Promise<MovieItem | undefined> => {
  const list = await ensureLoaded();
  return clone(list.find((item) => item.featured) ?? list[0]);
};

export const getTrending = async (): Promise<MovieItem[]> =>
  clone((await ensureLoaded()).filter((item) => item.trending));

export const getById = async (id: string): Promise<MovieItem | undefined> => {
  const list = await ensureLoaded();
  let match = list.find((item) => item.id === id);

  // If not found in memory store, try fetching directly from TMDB
  if (!match) {
    const parts = id.split("-");
    const type = (parts[0] as MediaType) || "movie";
    const rawId = parts.slice(1).join("-");
    const numId = Number(rawId);
    if (!isNaN(numId) && numId > 0) {
      try {
        if (type === "movie") {
          const detail = await getMovieDetail(numId);
          match = toItem(detail, "movie", 0);
        } else {
          const detail = await getTvDetail(numId);
          match = toItem(detail, type, 0);
        }
        if (match) store.push(match);
      } catch {
        // Ignore fallback error
      }
    }
  }

  // If it's a TV show, Anime, or Drama, fetch real Season 1 episodes from TMDB if available
  if (
    match &&
    (match.type === "anime" ||
      match.type === "drama" ||
      match.type === "series")
  ) {
    const rawId = match.id.split("-").slice(1).join("-");
    const numId = Number(rawId);
    if (!isNaN(numId) && numId > 0) {
      try {
        const seasonData = await getTvSeasonEpisodes(numId, 1);
        if (seasonData?.episodes && seasonData.episodes.length > 0) {
          const servers = getStreamingServers(numId, true, 1, 1);
          match.episodes = seasonData.episodes.map((ep) => ({
            id: `ep-${ep.id}`,
            episodeNumber: ep.episode_number,
            title: ep.name || `Episode ${ep.episode_number}`,
            duration: ep.runtime ? `${ep.runtime}m` : "24m",
            thumbnail:
              getImageUrl(ep.still_path ?? null, "w500") ||
              match?.backdrop ||
              match?.poster ||
              "",
            videoUrl: servers[0]?.url ?? "",
            synopsis:
              ep.overview || `Episode ${ep.episode_number} of ${match?.title}`,
            releaseDate: ep.air_date,
          }));
          match.totalEpisodes = match.episodes.length;
        }
      } catch {
        // If TMDB season lookup fails, fallback initial episodes remain intact
      }
    }
  }

  return match ? clone(match) : undefined;
};

export const getRelated = (item: MovieItem, limit = 10): MovieItem[] =>
  clone(
    getStore()
      .filter((m) => m.id !== item.id)
      .filter((m) => m.genres.some((g) => item.genres.includes(g)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit),
  );

export const searchMedia = (
  query: string,
  type?: MediaType | "all",
): MovieItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return clone(
    getStore()
      .filter((item) => (type && type !== "all" ? item.type === type : true))
      .filter(
        (item) =>
          (item.title ?? "").toLowerCase().includes(q) ||
          (item.originalTitle ?? "").toLowerCase().includes(q) ||
          item.genres.some((g) => g.toLowerCase().includes(q)) ||
          (item.country ?? "").toLowerCase().includes(q),
      ),
  );
};

export const filterMedia = (
  list: MovieItem[],
  options: FilterOptions,
  availableGenres: string[],
): MovieItem[] => {
  let result = [...list];

  const genreFilter =
    options.genre && options.genre !== "All" ? options.genre : null;
  if (genreFilter) {
    result = result.filter((item) => item.genres.includes(genreFilter));
  }

  if (options.year && options.year !== "All") {
    result = result.filter((item) => item.releaseYear === Number(options.year));
  }

  if (options.rating && options.rating !== "All") {
    const min = Number(options.rating);
    result = result.filter((item) => item.rating >= min);
  }

  if (options.status && options.status !== "All") {
    result = result.filter(
      (item) =>
        item.animeStatus === options.status ||
        (options.status === "Completed" && item.animeStatus === "Completed"),
    );
  }

  if (options.country && options.country !== "All") {
    result = result.filter((item) =>
      item.country.includes(options.country as string),
    );
  }

  switch (options.sortBy) {
    case "latest":
      result = result.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case "popular":
      result = result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      break;
    case "rating":
      result = result.sort((a, b) => b.rating - a.rating);
      break;
    case "az":
      result = result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      result = result.sort((a, b) => b.releaseYear - a.releaseYear);
  }

  void availableGenres;
  return result;
};

export const addMedia = (item: MovieItem): MovieItem => {
  void initCatalog();
  store = [item, ...store];
  return clone(item);
};

export const updateMedia = (
  id: string,
  patch: Partial<MovieItem>,
): MovieItem | undefined => {
  const idx = getStore().findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  store[idx] = { ...store[idx], ...patch };
  return clone(store[idx]);
};

export const deleteMedia = (id: string): boolean => {
  const before = store.length;
  store = store.filter((m) => m.id !== id);
  return store.length !== before;
};

export const addEpisodeTo = (
  mediaId: string,
  episode: MovieItem["episodes"] extends Array<infer E> ? E : never,
): boolean => {
  const idx = getStore().findIndex((m) => m.id === mediaId);
  if (idx === -1) return false;
  const episodes = store[idx].episodes ?? [];
  store[idx] = {
    ...store[idx],
    episodes: [...episodes, episode],
    totalEpisodes: (store[idx].totalEpisodes ?? 0) + 1,
  };
  return true;
};

export const getAllGenres = (): string[] => {
  const set = new Set<string>();
  getStore().forEach((item) => item.genres.forEach((g) => set.add(g)));
  return Array.from(set).sort();
};
