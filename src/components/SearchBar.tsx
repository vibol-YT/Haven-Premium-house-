import { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { searchProducts } from '../lib/hooks';
import type { ProductWithCategory } from '../lib/supabase';
import { formatPrice } from '../lib/format';
import { useNavigate } from '../lib/router';

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    let active = true;
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await searchProducts(q.trim());
      if (active) { setResults(r.slice(0, 6)); setOpen(true); setLoading(false); }
    }, 180);
    return () => { active = false; clearTimeout(t); };
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    setQ('');
    onNavigate?.();
    navigate({ name: 'product', slug });
  };

  const submitSearch = () => {
    if (q.trim()) {
      navigate({ name: 'search', q: q.trim() });
      setOpen(false);
      onNavigate?.();
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 transition focus-within:border-ink-700">
        <Search size={16} className="text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none"
          aria-label="Search products"
        />
        {q && (
          <button onClick={() => { setQ(''); setResults([]); }} aria-label="Clear search">
            <X size={14} className="text-ink-400 hover:text-ink-700" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lift animate-scale-in">
          {loading && <div className="px-4 py-3 text-sm text-ink-400">Searching...</div>}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-ink-400">No matches for "{q}"</div>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => go(p.slug)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sand-50"
            >
              <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink-800">{p.name}</div>
                <div className="text-xs text-ink-400">{p.categories?.name}</div>
              </div>
              <span className="text-sm font-semibold text-ink-900">{formatPrice(p.price_cents)}</span>
            </button>
          ))}
          {results.length > 0 && (
            <button onClick={submitSearch} className="w-full border-t border-ink-100 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-600 hover:bg-sand-50">
              See all results
            </button>
          )}
        </div>
      )}
    </div>
  );
}
