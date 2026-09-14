import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Star, Trash2 } from 'lucide-react';
import { useWatchlist } from '../../contexts/WatchlistContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import type { MediaType } from '../../types/movie.tsx';
import { Tabs } from '../../components/ui/Tabs.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { mediaLabel } from '../../utils/media.tsx';

const FILTERS: { label: string; value: MediaType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'Anime', value: 'anime' },
  { label: 'Drama', value: 'drama' },
  { label: 'Series', value: 'series' },
];

export const Watchlist = () => {
  const { watchlist, removeFromWatchlist, filterByType } = useWatchlist();
  const { notify } = useToast();
  const [filter, setFilter] = useState<MediaType | 'all'>('all');

  const items = useMemo(() => filterByType(filter), [filterByType, filter]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Watchlist</h1>
          <p className="mt-1 text-sm text-zinc-400">{watchlist.length} saved title{watchlist.length !== 1 ? 's' : ''}</p>
        </div>
        <Tabs
          tabs={FILTERS.map((f) => ({
            ...f,
            badge: f.value === 'all' ? watchlist.length : watchlist.filter((w) => w.type === f.value).length,
          }))}
          active={filter}
          onChange={(v) => setFilter(v as MediaType | 'all')}
        />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'Your watchlist is empty' : `No ${mediaLabel(filter as MediaType).toLowerCase()}s in your watchlist`}
          description="Add movies, anime, dramas, or series to your watchlist so you can find them easily later."
          action={
            <Link
              to="/movies"
              className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 glow-red"
            >
              <Plus size={16} aria-hidden /> Explore Titles
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <article key={item.id} className="group relative overflow-hidden rounded-xl bg-zinc-900 transition hover:-translate-y-1">
              <Link to={`/${item.type}/${item.id}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="card-gradient absolute inset-0 opacity-0 transition group-hover:opacity-100" />
                  <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-300 backdrop-blur">
                    {mediaLabel(item.type)}
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="truncate text-sm font-semibold text-zinc-100">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star size={11} className="fill-amber-400" aria-hidden /> {item.rating.toFixed(1)}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{item.releaseYear}</span>
                  </div>
                </div>
              </Link>
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                <Link
                  to={`/watch/${item.id}`}
                  aria-label={`Play ${item.title}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:scale-110"
                >
                  <Play size={18} className="ml-0.5 fill-white" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    removeFromWatchlist(item.id);
                    notify(`Removed "${item.title}" from watchlist`, 'info');
                  }}
                  aria-label={`Remove ${item.title} from watchlist`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900/90 text-red-400 shadow-xl ring-1 ring-white/20 transition hover:scale-110 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;