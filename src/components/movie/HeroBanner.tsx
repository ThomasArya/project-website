import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Play, Plus, Check, Star, Info } from "lucide-react";
import type { MovieItem } from "../../types/movie.tsx";
import { useWatchlist } from "../../contexts/WatchlistContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";
import { getFeatured } from "../../services/media.service.tsx";

export const HeroBanner = () => {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  //const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getFeatured().then((featured) => {
      if (featured) setItems([featured]);
    });
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [items.length]);

  const current = items[index] ?? items[0];
  const inWatchlist = current ? isInWatchlist(current.id) : false;

  if (!current) return null;

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(current.id);
      notify(`Removed "${current.title}" from watchlist`, "info");
    } else {
      addToWatchlist(current);
      notify(`Added "${current.title}" to watchlist`, "success");
    }
  };

  const handleWatch = () => {
    navigate(`/watch/${current.id}`);
  };

  return (
    <section
      className="relative -mt-16 flex min-h-[70vh] w-full items-end overflow-hidden md:min-h-[85vh]"
      aria-label="Featured content"
    >
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.backdrop}
          alt=""
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-mobile-gradient absolute inset-0 md:hidden" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pb-12 sm:px-6 md:pb-20 lg:px-8">
        <div
          className="max-w-2xl animate-slide-up space-y-4"
          key={`content-${current.id}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              #1 Featured
            </span>
            <span className="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur">
              {current.type === "movie"
                ? "Movie"
                : current.type === "anime"
                  ? "Anime"
                  : current.type === "drama"
                    ? "Drama"
                    : "Series"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-6xl">
            {current.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-300">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Star size={15} className="fill-amber-400" aria-hidden />
              {current.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden /> {current.releaseYear}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden /> {current.duration}
            </span>
            <span className="text-zinc-400">
              {current.genres.slice(0, 3).join(" · ")}
            </span>
            {current.ageRating === "18+" && (
              <span className="rounded border border-red-500/80 bg-red-600 px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-lg tracking-wider">
                18+
              </span>
            )}
            {current.quality && (
              <span className="rounded border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 text-[11px] font-bold text-cyan-300">
                {current.quality}
              </span>
            )}
          </div>

          <p className="line-clamp-3 max-w-xl text-sm text-zinc-300 sm:text-base">
            {current.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleWatch}
              className="flex h-11 items-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-500 hover:scale-[1.02] active:scale-95 glow-red"
            >
              <Play size={18} className="fill-white" aria-hidden />
              Watch Now
            </button>
            <button
              type="button"
              onClick={toggleWatchlist}
              className={`flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-semibold backdrop-blur transition active:scale-95 ${
                inWatchlist
                  ? "border-red-500/50 bg-red-500/15 text-red-300"
                  : "border-white/20 bg-white/5 text-white hover:bg-white/15"
              }`}
            >
              {inWatchlist ? (
                <Check size={18} aria-hidden />
              ) : (
                <Plus size={18} aria-hidden />
              )}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </button>
            <Link
              to={`/${current.type}/${current.id}`}
              className="flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-zinc-200 underline-offset-4 transition hover:text-white hover:underline"
            >
              <Info size={18} aria-hidden />
              More Info
            </Link>
          </div>
        </div>

        {items.length > 1 && (
          <div
            className="mt-8 flex items-center gap-2"
            role="tablist"
            aria-label="Featured carousel"
          >
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${item.title}`}
                onClick={() => {
                  setIndex(i);
                  setLoaded(false);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-10 bg-red-500"
                    : "w-5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
