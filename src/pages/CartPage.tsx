import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useStore } from '../lib/store';
import { useNavigate } from '../lib/router';
import { formatPrice } from '../lib/format';

const FREE_SHIP = 7500;
const SHIP_FLAT = 795;

export function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotalCents, clearCart } = useStore();
  const navigate = useNavigate();

  const shipping = cartSubtotalCents >= FREE_SHIP || cart.length === 0 ? 0 : SHIP_FLAT;
  const tax = Math.round(cartSubtotalCents * 0.08);
  const total = cartSubtotalCents + shipping + tax;
  const remaining = Math.max(0, FREE_SHIP - cartSubtotalCents);

  if (cart.length === 0) {
    return (
      <div className="container-content flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-sand-100 text-ink-300"><ShoppingBag size={28} /></div>
        <h1 className="heading text-2xl">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-ink-500">Looks like you haven't added anything yet. Let's fix that.</p>
        <button onClick={() => navigate({ name: 'shop' })} className="btn-primary mt-2">Start shopping <ArrowRight size={15} /></button>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="heading text-3xl">Your Cart</h1>
      <p className="mt-1 text-sm text-ink-500">{cart.length} item{cart.length > 1 ? 's' : ''}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* items */}
        <div className="lg:col-span-2">
          {/* free shipping progress */}
          <div className="mb-5 rounded-xl bg-sand-100/70 p-4">
            {remaining > 0 ? (
              <p className="text-sm text-ink-600">
                You're <span className="font-semibold text-ink-900">{formatPrice(remaining)}</span> away from free shipping
              </p>
            ) : (
              <p className="text-sm font-medium text-moss-600">You've unlocked free shipping!</p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
              <div className="h-full rounded-full bg-moss-500 transition-all" style={{ width: `${Math.min(100, (cartSubtotalCents / FREE_SHIP) * 100)}%` }} />
            </div>
          </div>

          <ul className="divide-y divide-ink-100 rounded-xl bg-white shadow-soft">
            {cart.map((item) => (
              <li key={`${item.product_id}-${item.variant}`} className="flex gap-4 p-4">
                <a href={`#/product/${item.slug}`} className="shrink-0">
                  <img src={item.image_url} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                </a>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <a href={`#/product/${item.slug}`} className="text-sm font-medium text-ink-800 hover:text-ink-900">{item.name}</a>
                    <button onClick={() => removeFromCart(item.product_id, item.variant)} className="text-ink-300 hover:text-clay-500" aria-label="Remove"><Trash2 size={16} /></button>
                  </div>
                  {item.variant !== 'Default' && <span className="text-xs text-ink-400">{item.variant}</span>}
                  <span className="text-sm text-ink-600">{formatPrice(item.price_cents)}</span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-ink-200">
                      <button onClick={() => updateQty(item.product_id, item.variant, item.quantity - 1)} className="px-3 py-1.5 text-ink-600 hover:text-ink-900" aria-label="Decrease"><Minus size={13} /></button>
                      <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product_id, item.variant, item.quantity + 1)} className="px-3 py-1.5 text-ink-600 hover:text-ink-900" aria-label="Increase"><Plus size={13} /></button>
                    </div>
                    <span className="text-sm font-semibold text-ink-900">{formatPrice(item.price_cents * item.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between">
            <button onClick={clearCart} className="text-xs text-ink-400 hover:text-clay-500">Clear cart</button>
            <button onClick={() => navigate({ name: 'shop' })} className="text-xs text-ink-500 hover:text-ink-800">Continue shopping</button>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-serif text-lg text-ink-900">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-medium text-ink-900">{formatPrice(cartSubtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd className="text-ink-900">{shipping === 0 ? <span className="text-moss-600">Free</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Estimated tax</dt><dd className="text-ink-900">{formatPrice(tax)}</dd></div>
              <div className="border-t border-ink-100 pt-3 flex justify-between text-base"><dt className="font-medium text-ink-900">Total</dt><dd className="font-semibold text-ink-900">{formatPrice(total)}</dd></div>
            </dl>

            {/* promo */}
            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input placeholder="Promo code" className="w-full rounded-full border border-ink-200 py-2.5 pl-9 pr-3 text-sm focus:border-ink-700 focus:outline-none" />
              </div>
              <button className="btn-secondary px-4 py-2.5 text-xs">Apply</button>
            </div>

            <button onClick={() => navigate({ name: 'checkout' })} className="btn-primary mt-5 w-full py-3.5">
              Checkout <ArrowRight size={15} />
            </button>
            <p className="mt-3 text-center text-xs text-ink-400">Secure checkout · Guest checkout available</p>
            <div className="mt-3 flex justify-center gap-1.5 text-[10px] font-medium text-ink-400">
              <span className="rounded bg-sand-100 px-2 py-1">VISA</span>
              <span className="rounded bg-sand-100 px-2 py-1">MASTERCARD</span>
              <span className="rounded bg-sand-100 px-2 py-1">AMEX</span>
              <span className="rounded bg-sand-100 px-2 py-1">PAYPAL</span>
              <span className="rounded bg-sand-100 px-2 py-1">APPLE PAY</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
