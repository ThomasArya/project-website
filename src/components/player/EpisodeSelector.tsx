import { Check } from 'lucide-react';
import type { Episode } from '../../types/movie.tsx';

interface EpisodeSelectorProps {
  episodes: Episode[];
  currentEpisode?: number;
  onSelect: (episode: Episode) => void;
}

export const EpisodeSelector = ({ episodes, currentEpisode, onSelect }: EpisodeSelectorProps) => (
  <div>
    <div className="space-y-2">
      {episodes.map((ep) => {
        const active = ep.episodeNumber === currentEpisode;
        return (
          <button
            key={ep.id}
            type="button"
            onClick={() => onSelect(ep)}
            aria-pressed={active}
            className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
              active
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/5'
            }`}
          >
            <img
              src={ep.thumbnail}
              alt=""
              loading="lazy"
              className="h-14 w-24 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${active ? 'text-red-300' : 'text-zinc-100'}`}>
                Episode {ep.episodeNumber}
              </p>
              <p className="truncate text-xs text-zinc-500">{ep.title || ep.synopsis}</p>
              <p className="mt-0.5 text-[11px] text-zinc-600">{ep.duration}</p>
            </div>
            {active && <Check size={16} className="shrink-0 text-red-400" aria-hidden />}
          </button>
        );
      })}
    </div>
  </div>
);

export default EpisodeSelector;