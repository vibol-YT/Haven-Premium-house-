import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { searchProducts } from '../lib/hooks';
import type { ProductWithCategory } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from '../lib/router';

export function SearchPage({ q }: { q: string }) {
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) { setResults([]); setLoading(false); return; }
    let active = true;
    setLoading(true);
    searchProducts(q).then((r) => { if (active) { setResults(r); setLoading(false); } });
    return () => { active = false; };
  }, [q]);

  return (
    <div className="container-content py-10">
      <div className="flex items-center gap-2 text-ink-500">
        <Search size={18} />
        <h1 className="heading text-2xl">Results for "{q}"</h1>
      </div>
      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Searching...</p>
      ) : results.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-ink-500">No products matched your search.</p>
          <button onClick={() => navigate({ name: 'shop' })} className="btn-secondary">Browse all products</button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink-400">{results.length} products found</p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  );
}
