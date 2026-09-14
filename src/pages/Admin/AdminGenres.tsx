import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { genres as mockGenres } from '../../data/index.tsx';
import type { Genre } from '../../types/movie.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useDebounce } from '../../hooks/useDebounce.tsx';
import { generateId } from '../../utils/media.tsx';
import { Search } from 'lucide-react';

export const AdminGenres = () => {
  const { notify } = useToast();
  const [list, setList] = useState<Genre[]>(mockGenres);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Genre | null>(null);
  const debounced = useDebounce(search, 200);

  const filtered = useMemo(
    () => list.filter((g) => g.name.toLowerCase().includes(debounced.toLowerCase()) || g.slug.includes(debounced.toLowerCase())),
    [list, debounced]
  );

  const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const addGenre = () => {
    if (!name.trim()) {
      notify('Genre name cannot be empty', 'warning');
      return;
    }
    setList((prev) => [...prev, { id: generateId('genre'), name: name.trim(), slug: slug.trim() || slugify(name), count: 0 }]);
    notify(`Added genre "${name.trim()}"`, 'success');
    setName('');
    setSlug('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Genres & Categories</h2>
          <p className="text-sm text-zinc-500">{filtered.length} genres</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search genres..."
              aria-label="Search genres"
              className="h-10 w-52 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} aria-hidden /> Add Genre
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((genre) => (
          <div key={genre.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="font-semibold text-zinc-100">{genre.name}</p>
              <p className="text-xs text-zinc-500">/{genre.slug} · {genre.count} titles</p>
            </div>
            <button
              type="button"
              aria-label={`Delete genre ${genre.name}`}
              onClick={() => setDeleteTarget(genre)}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={15} aria-hidden />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-zinc-500">No genres found.</p>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Genre" description="Create a new genre or category">
        <div className="space-y-4">
          <div>
            <label htmlFor="genre-name" className="mb-1.5 block text-sm font-medium text-zinc-300">Genre Name</label>
            <input
              id="genre-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value));
              }}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              placeholder="e.g. Sci-Fi"
            />
          </div>
          <div>
            <label htmlFor="genre-slug" className="mb-1.5 block text-sm font-medium text-zinc-300">Slug</label>
            <input
              id="genre-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              placeholder="sci-fi"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={addGenre}><Plus size={14} aria-hidden /> Create Genre</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete genre" description="This action cannot be undone.">
        <p className="text-sm text-zinc-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{deleteTarget?.name}"</span>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => {
            if (deleteTarget) {
              setList((prev) => prev.filter((g) => g.id !== deleteTarget.id));
              notify(`Deleted genre "${deleteTarget.name}"`, 'info');
            }
            setDeleteTarget(null);
          }}>
            <Trash2 size={15} aria-hidden /> Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGenres;