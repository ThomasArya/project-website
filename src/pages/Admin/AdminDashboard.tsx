import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Eye, Film, MonitorPlay, Plus, Users } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard.tsx';
import { getCatalog } from '../../services/media.service.tsx';
import { mockUsers } from '../../data/index.tsx';
import { formatCompact } from '../../utils/format.tsx';
import type { MovieItem } from '../../types/movie.tsx';

export const AdminDashboard = () => {
  const [catalog, setCatalog] = useState<MovieItem[]>([]);

  useEffect(() => {
    getCatalog().then(setCatalog);
  }, []);

  const movies = catalog.filter((m) => m.type === 'movie');
  const anime = catalog.filter((m) => m.type === 'anime');
  const drama = catalog.filter((m) => m.type === 'drama');
  const series = catalog.filter((m) => m.type === 'series');
  const totalViews = catalog.reduce((sum, m) => sum + (m.views ?? 0), 0);

  const topRated = [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const mostViewed = [...catalog].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      <section aria-label="Statistics">
        <h2 className="mb-4 text-xl font-bold text-white">Overview</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total Users" value={String(mockUsers.length)} icon={<Users size={20} aria-hidden />} trend={12} accent="purple" />
          <StatCard label="Total Movies" value={String(movies.length)} icon={<Film size={20} aria-hidden />} trend={8} accent="red" />
          <StatCard label="Total Anime" value={String(anime.length)} icon={<Clapperboard size={20} aria-hidden />} trend={15} accent="cyan" />
          <StatCard label="Total Dramas" value={String(drama.length + series.length)} icon={<MonitorPlay size={20} aria-hidden />} trend={5} accent="amber" />
          <StatCard label="Total Views" value={formatCompact(totalViews)} icon={<Eye size={20} aria-hidden />} trend={22} accent="emerald" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5" aria-label="Top rated">
          <h2 className="mb-4 text-lg font-bold text-white">Top Rated</h2>
          <div className="space-y-2">
            {topRated.map((item, i) => (
              <Link key={item.id} to={`/${item.type}/${item.id}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5">
                <span className="w-6 text-center text-lg font-extrabold text-zinc-600">{i + 1}</span>
                <img src={item.poster} alt="" loading="lazy" className="h-14 w-10 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-100">{item.title}</span>
                <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-400">★ {item.rating.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5" aria-label="Most viewed">
          <h2 className="mb-4 text-lg font-bold text-white">Most Viewed</h2>
          <div className="space-y-2">
            {mostViewed.map((item, i) => (
              <Link key={item.id} to={`/${item.type}/${item.id}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5">
                <span className="w-6 text-center text-lg font-extrabold text-zinc-600">{i + 1}</span>
                <img src={item.poster} alt="" loading="lazy" className="h-14 w-10 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-100">{item.title}</span>
                <span className="text-xs text-zinc-400">{formatCompact(item.views ?? 0)} views</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-red-600/10 to-transparent p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <p className="text-sm text-zinc-400">Manage your content library from one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/movies" className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500">
            <Plus size={16} aria-hidden /> Add Movie
          </Link>
          <Link to="/admin/anime" className="flex h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/5">
            <Plus size={16} aria-hidden /> Add Anime
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;