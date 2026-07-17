import { useStore } from '../lib/store';
import { useProducts } from '../lib/hooks';
import { ProductCard } from './ProductCard';
import { Clock } from 'lucide-react';

export function RecentlyViewed() {
  const { recentlyViewed } = useStore();
  const { products } = useProducts();

  const items = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (items.length < 2) return null;

  return (
    <section className="container-content py-12">
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-ink-400" />
        <h2 className="heading text-2xl">Recently viewed</h2>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
