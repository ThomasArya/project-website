import { Link } from 'react-router-dom';
import { Clapperboard, Globe, MessageCircle, Send, Share2 } from 'lucide-react';

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Browse',
    links: [
      { label: 'Movies', to: '/movies' },
      { label: 'TV Series', to: '/series' },
      { label: 'Anime', to: '/anime' },
      { label: 'Drama', to: '/drama' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Profile', to: '/profile' },
      { label: 'Watchlist', to: '/watchlist' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/#' },
      { label: 'Contact', to: '/#' },
      { label: 'Privacy Policy', to: '/#' },
      { label: 'Terms of Service', to: '/#' },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-16 border-t border-white/[0.06] bg-[#08090d]" aria-label="Footer">
    <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2" aria-label="Streamify home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-500">
              <Clapperboard size={20} className="text-white" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Stream<span className="text-red-500">ify</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm text-zinc-500">
            Your one-stop streaming platform for movies, anime, dramas, and TV series. Watch anywhere, anytime.
          </p>
          <div className="flex gap-2">
            {[
              { icon: <Send size={16} aria-hidden />, label: 'Telegram' },
              { icon: <MessageCircle size={16} aria-hidden />, label: 'Discord' },
              { icon: <Globe size={16} aria-hidden />, label: 'Website' },
              { icon: <Share2 size={16} aria-hidden />, label: 'Share' },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-zinc-500 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-zinc-600 sm:flex-row">
        <p>© {new Date().getFullYear()} Streamify. All rights reserved. Built for demo purposes.</p>
        <p>Made with care for movie lovers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;