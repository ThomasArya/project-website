import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-16 text-center animate-fadeIn">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-zinc-400">
      {icon ?? <SearchX size={28} aria-hidden />}
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description && <p className="max-w-sm text-sm text-zinc-400">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;