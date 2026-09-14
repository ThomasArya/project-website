import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, icon, action }: SectionHeaderProps) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <div className="flex items-center gap-2.5">
      {icon && <span className="text-red-500">{icon}</span>}
      <div>
        <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

export default SectionHeader;