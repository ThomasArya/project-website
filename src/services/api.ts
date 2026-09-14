export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult?: boolean;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbDetail extends TmdbMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string; character: string; profile_path: string | null }[];
  };
}

export interface TmdbTvEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date?: string;
  still_path?: string | null;
  runtime?: number;
}

export interface TmdbTvSeason {
  _id: string;
  air_date: string;
  episodes: TmdbTvEpisode[];
  name: string;
  overview: string;
  season_number: number;
}

export interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  name: string;
}

const DEFAULT_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "1a57b18cb4d8cc4c6bcbcee12d70f0fe";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export const getApiKey = (): string => {
  return localStorage.getItem("custom_tmdb_api_key") || DEFAULT_API_KEY;
};

export const setCustomApiKey = (key: string): void => {
  if (!key || key.trim() === "") {
    localStorage.removeItem("custom_tmdb_api_key");
  } else {
    localStorage.setItem("custom_tmdb_api_key", key.trim());
  }
};

export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/configuration?api_key=${key.trim()}`);
    return res.ok;
  } catch {
    return false;
  }
}

// CJK / Asian scripts title mapping to clean English titles
const CJK_TITLE_MAP: Record<string, string> = {
  // K-Drama
  연인: "My Dearest",
  "눈물의 여왕": "Queen of Tears",
  "선재 업고 튀어": "Lovely Runner",
  "내 남편과 결혼해줘": "Marry My Husband",
  "더 글로리": "The Glory",
  "사랑의 불시착": "Crash Landing on You",
  도깨비: "Guardian: The Lonely and Great God",
  "오징어 게임": "Squid Game",
  "이상한 변호사 우영우": "Extraordinary Attorney Woo",
  무빙: "Moving",
  "이태원 클라쓰": "Itaewon Class",
  빈센조: "Vincenzo",
  "호텔 델루나": "Hotel Del Luna",
  스위트홈: "Sweet Home",
  "지금 우리 학교는": "All of Us Are Dead",
  킹덤: "Kingdom",
  "무인도의 디바": "Castaway Diva",
  "마이 데몬": "My Demon",
  "정신병동에도 아침이 와요": "Daily Dose of Sunshine",
  "힘쎈여자 강남순": "Strong Girl Nam-soon",
  악귀: "Revenant",
  모범택시: "Taxi Driver",
  "비밀의 숲": "Stranger",
  "슬기로운 의사생활": "Hospital Playlist",
  "응답하라 1988": "Reply 1988",
  시그널: "Signal",
  "태양의 후예": "Descendants of the Sun",
  "별에서 온 그대": "My Love from the Star",
  "쌈 마이웨이": "Fight for My Way",
  "김비서가 왜 그럴까": "What's Wrong with Secretary Kim",
  "힘쎈여자 도봉순": "Strong Girl Bong-soon",
  "나의 아저씨": "My Mister",
  "꽃보다 남자": "Boys Over Flowers",
  상속자들: "The Heirs",
  "달의 연인 - 보보경심 려": "Moon Lovers: Scarlet Heart Ryeo",
  "미스터 션샤인": "Mr. Sunshine",
  "갯마을 차차차": "Hometown Cha-Cha-Cha",
  사내맞선: "Business Proposal",
  "스물다섯 스물하나": "Twenty Five Twenty One",
  "작은 아씨들": "Little Women",
  "일타 스캔들": "Crash Course in Romance",

  // Anime
  "家庭教師ヒットマン REBORN!": "Reborn!",
  鬼滅の刃: "Demon Slayer: Kimetsu no Yaiba",
  "귀멸의 칼날": "Demon Slayer",
  進撃の巨人: "Attack on Titan",
  呪術廻戦: "Jujutsu Kaisen",
  チェンソーマン: "Chainsaw Man",
  俺だけレベルアップな件: "Solo Leveling",
  ワンピース: "One Piece",
  "NARUTO -ナルト-": "Naruto",
  "NARUTO -ナルト- 疾風伝": "Naruto Shippuden",
  "SPY×FAMILY": "Spy x Family",
  BLEACH: "Bleach",
  ボルト: "Boruto: Naruto Next Generations",
  僕のヒーローアカデミア: "My Hero Academia",
  薬屋のひとりごと: "The Apothecary Diaries",
  葬送のフリーレン: "Frieren: Beyond Journey's End",
  怪獣8号: "Kaiju No. 8",
  ダンジョン飯: "Delicious in Dungeon",
  "ハイキュー!!": "Haikyu!!",
  "HUNTER×HUNTER": "Hunter x Hunter",
  デスノート: "Death Note",
  鋼の錬金術師: "Fullmetal Alchemist: Brotherhood",
  東京喰種トーキョーグール: "Tokyo Ghoul",
  "ソードアート・オンライン": "Sword Art Online",
  ワンパンマン: "One-Punch Man",
  ブラッククローバー: "Black Clover",
  七つの大罪: "The Seven Deadly Sins",
  "Dr.STONE": "Dr. Stone",
  転生したらスライムだった件: "That Time I Got Reincarnated as a Slime",
  "無職転生 ～異世界行ったら本気だす～":
    "Mushoku Tensei: Jobless Reincarnation",
  推しの子: "Oshi no Ko",
  ブルーロック: "Blue Lock",
  ダンダダン: "Dandadan",
  "Re:ゼロから始める異世界生活": "Re:Zero - Starting Life in Another World",
  名探偵コナン: "Detective Conan",
  ドラゴンボール: "Dragon Ball",
  ドラゴンボールZ: "Dragon Ball Z",
  ドラゴンボール超: "Dragon Ball Super",
  銀魂: "Gintama",
  ジョジョの奇妙な冒険: "JoJo's Bizarre Adventure",
  モブサイコ100: "Mob Psycho 100",
  "ノーゲーム・ノーライフ": "No Game No Life",
  甲鉄城のカバネリ: "Kabaneri of the Iron Fortress",

  // C-Drama
  庆余年: "Joy of Life",
  锦绣未央: "The Princess Weiyoung",
  陈情令: "The Untamed",
  山河令: "Word of Honor",
  长月烬明: "Till the End of the Moon",
  苍兰诀: "Love Between Fairy and Devil",
  星汉灿烂: "Love Like the Galaxy",
  梦华录: "A Dream of Splendor",
  长风渡: "Destined",
  莲花楼: "Mysterious Lotus Casebook",
};

export const hasCjk = (text: string): boolean => {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\uac00-\ud7af\u1100-\u11ff]/.test(
    text,
  );
};

export function cleanToEnglishTitle(
  title: string,
  originalTitle?: string,
): string {
  const cleanTitle = (title || "").trim();
  const cleanOrig = (originalTitle || "").trim();

  // 1. Direct dictionary match
  if (CJK_TITLE_MAP[cleanTitle]) return CJK_TITLE_MAP[cleanTitle];
  if (cleanOrig && CJK_TITLE_MAP[cleanOrig]) return CJK_TITLE_MAP[cleanOrig];

  // 2. If title has no CJK characters, it is already in Latin / English!
  if (!hasCjk(cleanTitle) && cleanTitle.length > 0) return cleanTitle;

  // 3. If original title has no CJK, use original title
  if (cleanOrig && !hasCjk(cleanOrig) && cleanOrig.length > 0) return cleanOrig;

  // 4. Partial dictionary match
  for (const [cjk, eng] of Object.entries(CJK_TITLE_MAP)) {
    if (cleanTitle.includes(cjk) || (cleanOrig && cleanOrig.includes(cjk))) {
      return eng;
    }
  }

  // 5. Fallback: return title
  return cleanTitle || cleanOrig || "Untitled";
}

type QueryParams = Record<string, string | number>;

const toQuery = (params: QueryParams): string =>
  new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();

async function get<T>(path: string, params: QueryParams = {}): Promise<T> {
  const apiKey = getApiKey();
  // Request English by default so TMDB translates Asian titles (Korean, Japanese, Chinese) to English
  const url = `${BASE_URL}${path}?${toQuery({ api_key: apiKey, language: "en-US", ...params })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return res.json() as Promise<T>;
}

