import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MovieItem } from '../../types/movie.tsx';
import { MovieCard } from './MovieCard.tsx';
import { AnimeCard } from '../anime/AnimeCard.tsx';
import { RowSkeleton } from '../ui/Skeleton.tsx';
import { Link } from 'react-router-dom';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  items: MovieItem[];
  loading?: boolean;
  variant?: 'movie' | 'anime';
  viewAllHref?: string;
  emptyMessage?: string;
}

export const MovieCarousel = ({
  title,
  subtitle,
  items,
  loading = false,
  variant = 'movie',
  viewAllHref,
  emptyMessage,
}: MovieCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 600) * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const Card: (props: { item: MovieItem }) => ReactNode = variant === 'anime' ? AnimeCard : MovieCard;

  return (
    <section className="group/carousel relative" aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="text-sm font-medium text-red-400 transition hover:text-red-300 hover:underline"
            >
              View All
            </Link>
          )}
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollBy(-1)}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollBy(1)}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {loading ? (
        <RowSkeleton count={8} />
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-zinc-500">
          {emptyMessage ?? 'No items available yet.'}
        </p>
      ) : (
        <div ref={trackRef} className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieCarousel;