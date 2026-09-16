import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Star } from "lucide-react";
import type { MovieItem } from "../../types/movie.tsx";
import { useWatchlist } from "../../contexts/WatchlistContext.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";
import { QualityBadge } from "../ui/Badge.tsx";

interface MovieCardProps {
  item: MovieItem;
}

export const MovieCard = ({ item }: MovieCardProps) => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
//  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const [loaded, setLoaded] = useState(false);
  const inWatchlist = isInWatchlist(item.id);

  const detailPath = `/${item.type}/${item.id}`;

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id);
      notify(`Removed "${item.title}" from watchlist`, "info");
    } else {
      addToWatchlist(item);
      notify(`Added "${item.title}" to watchlist`, "success");
    }
  };

  return (
    <article
      className="group relative w-40 shrink-0 sm:w-44 md:w-48 lg:w-52"
      data-testid="movie-card"
    >
      <Link
        to={detailPath}
        className="block overflow-hidden rounded-xl bg-zinc-900 transition-transform duration-300 group-hover:-translate-y-1.5"
        aria-label={item.title}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="card-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute right-1.5 top-1.5 flex flex-col items-end gap-1.5">
            {item.ageRating === "18+" && (
              <span className="inline-flex items-center rounded-md border border-red-500/80 bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-lg tracking-wider">
                18+
              </span>
            )}
            {item.quality && <QualityBadge quality={item.quality} />}
            {item.animeStatus === "Ongoing" && (
              <span className="inline-flex rounded-md border border-emerald-500/40 bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                Ongoing
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={
              inWatchlist
                ? `Remove ${item.title} from watchlist`
                : `Add ${item.title} to watchlist`
            }
            onClick={toggleWatchlist}
            className={`absolute left-1.5 top-1.5 rounded-full p-1.5 backdrop-blur transition-all duration-200 ${
              inWatchlist
                ? "bg-red-600 text-white"
                : "bg-black/50 text-white opacity-0 hover:bg-red-600 group-hover:opacity-100"
            }`}
          >
            {inWatchlist ? (
              <Check size={14} aria-hidden />
            ) : (
              <Plus size={14} aria-hidden />
            )}
          </button>

          <button
            type="button"
            aria-label={`Play ${item.title}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/watch/${item.id}`);
            }}
            className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/95 text-white opacity-0 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-red-500 group-hover:opacity-100"
          >
            <Play size={20} className="ml-0.5" aria-hidden />
          </button>
        </div>

        <div className="p-2.5">
          <h3
            className="truncate text-sm font-semibold text-zinc-100"
            title={item.title}
          >
            {item.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="flex items-center gap-0.5 font-medium text-amber-400">
              <Star size={11} className="fill-amber-400" aria-hidden />
              {item.rating.toFixed(1)}
            </span>
            <span aria-hidden>·</span>
            <span>{item.releaseYear}</span>
            {item.totalEpisodes && (
              <>
                <span aria-hidden>·</span>
                <span>{item.totalEpisodes} eps</span>
              </>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-600">
            {item.genres.join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;
