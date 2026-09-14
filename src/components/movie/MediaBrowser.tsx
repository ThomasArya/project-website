import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { FilterOptions, MovieItem } from '../../types/movie.tsx';
import { filterMedia } from '../../services/media.service.tsx';
import { MovieCard } from './MovieCard.tsx';
import { AnimeCard } from '../anime/AnimeCard.tsx';
import { Dropdown } from '../ui/Dropdown.tsx';
import { GenreFilter } from './GenreFilter.tsx';
import { CardGridSkeleton } from '../ui/Skeleton.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';
import { Pagination } from '../ui/Pagination.tsx';
import { ListFilter } from 'lucide-react';

interface MediaBrowserProps {
  title: string;
  description?: string;
  items: MovieItem[];
  variant: 'movie' | 'anime' | 'series' | 'drama';
  genres: string[];
  showStatusFilter?: boolean;
  statusValues?: string[];
  showCountryFilter?: boolean;
  countryValues?: string[];
  pageSize?: number;
  loading?: boolean;
  headerExtra?: React.ReactNode;
  onReset?: () => void;
}

export const MediaBrowser = ({
  title,
  description,
  items,
  variant,
  genres,
  showStatusFilter = false,
  statusValues = ['All', 'Ongoing', 'Completed'],
  showCountryFilter = false,
  countryValues = [],
  pageSize = 18,
  loading = false,
  headerExtra,
  onReset,
}: MediaBrowserProps) => {
  const [genre, setGenre] = useState('All');
  const [year, setYear] = useState('All');
  const [rating, setRating] = useState('All');
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('latest');
  const [status, setStatus] = useState('All');
  const [country, setCountry] = useState('All');
  const [page, setPage] = useState(1);

  const years = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.releaseYear))).sort((a, b) => b - a).map(String)],
    [items]
  );

  const filtered = useMemo(() => {
    return filterMedia(
      items,
      { genre, year, rating, sortBy, status: status as FilterOptions['status'], country },
      []
    );
  }, [items, genre, year, rating, sortBy, status, country]);

  useEffect(() => {
    setPage(1);
  }, [genre, year, rating, sortBy, status, country]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasActiveFilters = genre !== 'All' || year !== 'All' || rating !== 'All' || status !== 'All' || country !== 'All';

  const Card = variant === 'anime' ? AnimeCard : MovieCard;

  const clearAll = () => {
    setGenre('All');
    setYear('All');
    setRating('All');
    setSortBy('latest');
    setStatus('All');
    setCountry('All');
    onReset?.();
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
        {headerExtra}
      </div>

      {loading ? (
        <CardGridSkeleton count={12} />
      ) : (
        <>
          <div className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
                <SlidersHorizontal size={15} aria-hidden /> Filters
              </span>
              <GenreFilter genres={genres} value={genre} onChange={setGenre} />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Dropdown label="Year" value={year} options={years.map((y) => ({ label: y === 'All' ? 'All Years' : y, value: y }))} onChange={setYear} />
              <Dropdown
                label="Rating"
                value={rating}
                options={[
                  { label: 'Any Rating', value: 'All' },
                  { label: '9+', value: '9' },
                  { label: '8+', value: '8' },
                  { label: '7+', value: '7' },
                  { label: '6+', value: '6' },
                ]}
                onChange={setRating}
              />
              <Dropdown
                label="Sort"
                value={sortBy ?? 'latest'}
                options={[
                  { label: 'Latest', value: 'latest' },
                  { label: 'Most Popular', value: 'popular' },
                  { label: 'Highest Rated', value: 'rating' },
                  { label: 'A - Z', value: 'az' },
                ]}
                onChange={(v) => setSortBy(v as FilterOptions['sortBy'])}
              />
              {showStatusFilter && (
                <Dropdown label="Status" value={status} options={statusValues.map((s) => ({ label: s, value: s }))} onChange={setStatus} />
              )}
              {showCountryFilter && (
                <Dropdown
                  label="Country"
                  value={country}
                  options={['All', ...countryValues].map((c) => ({ label: c, value: c }))}
                  onChange={setCountry}
                />
              )}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <ListFilter size={14} aria-hidden /> Clear all
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try adjusting your filters or search for something else."
              action={
                <button type="button" onClick={clearAll} className="text-sm font-medium text-red-400 hover:underline">
                  Clear all filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {visible.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MediaBrowser;