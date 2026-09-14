# Streamify — Platform Streaming Film & Series

Web streaming film, drama, anime, dan series dengan UI dark cinematic.  
React 19 + TypeScript 6 + TailwindCSS v4 + Vite 8.

---

## Struktur Folder

```
src/
├── types/              # Tipe data TypeScript
│   ├── movie.tsx       # MovieItem, Episode, FilterOptions, Genre, dll
│   ├── user.tsx        # User, WatchlistItem, WatchHistoryItem
│   └── context.tsx     # Session, Toast, ToastType
│
├── data/               # Mock data (ganti dengan API)
│   ├── movies.tsx      # Film blockbuster (~15 items)
│   ├── anime.tsx       # Anime (~12 items)
│   ├── drama.tsx       # Drama (~10 items)
│   ├── series.tsx      # TV Series (~7 items)
│   ├── genres.tsx      # ~28 genre (Aksi, Drama, Sci-Fi, dll)
│   ├── users.tsx       # Akun demo (admin + user)
│   └── index.tsx       # Re-export semua
│
├── services/           # Service layer (abstraksi API)
│   ├── media.service.tsx   # getMovies, getAnime, getDrama, getSeries,
│   │                       #   getById, getRelated, search, filter, create/update/delete
│   ├── auth.service.tsx    # login, register, forgotPassword, logout
│   ├── storage.tsx         # localStorage wrapper (get/set/remove)
│   └── image.tsx           # Image optimization, cache, error handling
│
├── contexts/           # React Context providers
│   ├── AuthContext.tsx      # user, session, login, logout, isAdmin
│   ├── WatchlistContext.tsx # watchlist, history, favorites, continueWatching
│   └── ToastContext.tsx     # notification toast system
│
├── hooks/              # Custom React hooks
│   ├── useDebounce.tsx
│   ├── useLocalStorage.tsx
│   ├── useScrollPosition.tsx
│   └── useSimulatedLoading.tsx
│
├── utils/              # Fungsi utilitas
│   ├── format.tsx      # timeAgo, formatCompact, formatDuration, dll
│   └── media.tsx       # typeLabel, typeIcon
│
├── components/
│   ├── ui/             # Komponen dasar reusable
│   │   ├── Button.tsx, Modal.tsx, Badge.tsx, Spinner.tsx
│   │   ├── StarRating.tsx, Avatar.tsx, Dropdown.tsx, Tabs.tsx
│   │   ├── SearchBar.tsx, Pagination.tsx, Skeleton.tsx
│   │   ├── EmptyState.tsx, ErrorState.tsx
│   │   └── ToastViewport.tsx
│   │
│   ├── layout/         # Layout komponen
│   │   ├── Navbar.tsx          # Sticky, glass-blur, profile dropdown
│   │   ├── Footer.tsx          # Kategori + link
│   │   ├── MobileBottomNav.tsx # Nav mobile fixed bottom
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── ProtectedRoute.tsx  # Route guard (auth + admin)
│   │
│   ├── movie/          # Komponen domain film/anime/drama/series
│   │   ├── MovieCard.tsx, AnimeCard.tsx
│   │   ├── HeroBanner.tsx      # Carousel hero
│   │   ├── MovieCarousel.tsx   # Horizontal scrollable carousel
│   │   ├── SectionHeader.tsx   # "Continue Watching" / "New Releases"
│   │   ├── GenreFilter.tsx     # Horizontal genre pill buttons
│   │   ├── MediaBrowser.tsx    # Full-page grid + filters + pagination
│   │   ├── WatchlistButton.tsx
│   │   └── ContinueWatchingCard.tsx
│   │
│   ├── player/         # Video player komponen
│   │   ├── VideoPlayer.tsx     # Custom player (play/pause, volume,
│   │   │                       #   progress bar, fullscreen, speed,
│   │   │                       #   subtitles, quality, keyboard shortcuts,
│   │   │                       #   skip intro, autoplay next)
│   │   ├── EpisodeSelector.tsx
│   │   └── ServerSelector.tsx
│   │
│   └── admin/          # Admin panel komponen
│       ├── AdminLayout.tsx     # Sidebar + topbar admin
│       ├── StatCard.tsx        # Dashboard stat cards
│       ├── MediaForm.tsx       # Form add/edit film/anime/drama/series
│       └── EpisodeForm.tsx     # Form add/edit episode
│
├── pages/              # Halaman-halaman
│   ├── Home/Home.tsx
│   ├── Movies/Movies.tsx
│   ├── Anime/Anime.tsx
│   ├── Drama/Drama.tsx
│   ├── Series/Series.tsx
│   ├── Details/MediaDetail.tsx
│   ├── Watch/Watch.tsx         # Halaman nonton + player
│   ├── Search/Search.tsx
│   ├── Watchlist/Watchlist.tsx
│   ├── Profile/Profile.tsx
│   ├── Auth/
│   │   ├── AuthLayout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   └── Admin/
│       ├── AdminDashboard.tsx  # Statistik + overview
│       ├── AdminMovies.tsx     # CRUD film
│       ├── AdminAnime.tsx      # CRUD anime + episode
│       ├── AdminUsers.tsx
│       └── AdminGenres.tsx
│
├── routes/
│   └── index.tsx       # React Router config + lazy loading
│
├── App.tsx             # Providers + ToastViewport
└── main.tsx            # ReactDOM.createRoot entry
```

