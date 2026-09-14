import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { deleteMedia, getMovies } from '../../services/media.service.tsx';
import type { MovieItem } from '../../types/movie.tsx';
import { MediaForm } from '../../components/admin/MediaForm.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { useDebounce } from '../../hooks/useDebounce.tsx';
import { formatCompact } from '../../utils/format.tsx';

export const AdminMovies = () => {
  const { notify } = useToast();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MovieItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MovieItem | null>(null);
  const debounced = useDebounce(search, 250);

  const load = useCallback(() => {
    getMovies().then(setMovies);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      movies.filter((m) => m.title.toLowerCase().includes(debounced.toLowerCase())),
    [movies, debounced]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Movies</h2>
          <p className="text-sm text-zinc-500">{filtered.length} titles</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              aria-label="Search movies"
              className="h-10 w-52 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} aria-hidden /> Add Movie
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((movie) => (
              <tr key={movie.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={movie.poster} alt="" loading="lazy" className="h-14 w-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-100">{movie.title}</p>
                      <p className="truncate text-xs text-zinc-500">{movie.genres.slice(0, 3).join(' · ')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-300">{movie.releaseYear}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={13} className="fill-amber-400" aria-hidden /> {movie.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-cyan-300">{movie.quality}</span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{formatCompact(movie.views ?? 0)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {movie.featured && <span className="rounded bg-red-600/15 px-1.5 py-0.5 text-[10px] font-bold text-red-300">Hero</span>}
                    {movie.trending && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">Hot</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${movie.title}`}
                      onClick={() => { setEditing(movie); setFormOpen(true); }}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={15} aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${movie.title}`}
                      onClick={() => setDeleteTarget(movie)}
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
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MediaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        type="movie"
        existing={editing}
        onSaved={load}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete movie"
        description="This action cannot be undone."
      >
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
    </div>
  );
};

export default AdminMovies;