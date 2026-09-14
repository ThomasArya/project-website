export type MediaType = 'movie' | 'anime' | 'drama' | 'series';

export type Quality = 'HD' | 'FHD' | '4K' | 'CAM';

export type AnimeStatus = 'Ongoing' | 'Completed';

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  synopsis?: string;
  releaseDate?: string;
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface VideoServer {
  id: string;
  name: string;
  quality: string;
  url: string;
  speed: 'Fast' | 'Ultra Fast' | 'Normal';
  isVip?: boolean;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src?: string;
  isDefault?: boolean;
}

export interface MovieItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  rating: number;
  voteCount?: number;
  releaseYear: number;
  duration: string;
  quality: Quality;
  genres: string[];
  country: string;
  description: string;
  director?: string;
  cast: CastMember[];
  featured?: boolean;
  trending?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
  isRecommended?: boolean;
  totalEpisodes?: number;
  currentEpisode?: number;
  animeStatus?: AnimeStatus;
  episodes?: Episode[];
  servers?: VideoServer[];
  subtitles?: SubtitleTrack[];
  ageRating?: string;
  views?: number;
  createdAt: string;
}

export interface FilterOptions {
  genre?: string;
  year?: number | string;
  rating?: number | string;
  sortBy?: 'latest' | 'popular' | 'rating' | 'az';
  category?: string;
  status?: AnimeStatus | 'All';
  country?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}
