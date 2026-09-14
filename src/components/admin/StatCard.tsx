import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: number;
  accent?: 'red' | 'cyan' | 'amber' | 'emerald' | 'purple';
}

const ACCENTS = {
  red: 'from-red-600/20 text-red-400',
  cyan: 'from-cyan-600/20 text-cyan-400',
  amber: 'from-amber-600/20 text-amber-400',
  emerald: 'from-emerald-600/20 text-emerald-400',
  purple: 'from-purple-600/20 text-purple-400',
};

export const StatCard = ({ label, value, icon, trend, accent = 'red' }: StatCardProps) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5">
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${ACCENTS[accent].split(' ')[0]}`} aria-hidden />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
      </div>
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ACCENTS[accent]}`}>
        {icon}
      </span>
    </div>
    {typeof trend === 'number' && (
      <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {trend >= 0 ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}
        {Math.abs(trend)}% from last month
      </p>
    )}
  </div>
);

export default StatCard;