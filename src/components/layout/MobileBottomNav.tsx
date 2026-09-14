import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Home, Search, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';

const items = [
  { label: 'Home', to: '/', icon: <Home size={20} aria-hidden /> },
  { label: 'Discover', to: '/movies', icon: <Compass size={20} aria-hidden /> },
  { label: 'Search', to: '/search', icon: <Search size={20} aria-hidden /> },
];

export const MobileBottomNav = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/watch')) {
    return null;
  }

  const navItems = [
    ...items,
    isAuthenticated
      ? { label: 'Profile', to: '/profile', icon: <User size={20} aria-hidden /> }
      : { label: 'Login', to: '/login', icon: <User size={20} aria-hidden /> },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 pb-[env(safe-area-inset-bottom)] md:hidden glass-nav"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                isActive ? 'text-red-400' : 'text-zinc-500'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;