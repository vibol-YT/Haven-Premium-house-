import { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/format';
import { useNavigate } from '../lib/router';

const FREE_SHIP_THRESHOLD = 7500;

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateQty, removeFromCart, cartSubtotalCents } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - cartSubtotalCents);
  const progress = Math.min(100, (cartSubtotalCents / FREE_SHIP_THRESHOLD) * 100);

  const goCheckout = () => {
    onClose();
    navigate({ name: 'checkout' });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-sand-50 shadow-lift transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-lg text-ink-900">
            <ShoppingBag size={18} /> Your Cart
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="rounded-full p-2 hover:bg-sand-100">
            <X size={18} />
          </button>
        </div>

        {cart.length > 0 && (
          <div className="border-b border-ink-100 px-5 py-3">
            {remaining > 0 ? (
              <p className="text-xs text-ink-600">
                You're <span className="font-semibold text-ink-900">{formatPrice(remaining)}</span> away from free shipping
              </p>
            ) : (
              <p className="text-xs font-medium text-moss-600">You've unlocked free shipping!</p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
              <div className="h-full rounded-full bg-moss-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag size={40} className="text-ink-200" />
              <p className="text-sm text-ink-500">Your cart is empty.</p>
              <button onClick={onClose} className="btn-secondary">Continue shopping</button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={`${item.product_id}-${item.variant}`} className="flex gap-3">
                  <a href={`#/product/${item.slug}`} onClick={onClose} className="shrink-0">
                    <img src={item.image_url} alt={item.name} className="h-20 w-20 relative z-0 rounded-lg object-cover" />
                  </a>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <a href={`#/product/${item.slug}`} onClick={onClose} className="text-sm font-medium text-ink-800 hover:text-ink-900">
                        {item.name}
                      </a>
                      <button onClick={() => removeFromCart(item.product_id, item.variant)} aria-label="Remove" className="text-ink-300 hover:text-clay-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {item.variant !== 'Default' && <span className="text-xs text-ink-400">{item.variant}</span>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button onClick={() => updateQty(item.product_id, item.variant, item.quantity - 1)} className="px-2.5 py-1.5 text-ink-600 hover:text-ink-900" aria-label="Decrease">
                          <Minus size={13} />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product_id, item.variant, item.quantity + 1)} className="px-2.5 py-1.5 text-ink-600 hover:text-ink-900" aria-label="Increase">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink-900">
                        {formatPrice(item.price_cents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-ink-100 px-5 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-ink-600">Subtotal</span>
              <span className="font-semibold text-ink-900">{formatPrice(cartSubtotalCents)}</span>
            </div>
            <p className="mb-3 text-xs text-ink-400">Shipping & taxes calculated at checkout.</p>
            <button onClick={goCheckout} className="btn-primary w-full">Checkout</button>
            <button onClick={onClose} className="mt-2 w-full text-center text-xs text-ink-500 hover:text-ink-800">Continue shopping</button>
          </div>
        )}
      </aside>
    </>
  );
}
