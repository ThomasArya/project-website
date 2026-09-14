import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { searchMedia, getAllGenres, useCatalogLoaded } from '../../services/media.service.tsx';
import type { MediaType, MovieItem } from '../../types/movie.tsx';
import { SearchBar } from '../../components/ui/SearchBar.tsx';
import { Tabs } from '../../components/ui/Tabs.tsx';
import { GenreFilter } from '../../components/movie/GenreFilter.tsx';
import { Dropdown } from '../../components/ui/Dropdown.tsx';
import { MovieCard } from '../../components/movie/MovieCard.tsx';
import { CardGridSkeleton } from '../../components/ui/Skeleton.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { Pagination } from '../../components/ui/Pagination.tsx';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.tsx';
import { mediaLabel } from '../../utils/media.tsx';

const CATEGORIES: { label: string; value: MediaType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Movie', value: 'movie' },
  { label: 'Anime', value: 'anime' },
  { label: 'Drama', value: 'drama' },
  { label: 'Series', value: 'series' },
];

export const Search = () => {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const initialGenre = params.get('genre') ?? 'All';
  const initialSort = params.get('sort') ?? 'relevance';

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState<MediaType | 'all'>('all');
  const [genre, setGenre] = useState(initialGenre);
  const [sort, setSort] = useState(initialSort);
  const [program, setProgram] = useState(1);
  const loading = useSimulatedLoading(400);
  const [genres, setGenres] = useState<string[]>([]);
  const catalogReady = useCatalogLoaded();

  const PAGE_SIZE = 18;

  useEffect(() => {
    if (catalogReady) setGenres(getAllGenres());
  }, [catalogReady]);

  useEffect(() => {
    setProgram(1);
  }, [query, category, genre, sort]);

  const baseResults: MovieItem[] = useMemo(() => {
    void catalogReady;
    let results = query.trim() ? searchMedia(query, category) : [];
    if (genre !== 'All' && genre) {
      results = results.filter((r) => r.genres.includes(genre));
    }
    switch (sort) {
      case 'latest':
        results = [...results].sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'popular':
        results = [...results].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case 'az':
        results = [...results].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return results;
  }, [query, category, genre, sort, catalogReady]);

  const totalPages = Math.max(1, Math.ceil(baseResults.length / PAGE_SIZE));
  const visible = baseResults.slice((program - 1) * PAGE_SIZE, program * PAGE_SIZE);

  const updateParams = () => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (genre !== 'All') next.set('genre', genre);
    if (sort !== 'relevance') next.set('sort', sort);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    const hadQuery = Boolean(params.get('q'));
    if (hadQuery && !query.trim()) {
      // Keep URL in sync when user clears
    } else {
      updateParams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, genre, sort]);

  useEffect(() => {
    setQuery(initialQ);
    setGenre(initialGenre);
    setSort(initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const hasSearched = Boolean(query.trim());

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center text-3xl font-extrabold text-white">Search</h1>
        <p className="mb-6 text-center text-sm text-zinc-400">
          Find movies, anime, dramas, and series across the whole catalog
        </p>
        <SearchBar autoFocus placeholder="Type to search the entire catalog..." />
      </div>

      {hasSearched && (
        <div className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              tabs={CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
              active={category}
              onChange={(v) => setCategory(v as MediaType | 'all')}
            />
            <Dropdown
              label="Sort"
              value={sort}
              options={[
                { label: 'Relevance', value: 'relevance' },
                { label: 'Latest', value: 'latest' },
                { label: 'Most Popular', value: 'popular' },
                { label: 'Highest Rated', value: 'rating' },
                { label: 'A - Z', value: 'az' },
              ]}
              onChange={setSort}
            />
          </div>

          <GenreFilter genres={genres} value={genre} onChange={setGenre} />

          <p className="text-sm text-zinc-500">
            {loading ? (
              'Searching...'
            ) : (
              <>
                <SearchIcon size={14} className="mr-1 inline" aria-hidden />
                {baseResults.length} result{baseResults.length !== 1 ? 's' : ''} for <span className="font-semibold text-zinc-200">"{query}"</span>
                {genre !== 'All' && <> in <span className="font-semibold text-zinc-200">{genre}</span></>}
                {' '}
                {category !== 'all' && <>in <span className="font-semibold text-zinc-200">{mediaLabel(category as MediaType)}</span></>}
              </>
            )}
          </p>
        </div>
      )}

      {loading && hasSearched ? (
        <CardGridSkeleton count={12} />
      ) : hasSearched && baseResults.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No results found"
            description={
              category !== 'all' || genre !== 'All'
                ? `We could not find any ${category !== 'all' ? mediaLabel(category as MediaType) : ''} matching "${query}" with the current filters.`
                : `We could not find anything matching "${query}". Try a different keyword.`
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {visible.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={program} totalPages={totalPages} onChange={setProgram} />
            </div>
          )}
        </>
      )}

      {!hasSearched && (
        <div className="mt-12 flex flex-col items-center gap-2 text-center text-zinc-500">
          <SearchIcon size={40} className="opacity-40" aria-hidden />
          <p>Start typing above to search across the catalog.</p>
        </div>
      )}
    </div>
  );
};

export default Search;