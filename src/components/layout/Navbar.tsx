import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User2,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useScrollPosition } from "../../hooks/useScrollPosition.tsx";
import { Avatar } from "../ui/Avatar.tsx";
import { SearchBar } from "../ui/SearchBar.tsx";

const MENU_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "TV Series", to: "/series" },
  { label: "Anime", to: "/anime" },
  { label: "Drama", to: "/drama" },
];

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const scrolled = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-1 text-sm font-medium transition-colors ${
      isActive ? "text-white" : "text-zinc-400 hover:text-white"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "glass-nav shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Streamify home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-500">
            <Clapperboard size={20} className="text-white" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Stream<span className="text-red-500">ify</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex md:ml-6">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden w-56 lg:block xl:w-72">
            <SearchBar size="sm" />
          </div>

          <button
            type="button"
            aria-label="Open search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Search size={18} aria-hidden />
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Open profile menu"
                onClick={() => setProfileOpen((v) => !v)}
                className="rounded-full transition hover:opacity-80"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.username ?? "User"}
                  size={34}
                />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#141826]/98 p-1.5 shadow-2xl backdrop-blur-xl animate-[scaleIn_120ms_ease]">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.username}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <User2 size={15} aria-hidden /> My Profile
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <LayoutDashboard size={15} aria-hidden /> Admin
                        Dashboard
                      </Link>
                      <Link
                        to="/apikey"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Key size={15} aria-hidden /> API & Streaming Config
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={15} aria-hidden /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500 glow-red"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            {mobileOpen ? (
              <X size={18} aria-hidden />
            ) : (
              <Menu size={18} aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 lg:hidden">
          <SearchBar size="lg" onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-white/10 md:hidden glass-nav">
          <div className="space-y-1 px-4 py-4">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-600/10 text-red-400"
                      : "text-zinc-300 hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                <Link
                  to="/login"
                  className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-medium text-zinc-200 transition hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
