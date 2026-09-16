const DEFAULT_API_KEY = "1a57b18cb4d8cc4c6bcbcee12d70f0fe";
const BASE_URL = "https://api.themoviedb.org/3";
const TTL_MS = Number(process.env.CACHE_TTL_MS || 12 * 60 * 60 * 1000);

let CACHE = null;
let cacheTime = 0;

const toQuery = (params) =>
  new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();

async function get(path, params = {}) {
  const request = (key) =>
    fetch(`${BASE_URL}${path}?${toQuery({ api_key: key, language: "en-US", ...params })}`);
  let res = await request(process.env.TMDB_API_KEY || DEFAULT_API_KEY);
  if (!res.ok) res = await request(DEFAULT_API_KEY);
  if (!res.ok) throw new Error(`TMDB ${path} failed (${res.status})`);
  return res.json();
}

async function getPages(path, params, pages) {
  const results = [];
  const settled = await Promise.allSettled(
    Array.from({ length: pages }, (_, i) => get(path, { ...params, page: i + 1 })),
  );
  for (const r of settled) if (r.status === "fulfilled") results.push(...(r.value.results || []));
  return results;
}

const ok = (r, fallback) => (r.status === "fulfilled" ? r.value : fallback);

async function fetchCatalog() {
  const [genresRes, moviesRes, tvRes, trendingRes, animeShowsRes, animeMoviesRes, dramaShowsRes, dramaMoviesRes] =
    await Promise.allSettled([
      get("/genre/movie/list"),
      getPages("/movie/popular", {}, 3),
      getPages("/tv/popular", {}, 2),
      get("/trending/all/week"),
      getPages("/discover/tv", { with_genres: 16, with_original_language: "ja" }, 3),
      get("/discover/movie", { with_genres: 16 }, 1),
      getPages("/discover/tv", { with_genres: 18, with_original_language: "ko" }, 3),
      get("/discover/movie", { with_genres: 18 }, 1),
    ]);

  const genres = ok(genresRes, { genres: [] }).genres || [];

  return {
    genres,
    movies: ok(moviesRes, []),
    tv: ok(tvRes, []),
    trending: ok(trendingRes, { results: [] }).results || [],
    animeShows: ok(animeShowsRes, []),
    animeMovies: ok(animeMoviesRes, { results: [] }).results || [],
    dramaShows: ok(dramaShowsRes, []),
    dramaMovies: ok(dramaMoviesRes, { results: [] }).results || [],
    fetchedAt: new Date().toISOString(),
  };
}

function isUsable(catalog) {
  return (
    Array.isArray(catalog?.movies) &&
    (catalog.movies.length > 0 ||
      catalog.tv.length > 0 ||
      catalog.dramaShows.length > 0 ||
      catalog.animeShows.length > 0)
  );
}

/**
 * Returns the catalog from the in-memory cache, or fetches a fresh one from
 * TMDB. Falls back to the last known catalog when TMDB is unreachable.
 */
export async function getCatalog({ force = false } = {}) {
  if (!force && CACHE && isUsable(CACHE) && Date.now() - cacheTime < TTL_MS) {
    return CACHE;
  }
  try {
    const catalog = await fetchCatalog();
    if (isUsable(catalog)) {
      CACHE = catalog;
      cacheTime = Date.now();
      return catalog;
    }
    throw new Error("TMDB returned no usable data");
  } catch (err) {
    if (CACHE && isUsable(CACHE)) return CACHE;
    throw err;
  }
}