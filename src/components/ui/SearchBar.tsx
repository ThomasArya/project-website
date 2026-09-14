import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CornerDownLeft, Film, Search, X } from 'lucide-react';
import { searchMedia, useCatalogLoaded } from '../../services/media.service.tsx';
import { useDebounce } from '../../hooks/useDebounce.tsx';
import { mediaLabel } from '../../utils/media.tsx';
import storage from '../../services/storage.tsx';
import type { MovieItem } from '../../types/movie.tsx';

const HISTORY_KEY = 'search-history';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'lg';
  onNavigate?: () => void;
}

export const SearchBar = ({ placeholder = 'Search movies, anime, drama, series...', autoFocus = false, size = 'lg', onNavigate }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>(() => storage.get(HISTORY_KEY, []));
  const debounced = useDebounce(query, 300);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const catalogReady = useCatalogLoaded();

  const results: MovieItem[] = useMemo(() => {
    void catalogReady;
    return debounced ? searchMedia(debounced) : [];
  }, [debounced, catalogReady]);
  const suggestions = useMemo(() => {
    const groups = new Map<string, MovieItem[]>();
    results.slice(0, 8).forEach((r) => {
      const list = groups.get(r.type) ?? [];
      list.push(r);
      groups.set(r.type, list);
    });
    return Array.from(groups.entries());
  }, [results]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setHistory((prev) => [q, ...prev.filter((h) => h.toLowerCase() !== q.toLowerCase())].slice(0, 8));
    storage.set(HISTORY_KEY, [q, ...history.filter((h) => h.toLowerCase() !== q.toLowerCase())].slice(0, 8));
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onNavigate?.();
  };

  const total = suggestions.reduce((acc, [, list]) => acc + list.length, 0);
  const flat: MovieItem[] = suggestions.flatMap(([, list]) => list);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && flat[activeIndex]) {
        setQuery('');
        navigate(`/${flat[activeIndex].type}/${flat[activeIndex].id}`);
        onNavigate?.();
        setOpen(false);
      } else {
        submitSearch(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inputClass =
    size === 'lg' ? 'h-11 pl-4 pr-10 text-sm' : 'h-9 pl-9 pr-7 text-sm';

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        {size === 'lg' ? (
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
        ) : null}
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`${inputClass} w-full rounded-xl border border-white/10 bg-white/[0.04] text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-red-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-red-500/20`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-500 transition hover:text-white"
          >
            <X size={15} aria-hidden />
          </button>
        )}
      </div>

      {open && (
        <div
          id="search-suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#141826]/98 shadow-2xl backdrop-blur-xl animate-[scaleIn_140ms_ease]"
        >
          {query.trim() ? (
            <>
              {total > 0 ? (
                <>
                  <div className="scrollbar-thin max-h-80 overflow-y-auto">
                    {suggestions.map(([type, list]) => (
                      <div key={type} className="border-b border-white/5 last:border-0">
                        <p className="flex items-center gap-2 px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          <Film size={12} aria-hidden /> {mediaLabel(type as MovieItem['type'])}
                        </p>
                        {list.map((item) => {
                          const flatIdx = suggestions.flatMap(([, l]) => l).findIndex((m) => m.id === item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setQuery('');
                                navigate(`/${item.type}/${item.id}`);
                                onNavigate?.();
                                setOpen(false);
                              }}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                              className={`flex w-full items-center gap-3 px-4 py-2 text-left transition ${
                                activeIndex === flatIdx ? 'bg-white/10' : 'hover:bg-white/5'
                              }`}
                            >
                              <img
                                src={item.poster}
                                alt=""
                                loading="lazy"
                                className="h-14 w-10 rounded-md object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-zinc-100">{item.title}</p>
                                <p className="text-xs text-zinc-500">
                                  {item.releaseYear} · {item.rating.toFixed(1)} ★
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => submitSearch(query)}
                    className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-white/5"
                  >
                    <CornerDownLeft size={15} aria-hidden />
                    See all results for <span className="font-semibold">"{query}"</span>
                  </button>
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-zinc-400">No results for "{query}"</p>
                  <button
                    type="button"
                    onClick={() => submitSearch(query)}
                    className="mt-2 text-sm font-medium text-red-400 hover:underline"
                  >
                    Search everything for "{query}"
                  </button>
                </div>
              )}
            </>
          ) : history.length > 0 ? (
            <div className="py-2">
              <p className="flex items-center justify-between px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <span>Recent Searches</span>
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    storage.remove(HISTORY_KEY);
                  }}
                  className="text-zinc-500 hover:text-red-400"
                  aria-label="Clear search history"
                >
                  Clear
                </button>
              </p>
              {history.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => submitSearch(term)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  <Clock size={15} className="text-zinc-600" aria-hidden />
                  {term}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-zinc-500">
              Start typing to search across movies, anime, drama & series
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;