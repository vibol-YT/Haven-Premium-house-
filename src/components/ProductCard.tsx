import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useStore } from '../lib/store';
import { formatPrice, discountPct, classNames } from '../lib/format';
import { StarRating } from './StarRating';
import { useNavigate, type Route } from '../lib/router';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const disc = discountPct(product.price_cents, product.compare_at_cents);

  const go: Route = { name: 'product', slug: product.slug };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <a
      href={`#/product/${product.slug}`}
      onClick={() => navigate(go)}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full relative z-0 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges?.map((b) => (
            <span
              key={b}
              className={classNames(
                'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm',
                b === 'Bestseller' && 'bg-ink-800 text-sand-50',
                b === 'New' && 'bg-moss-500 text-white',
                b === 'Low stock' && 'bg-clay-500 text-white',
                !['Bestseller', 'New', 'Low stock'].includes(b) && 'bg-sand-50 text-ink-700',
              )}
            >
              {b}
            </span>
          ))}
          {disc && (
            <span className="rounded-full bg-clay-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              -{disc}%
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-700 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Heart size={16} className={wishlisted ? 'fill-clay-500 text-clay-500' : ''} />
        </button>
        <button
          onClick={handleAdd}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-ink-800 py-2.5 text-xs font-medium uppercase tracking-wide text-sand-50 opacity-0 shadow-lift transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {added ? 'Added!' : 'Add to cart'}
        </button>
      </div>
      <div className="mt-3 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-ink-800 group-hover:text-ink-900">{product.name}</h3>
        </div>
        {product.short_desc && (
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-400">{product.short_desc}</p>
        )}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-ink-900">{formatPrice(product.price_cents)}</span>
            {product.compare_at_cents && (
              <span className="text-xs text-ink-300 line-through">{formatPrice(product.compare_at_cents)}</span>
            )}
          </div>
          {product.rating > 0 && (
            <StarRating rating={product.rating} count={product.review_count} showValue size={12} />
          )}
        </div>
      </div>
    </a>
  );
}
