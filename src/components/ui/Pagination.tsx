import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination = ({ page, totalPages, onChange, siblingCount = 1 }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = new Set<number>([1, totalPages]);
  for (let i = Math.max(2, page - siblingCount); i <= Math.min(totalPages - 1, page + siblingCount); i++) {
    pages.add(i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: (number | 'ellipsis')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push('ellipsis');
    items.push(p);
  });

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronLeft size={16} aria-hidden />
      </button>
      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-zinc-600">
            ...
          </span>
        ) : (
          <button
            key={`p-${item}`}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={page === item ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
              page === item
                ? 'bg-red-600 text-white shadow'
                : 'border border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  );
};

export default Pagination;