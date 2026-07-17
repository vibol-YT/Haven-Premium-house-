import { Star } from 'lucide-react';
import { classNames } from '../lib/format';

export function StarRating({
  rating,
  size = 14,
  showValue = false,
  count,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  className?: string;
}) {
  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'text-clay-500 fill-clay-500' : 'text-ink-200 fill-ink-200'}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-ink-600">
          {rating.toFixed(1)}
          {count != null && count > 0 && (
            <span className="text-ink-400"> ({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
