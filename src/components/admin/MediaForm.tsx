import { useEffect, useMemo, useState } from 'react';
import type { AnimeStatus, MediaType, MovieItem, Quality } from '../../types/movie.tsx';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { addMedia, updateMedia, getAllGenres, useCatalogLoaded } from '../../services/media.service.tsx';
import { generateId } from '../../utils/media.tsx';

interface MediaFormProps {
  open: boolean;
  onClose: () => void;
  type: MediaType;
  existing?: MovieItem | null;
  onSaved?: (item: MovieItem) => void;
}

const inputClass =
  'h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 placeholder-zinc-600';

const labelClass = 'mb-1.5 block text-sm font-medium text-zinc-300';

export const MediaForm = ({ open, onClose, type, existing, onSaved }: MediaFormProps) => {
  const { notify } = useToast();
  const catalogReady = useCatalogLoaded();
  const allGenres = useMemo(() => (catalogReady ? getAllGenres() : []), [catalogReady]);

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [rating, setRating] = useState('7.5');
  const [releaseYear, setReleaseYear] = useState(String(new Date().getFullYear()));
  const [duration, setDuration] = useState('2h');
  const [quality, setQuality] = useState<Quality>('HD');
  const [country, setCountry] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState('');
  const [animeStatus, setAnimeStatus] = useState<AnimeStatus | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(existing?.title ?? '');
    setOriginalTitle(existing?.originalTitle ?? '');
    setPoster(existing?.poster ?? '');
    setBackdrop(existing?.backdrop ?? '');
    setRating(String(existing?.rating ?? 7.5));
    setReleaseYear(String(existing?.releaseYear ?? new Date().getFullYear()));
    setDuration(existing?.duration ?? '2h');
    setQuality(existing?.quality ?? 'HD');
    setCountry(existing?.country ?? '');
    setGenres(existing?.genres ?? []);
    setDescription(existing?.description ?? '');
    setDirector(existing?.director ?? '');
    setFeatured(existing?.featured ?? false);
    setTrending(existing?.trending ?? false);
    setTotalEpisodes(existing?.totalEpisodes ? String(existing.totalEpisodes) : '');
    setAnimeStatus(existing?.animeStatus ?? (type === 'anime' ? 'Ongoing' : ''));
  }, [open, existing, type]);

  const toggleGenre = (g: string) => {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !poster.trim() || !country.trim()) {
      notify('Please fill in title, poster, and country', 'warning');
      return;
    }
    setSaving(true);
    const item: MovieItem = {
      id: existing?.id ?? generateId(type),
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      type,
      poster: poster.trim(),
      backdrop: backdrop.trim() || poster.trim(),
      rating: Math.min(10, Math.max(0, Number(rating) || 0)),
      releaseYear: Number(releaseYear) || new Date().getFullYear(),
      duration: duration.trim() || '2h',
      quality,
      genres: genres.length ? genres : ['Drama'],
      country: country.trim(),
      cast: existing?.cast ?? [],
      description: description.trim() || 'No description provided.',
      director: director.trim() || undefined,
      featured,
      trending,
      isPopular: existing?.isPopular ?? false,
      isRecommended: existing?.isRecommended ?? false,
      episodes: existing?.episodes,
      servers: existing?.servers,
      subtitles: existing?.subtitles,
      totalEpisodes: totalEpisodes ? Number(totalEpisodes) : existing?.totalEpisodes,
      currentEpisode: existing?.currentEpisode,
      animeStatus: animeStatus || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      ageRating: existing?.ageRating,
      views: existing?.views,
    };

    if (existing) {
      updateMedia(existing.id, item);
      notify(`Updated "${item.title}"`, 'success');
    } else {
      addMedia(item);
      notify(`Added "${item.title}"`, 'success');
    }
    setSaving(false);
    onSaved?.(item);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={existing ? `Edit ${type}` : `Add New ${type}`}
      description={`Manage the details for this ${type} title`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mf-title" className={labelClass}>Title *</label>
            <input id="mf-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Enter title" />
          </div>
          <div>
            <label htmlFor="mf-original" className={labelClass}>Original Title</label>
            <input id="mf-original" value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} className={inputClass} placeholder="Original / native title" />
          </div>
          <div>
            <label htmlFor="mf-poster" className={labelClass}>Poster URL *</label>
            <input id="mf-poster" type="url" value={poster} onChange={(e) => setPoster(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="mf-backdrop" className={labelClass}>Backdrop URL</label>
            <input id="mf-backdrop" type="url" value={backdrop} onChange={(e) => setBackdrop(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="mf-rating" className={labelClass}>Rating (0 - 10)</label>
            <input id="mf-rating" type="number" min={0} max={10} step={0.1} value={rating} onChange={(e) => setRating(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="mf-year" className={labelClass}>Release Year</label>
            <input id="mf-year" type="number" min={1900} max={2100} value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="mf-duration" className={labelClass}>Duration</label>
            <input id="mf-duration" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="2h 10m" />
          </div>
          <div>
            <label htmlFor="mf-country" className={labelClass}>Country *</label>
            <input id="mf-country" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="USA, Japan, ..." />
          </div>
          <div>
            <label htmlFor="mf-director" className={labelClass}>Director</label>
            <input id="mf-director" value={director} onChange={(e) => setDirector(e.target.value)} className={inputClass} placeholder="Director name" />
          </div>
          <div>
            <label htmlFor="mf-quality" className={labelClass}>Quality</label>
            <select id="mf-quality" value={quality} onChange={(e) => setQuality(e.target.value as Quality)} className={inputClass}>
              {['HD', 'FHD', '4K', 'CAM'].map((q) => (
                <option key={q} value={q} className="bg-zinc-900">{q}</option>
              ))}
            </select>
          </div>

          {(type === 'anime' || type === 'drama' || type === 'series') && (
            <>
              <div>
                <label htmlFor="mf-episodes" className={labelClass}>Total Episodes</label>
                <input id="mf-episodes" type="number" min={1} value={totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value)} className={inputClass} placeholder="24" />
              </div>
              {type === 'anime' && (
                <div>
                  <label htmlFor="mf-status" className={labelClass}>Status</label>
                  <select id="mf-status" value={animeStatus} onChange={(e) => setAnimeStatus(e.target.value as AnimeStatus)} className={inputClass}>
                    <option value="Ongoing" className="bg-zinc-900">Ongoing</option>
                    <option value="Completed" className="bg-zinc-900">Completed</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <label className={labelClass}>Genres</label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={genres.includes(g)}
                onClick={() => toggleGenre(g)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  genres.includes(g)
                    ? 'border-red-500/60 bg-red-600/20 text-red-300'
                    : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="mf-desc" className={labelClass}>Description</label>
          <textarea
            id="mf-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} h-auto py-2.5`}
            placeholder="Short synopsis..."
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-red-600" />
            Featured (Hero banner)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} className="h-4 w-4 accent-red-600" />
            Trending
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : existing ? 'Save Changes' : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MediaForm;