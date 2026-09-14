import type { ReactNode } from 'react';

export interface TabItem {
  label: string;
  value: string;
  badge?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, active, onChange, className = '' }: TabsProps) => (
  <div role="tablist" className={`flex gap-1 overflow-x-auto no-scrollbar rounded-xl border border-white/10 bg-white/[0.03] p-1 ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={active === tab.value}
        onClick={() => onChange(tab.value)}
        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
          active === tab.value
            ? 'bg-red-600 text-white shadow-[0_2px_12px_-2px_rgba(229,9,20,0.6)]'
            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        {tab.label}
        {typeof tab.badge === 'number' && tab.badge > 0 && (
          <span
            className={`rounded-full px-1.5 text-[10px] font-bold ${active === tab.value ? 'bg-white/20 text-white' : 'bg-white/10'}`}
          >
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </div>
);

export const TabContent = ({ children }: { children: ReactNode }) => <div>{children}</div>;

export default Tabs;