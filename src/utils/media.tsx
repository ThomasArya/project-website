import type { MediaType, MovieItem } from '../types/movie.tsx';

export const isAnime = (item: MovieItem): boolean => item.type === 'anime';

export const mediaLabel = (type: MediaType): string => {
  switch (type) {
    case 'movie':
      return 'Movie';
    case 'anime':
      return 'Anime';
    case 'drama':
      return 'Drama';
    case 'series':
      return 'Series';
  }
};

export const episodeDisplay = (item: MovieItem): string => {
  if (!item.totalEpisodes) return '';
  return item.animeStatus === 'Ongoing'
    ? `${item.currentEpisode ?? item.totalEpisodes} / ${item.totalEpisodes} eps`
    : `${item.totalEpisodes} eps`;
};

export const generateId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;