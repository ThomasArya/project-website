import type { VideoServer } from "../types/movie.tsx";

export interface StreamingServerConfig {
  id: string;
  name: string;
  quality: string;
  speed: "Fast" | "Ultra Fast" | "Normal";
  isVip?: boolean;
  getMovieUrl: (tmdbId: number | string) => string;
  getTvUrl: (
    tmdbId: number | string,
    season: number,
    episode: number,
  ) => string;
}

export const STREAMING_PROVIDERS: StreamingServerConfig[] = [
  {
    id: "vidlink",
    name: "Server 1 (VidLink HD)",
    quality: "1080p",
    speed: "Ultra Fast",
    getMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-net",
    name: "Server 2 (VidSrc VIP)",
    quality: "4K",
    speed: "Ultra Fast",
    isVip: true,
    getMovieUrl: (id) => `https://vidsrc.net/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "multiembed",
    name: "Server 3 (MultiEmbed)",
    quality: "1080p",
    speed: "Fast",
    getMovieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTvUrl: (id, s, e) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "autoembed",
    name: "Server 4 (AutoEmbed)",
    quality: "1080p",
    speed: "Fast",
    getMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "2embed",
    name: "Server 5 (2Embed)",
    quality: "HD",
    speed: "Normal",
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
];

/**
 * Returns a list of working video servers for a given TMDB movie or TV show.
 */
export function getStreamingServers(
  tmdbId: number | string,
  isTv = false,
  season = 1,
  episode = 1,
): VideoServer[] {
  return STREAMING_PROVIDERS.map((provider) => ({
    id: provider.id,
    name: provider.name,
    quality: provider.quality,
    speed: provider.speed,
    isVip: provider.isVip,
    url: isTv
      ? provider.getTvUrl(tmdbId, season, episode)
      : provider.getMovieUrl(tmdbId),
  }));
}

/**
 * Check if the given video URL is an embed/iframe URL or direct video file.
 */
export function isEmbedUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".m3u8")
  ) {
    return false;
  }
  return (
    lower.includes("vidlink.pro") ||
    lower.includes("vidsrc") ||
    lower.includes("multiembed.mov") ||
    lower.includes("autoembed") ||
    lower.includes("2embed") ||
    lower.includes("youtube.com/embed") ||
    lower.includes("embed") ||
    lower.startsWith("http")
  );
}
