import { useMemo, useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useProducts, useCategories } from '../lib/hooks';
import { useNavigate } from '../lib/router';
import { ProductCard } from '../components/ProductCard';
import { classNames } from '../lib/format';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
  newest: 'Newest',
};

export function ShopPage({ category }: { category?: string }) {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.categories?.slug === category);
    list = list.filter((p) => p.price_cents / 100 <= maxPrice);
    if (onlySale) list = list.filter((p) => p.compare_at_cents && p.compare_at_cents > p.price_cents);
    if (onlyNew) list = list.filter((p) => p.is_new);
    list = list.filter((p) => p.rating >= minRating);

    const sorted = [...list];
    switch (sort) {
      case 'price-asc': sorted.sort((a, b) => a.price_cents - b.price_cents); break;
      case 'price-desc': sorted.sort((a, b) => b.price_cents - a.price_cents); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'newest': sorted.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      default: sorted.sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
    }
    return sorted;
  }, [products, category, maxPrice, onlySale, onlyNew, minRating, sort]);

  const resetFilters = () => {
    setMaxPrice(300); setOnlySale(false); setOnlyNew(false); setMinRating(0); setSort('featured');
  };

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Category</h4>
        <ul className="mt-3 space-y-1.5">
          <li>
            <button onClick={() => navigate({ name: 'shop' })} className={classNames('text-sm hover:text-ink-900', !category ? 'font-semibold text-ink-900' : 'text-ink-600')}>
              All Products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button onClick={() => navigate({ name: 'shop', category: c.slug })} className={classNames('text-sm hover:text-ink-900', category === c.slug ? 'font-semibold text-ink-900' : 'text-ink-600')}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Max Price</h4>
        <input
          type="range" min={20} max={300} step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-ink-800"
        />
        <p className="mt-1 text-sm text-ink-600">Up to ${maxPrice}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Rating</h4>
        <div className="mt-3 flex flex-col gap-1.5">
          {[0, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={classNames('text-sm hover:text-ink-900', minRating === r ? 'font-semibold text-ink-900' : 'text-ink-600')}>
              {r === 0 ? 'Any rating' : `${r}+ stars`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Offers</h4>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} className="accent-ink-800" />
            On sale only
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="accent-ink-800" />
            New arrivals
          </label>
        </div>
      </div>

      <button onClick={resetFilters} className="text-xs font-medium uppercase tracking-wide text-ink-500 hover:text-ink-800">
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="container-content py-10">
      {/* breadcrumb + title */}
      <nav className="text-xs text-ink-400">
        <button onClick={() => navigate({ name: 'home' })} className="hover:text-ink-700">Home</button>
        <span className="mx-1.5">/</span>
        <button onClick={() => navigate({ name: 'shop' })} className="hover:text-ink-700">Shop</button>
        {activeCategory && (<><span className="mx-1.5">/</span><span className="text-ink-700">{activeCategory.name}</span></>)}
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading text-3xl sm:text-4xl">{activeCategory ? activeCategory.name : 'Shop All'}</h1>
          {activeCategory?.tagline && <p className="mt-1 text-sm text-ink-500">{activeCategory.tagline}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-500">{filtered.length} items</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none rounded-full border border-ink-200 bg-white py-2.5 pl-4 pr-9 text-sm text-ink-800 focus:border-ink-700 focus:outline-none"
            >
              {Object.entries(SORT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm lg:hidden">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-10">
        {/* desktop filters */}
        <aside className="hidden w-56 shrink-0 lg:block">{FilterPanel}</aside>

        {/* grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-sand-100" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <p className="text-ink-500">No products match those filters.</p>
              <button onClick={resetFilters} className="btn-secondary">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-sand-50 p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg">Filters</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="mt-6">{FilterPanel}</div>
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-8 w-full">Show {filtered.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
