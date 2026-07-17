import { useState } from 'react';
import { ChevronDown, Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard orders ship within 1 business day and arrive in 3-5 business days. Express (1-2 days) is available at checkout. International orders take 7-14 days depending on destination.' },
  { q: 'Do you offer free shipping?', a: 'Yes — free standard shipping on all U.S. orders over $75. Orders under $75 ship for a flat $7.95. International shipping is calculated at checkout.' },
  { q: 'What is your return policy?', a: 'We accept returns within 60 days of delivery, no questions asked. Items must be unused and in original packaging. We cover return shipping on orders over $75.' },
  { q: 'How do refunds work?', a: 'Refunds are issued to the original payment method within 3-5 business days of us receiving your return. You\'ll get an email confirmation when it\'s processed.' },
  { q: 'Do you ship internationally?', a: 'Yes — we ship to Canada, the UK, the EU, and Australia. Duties and taxes may apply on delivery and are the recipient\'s responsibility.' },
  { q: 'Which payment methods do you accept?', a: 'Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Klarna (4 interest-free payments).' },
  { q: 'Is my payment secure?', a: 'Yes. All payments are processed over an SSL-encrypted connection and we never store your card details on our servers.' },
  { q: 'Can I change or cancel my order?', a: 'If your order hasn\'t shipped yet, email hello@haven.shop and we\'ll do our best to catch it. Once shipped, we can\'t modify it, but you can return it for a full refund.' },
  { q: 'Do you offer a warranty?', a: 'Furniture and cookware come with a lifetime repair promise. If something breaks from normal use, we\'ll repair or replace it.' },
  { q: 'How do I track my order?', a: 'You\'ll receive a tracking link by email as soon as your order ships. You can also find it under Account → Orders.' },
];

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container-content py-12">
      <div className="max-w-2xl">
        <p className="eyebrow">Help center</p>
        <h1 className="mt-2 heading text-4xl">FAQ & Shipping</h1>
        <p className="mt-3 text-ink-500">Everything you need to know. Can't find an answer? <a href="#/contact" className="underline">Get in touch</a>.</p>
      </div>

      {/* quick info cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: 'Free shipping over $75', sub: '1-2 day processing' },
          { icon: RotateCcw, title: '60-day returns', sub: 'Free return shipping over $75' },
          { icon: ShieldCheck, title: 'Lifetime repair', sub: 'On furniture & cookware' },
        ].map((c) => (
          <div key={c.title} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-soft">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-sand-100 text-ink-700"><c.icon size={18} /></div>
            <div><p className="text-sm font-medium text-ink-900">{c.title}</p><p className="text-xs text-ink-400">{c.sub}</p></div>
          </div>
        ))}
      </div>

      {/* accordion */}
      <div className="mt-10 max-w-3xl divide-y divide-ink-100 rounded-2xl bg-white shadow-soft">
        {FAQS.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="text-sm font-medium text-ink-900">{f.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-ink-400 transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-600 animate-fade-in">{f.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-xl bg-sand-100/60 p-5 text-sm text-ink-600">
        <CreditCard size={18} className="text-ink-500" />
        We accept Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, and Klarna.
      </div>
    </div>
  );
}
