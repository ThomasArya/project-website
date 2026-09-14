import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 20, className = '', label }: SpinnerProps) => (
  <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-label={label ?? 'Loading'}>
    <Loader2 size={size} className="animate-spin text-red-500" aria-hidden />
    {label && <span className="text-sm text-zinc-400">{label}</span>}
  </span>
);

export default Spinner;