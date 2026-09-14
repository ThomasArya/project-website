import { Film } from 'lucide-react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} aria-hidden />
);

export const CardSkeleton = () => (
  <div className="space-y-2" role="status" aria-label="Loading">
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const CardGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative h-[520px] w-full overflow-hidden" role="status" aria-label="Loading hero">
    <Skeleton className="absolute inset-0" />
    <div className="absolute bottom-0 left-0 right-0 space-y-3 p-8 md:p-16">
      <Skeleton className="h-10 w-2/3 max-w-lg" />
      <Skeleton className="h-4 w-1/3 max-w-sm" />
      <Skeleton className="h-4 w-1/2 max-w-md" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" role="status" aria-label="Loading list">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
        <Skeleton className="h-14 w-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const RowSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="no-scrollbar flex gap-4 overflow-hidden" role="status" aria-label="Loading row">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const LoadingScreen = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status">
    <div className="flex items-center gap-2">
      <Film size={32} className="animate-pulse text-red-500" aria-hidden />
      <span className="text-lg font-bold tracking-wide text-white">Streamify</span>
    </div>
    <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
      <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-red-500" />
    </div>
    <span className="text-sm text-zinc-400">{label}</span>
  </div>
);

export default Skeleton;