import { CheckCircle2, Info, XCircle, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.tsx';

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-400" aria-hidden />,
  error: <XCircle size={18} className="text-red-400" aria-hidden />,
  info: <Info size={18} className="text-sky-400" aria-hidden />,
  warning: <AlertTriangle size={18} className="text-amber-400" aria-hidden />,
};

const BORDERS = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  info: 'border-l-sky-500',
  warning: 'border-l-amber-500',
};

export const ToastViewport = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-white/10 border-l-4 bg-[#161a26]/95 px-4 py-3 shadow-2xl backdrop-blur animate-[slideIn_200ms_ease] ${BORDERS[toast.type]}`}
        >
          {ICONS[toast.type]}
          <p className="flex-1 text-sm text-zinc-100">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismiss(toast.id)}
            className="rounded p-0.5 text-zinc-500 transition hover:text-white"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;