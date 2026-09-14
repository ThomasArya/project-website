import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap select-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-red-600 text-white hover:bg-red-500 shadow-[0_4px_20px_-4px_rgba(229,9,20,0.5)] glow-red',
  secondary: 'bg-zinc-200 text-zinc-900 hover:bg-white',
  outline:
    'border border-white/15 text-white bg-white/5 backdrop-blur hover:bg-white/10 hover:border-white/30',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/5',
  danger: 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30',
  success: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) => (
  <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
    {children}
  </button>
);

export default Button;