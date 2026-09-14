import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListVideo, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { deleteMedia, getAnime } from '../../services/media.service.tsx';
import type { Episode, MovieItem } from '../../types/movie.tsx';
import { MediaForm } from '../../components/admin/MediaForm.tsx';
import { EpisodeForm } from '../../components/admin/EpisodeForm.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { useDebounce } from '../../hooks/useDebounce.tsx';
import { formatCompact } from '../../utils/format.tsx';

export const AdminAnime = () => {
  const { notify } = useToast();
  const [anime, setAnime] = useState<MovieItem[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MovieItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MovieItem | null>(null);
  const [episodeMedia, setEpisodeMedia] = useState<MovieItem | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const debounced = useDebounce(search, 250);

  const load = useCallback(() => {
    getAnime().then(setAnime);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => anime.filter((a) => a.title.toLowerCase().includes(debounced.toLowerCase())),
    [anime, debounced]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Anime</h2>
          <p className="text-sm text-zinc-500">{filtered.length} titles</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anime..."
              aria-label="Search anime"
              className="h-10 w-52 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} aria-hidden /> Add Anime
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Episodes</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={a.poster} alt="" loading="lazy" className="h-14 w-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-100">{a.title}</p>
                      <p className="truncate text-xs text-zinc-500">{a.genres.slice(0, 3).join(' · ')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                      a.animeStatus === 'Ongoing'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-sky-500/15 text-sky-300'
                    }`}
                  >
                    {a.animeStatus ?? 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{a.totalEpisodes ?? a.episodes?.length ?? 0}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={13} className="fill-amber-400" aria-hidden /> {a.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{formatCompact(a.views ?? 0)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Manage episodes for ${a.title}`}
                      onClick={() => { setEpisodeMedia(a); setEditingEpisode(null); }}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <ListVideo size={15} aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${a.title}`}
                      onClick={() => { setEditing(a); setFormOpen(true); }}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={15} aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${a.title}`}
                      onClick={() => setDeleteTarget(a)}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No anime found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MediaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        type="anime"
        existing={editing}
        onSaved={load}
      />

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete anime" description="This action cannot be undone.">
        <p className="text-sm text-zinc-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{deleteTarget?.title}"</span>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (deleteTarget) {
                deleteMedia(deleteTarget.id);
                notify(`Deleted "${deleteTarget.title}"`, 'info');
                load();
              }
              setDeleteTarget(null);
            }}
          >
            <Trash2 size={15} aria-hidden /> Delete
          </Button>
        </div>
      </Modal>

      {episodeMedia && (
        <Modal
          open={Boolean(episodeMedia)}
          onClose={() => setEpisodeMedia(null)}
          size="lg"
          title={`Episodes — ${episodeMedia.title}`}
          description={`${episodeMedia.episodes?.length ?? 0} episodes`}
        >
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={() => { setEditingEpisode(null); setEpisodeMedia(episodeMedia); setEpisodeMedia({ ...episodeMedia }); }}>
              <Plus size={14} aria-hidden /> Add Episode
            </Button>
          </div>
          <div className="space-y-2">
            {(episodeMedia.episodes ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">No episodes yet. Add your first episode.</p>
            )}
            {(episodeMedia.episodes ?? []).map((ep) => (
              <div key={ep.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                <img src={ep.thumbnail} alt="" loading="lazy" className="h-14 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-100">EP {ep.episodeNumber} — {ep.title}</p>
                  <p className="text-xs text-zinc-500">{ep.duration}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Edit episode ${ep.episodeNumber}`}
                  onClick={() => setEditingEpisode(ep)}
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <Pencil size={15} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {episodeMedia && (
        <EpisodeForm
          open={Boolean(editingEpisode) || Boolean(episodeMedia)}
          onClose={() => { setEditingEpisode(null); }}
          media={episodeMedia}
          episode={editingEpisode}
          onSaved={() => {
            getAnime().then((list) => {
              const fresh = list.find((a) => a.id === episodeMedia.id);
              if (fresh) setEpisodeMedia(fresh);
            });
            load();
          }}
        />
      )}
    </div>
  );
};

export default AdminAnime;