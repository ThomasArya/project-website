import { Link } from 'react-router-dom';
import { Play, RotateCcw } from 'lucide-react';
import type { ContinueWatchingItem } from '../../types/user.tsx';
import { formatDuration } from '../../utils/format.tsx';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
}

export const ContinueWatchingCard = ({ item }: ContinueWatchingCardProps) => (
  <Link
    to={`/watch/${item.mediaId}${item.episodeId ? `?ep=${item.episodeNumber ?? 1}` : ''}`}
    className="group relative block w-64 shrink-0 overflow-hidden rounded-xl bg-zinc-900 transition-transform duration-300 hover:-translate-y-1 sm:w-72"
    aria-label={`Continue watching ${item.title}`}
  >
    <div className="relative aspect-video overflow-hidden">
      <img
        src={item.poster}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <span className="absolute left-2.5 top-2.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-200 backdrop-blur">
        {item.type}
      </span>
      {item.episodeNumber && (
        <span className="absolute right-2.5 top-2.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur">
          EP {item.episodeNumber}
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition group-hover:scale-110">
          {item.progressPercent > 0 ? (
            <Play size={18} className="ml-0.5 fill-white" aria-hidden />
          ) : (
            <RotateCcw size={18} aria-hidden />
          )}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{ width: `${item.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums text-zinc-400">
            {formatDuration(item.durationSeconds - item.progressSeconds)}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default ContinueWatchingCard;