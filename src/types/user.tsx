import type { MediaType } from './movie.tsx';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  plan: 'Free' | 'Premium' | 'VIP';
  createdAt: string;
  favorites: string[];
}

export interface WatchlistItem {
  id: string;
  title: string;
  type: MediaType;
  poster: string;
  rating: number;
  releaseYear: number;
  genres: string[];
  addedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  mediaId: string;
  title: string;
  type: MediaType;
  poster: string;
  progressSeconds: number;
  durationSeconds: number;
  watchedAt: string;
  episodeId?: string;
  episodeNumber?: number;
}

export interface ContinueWatchingItem extends WatchHistoryItem {
  progressPercent: number;
  isMovie: boolean;
}