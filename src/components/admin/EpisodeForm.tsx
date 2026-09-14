import { useEffect, useState } from 'react';
import type { Episode, MovieItem } from '../../types/movie.tsx';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { updateMedia } from '../../services/media.service.tsx';
import { generateId } from '../../utils/media.tsx';

interface EpisodeFormProps {
  open: boolean;
  onClose: () => void;
  media: MovieItem;
  episode?: Episode | null;
  onSaved?: () => void;
}

const inputClass =
  'h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 placeholder-zinc-600';
const labelClass = 'mb-1.5 block text-sm font-medium text-zinc-300';

export const EpisodeForm = ({ open, onClose, media, episode, onSaved }: EpisodeFormProps) => {
  const { notify } = useToast();
  const [episodeNumber, setEpisodeNumber] = useState('1');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('24m');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');

  useEffect(() => {
    if (!open) return;
    setEpisodeNumber(String(episode?.episodeNumber ?? 1));
    setTitle(episode?.title ?? '');
    setDuration(episode?.duration ?? '24m');
    setThumbnail(episode?.thumbnail ?? '');
    setVideoUrl(episode?.videoUrl ?? '');
    setSynopsis(episode?.synopsis ?? '');
  }, [open, episode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ep: Episode = {
      id: episode?.id ?? generateId('ep'),
      episodeNumber: Number(episodeNumber) || 1,
      title: title.trim() || `Episode ${episodeNumber}`,
      duration: duration.trim() || '24m',
      thumbnail: thumbnail.trim() || media.backdrop,
      videoUrl: videoUrl.trim(),
      synopsis: synopsis.trim() || undefined,
    };

    const list = media.episodes ? [...media.episodes] : [];
    const idx = list.findIndex((x) => x.id === ep.id);
    if (idx >= 0) {
      list[idx] = ep;
    } else {
      list.push(ep);
    }
    list.sort((a, b) => a.episodeNumber - b.episodeNumber);
    updateMedia(media.id, { episodes: list, totalEpisodes: list.length });
    notify(`Episode ${ep.episodeNumber} saved`, 'success');
    onSaved?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={episode ? `Edit Episode ${episode.episodeNumber}` : 'Add Episode'} description={`Manage episodes for ${media.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ep-number" className={labelClass}>Episode Number</label>
            <input id="ep-number" type="number" min={1} value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ep-duration" className={labelClass}>Duration</label>
            <input id="ep-duration" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="24m" />
          </div>
        </div>
        <div>
          <label htmlFor="ep-title" className={labelClass}>Title</label>
          <input id="ep-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Episode title" />
        </div>
        <div>
          <label htmlFor="ep-thumb" className={labelClass}>Thumbnail URL</label>
          <input id="ep-thumb" type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="ep-video" className={labelClass}>Video URL</label>
          <input id="ep-video" type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputClass} placeholder="https://.../stream.m3u8" />
        </div>
        <div>
          <label htmlFor="ep-synopsis" className={labelClass}>Synopsis</label>
          <textarea id="ep-synopsis" rows={3} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className={`${inputClass} h-auto py-2.5`} />
        </div>
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Episode</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EpisodeForm;