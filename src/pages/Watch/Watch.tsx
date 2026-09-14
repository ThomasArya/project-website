import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { getById, getRelated } from "../../services/media.service.tsx";
import { getStreamingServers } from "../../services/streaming.service";
import type { Episode, MovieItem } from "../../types/movie.tsx";
import { VideoPlayer } from "../../components/player/VideoPlayer.tsx";
import { EpisodeSelector } from "../../components/player/EpisodeSelector.tsx";
import { ServerSelector } from "../../components/player/ServerSelector.tsx";
import { MovieCarousel } from "../../components/movie/MovieCarousel.tsx";
import { LoadingScreen } from "../../components/ui/Skeleton.tsx";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import { useWatchlist } from "../../contexts/WatchlistContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Badge, QualityBadge } from "../../components/ui/Badge.tsx";
import { mediaLabel } from "../../utils/media.tsx";

export const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateProgress } = useWatchlist();
  const { user } = useAuth();

  const [item, setItem] = useState<MovieItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [serverId, setServerId] = useState("vidlink");

  useEffect(() => {
    if (!id) return;
    getById(id).then((found) => {
      if (!found) {
        setNotFound(true);
        return;
      }
      setItem(found);
      setEpisode(null);
      window.scrollTo({ top: 0 });
    });
  }, [id]);

  const isTv =
    item?.type === "anime" || item?.type === "drama" || item?.type === "series";
  const rawTmdbId = item?.id ? item.id.split("-").slice(1).join("-") : "";
  const tmdbId = Number(rawTmdbId) || rawTmdbId;

  const hasEpisodes = Boolean(item?.episodes?.length);
  const episodes = item?.episodes ?? [];
  const epParam = params.get("ep");
  const currentEpisodeNumber =
    episode?.episodeNumber ??
    (epParam ? Number(epParam) : (item?.currentEpisode ?? 1));
  const activeEpisode =
    episode ??
    episodes.find((e) => e.episodeNumber === currentEpisodeNumber) ??
    episodes[0];

  const currentServers = useMemo(() => {
    if (!item) return [];
    const epNum = activeEpisode?.episodeNumber ?? 1;
    return getStreamingServers(tmdbId, isTv, 1, epNum);
  }, [item, tmdbId, isTv, activeEpisode?.episodeNumber]);

  useEffect(() => {
    if (
      currentServers.length > 0 &&
      !currentServers.some((s) => s.id === serverId)
    ) {
      setServerId(currentServers[0].id);
    }
  }, [currentServers, serverId]);

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <ErrorState
          title="Content not found"
          onRetry={() => navigate("/movies")}
        />
      </div>
    );
  }

  if (!item) return <LoadingScreen label="Booting up the player..." />;

  const activeServer =
    currentServers.find((s) => s.id === serverId) ??
    currentServers[0] ??
    item.servers?.[0];

  const episodeIndex = episodes.findIndex((e) => e.id === activeEpisode?.id);
  const hasPrev = episodeIndex > 0;
  const hasNext = episodeIndex < episodes.length - 1;

  const switchEpisode = (ep: Episode) => {
    setEpisode(ep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProgress = (
    current: number,
    duration: number,
    played: boolean,
  ) => {
    updateProgress({
      id: `${item.id}-${activeEpisode?.id ?? "movie"}`,
      mediaId: item.id,
      title: item.title,
      type: item.type,
      poster: item.backdrop,
      progressSeconds: current,
      durationSeconds: duration,
      watchedAt: new Date().toISOString(),
      episodeId: activeEpisode?.id,
      episodeNumber: activeEpisode?.episodeNumber,
    });
    void played;
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(`/${item.type}/${item.id}`)}
          aria-label="Back to details"
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <div>
          <Link
            to={`/${item.type}/${item.id}`}
            className="text-xl font-extrabold text-white transition hover:text-red-400"
          >
            {item.title}
          </Link>
          <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <Badge tone="red">{mediaLabel(item.type)}</Badge>
            {item.quality && <QualityBadge quality={item.quality} />}
            {hasEpisodes && activeEpisode && (
              <span>Episode {activeEpisode.episodeNumber}</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <VideoPlayer
            src={activeServer?.url ?? ""}
            poster={item.backdrop}
            title={
              hasEpisodes && activeEpisode
                ? `${item.title} — EP ${activeEpisode.episodeNumber}`
                : item.title
            }
            subtitles={item.subtitles}
            skipIntroSeconds={hasEpisodes ? 90 : undefined}
            onBack={() => navigate(`/${item.type}/${item.id}`)}
            onProgress={handleProgress}
          />

          {currentServers.length > 1 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <Layers size={16} className="text-red-400" aria-hidden />{" "}
                Streaming Servers
              </h3>
              <ServerSelector
                servers={currentServers}
                activeServerId={serverId}
                onSelect={(s) => setServerId(s.id)}
                isPremium={user?.plan !== "Free"}
              />
            </div>
          )}

          {hasEpisodes && activeEpisode && (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() =>
                  activeEpisode &&
                  episodes[episodeIndex - 1] &&
                  switchEpisode(episodes[episodeIndex - 1])
                }
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-200 transition hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronLeft size={16} aria-hidden /> Previous Episode
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() =>
                  activeEpisode &&
                  episodes[episodeIndex + 1] &&
                  switchEpisode(episodes[episodeIndex + 1])
                }
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-40"
              >
                Next Episode <ChevronRight size={16} aria-hidden />
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="mb-2 text-lg font-bold text-white">{item.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              {activeEpisode?.synopsis ?? item.description}
            </p>
          </div>
        </div>

        {hasEpisodes && (
          <aside className="space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                Episodes{" "}
                <span className="text-zinc-500">({episodes.length})</span>
              </h3>
              <EpisodeSelector
                episodes={episodes}
                currentEpisode={activeEpisode?.episodeNumber}
                onSelect={switchEpisode}
              />
            </div>
          </aside>
        )}
      </div>

      <section className="mt-12" aria-label="Related content">
        <MovieCarousel
          title="You May Also Like"
          items={getRelated(item, 10)}
          variant={item.type === "anime" ? "anime" : "movie"}
        />
      </section>
    </div>
  );
};

export default Watch;