interface TmdbResult {
  results: TmdbMovie[];
}

const normalizeShow = (r: Record<string, unknown>): TmdbMovie => {
  const rawTitle = String(r.name ?? r.title ?? "").trim();
  const origTitle = String(r.original_name ?? r.original_title ?? "").trim();
  const title = cleanToEnglishTitle(rawTitle, origTitle);

  return {
    id: Number(r.id),
    title,
    name: title,
    original_title: origTitle,
    original_name: origTitle,
    overview: String(r.overview ?? ""),
    poster_path: (r.poster_path as string | null) ?? null,
    backdrop_path: (r.backdrop_path as string | null) ?? null,
    release_date: String(r.release_date ?? r.first_air_date ?? ""),
    vote_average: Number(r.vote_average),
    vote_count: Number(r.vote_count),
    genre_ids: (r.genre_ids as number[]) ?? [],
    adult: Boolean(r.adult),
  };
};

export async function getPopularMovies(page = 1): Promise<TmdbMovie[]> {
  const data = await get<TmdbResult>("/movie/popular", { page });
  return data.results.map(normalizeShow);
}

export async function getPopularMoviesMultiPage(
  pages = 3,
): Promise<TmdbMovie[]> {
  const pagePromises = Array.from({ length: pages }, (_, i) =>
    getPopularMovies(i + 1),
  );
  const settled = await Promise.allSettled(pagePromises);
  const items: TmdbMovie[] = [];
  settled.forEach((r) => {
    if (r.status === "fulfilled") items.push(...r.value);
  });
  return items;
}

