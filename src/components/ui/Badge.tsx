import type { ReactNode } from 'react';

export type BadgeTone = 'red' | 'cyan' | 'amber' | 'emerald' | 'zinc' | 'purple' | 'sky';

const tones: Record<BadgeTone, string> = {
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  zinc: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ tone = 'zinc', children, className = '' }: BadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);

export const QualityBadge = ({ quality }: { quality: string }) => {
  const tone = quality === '4K' ? 'cyan' : quality === 'FHD' ? 'sky' : quality === 'HD' ? 'amber' : 'zinc';
  return <Badge tone={tone}>{quality}</Badge>;
};

export default Badge;