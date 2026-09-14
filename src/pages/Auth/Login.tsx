import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthLayout } from './AuthLayout.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Spinner } from '../../components/ui/Spinner.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import authService from '../../services/auth.service.tsx';
import type { SessionUser } from '../../types/context.tsx';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useToast();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState(authService.remembersEmail());
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  const from = (location.state as { from?: string } | null)?.from ?? '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    const result = await authService.login({ email, password, remember });
    setLoading(false);
    if (result.error || !result.user) {
      setError(result.error ?? 'Login failed. Please try again.');
      return;
    }
    login(result.user as SessionUser);
    notify(`Welcome back, ${result.user.username}!`, 'success');
    navigate(result.user.role === 'admin' ? '/admin' : from);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue watching">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-red-600"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-red-400 transition hover:text-red-300 hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner size={18} /> : <LogIn size={17} aria-hidden />}
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-zinc-400">
        <p className="font-semibold text-zinc-300">Demo accounts</p>
        <p className="mt-1 text-xs">
          Admin — <span className="text-zinc-200">admin@streamify.com</span> (any password)
          <br />
          User — <span className="text-zinc-200">cinephile@example.com</span> (any password)
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-red-400 transition hover:text-red-300 hover:underline">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;