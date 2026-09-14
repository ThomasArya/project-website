import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, History, LogOut, Play, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useWatchlist } from '../../contexts/WatchlistContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { Avatar } from '../../components/ui/Avatar.tsx';
import { Tabs } from '../../components/ui/Tabs.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { getById } from '../../services/media.service.tsx';
import { timeAgo } from '../../utils/format.tsx';
import type { MediaType, MovieItem } from '../../types/movie.tsx';

const TABS: { label: string; value: string }[] = [
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'Continue Watching', value: 'continue-watching' },
  { label: 'Watch History', value: 'history' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Settings', value: 'settings' },
];

export const Profile = () => {
  const { user, isAdmin, logout, updateUser } = useAuth();
  const { watchlist, history, continueWatching, favorites, clearHistory, toggleFavorite } = useWatchlist();
  const { notify } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [tab, setTab] = useState('watchlist');
  const [editOpen, setEditOpen] = useState(false);
  const [username, setUsername] = useState(user?.username ?? '');
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar ?? '');
  const [favoriteItems, setFavoriteItems] = useState<MovieItem[]>([]);

  useEffect(() => {
    setUsername(user?.username ?? '');
    setAvatarSrc(user?.avatar ?? '');
  }, [user]);

  useEffect(() => {
    (async () => {
      const items = await Promise.all(favorites.map((id) => getById(id)));
      setFavoriteItems(items.filter((m): m is NonNullable<typeof m> => Boolean(m)));
    })();
  }, [favorites]);

  const handleAvatarFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Please choose an image file', 'warning');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify('Image too large — max 2MB', 'warning');
      return;
    }
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(String(reader.result ?? ''));
      setAvatarUploading(false);
      notify('Image ready — press Save Changes to apply', 'success');
    };
    reader.onerror = () => {
      setAvatarUploading(false);
      notify('Failed to read the image', 'error');
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const stats = [
    { label: 'Watchlist', value: watchlist.length, icon: <Star size={16} className="text-amber-400" aria-hidden /> },
    { label: 'Continue Watching', value: continueWatching.length, icon: <Play size={16} className="text-red-400" aria-hidden /> },
    { label: 'History', value: history.length, icon: <History size={16} className="text-sky-400" aria-hidden /> },
    { label: 'Favorites', value: favorites.length, icon: <Heart size={16} className="text-rose-400" aria-hidden /> },
  ];

  const typeLabel = (type: MediaType) => type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-red-600/[0.07] via-transparent to-transparent p-6 md:flex-row md:items-center md:gap-8 md:p-8">
        <Avatar src={user.avatar} name={user.username} size={96} className="ring-4 ring-white/20" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white md:text-3xl">{user.username}</h1>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                user.role === 'admin'
                  ? 'bg-red-600 text-white'
                  : user.plan === 'VIP'
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 text-black'
                    : user.plan === 'Premium'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-white/10 text-zinc-300'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : user.plan}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
          <p className="mt-1 text-xs text-zinc-600">Member since {new Date(user.createdAt ?? '2024-01-01').toLocaleDateString()}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Camera size={14} aria-hidden /> Edit Profile
            </Button>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="secondary" size="sm">Admin Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              {s.icon}
              <span className="text-lg font-bold text-white">{s.value}</span>
              <span className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-6" />

      {tab === 'watchlist' && (
        watchlist.length === 0 ? (
          <EmptyState title="Your watchlist is empty" description="Save content to watch it later." action={<Link to="/movies"><Button>Browse Movies</Button></Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {watchlist.slice(0, 10).map((item) => (
              <div key={item.id} className="rounded-xl bg-zinc-900">
                <Link to={`/${item.type}/${item.id}`} className="block p-2">
                  <img src={item.poster} alt={item.title} loading="lazy" className="aspect-[2/3] w-full rounded-lg object-cover" />
                  <p className="mt-2 truncate text-sm font-semibold text-zinc-100">{item.title}</p>
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'continue-watching' && (
        continueWatching.length === 0 ? (
          <EmptyState title="Nothing in progress" description="Start watching something to see it here." action={<Link to="/"><Button>Home</Button></Link>} />
        ) : (
          <div className="space-y-3">
            {continueWatching.slice(0, 10).map((item) => (
              <Link
                key={item.id}
                to={`/watch/${item.mediaId}${item.episodeId ? `?ep=${item.episodeNumber}` : ''}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition hover:bg-white/5"
              >
                <img src={item.poster} alt="" loading="lazy" className="h-20 w-36 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-100">{item.title}</p>
                  <p className="text-xs text-zinc-500">
                    {typeLabel(item.type)}{item.episodeNumber ? ` · EP ${item.episodeNumber}` : ''} · {timeAgo(item.watchedAt)}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${item.progressPercent}%` }} />
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600/90 text-white">
                  <Play size={16} className="ml-0.5 fill-white" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {tab === 'history' && (
        history.length === 0 ? (
          <EmptyState title="No watch history yet" description="Titles you watch will show up here." />
        ) : (
          <div className="space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  clearHistory();
                  notify('Watch history cleared', 'info');
                }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={15} aria-hidden /> Clear history
              </button>
            </div>
            {history.slice(0, 20).map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <img src={entry.poster} alt="" loading="lazy" className="h-14 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-100">{entry.title}</p>
                  <p className="text-xs text-zinc-500">
                    {typeLabel(entry.type)}{entry.episodeNumber ? ` · EP ${entry.episodeNumber}` : ''} · watched {timeAgo(entry.watchedAt)}
                  </p>
                </div>
                <Link to={`/watch/${entry.mediaId}`} aria-label={`Watch ${entry.title} again`} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white">
                  <Play size={16} aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'favorites' && (
        favoriteItems.length === 0 ? (
          <EmptyState title="No favorites yet" description="Tap the heart on any title to add it to favorites." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favoriteItems.map((item) => (
              <div key={item.id} className="group rounded-xl bg-zinc-900">
                <Link to={`/${item.type}/${item.id}`} className="block relative">
                  <img src={item.poster} alt={item.title} loading="lazy" className="aspect-[2/3] w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(item.id);
                      notify('Removed from favorites', 'info');
                    }}
                    aria-label={`Remove ${item.title} from favorites`}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-red-400 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
                  >
                    <Heart size={14} className="fill-current" aria-hidden />
                  </button>
                </Link>
                <p className="truncate p-2 text-sm font-semibold text-zinc-100">{item.title}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Account Settings</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <div>
                  <p className="font-medium text-zinc-200">Plan</p>
                  <p className="text-xs text-zinc-500">Your current subscription plan</p>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-200">{user.plan}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-zinc-200">Notifications</p>
                  <p className="text-xs text-zinc-500">Get notified about new episodes</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="true"
                  className="relative h-5 w-9 rounded-full bg-red-600"
                >
                  <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <h2 className="mb-2 text-lg font-bold text-white">Danger Zone</h2>
            <p className="mb-4 text-sm text-zinc-400">Sign out of your account on this device.</p>
            <Button variant="danger" onClick={() => { logout(); }}>
              <LogOut size={16} aria-hidden /> Logout
            </Button>
          </div>
        </div>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" description="Update your public profile information">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={avatarSrc} name={username || user.username} size={72} className="ring-2 ring-white/15" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">Profile Picture</p>
              <p className="text-xs text-zinc-600">Upload from your gallery/device or paste a URL below.</p>
            </div>
          </div>
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-zinc-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="mb-1.5 block text-sm font-medium text-zinc-300">Avatar URL</label>
            <input
              id="avatar"
              type="url"
              value={avatarSrc}
              onChange={(e) => setAvatarSrc(e.target.value)}
              placeholder="https://..."
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
            <p className="mt-1 text-xs text-zinc-600">Paste a direct image URL, or upload a photo from your device.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Camera size={14} aria-hidden /> {avatarUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleAvatarFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => {
                updateUser({ username: username.trim() || user.username, avatar: avatarSrc.trim() || user.avatar });
                setEditOpen(false);
                notify('Profile updated', 'success');
              }}
            >
              <Camera size={14} aria-hidden /> Save Changes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;