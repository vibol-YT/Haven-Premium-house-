import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag, Heart, User, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useStore } from '../lib/store';
import { useCategories } from '../lib/hooks';
import { useNavigate, type Route } from '../lib/router';
import { SearchBar } from './SearchBar';
import { CartDrawer } from './CartDrawer';

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free shipping over $75' },
  { icon: RotateCcw, label: '60-day returns' },
  { icon: ShieldCheck, label: 'Secure checkout' },
];

export function Header() {
  const { cartCount, wishlist } = useStore();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (r: Route) => {
    setMobileOpen(false);
    navigate(r);
  };

  return (
    <>
      {/* announcement bar */}
      <div className="bg-ink-800 text-sand-50">
        <div className="container-content flex h-9 items-center justify-center text-center text-xs tracking-wide">
          <span className="hidden sm:inline">Free shipping over $75 · 60-day returns · </span>
          <span className="font-medium">New arrivals just landed — shop the collection</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50  shadow-md bg-sand-50/90 backdrop-blur transition-shadow duration-300 ${
          scrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="container-content">
          <div className="flex h-16 items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <a
              href="#/"
              onClick={() => go({ name: 'home' })}
              className="font-serif text-2xl font-semibold tracking-tight text-ink-900"
            >
              Haven
            </a>

            <nav className="ml-6 hidden items-center gap-6 lg:flex">
              <button onClick={() => go({ name: 'shop' })} className="text-sm text-ink-700 hover:text-ink-900">
                Shop All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => go({ name: 'shop', category: c.slug })}
                  className="text-sm text-ink-700 hover:text-ink-900"
                >
                  {c.name}
                </button>
              ))}
              <button onClick={() => go({ name: 'about' })} className="text-sm text-ink-700 hover:text-ink-900">
                Our Story
              </button>
            </nav>

            <div className="ml-auto hidden max-w-xs flex-1 md:block lg:max-w-sm">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1 md:ml-3">
              <button
                onClick={() => go({ name: 'account' })}
                className="relative rounded-full p-2.5 text-ink-700 hover:bg-sand-100"
                aria-label="Account"
              >
                <User size={19} />
              </button>
              <button
                onClick={() => go({ name: 'account' })}
                className="relative rounded-full p-2.5 text-ink-700 hover:bg-sand-100"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-clay-500 px-1 text-[10px] font-semibold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative rounded-full p-2.5 text-ink-700 hover:bg-sand-100"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink-800 px-1 text-[10px] font-semibold text-sand-50">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* trust bar */}
          <div className="hidden items-center gap-6 border-t border-ink-100 py-2 text-xs text-ink-500 lg:flex">
            {TRUST_ITEMS.map((t) => (
              <span key={t.label} className="flex items-center gap-1.5">
                <t.icon size={14} className="text-moss-500" />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* mobile search */}
        <div className="border-t border-ink-100 px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-sand-50 p-5 shadow-lift animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              <button onClick={() => go({ name: 'shop' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Shop All</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => go({ name: 'shop', category: c.slug })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">
                  {c.name}
                </button>
              ))}
              <div className="my-2 border-t border-ink-100" />
              <button onClick={() => go({ name: 'about' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Our Story</button>
              <button onClick={() => go({ name: 'reviews' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Reviews</button>
              <button onClick={() => go({ name: 'blog' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Guides</button>
              <button onClick={() => go({ name: 'faq' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">FAQ & Shipping</button>
              <button onClick={() => go({ name: 'contact' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Contact</button>
              <button onClick={() => go({ name: 'account' })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sand-100">Account</button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