export async function getTrending(
  window: "day" | "week" = "week",
): Promise<TmdbMovie[]> {
  const data = await get<{ results: Array<Record<string, unknown>> }>(
    `/trending/all/${window}`,
  );
  return data.results.map(normalizeShow);
}

export async function getPopularTv(page = 1): Promise<TmdbMovie[]> {
  const data = await get<{ results: Array<Record<string, unknown>> }>(
    "/tv/popular",
    { page },
  );
  return data.results.map(normalizeShow);
}

export async function getPopularTvMultiPage(pages = 2): Promise<TmdbMovie[]> {
  const pagePromises = Array.from({ length: pages }, (_, i) =>
    getPopularTv(i + 1),
  );
  const settled = await Promise.allSettled(pagePromises);
  const items: TmdbMovie[] = [];
  settled.forEach((r) => {
    if (r.status === "fulfilled") items.push(...r.value);
  });
  return items;
}

export async function getDramaMovies(page = 1): Promise<TmdbMovie[]> {
  const data = await get<TmdbResult>("/discover/movie", {
    with_genres: 18,
    sort_by: "popularity.desc",
    page,
  });
  return data.results.map(normalizeShow);
}

export async function getDramaShows(page = 1): Promise<TmdbMovie[]> {
  const data = await get<{ results: Array<Record<string, unknown>> }>(
    "/discover/tv",
    {
      with_genres: 18,
      with_original_language: "ko",
      sort_by: "popularity.desc",
      page,
    },
  );
  return data.results.map(normalizeShow);
}

export async function getDramaShowsMultiPage(pages = 3): Promise<TmdbMovie[]> {
  const pagePromises = Array.from({ length: pages }, (_, i) =>
    getDramaShows(i + 1),
  );
  const settled = await Promise.allSettled(pagePromises);
  const items: TmdbMovie[] = [];
  settled.forEach((r) => {
    if (r.status === "fulfilled") items.push(...r.value);
  });
  return items;
}

export async function getAnimeMovies(page = 1): Promise<TmdbMovie[]> {
  const data = await get<TmdbResult>("/discover/movie", {
    with_genres: 16,
    sort_by: "popularity.desc",
    page,
  });
  return data.results.map(normalizeShow);
}

export async function getAnimeShows(page = 1): Promise<TmdbMovie[]> {
  const data = await get<{ results: Array<Record<string, unknown>> }>(
    "/discover/tv",
    {
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc",
      page,
    },
  );
  return data.results.map(normalizeShow);
}

export async function getAnimeShowsMultiPage(pages = 3): Promise<TmdbMovie[]> {
  const pagePromises = Array.from({ length: pages }, (_, i) =>
    getAnimeShows(i + 1),
  );
  const settled = await Promise.allSettled(pagePromises);
  const items: TmdbMovie[] = [];
  settled.forEach((r) => {
    if (r.status === "fulfilled") items.push(...r.value);
  });
  return items;
}

export async function getMovieGenres(): Promise<TmdbGenre[]> {
  const data = await get<{ genres: TmdbGenre[] }>("/genre/movie/list");
  return data.genres;
}

export async function getMovieDetail(id: number | string): Promise<TmdbDetail> {
  const detail = await get<TmdbDetail>(`/movie/${id}`);
  return {
    ...detail,
    title: cleanToEnglishTitle(detail.title || "", detail.original_title),
  };
}

export async function getTvDetail(id: number | string): Promise<TmdbDetail> {
  const detail = await get<TmdbDetail>(`/tv/${id}`);
  return {
    ...detail,
    title: cleanToEnglishTitle(
      detail.name || detail.title || "",
      detail.original_name,
    ),
  };
}

export async function getTvSeasonEpisodes(
  id: number | string,
  season = 1,
): Promise<TmdbTvSeason> {
  return get<TmdbTvSeason>(`/tv/${id}/season/${season}`);
}

export async function getMovieVideos(
  id: number | string,
): Promise<TmdbVideo[]> {
  const data = await get<{ results: TmdbVideo[] }>(`/movie/${id}/videos`);
  return data.results;
}

export async function getTvVideos(id: number | string): Promise<TmdbVideo[]> {
  const data = await get<{ results: TmdbVideo[] }>(`/tv/${id}/videos`);
  return data.results;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<TmdbMovie[]> {
  const data = await get<TmdbResult>("/search/movie", { query, page });
  return data.results.map(normalizeShow);
}

export const getImageUrl = (
  path: string | null,
  size = "w500",
): string | null => (path ? `${IMAGE_BASE}${size}${path}` : null);
