import { useState } from 'react';
import { Package, Heart, MapPin, User, LogOut, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/store';
import { useNavigate } from '../lib/router';
import { useProducts } from '../lib/hooks';

export function AccountPage() {
  const { wishlist, recentlyViewed, cart } = useStore();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'orders' | 'wishlist' | 'addresses' | 'recent'>('wishlist');

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id));

  return (
    <div className="container-content py-10">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-ink-800 text-sand-50"><User size={20} /></div>
        <div>
          <h1 className="heading text-2xl">Your Account</h1>
          <p className="text-sm text-ink-500">Guest · {cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-4">
        {/* sidebar */}
        <aside className="lg:col-span-1">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {[
              { id: 'wishlist' as const, label: 'Wishlist', icon: Heart, count: wishlist.length },
              { id: 'orders' as const, label: 'Orders', icon: Package, count: 0 },
              { id: 'recent' as const, label: 'Recently viewed', icon: ShoppingBag, count: recentlyViewed.length },
              { id: 'addresses' as const, label: 'Addresses', icon: MapPin, count: 0 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm transition whitespace-nowrap ${
                  tab === item.id ? 'bg-ink-800 text-sand-50' : 'text-ink-600 hover:bg-sand-100'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {item.count > 0 && <span className="ml-auto rounded-full bg-sand-200 px-2 py-0.5 text-xs text-ink-700">{item.count}</span>}
              </button>
            ))}
            <button className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm text-ink-400 hover:bg-sand-100">
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        </aside>

        {/* content */}
        <div className="lg:col-span-3">
          {tab === 'wishlist' && (
            <div>
              <h2 className="heading text-xl">Saved items</h2>
              {wishlistProducts.length === 0 ? (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-sand-100/50 py-16 text-center">
                  <Heart size={32} className="text-ink-200" />
                  <p className="text-sm text-ink-500">No saved items yet. Tap the heart on any product.</p>
                  <button onClick={() => navigate({ name: 'shop' })} className="btn-secondary">Browse products</button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                  {wishlistProducts.map((p, i) => (
                    <ProductCardLite key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="heading text-xl">Order history</h2>
              <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-sand-100/50 py-16 text-center">
                <Package size={32} className="text-ink-200" />
                <p className="text-sm text-ink-500">No orders yet. When you place one, it'll show up here.</p>
                <button onClick={() => navigate({ name: 'shop' })} className="btn-secondary">Start shopping</button>
              </div>
            </div>
          )}

          {tab === 'recent' && (
            <div>
              <h2 className="heading text-xl">Recently viewed</h2>
              {recentProducts.length === 0 ? (
                <p className="mt-6 text-sm text-ink-500">Products you view will appear here.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                  {recentProducts.map((p, i) => <ProductCardLite key={p.id} product={p} index={i} />)}
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div>
              <h2 className="heading text-xl">Saved addresses</h2>
              <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-sand-100/50 py-16 text-center">
                <MapPin size={32} className="text-ink-200" />
                <p className="text-sm text-ink-500">No saved addresses yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCardLite({ product, index }: { product: any; index: number }) {
  return (
    <a href={`#/product/${product.slug}`} className="group block animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-sand-100">
        <img src={product.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-ink-800">{product.name}</h3>
      <p className="text-sm font-semibold text-ink-900">${(product.price_cents / 100).toFixed(2)}</p>
    </a>
  );
}
