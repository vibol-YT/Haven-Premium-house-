import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from './supabase';

export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string;
  quantity: number;
  variant: string;
};

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  addToCart: (product: Product, variant?: string, qty?: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQty: (productId: string, variant: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalCents: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  trackView: (productId: string) => void;
};

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'haven_cart_v1';
const WISH_KEY = 'haven_wishlist_v1';
const RECENT_KEY = 'haven_recent_v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => load(WISH_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => load(RECENT_KEY, []));

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const addToCart = (product: Product, variant = 'Default', qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product_id === product.id && i.variant === variant);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          price_cents: product.price_cents,
          image_url: product.image_url,
          quantity: qty,
          variant,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart((prev) => prev.filter((i) => !(i.product_id === productId && i.variant === variant)));
  };

  const updateQty = (productId: string, variant: string, qty: number) => {
    if (qty < 1) return removeFromCart(productId, variant);
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === productId && i.variant === variant ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const trackView = (productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  };

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartSubtotalCents = useMemo(
    () => cart.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),
    [cart],
  );

  const value: StoreState = {
    cart,
    wishlist,
    recentlyViewed,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartSubtotalCents,
    toggleWishlist,
    isWishlisted,
    trackView,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
