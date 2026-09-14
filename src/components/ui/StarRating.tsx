import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export const StarRating = ({ rating, size = 16, showValue = true, className = '' }: StarRatingProps) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const rounded = rating - full >= 0.5 ? full + 0.5 : full;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="flex items-center -space-x-0.5" role="img" aria-label={`Rating ${rating} out of 10`}>
        {Array.from({ length: 5 }, (_, i) => {
          const position = i + 1;
          if (position <= full) {
            return <Star key={i} size={size} className="fill-amber-400 text-amber-400" aria-hidden />;
          }
          if (hasHalf && position === Math.ceil(rounded)) {
            return (
              <span key={i} className="relative inline-flex">
                <Star size={size} className="text-zinc-600" aria-hidden />
                <StarHalf
                  size={size}
                  className="absolute inset-0 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              </span>
            );
          }
          return <Star key={i} size={size} className="text-zinc-600" aria-hidden />;
        })}
      </span>
      {showValue && (
        <span className="text-sm font-semibold text-zinc-200">{rating.toFixed(1)}</span>
      )}
    </span>
  );
};

export default StarRating;