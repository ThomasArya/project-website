import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Clapperboard, Film, LayoutDashboard, LogOut, Shield, SlidersHorizontal, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={17} aria-hidden />, end: true },
  { label: 'Movies', to: '/admin/movies', icon: <Film size={17} aria-hidden /> },
  { label: 'Anime', to: '/admin/anime', icon: <Clapperboard size={17} aria-hidden /> },
  { label: 'Users', to: '/admin/users', icon: <Users size={17} aria-hidden /> },
  { label: 'Genres', to: '/admin/genres', icon: <SlidersHorizontal size={17} aria-hidden /> },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#08090d] pt-16">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-[#0d0f15] pt-20 lg:flex">
        <div className="flex items-center gap-2 px-5 py-3">
          <Shield size={20} className="text-red-500" aria-hidden />
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Admin Panel</span>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-red-600/15 text-red-400'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-red-400"
          >
            <LogOut size={17} aria-hidden /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-60">
        <div className="border-b border-white/10 px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-red-500" aria-hidden />
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Admin Panel</span>
          </div>
          <nav className="mt-3 no-scrollbar flex gap-1 overflow-x-auto" aria-label="Admin mobile navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive ? 'bg-red-600/15 text-red-400' : 'text-zinc-400 hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <main className="p-4 pb-16 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Signed in as</p>
              <p className="text-sm font-semibold text-white">{user?.username} <span className="font-normal text-zinc-500">· Administrator</span></p>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;