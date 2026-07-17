import { Quote } from 'lucide-react';
import { useProducts } from '../lib/hooks';
import { StarRating } from '../components/StarRating';
import { formatDate } from '../lib/format';
import { useEffect, useState } from 'react';
import { supabase, type Review, type Product } from '../lib/supabase';

export function ReviewsPage() {
  const { products, loading } = useProducts();
  const [allReviews, setAllReviews] = useState<(Review & { product?: Product })[]>([]);

  useEffect(() => {
    if (loading || products.length === 0) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(24);
      if (!active || !data) return;
      const withProducts = (data as Review[]).map((r) => ({
        ...r,
        product: products.find((p) => p.id === r.product_id),
      }));
      setAllReviews(withProducts);
    })();
    return () => { active = false; };
  }, [loading, products]);

  const avg = allReviews.length
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : 0;

  return (
    <div className="container-content py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center"><StarRating rating={avg || 4.9} size={24} /></div>
        <h1 className="mt-4 heading text-4xl">Loved by 10,000+ homes</h1>
        <p className="mt-3 text-ink-500">Real reviews from verified buyers. We never edit or remove them.</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allReviews.length === 0 && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-sand-100" />
        ))}
        {allReviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <StarRating rating={r.rating} size={14} />
              {r.verified && <span className="text-xs text-moss-600">Verified</span>}
            </div>
            <Quote size={18} className="mt-4 text-clay-400" />
            {r.title && <h3 className="mt-2 text-sm font-semibold text-ink-900">{r.title}</h3>}
            <p className="mt-1 text-sm text-ink-600">{r.body}</p>
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
              <span className="text-xs font-medium text-ink-700">{r.author}</span>
              <span className="text-xs text-ink-400">{formatDate(r.created_at)}</span>
            </div>
            {r.product && <p className="mt-2 text-xs text-ink-400">on {r.product.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