---

## Dependencies

| Paket | Versi | Kegunaan |
|---|---|---|
| react | 19.2 | UI framework |
| react-dom | 19.2 | DOM renderer |
| react-router-dom | 7.18 | Client-side routing + lazy loading |
| tailwindcss | 4.3 | CSS framework |
| @tailwindcss/vite | 4.3 | Vite plugin TailwindCSS |
| lucide-react | 1.45 | Icon library |
| typescript | 6.0 | Static typing |
| vite | 8.3 | Dev server + bundler |

---

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build → dist/
npm run build

# Preview build
npm run preview
```

---

## Akun Demo

| Email | Password | Role |
|---|---|---|
| `admin@streamify.com` | apapun | Admin (bisa akses `/admin`) |
| `cinephile@example.com` | apapun | User biasa |

Login → pilih role → admin masuk ke dashboard `/admin`.

---

## Cara Menambah Movie

### Cara 1: Edit file mock data

Buka `src/data/movies.tsx` lalu tambah item baru ke array:

```ts
// src/data/movies.tsx
export const mockMovies: MovieItem[] = [
  // ...existing items
  {
    id: 'movie-new',
    type: 'movie',
    title: 'Judul Film',
    overview: 'Sinopsis singkat film.',
    poster: 'https://picsum.photos/seed/new/300/450',
    backdrop: 'https://picsum.photos/seed/newbackdrop/1280/720',
    rating: 8.5,
    releaseYear: 2025,
    duration: '2j 15m',
    quality: '4K',
    genres: ['Aksi', 'Sci-Fi'],
    country: 'USA',
    cast: ['Actor A', 'Actor B'],
    isPopular: true,
    isNewRelease: true,
    servers: [
      { id: 's1', name: 'Server A', url: '#', quality: '4K', type: 'mp4' },
    ],
    episodes: [],
  },
];
```

### Cara 2: Admin Dashboard

Masuk ke `/admin` → tab Movies → klik **Add Movie** → isi form → Save.

---

## Cara Mengganti Mock Data dengan API

### 1. Ubah `media.service.tsx`

Ganti fungsi filter/sort manual dengan `fetch`:

```ts
// src/services/media.service.tsx

const API_URL = import.meta.env.VITE_API_URL;

export const getMovies = async (options?: FilterOptions): Promise<MovieItem[]> => {
  const res = await fetch(`${API_URL}/movies?${new URLSearchParams(options as any)}`);
  return res.json();
};

