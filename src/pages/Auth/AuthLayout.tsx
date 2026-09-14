import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
    </div>

    <div
      className="relative w-full max-w-md rounded-3xl glass-modal p-8 shadow-2xl animate-fadeIn"
      role="form"
    >
      <Link to="/" className="mb-6 flex items-center justify-center gap-2" aria-label="Streamify home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-500">
          <Clapperboard size={22} className="text-white" aria-hidden />
        </span>
        <span className="text-xl font-bold tracking-tight text-white">
          Stream<span className="text-red-500">ify</span>
        </span>
      </Link>

      <h1 className="text-center text-2xl font-extrabold text-white">{title}</h1>
      <p className="mt-1 text-center text-sm text-zinc-400">{subtitle}</p>

      <div className="mt-8">{children}</div>
    </div>
  </div>
);

export default AuthLayout;