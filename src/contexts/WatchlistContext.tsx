import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MediaType, MovieItem } from '../types/movie.tsx';
import type { ContinueWatchingItem, WatchHistoryItem, WatchlistItem } from '../types/user.tsx';
import storage from '../services/storage.tsx';

interface WatchlistContextValue {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: MovieItem) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  history: WatchHistoryItem[];
  addToHistory: (entry: WatchHistoryItem) => void;
  clearHistory: () => void;
  continueWatching: ContinueWatchingItem[];
  updateProgress: (entry: WatchHistoryItem) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  filterByType: (type: MediaType | 'all') => WatchlistItem[];
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

const toWatchlistItem = (item: MovieItem): WatchlistItem => ({
  id: item.id,
  title: item.title,
  type: item.type,
  poster: item.poster,
  rating: item.rating,
  releaseYear: item.releaseYear,
  genres: item.genres,
  addedAt: new Date().toISOString(),
});

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => storage.get('watchlist', []));
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => storage.get('watch-history', []));
  const [favorites, setFavorites] = useState<string[]>(() => storage.get('favorites', []));

  useEffect(() => storage.set('watchlist', watchlist), [watchlist]);
  useEffect(() => storage.set('watch-history', history), [history]);
  useEffect(() => storage.set('favorites', favorites), [favorites]);

  const addToWatchlist = useCallback((item: MovieItem) => {
    setWatchlist((prev) => {
      if (prev.some((w) => w.id === item.id)) return prev;
      return [toWatchlistItem(item), ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const isInWatchlist = useCallback((id: string) => watchlist.some((w) => w.id === id), [watchlist]);

  const addToHistory = useCallback((entry: WatchHistoryItem) => {
    setHistory((prev) => [entry, ...prev.filter((h) => h.mediaId !== entry.mediaId)].slice(0, 50));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const updateProgress = useCallback((entry: WatchHistoryItem) => {
    setHistory((prev) => {
      const rest = prev.filter((h) => !(h.mediaId === entry.mediaId));
      return [entry, ...rest].slice(0, 50);
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const filterByType = useCallback(
    (type: MediaType | 'all') => (type === 'all' ? watchlist : watchlist.filter((w) => w.type === type)),
    [watchlist]
  );

  const continueWatching = useMemo(
    () =>
      history
        .filter((h) => h.progressSeconds > 0 && h.durationSeconds > 0)
        .map((h) => ({
          ...h,
          progressPercent: Math.min(99, Math.round((h.progressSeconds / h.durationSeconds) * 100)),
          isMovie: !h.episodeNumber,
        })),
    [history]
  );

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      history,
      addToHistory,
      clearHistory,
      continueWatching,
      updateProgress,
      favorites,
      toggleFavorite,
      isFavorite,
      filterByType,
    }),
    [
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      history,
      addToHistory,
      clearHistory,
      continueWatching,
      updateProgress,
      favorites,
      toggleFavorite,
      isFavorite,
      filterByType,
    ]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export const useWatchlist = (): WatchlistContextValue => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
};

export default WatchlistProvider;