import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  align?: 'left' | 'right';
  className?: string;
  icon?: ReactNode;
}

export const Dropdown = ({ label, value, options, onChange, align = 'left', className = '', icon }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-200 transition hover:border-white/25 hover:bg-white/10"
      >
        {icon}
        <span className="max-w-36 truncate">
          {label && <span className="mr-1 text-zinc-500">{label}:</span>}
          {current?.label ?? 'All'}
        </span>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute z-30 mt-2 max-h-72 w-max min-w-full overflow-y-auto rounded-xl border border-white/10 bg-[#141826]/95 py-1.5 shadow-2xl backdrop-blur-lg animate-[scaleIn_120ms_ease] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-white/10 ${
                  option.value === value ? 'font-semibold text-red-400' : 'text-zinc-300'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;