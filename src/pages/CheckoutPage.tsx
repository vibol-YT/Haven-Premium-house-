import { useState } from 'react';
import { Check, Lock, ChevronLeft, CreditCard, Truck, Package } from 'lucide-react';
import { useStore } from '../lib/store';
import { useNavigate } from '../lib/router';
import { formatPrice, classNames } from '../lib/format';
import { toast } from '../components/Toast';

const FREE_SHIP = 7500;
const SHIP_FLAT = 795;
const STEPS = ['Information', 'Shipping', 'Payment'] as const;

export function CheckoutPage() {
  const { cart, cartSubtotalCents, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [shipMethod, setShipMethod] = useState<'standard' | 'express'>('standard');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const shipping = cartSubtotalCents >= FREE_SHIP ? 0 : (shipMethod === 'express' ? 1495 : SHIP_FLAT);
  const tax = Math.round(cartSubtotalCents * 0.08);
  const total = cartSubtotalCents + shipping + tax;

  if (cart.length === 0 && !placed) {
    return (
      <div className="container-content flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-sand-100 text-ink-300"><Package size={28} /></div>
        <h1 className="heading text-2xl">Your cart is empty</h1>
        <button onClick={() => navigate({ name: 'shop' })} className="btn-primary">Browse products</button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container-content flex flex-col items-center justify-center gap-5 py-28 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-moss-500 text-white animate-scale-in"><Check size={36} /></div>
        <h1 className="heading text-3xl">Order confirmed!</h1>
        <p className="max-w-md text-sm text-ink-500">
          Thanks{firstName ? `, ${firstName}` : ''}! A confirmation has been sent to {email || 'your email'}. You'll get tracking info once your order ships.
        </p>
        <div className="mt-2 rounded-xl bg-white p-5 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-ink-400">Order number</p>
          <p className="mt-1 font-mono text-lg text-ink-900">HV-{Math.floor(Math.random() * 900000 + 100000)}</p>
        </div>
        <button onClick={() => navigate({ name: 'home' })} className="btn-primary mt-2">Back to home</button>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      clearCart();
      toast('Order placed!');
    }, 1100);
  };

  return (
    <div className="container-content py-10">
      <button onClick={() => navigate({ name: 'cart' })} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
        <ChevronLeft size={15} /> Back to cart
      </button>

      {/* progress */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={classNames(
              'grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-medium transition',
              i < step ? 'bg-moss-500 text-white' : i === step ? 'bg-ink-800 text-sand-50' : 'bg-sand-200 text-ink-400',
            )}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={classNames('text-sm', i === step ? 'font-medium text-ink-900' : 'text-ink-400')}>{s}</span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-ink-100" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* form */}
        <form onSubmit={placeOrder} className="lg:col-span-2">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="heading text-xl">Contact & shipping</h2>
              <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
                <input required placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" />
              </div>
              <input required placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="input" />
                <input required placeholder="ZIP / Postal code" value={zip} onChange={(e) => setZip(e.target.value)} className="input" />
              </div>
              <button type="button" onClick={next} className="btn-primary w-full">Continue to shipping</button>
              <p className="text-center text-xs text-ink-400">Guest checkout — no account required</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="heading text-xl">Shipping method</h2>
              {[
                { id: 'standard' as const, label: 'Standard (3-5 business days)', price: cartSubtotalCents >= FREE_SHIP ? 'Free' : formatPrice(SHIP_FLAT) },
                { id: 'express' as const, label: 'Express (1-2 business days)', price: formatPrice(1495) },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setShipMethod(m.id)}
                  className={classNames(
                    'flex w-full items-center justify-between rounded-xl border p-4 text-left transition',
                    shipMethod === m.id ? 'border-ink-800 bg-ink-50' : 'border-ink-200 hover:border-ink-400',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Truck size={18} className="text-ink-600" />
                    <span className="text-sm font-medium text-ink-800">{m.label}</span>
                  </span>
                  <span className="text-sm font-semibold text-ink-900">{m.price}</span>
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={back} className="btn-secondary flex-1">Back</button>
                <button type="button" onClick={next} className="btn-primary flex-1">Continue to payment</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="heading text-xl">Payment</h2>
              <div className="flex items-center gap-2 rounded-xl bg-sand-100/60 p-3 text-xs text-ink-600">
                <Lock size={14} className="text-moss-500" /> All transactions are secure and encrypted.
              </div>
              <div className="rounded-xl border border-ink-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-800"><CreditCard size={16} /> Credit / Debit Card</div>
                <div className="mt-4 space-y-3">
                  <input required placeholder="Card number" value={card} onChange={(e) => setCard(e.target.value)} className="input" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} className="input" />
                    <input required placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} className="input" />
                  </div>
                </div>
              </div>
              {/* alt pay */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="rounded-xl border border-ink-200 py-3 text-sm font-medium text-ink-700 hover:border-ink-400">Pay with PayPal</button>
                <button type="button" className="rounded-xl border border-ink-200 py-3 text-sm font-medium text-ink-700 hover:border-ink-400">Apple Pay</button>
                <button type="button" className="rounded-xl border border-ink-200 py-3 text-sm font-medium text-ink-700 hover:border-ink-400">Google Pay</button>
                <button type="button" className="rounded-xl border border-ink-200 py-3 text-sm font-medium text-ink-700 hover:border-ink-400">Klarna · 4 payments</button>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={back} className="btn-secondary flex-1">Back</button>
                <button type="submit" disabled={placing} className="btn-primary flex-1">
                  {placing ? 'Placing order...' : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl bg-white p-6 shadow-soft">
            <h2 className="font-serif text-lg text-ink-900">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li key={`${item.product_id}-${item.variant}`} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={item.image_url} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink-800 px-1 text-[10px] font-semibold text-sand-50">{item.quantity}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium text-ink-800">{item.name}</p>
                    {item.variant !== 'Default' && <span className="text-xs text-ink-400">{item.variant}</span>}
                  </div>
                  <span className="self-center text-sm font-medium text-ink-900">{formatPrice(item.price_cents * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="text-ink-900">{formatPrice(cartSubtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd className="text-ink-900">{shipping === 0 ? <span className="text-moss-600">Free</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Tax</dt><dd className="text-ink-900">{formatPrice(tax)}</dd></div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base"><dt className="font-medium">Total</dt><dd className="font-semibold">{formatPrice(total)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