export const getById = async (id: string, type: MediaType): Promise<MovieItem | null> => {
  const res = await fetch(`${API_URL}/${type}s/${id}`);
  return res.ok ? res.json() : null;
};
```

### 2. Ubah `auth.service.tsx`

```ts
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
```

### 3. Tambah environment variable

```
# .env
VITE_API_URL=https://your-api.com/api
```

### 4. Update tipe data

Sesuaikan `MovieItem` di `src/types/movie.tsx` dengan response API.

---

## Cara Menghubungkan Firebase Auth

```bash
npm install firebase
```

### 1. Setup Firebase config

```ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
```

### 2. Ubah `auth.service.tsx`

```ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export const login = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return { uid: userCred.user.uid, email: userCred.user.email };
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return { uid: result.user.uid, email: result.user.email };
};

export const logout = async () => signOut(auth);
export const resetPassword = async (email: string) => sendPasswordResetEmail(auth, email);
```

### 3. Update `AuthContext.tsx`

Ubah `authService.login(...)` di `AuthContext` untuk memanggil versi Firebase.

---

## Cara Menghubungkan Backend Streaming

### Arsitektur yang direkomendasikan

```
[Browser] → video.player.m3u8?server=1&episode=1
    ↓
[Streaming Backend / CDN]
    ↓ ( HLS / DASH )
[VideoPlayer.tsx]
```

### 1. URL streaming di MovieItem

Tambahkan field `streamUrl` atau `hlsUrl` di `MovieItem`:

```ts
// src/types/movie.tsx
interface MovieItem {
  // ...existing fields
  streamUrl?: string;   // direct MP4 URL
  hlsUrl?: string;      // .m3u8 manifest URL
}
```

### 2. Update VideoPlayer

Ganti `<video src={url}>` dengan [hls.js](https://github.com/nickoala/hls.js) atau [dash.js](https://github.com/nickoala/dash.js):

```bash
npm install hls.js
```

```ts
// src/components/player/VideoPlayer.tsx
import Hls from 'hls.js';

useEffect(() => {
  if (!videoRef.current) return;
  const hls = new Hls();
  hls.loadSource(video.hlsUrl);
  hls.attachMedia(videoRef.current);
  return () => hls.destroy();
}, [video.hlsUrl]);
```

### 3. DRM (opsional)

Untuk konten premium, gunakan Widevine/FairPlay via [Shaka Player](https://github.com/nickoala/shaka-player) atau EME (Encrypted Media Extensions).

### 4. CDN

Untuk production:
- **Cloudflare Stream** — HLS playback + DRM
- **AWS CloudFront** — origin dari S3 bucket
- **Mux** — video hosting khusus + analytics

### 5. Update ServerSelector

Hubungkan `servers` di `MovieItem` dengan URL CDN yang sebenarnya. Setiap server bisa di-point ke CDN yang berbeda untuk redundancy.

---

## Features

- Dark cinematic UI dengan glassmorphism
- Custom video player (play/pause, volume, progress, fullscreen, speed, subtitles, quality)
- Search + debounce + suggestions + recent search history
- Genre filter, content-type filter, sort by rating/year
- Pagination untuk catalog browsing
- Continue Watching, My List, Favorites, History
- Responsive: desktop, tablet, mobile (bottom nav + hamburger menu)
- Lazy loading semua halaman via React.lazy
- Admin dashboard: CRUD movies/anime/drama/series, manage episodes, user overview, genre management
- Keyboard shortcuts di player (`Space`, `→/←` 10 detik, `↑/↓` volume, `F` fullscreen, `M` mute)
- Protected routes (requireAuth, requireAdmin)
- Toast notifications
- Auth: login, register, forgot password

---

## Tech Decisions

- **TailwindCSS v4** via `@tailwindcss/vite` (bukan PostCSS)
- **TypeScript strict**: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`
- **Lucide React** untuk icons
- **Mock data + service layer** supaya gampang swap ke real API nanti
- **React Router v7** dengan lazy + Suspense untuk code splitting
