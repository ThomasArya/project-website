import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Key,
  Play,
  Server,
  RefreshCw,
  Film,
  Tv,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { getApiKey, setCustomApiKey, validateApiKey } from "../services/api";
import { getStreamingServers } from "../services/streaming.service";
import { VideoPlayer } from "../components/player/VideoPlayer";

interface SampleItem {
  id: number;
  title: string;
  type: "movie" | "anime" | "drama";
  isTv: boolean;
  totalEpisodes?: number;
}

const SAMPLE_TITLES: SampleItem[] = [
  {
    id: 969681,
    title: "Spider-Man: Brand New Day",
    type: "movie",
    isTv: false,
  },
  { id: 550, title: "Fight Club", type: "movie", isTv: false },
  {
    id: 209867,
    title: "Solo Leveling (Anime)",
    type: "anime",
    isTv: true,
    totalEpisodes: 12,
  },
  {
    id: 95479,
    title: "Jujutsu Kaisen (Anime)",
    type: "anime",
    isTv: true,
    totalEpisodes: 24,
  },
  {
    id: 207384,
    title: "Queen of Tears (K-Drama)",
    type: "drama",
    isTv: true,
    totalEpisodes: 16,
  },
  {
    id: 206693,
    title: "My Dearest (K-Drama)",
    type: "drama",
    isTv: true,
    totalEpisodes: 20,
  },
];

export default function ApiKey() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<
    "valid" | "invalid" | "untested"
  >("untested");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Live tester states
  const [selectedSample, setSelectedSample] = useState<SampleItem>(
    SAMPLE_TITLES[0],
  );
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServerId, setSelectedServerId] = useState("vidlink");

  const testKey = async (key: string) => {
    if (!key) return;
    setIsVerifying(true);
    const valid = await validateApiKey(key);
    setVerifyStatus(valid ? "valid" : "invalid");
    setIsVerifying(false);
  };

  useEffect(() => {
    const currentKey = getApiKey();
    setApiKeyInput(currentKey);
    void testKey(currentKey);
  }, []);

  const handleSaveKey = async () => {
    setCustomApiKey(apiKeyInput);
    await testKey(apiKeyInput);
    setSaveMessage("API Key berhasil disimpan!");
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleResetDefault = async () => {
    setCustomApiKey("");
    const defaultKey = getApiKey();
    setApiKeyInput(defaultKey);
    await testKey(defaultKey);
    setSaveMessage("API Key dikembalikan ke default (.env)!");
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const servers = getStreamingServers(
    selectedSample.id,
    selectedSample.isTv,
    1,
    selectedEpisode,
  );

  const activeServer =
    servers.find((s) => s.id === selectedServerId) ?? servers[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center gap-3">
          <Key className="text-red-500" size={32} />
          Pengaturan API & Server Streaming
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Konfigurasi TMDB API Key untuk katalog metadata & Server Streaming
          Embed untuk menonton Film, Anime, dan Drama.
        </p>
      </div>

      {/* Info Card: Cara Kerja API & Streaming */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <Sparkles className="text-amber-400" size={20} />
          Cara Kerja Sistem Streaming & API Key
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-1 text-sm">
              <Film size={16} className="text-blue-400" /> TMDB API (The Movie
              Database)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Digunakan untuk mengambil{" "}
              <strong>
                metadata film, poster, sinopsis, rating, dan episode serial
              </strong>
              . API key Anda saat ini sudah terhubung dan aktif.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-1 text-sm">
              <Tv size={16} className="text-emerald-400" /> Embed Streaming
              Servers (VidLink, VidSrc, dll)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Digunakan untuk{" "}
              <strong>
                memutar video film & anime per episode secara langsung
              </strong>
              . Bekerja otomatis menggunakan TMDB ID tanpa biaya/kuota API.
            </p>
          </div>
        </div>
      </div>

      {/* API Key Management Box */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          Status & Pengaturan TMDB API Key
        </h2>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              TMDB API Key (v3 auth)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Masukkan API Key TMDB..."
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-4 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                  title={showKey ? "Sembunyikan" : "Tampilkan"}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => testKey(apiKeyInput)}
                disabled={isVerifying}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isVerifying ? "animate-spin" : ""}
                />
                {isVerifying ? "Testing..." : "Tes Key"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {verifyStatus === "valid" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={14} /> TMDB API Key Aktif & Terverifikasi
                </span>
              )}
              {verifyStatus === "invalid" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                  <XCircle size={14} /> API Key Tidak Valid atau Error
                </span>
              )}
              {verifyStatus === "untested" && (
                <span className="text-xs text-zinc-500">
                  Klik 'Tes Key' untuk menguji.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-zinc-400 hover:text-white underline transition"
              >
                Reset ke Default
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
              >
                Simpan Key
              </button>
            </div>
          </div>

          {saveMessage && (
            <p className="text-xs text-emerald-400 font-medium">
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      {/* Live Stream Tester */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="text-red-500 fill-red-500" size={18} />
              Uji Coba Live Streaming Player
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Pilih judul film, anime, atau drama di bawah untuk langsung
              menguji server streaming pemutaran video secara live:
            </p>
          </div>
        </div>

        {/* Title selector pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SAMPLE_TITLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setSelectedSample(sample);
                setSelectedEpisode(1);
              }}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                selectedSample.id === sample.id
                  ? "border-red-500 bg-red-600/20 text-red-300"
                  : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Server & Episode Controls */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Server Selector */}
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
              <Server size={14} className="text-red-400" /> Pilihan Server
              Streaming:
            </label>
            <div className="flex flex-wrap gap-2">
              {servers.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServerId(s.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    activeServer.id === s.id
                      ? "border-red-500 bg-red-600/20 text-red-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  {s.name}{" "}
                  <span className="text-[10px] text-zinc-500">
                    ({s.quality})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Episode Selector (if TV/Anime/Drama) */}
          {selectedSample.isTv && selectedSample.totalEpisodes && (
            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                <Tv size={14} className="text-emerald-400" /> Pilih Episode:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {Array.from(
                  { length: selectedSample.totalEpisodes },
                  (_, i) => i + 1,
                ).map((ep) => (
                  <button
                    key={ep}
                    type="button"
                    onClick={() => setSelectedEpisode(ep)}
                    className={`h-7 w-9 rounded-md border text-xs font-semibold transition ${
                      selectedEpisode === ep
                        ? "border-red-500 bg-red-600 text-white"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Video Player Box */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <div className="border-b border-white/10 bg-zinc-950/80 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-zinc-300 truncate flex items-center gap-2">
              <Server size={14} className="text-red-400" />
              Aktif: {activeServer.name} ({activeServer.quality})
            </span>
            <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] uppercase font-semibold">
              Live Embed
            </span>
          </div>

          <VideoPlayer
            src={activeServer.url}
            title={`${selectedSample.title}${selectedSample.isTv ? ` - Episode ${selectedEpisode}` : ""}`}
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <AlertCircle size={14} />
          Jika salah satu server lambat atau buffering, silakan ganti ke Server
          2 (VidSrc), Server 3 (MultiEmbed), atau Server 4 (AutoEmbed).
        </div>
      </div>
    </div>
  );
}
