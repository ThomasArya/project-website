import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, MailCheck } from 'lucide-react';
import { AuthLayout } from './AuthLayout.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Spinner } from '../../components/ui/Spinner.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import authService from '../../services/auth.service.tsx';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const result = await authService.forgotPassword(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
    notify('Reset link sent to your email', 'success');
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We will send you a link to reset it">
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <MailCheck size={30} aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Check your inbox</h2>
            <p className="mt-1 text-sm text-zinc-400">
              We sent a password reset link to <span className="font-medium text-zinc-200">{email}</span>.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner size={18} /> : <KeyRound size={17} aria-hidden />}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-zinc-400">
        Remembered it?{' '}
        <Link to="/login" className="font-semibold text-red-400 transition hover:text-red-300 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;