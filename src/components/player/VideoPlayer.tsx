import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Gauge,
  Maximize,
  Minimize,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Settings,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { SubtitleTrack } from "../../types/movie.tsx";
import { clamp, formatDuration } from "../../utils/format.tsx";
import { isEmbedUrl } from "../../services/streaming.service";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  subtitles?: SubtitleTrack[];
  autoPlay?: boolean;
  skipIntroSeconds?: number;
  onBack?: () => void;
  onProgress?: (currentTime: number, duration: number, played: boolean) => void;
}

type ControlModal = null | "speed" | "quality" | "subtitle";

export const VideoPlayer = ({
  src,
  poster,
  title,
  subtitles = [],
  autoPlay = true,
  skipIntroSeconds,
  onBack,
  onProgress,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPercent, setHoverPercent] = useState(0);
  const [modal, setModal] = useState<ControlModal>(null);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("Auto");
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(
    subtitles.find((s) => s.isDefault)?.id ?? null,
  );
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [error, setError] = useState(false);

  const Q = [480, 720, 1080, "Auto"] as const;

  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime, video.duration || 0, !video.paused);
    };
    const onLoaded = () => setDuration(video.duration);
    const onProgressEvt = () => {
      try {
        if (video.buffered.length > 0)
          setBuffered(video.buffered.end(video.buffered.length - 1));
      } catch {
        /* ignore */
      }
    };
    const onEnded = () => setPlaying(false);
    const onError = () => setError(true);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("progress", onProgressEvt);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("progress", onProgressEvt);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [onProgress, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (
      skipIntroSeconds &&
      duration &&
      currentTime < skipIntroSeconds &&
      currentTime > 10
    ) {
      setShowSkipIntro(true);
    } else if (currentTime >= (skipIntroSeconds ?? Infinity)) {
      setShowSkipIntro(false);
    }
    void video;
  }, [currentTime, duration, skipIntroSeconds]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (!videoRef.current?.paused) {
      hideTimer.current = window.setTimeout(
        () => setControlsVisible(false),
        3000,
      );
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (error) {
      video.load();
      setError(false);
    }
    if (video.paused) {
      void video.play().catch(() => setError(true));
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
    revealControls();
  }, [error, revealControls]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const changeVolume = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    const v = clamp(value, 0, 1);
    video.volume = v;
    video.muted = v === 0;
    setVolume(v);
    setMuted(v === 0);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = clamp(seconds, 0, duration || 0);
      setCurrentTime(video.currentTime);
    },
    [duration],
  );

  const onProgressClick = (e: React.MouseEvent) => {
    const el = progressRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    seekTo(ratio * duration);
  };

  const onProgressHover = (e: React.MouseEvent) => {
    const el = progressRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    setHoverTime(ratio * duration);
    setHoverPercent(ratio * 100);
  };

  const skipSeconds = useCallback(
    (amount: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = clamp(video.currentTime + amount, 0, duration || 0);
      revealControls();
    },
    [duration, revealControls],
  );

  const skipIntro = useCallback(() => {
    seekTo(skipIntroSeconds ?? 90);
    setShowSkipIntro(false);
  }, [seekTo, skipIntroSeconds]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "ArrowRight":
          skipSeconds(10);
          break;
        case "ArrowLeft":
          skipSeconds(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(volume - 0.1);
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          break;
      }
    },
    [
      togglePlay,
      toggleMute,
      skipSeconds,
      changeVolume,
      toggleFullscreen,
      volume,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Embed iframe player branch for online streaming servers
  if (isEmbedUrl(src)) {
    return (
      <div
        ref={wrapperRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100 group-hover:opacity-100 md:opacity-100">
          <div className="pointer-events-auto flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="rounded-lg bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/90"
              >
                <ChevronLeft size={18} aria-hidden />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-xs font-semibold text-white drop-shadow sm:text-sm">
                {title}
              </h2>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Reload stream"
              onClick={() => {
                const iframe = wrapperRef.current?.querySelector("iframe");
                if (iframe) iframe.src = src;
              }}
              title="Reload stream"
              className="rounded-lg bg-black/60 p-2 text-zinc-300 backdrop-blur transition hover:bg-black/90 hover:text-white"
            >
              <RefreshCw size={16} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Fullscreen"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="rounded-lg bg-black/60 p-2 text-zinc-300 backdrop-blur transition hover:bg-black/90 hover:text-white"
            >
              {fullscreen ? (
                <Minimize size={16} aria-hidden />
              ) : (
                <Maximize size={16} aria-hidden />
              )}
            </button>
          </div>
        </div>

        <iframe
          key={src}
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;
  const controlsOpacity = controlsVisible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 select-none"
      onMouseMove={revealControls}
      onMouseLeave={() => setModal(null)}
      onKeyDown={(e) => handleKey(e as unknown as KeyboardEvent)}
      tabIndex={0}
      role="application"
      aria-label={`Video player: ${title}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        onClick={togglePlay}
        playsInline
        className="h-full w-full"
        data-testid="video-element"
      >
        {subtitles.map((sub) => (
          <track
            key={sub.id}
            kind="subtitles"
            srcLang={sub.language}
            label={sub.label}
            src={sub.src}
            default={sub.id === activeSubtitle}
          />
        ))}
      </video>

      {poster && currentTime === 0 && !playing && (
        <img
          src={poster}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-center">
          <p className="text-sm text-zinc-300">
            This video could not be played.
          </p>
          <button
            type="button"
            onClick={() => {
              videoRef.current?.load();
              setError(false);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      )}

      {!playing && !error && (
        <button
          type="button"
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:scale-105 hover:bg-red-600/90 fadeIn"
        >
          <Play size={36} className="ml-1 fill-white" aria-hidden />
        </button>
      )}

      {showSkipIntro && playing && (
        <button
          type="button"
          onClick={skipIntro}
          className="absolute right-4 top-20 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
        >
          <SkipForward size={14} className="mr-1.5 inline" aria-hidden />
          Skip Intro
        </button>
      )}

      {/* Top gradient */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent transition-opacity ${controlsOpacity}`}
      />

      {/* Top bar */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center gap-3 p-4 transition-opacity ${controlsOpacity}`}
      >
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="rounded-lg bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white sm:text-base">
            {title}
          </h2>
        </div>
      </div>

      {/* Bottom gradient + controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 transition-opacity ${controlsOpacity}`}
      >
        {/* Progress bar */}
        <div className="group/progress px-2 pb-1">
          <div
            ref={progressRef}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatDuration(currentTime)} of ${formatDuration(duration)}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seekTo(currentTime + 10);
              if (e.key === "ArrowLeft") seekTo(currentTime - 10);
            }}
            onClick={onProgressClick}
            onMouseMove={onProgressHover}
            onMouseLeave={() => setHoverTime(null)}
            className="group relative flex h-5 cursor-pointer items-center"
          >
            <div className="relative h-1 w-full overflow-visible rounded-full bg-white/15 transition-all group-hover/progress:h-1.5">
              <div
                className="absolute h-full rounded-full bg-white/25"
                style={{ width: `${bufferedPct}%` }}
              />
              <div
                className="absolute h-full rounded-full bg-red-500"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-red-500 opacity-0 shadow transition group-hover/progress:opacity-100"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>
            {hoverTime !== null && (
              <div
                className="pointer-events-none absolute -top-9 z-10 -translate-x-1/2 rounded-md bg-black/90 px-2 py-1 text-xs tabular-nums text-white"
                style={{ left: `${hoverPercent}%` }}
              >
                {formatDuration(hoverTime)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 pb-3 sm:gap-2">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={togglePlay}
            className="rounded-lg p-2 text-white transition hover:bg-white/15"
          >
            {playing ? (
              <Pause size={20} className="fill-white" aria-hidden />
            ) : (
              <Play size={20} className="fill-white" aria-hidden />
            )}
          </button>

          <button
            type="button"
            aria-label="Rewind 10 seconds"
            onClick={() => skipSeconds(-10)}
            className="hidden rounded-lg p-2 text-white transition hover:bg-white/15 sm:block"
          >
            <RotateCcw size={18} className="scale-x-[-1]" aria-hidden />
          </button>

          <div className="group flex items-center gap-1.5">
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              {muted || volume === 0 ? (
                <VolumeX size={19} aria-hidden />
              ) : volume > 0.5 ? (
                <Volume2 size={19} aria-hidden />
              ) : (
                <Volume1 size={19} aria-hidden />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="hidden w-16 accent-red-500 sm:block"
            />
          </div>

          <span className="ml-1 text-xs tabular-nums text-zinc-300">
            {formatDuration(currentTime)}{" "}
            <span className="text-zinc-500">/</span> {formatDuration(duration)}
          </span>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            {showSkipIntro && (
              <button
                type="button"
                onClick={skipIntro}
                className="hidden items-center gap-1 rounded-md border border-white/25 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20 lg:inline-flex"
              >
                <SkipForward size={13} aria-hidden /> Skip Intro
              </button>
            )}

            <button
              type="button"
              onClick={() => setModal((m) => (m === "speed" ? null : "speed"))}
              aria-label="Playback speed"
              className="hidden rounded-lg px-2 py-2 text-xs font-bold text-white transition hover:bg-white/15 sm:block"
            >
              {speed}x
            </button>

            {/* Subtitles */}
            <button
              type="button"
              onClick={() =>
                setModal((m) => (m === "subtitle" ? null : "subtitle"))
              }
              aria-label="Subtitles"
              className={`rounded-lg p-2 transition hover:bg-white/15 ${activeSubtitle ? "text-red-400" : "text-white"}`}
            >
              <Subtitles size={19} aria-hidden />
            </button>

            {/* Settings (quality + autoplay) */}
            <button
              type="button"
              onClick={() =>
                setModal((m) => (m === "quality" ? null : "quality"))
              }
              aria-label="Settings"
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              <Settings size={19} aria-hidden />
            </button>

            <button
              type="button"
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              onClick={toggleFullscreen}
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              {fullscreen ? (
                <Minimize size={19} aria-hidden />
              ) : (
                <Maximize size={19} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="absolute bottom-16 right-3 w-52 overflow-hidden rounded-xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl animate-[scaleIn_120ms_ease]">
          {modal === "speed" && (
            <div role="menu" aria-label="Playback speed">
              <p className="border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Speed
              </p>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setSpeed(s);
                    if (videoRef.current) videoRef.current.playbackRate = s;
                    setModal(null);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-white/10 ${
                    speed === s ? "text-red-400" : "text-zinc-200"
                  }`}
                >
                  {s}x{speed === s && <Check size={15} aria-hidden />}
                </button>
              ))}
            </div>
          )}

          {modal === "subtitle" && (
            <div role="menu" aria-label="Subtitles">
              <p className="border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Subtitles
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setActiveSubtitle(null);
                  setModal(null);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-white/10 ${
                  activeSubtitle === null ? "text-red-400" : "text-zinc-200"
                }`}
              >
                Off
                {activeSubtitle === null && <Check size={15} aria-hidden />}
              </button>
              {subtitles.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setActiveSubtitle(sub.id);
                    setModal(null);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-white/10 ${
                    activeSubtitle === sub.id ? "text-red-400" : "text-zinc-200"
                  }`}
                >
                  {sub.label}
                  {activeSubtitle === sub.id && <Check size={15} aria-hidden />}
                </button>
              ))}
            </div>
          )}

          {modal === "quality" && (
            <div role="menu" aria-label="Settings">
              <p className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <Gauge size={13} aria-hidden /> Quality
              </p>
              <div className="p-1">
                {Q.map((q) => (
                  <button
                    key={String(q)}
                    type="button"
                    onClick={() => {
                      setQuality(String(q));
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-white/10 ${
                      quality === String(q) ? "text-red-400" : "text-zinc-200"
                    }`}
                  >
                    {q === "Auto" ? "Auto" : `${q}p`}
                    {quality === String(q) && <Check size={15} aria-hidden />}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-3 py-2.5">
                <span className="text-xs text-zinc-300">Autoplay next</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoplayNext}
                  onClick={() => setAutoplayNext((v) => !v)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${autoplayNext ? "bg-red-600" : "bg-white/20"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      autoplayNext ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
