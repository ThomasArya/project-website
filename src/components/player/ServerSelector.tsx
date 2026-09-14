import { Server, Zap } from 'lucide-react';
import type { VideoServer } from '../../types/movie.tsx';

interface ServerSelectorProps {
  servers: VideoServer[];
  activeServerId: string;
  onSelect: (server: VideoServer) => void;
  isPremium?: boolean;
}

export const ServerSelector = ({ servers, activeServerId, onSelect, isPremium = true }: ServerSelectorProps) => (
  <div>
    <div className="flex flex-wrap gap-2">
      {servers.map((server) => {
        const active = server.id === activeServerId;
        const locked = server.isVip && !isPremium;
        return (
          <button
            key={server.id}
            type="button"
            onClick={() => !locked && onSelect(server)}
            disabled={locked}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              active
                ? 'border-red-500/60 bg-red-600/20 text-red-300'
                : locked
                  ? 'border-white/10 bg-white/[0.02] text-zinc-600'
                  : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/25 hover:text-white'
            }`}
          >
            <Server size={14} aria-hidden />
            {server.name}
            {server.speed === 'Ultra Fast' && <Zap size={12} className="text-amber-400" aria-hidden />}
            <span className="rounded bg-white/10 px-1 text-[10px]">{server.quality}</span>
            {server.isVip && <span className="rounded bg-gradient-to-r from-amber-500 to-red-500 px-1 text-[10px] font-bold text-black">VIP</span>}
          </button>
        );
      })}
    </div>
  </div>
);

export default ServerSelector;