import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from './Button.tsx';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.03] py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
      <TriangleAlert size={28} aria-hidden />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">{message}</p>
    </div>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw size={16} aria-hidden />
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorState;