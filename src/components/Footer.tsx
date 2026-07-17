import { useState } from 'react';
import { Mail, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useNavigate } from '../lib/router';
import { subscribeEmail } from '../lib/hooks';

export function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { ok } = await subscribeEmail(email);
    setStatus(ok ? 'ok' : 'err');
    if (ok) setEmail('');
  };

  const go = (r: Parameters<typeof navigate>[0]) => navigate(r);

  return (
    <footer className="mt-24 bg-ink-900 text-sand-100">
      {/* email capture */}
      <div className="border-b border-ink-700">
        <div className="container-content grid gap-8 py-12 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="font-serif text-2xl text-sand-50">Join the list, get 10% off</h3>
            <p className="mt-2 text-sm text-sand-200/80">
              Be first to know about new arrivals, restocks, and members-only offers. New subscribers get a single-use 10% code.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2 md:ml-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-ink-600 bg-ink-800 px-5 py-3 text-sm text-sand-50 placeholder:text-ink-400 focus:border-sand-300 focus:outline-none"
            />
            <button type="submit" className="btn bg-sand-50 px-5 py-3 text-sm font-medium text-ink-900 hover:bg-white">
              <ArrowRight size={16} />
            </button>
          </form>
          {status === 'ok' && <p className="text-xs text-moss-500 md:col-span-2 md:-mt-4">You're in! Check your inbox for your 10% code.</p>}
          {status === 'err' && <p className="text-xs text-clay-400 md:col-span-2 md:-mt-4">Something went wrong. Please try again.</p>}
        </div>
      </div>

      <div className="container-content grid gap-10 py-14 md:grid-cols-4">
        <div>
          <h4 className="font-serif text-xl text-sand-50">Haven</h4>
          <p className="mt-3 text-sm text-sand-200/70 max-w-xs">
            Thoughtfully made home & lifestyle goods, built to last and designed to be used every day.
          </p>
          <div className="mt-4 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#/" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full border border-ink-600 text-sand-200 transition hover:border-sand-300 hover:text-sand-50">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-[0.15em] text-sand-300">Shop</h5>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li><button onClick={() => go({ name: 'shop' })} className="hover:text-sand-50">All Products</button></li>
            <li><button onClick={() => go({ name: 'shop', category: 'living' })} className="hover:text-sand-50">Living</button></li>
            <li><button onClick={() => go({ name: 'shop', category: 'kitchen' })} className="hover:text-sand-50">Kitchen</button></li>
            <li><button onClick={() => go({ name: 'shop', category: 'bath' })} className="hover:text-sand-50">Bath & Body</button></li>
            <li><button onClick={() => go({ name: 'shop', category: 'bedding' })} className="hover:text-sand-50">Bedding</button></li>
            <li><button onClick={() => go({ name: 'shop', category: 'lighting' })} className="hover:text-sand-50">Lighting</button></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-[0.15em] text-sand-300">Company</h5>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li><button onClick={() => go({ name: 'about' })} className="hover:text-sand-50">Our Story</button></li>
            <li><button onClick={() => go({ name: 'reviews' })} className="hover:text-sand-50">Reviews</button></li>
            <li><button onClick={() => go({ name: 'blog' })} className="hover:text-sand-50">Guides</button></li>
            <li><button onClick={() => go({ name: 'contact' })} className="hover:text-sand-50">Contact</button></li>
            <li><button onClick={() => go({ name: 'account' })} className="hover:text-sand-50">Account</button></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-[0.15em] text-sand-300">Help</h5>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li><button onClick={() => go({ name: 'faq' })} className="hover:text-sand-50">FAQ</button></li>
            <li><button onClick={() => go({ name: 'faq' })} className="hover:text-sand-50">Shipping & Returns</button></li>
            <li><a href="mailto:hello@haven.shop" className="flex items-center gap-1.5 hover:text-sand-50"><Mail size={13} /> hello@haven.shop</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <div className="container-content flex flex-col items-center justify-between gap-4 py-6 text-xs text-sand-200/60 md:flex-row">
          <p>© {new Date().getFullYear()} Haven Goods. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Refund Policy</span>
            <div className="flex items-center gap-1.5 rounded-md bg-ink-800 px-2.5 py-1.5 text-[10px] font-medium tracking-wide">
              <span>VISA</span><span>·</span><span>MC</span><span>·</span><span>AMEX</span><span>·</span><span>PAYPAL</span><span>·</span><span>APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
