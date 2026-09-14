import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Flag,
  Play,
  Star,
  Users,
  Heart,
  Check,
} from "lucide-react";
import { getById, getRelated } from "../../services/media.service.tsx";
import type { MovieItem } from "../../types/movie.tsx";
import { useWatchlist } from "../../contexts/WatchlistContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Badge, QualityBadge } from "../../components/ui/Badge.tsx";
import { MovieCarousel } from "../../components/movie/MovieCarousel.tsx";
import { LoadingScreen } from "../../components/ui/Skeleton.tsx";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import { mediaLabel } from "../../utils/media.tsx";
import { formatCompact } from "../../utils/format.tsx";

export const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleFavorite,
    isFavorite,
  } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();

  const [item, setItem] = useState<MovieItem | null>(null);
  const [related, setRelated] = useState<MovieItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const found = await getById(id);
      if (!found) {
        setNotFound(true);
        return;
      }
      setItem(found);
      setRelated(getRelated(found, 12));
      window.scrollTo({ top: 0, behavior: "instant" });
    })();
  }, [id]);

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title="Content not found"
          message="We could not find this title. It may have been removed."
          onRetry={() => navigate("/movies")}
        />
      </div>
    );
  }

  if (!item) return <LoadingScreen label="Loading details..." />;

  const inWatchlist = isInWatchlist(item.id);
  const fav = isFavorite(item.id);

  const handleWatch = () => {
    navigate(`/watch/${item.id}`);
  };

  const handleWatchlist = () => {
    if (!isAuthenticated) {
      notify("Please login to manage your watchlist", "warning");
      navigate("/login");
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(item.id);
      notify(`Removed "${item.title}" from watchlist`, "info");
    } else {
      addToWatchlist(item);
      notify(`Added "${item.title}" to watchlist`, "success");
    }
  };

  const isAnimeOrEpisode =
    item.type === "anime" || item.type === "drama" || item.type === "series";

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[45vh] w-full overflow-hidden md:h-[60vh]">
        <img
          src={item.backdrop}
          alt=""
          className="h-full w-full object-cover blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-black/30" />
        <div className="absolute inset-0 bg-[#08090d]/30" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 -mt-40 mb-12 md:-mt-52">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <img
              src={item.poster}
              alt={`${item.title} poster`}
              className="h-64 w-44 shrink-0 rounded-2xl object-cover shadow-2xl ring-1 ring-white/20 md:h-80 md:w-56"
            />

            <div className="min-w-0 flex-1 pb-2">
                {item.ageRating === '18+' && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-red-500/80 bg-red-600 px-2 py-0.5 text-xs font-black uppercase text-white shadow-lg tracking-wider">
                    18+ Dewasa
                  </span>
                )}
                <Badge tone="red">{mediaLabel(item.type)}</Badge>
                <QualityBadge quality={item.quality} />
                {item.animeStatus && (
                  <Badge
                    tone={item.animeStatus === "Ongoing" ? "emerald" : "sky"}
                  >
                    {item.animeStatus}
                  </Badge>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white md:text-5xl">
                {item.title}
              </h1>
              {item.originalTitle && item.originalTitle !== item.title && (
                <p className="mt-1 text-sm text-zinc-400">
                  {item.originalTitle}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
                <span className="flex items-center gap-1 font-semibold text-amber-400">
                  <Star size={16} className="fill-amber-400" aria-hidden />
                  {item.rating.toFixed(1)}{" "}
                  <span className="text-xs font-normal text-zinc-500">
                    ({formatCompact(item.voteCount ?? 0)} votes)
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} aria-hidden /> {item.releaseYear}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden /> {item.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Flag size={14} aria-hidden /> {item.country}
                </span>
                {item.totalEpisodes && (
                  <span>{item.totalEpisodes} Episodes</span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/search?genre=${encodeURIComponent(g)}`}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-white"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={handleWatch}>
                  <Play size={18} className="fill-white" aria-hidden />
                  Watch Now
                </Button>
                <Button
                  variant={inWatchlist ? "danger" : "outline"}
                  size="lg"
                  onClick={handleWatchlist}
                  aria-pressed={inWatchlist}
                >
                  {inWatchlist ? (
                    <Check size={18} aria-hidden />
                  ) : (
                    <Play size={18} aria-hidden />
                  )}
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    toggleFavorite(item.id);
                    notify(
                      fav ? "Removed from favorites" : "Added to favorites",
                      fav ? "info" : "success",
                    );
                  }}
                  aria-pressed={fav}
                  aria-label="Toggle favorite"
                >
                  <Heart
                    size={18}
                    className={fav ? "fill-red-500 text-red-500" : ""}
                    aria-hidden
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section aria-label="Overview">
              <h2 className="mb-3 text-lg font-bold text-white">Overview</h2>
              <p className="leading-relaxed text-zinc-300">
                {item.description}
              </p>
              {item.director && (
                <p className="mt-4 text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">Director:</span>{" "}
                  {item.director}
                </p>
              )}
              {item.ageRating && (
                <p className="mt-1 text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">
                    Age Rating:
                  </span>{" "}
                  {item.ageRating}
                </p>
              )}
            </section>

            {item.cast.length > 0 && (
              <section aria-label="Cast">
                <div className="mb-4 flex items-center gap-2">
                  <Users size={18} className="text-red-400" aria-hidden />
                  <h2 className="text-lg font-bold text-white">Cast</h2>
                </div>
                <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
                  {item.cast.map((member) => (
                    <div
                      key={member.id}
                      className="flex w-24 shrink-0 flex-col items-center gap-2 text-center"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        loading="lazy"
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                      />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          as {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6" aria-label="Details">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-400">
                Details
              </h3>
              <dl className="space-y-3 text-sm">
                {item.director && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Director</dt>
                    <dd className="text-right text-zinc-200">
                      {item.director}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Country</dt>
                  <dd className="text-right text-zinc-200">{item.country}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Quality</dt>
                  <dd className="text-right">
                    <QualityBadge quality={item.quality} />
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Views</dt>
                  <dd className="text-right text-zinc-200">
                    {formatCompact(item.views ?? 0)}
                  </dd>
                </div>
                {isAnimeOrEpisode && item.totalEpisodes && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Episodes</dt>
                    <dd className="text-right text-zinc-200">
                      {item.totalEpisodes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-600/10 to-transparent p-5">
              <h3 className="mb-2 text-sm font-bold text-white">Smart Tip</h3>
              <p className="text-sm text-zinc-400">
                Press <Badge tone="zinc">Watch Now</Badge> to start instantly.
                Episodes and quality can be changed right inside the player.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-14" aria-label="Related content">
          <MovieCarousel
            title="You May Also Like"
            subtitle="Similar titles based on what you are watching"
            items={related.slice(0, 10)}
            variant={item.type === "anime" ? "anime" : "movie"}
          />
        </section>
      </div>
    // </div>
  
  );
};

export default MediaDetail;
