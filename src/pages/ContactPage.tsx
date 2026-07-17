import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Phone, Send } from 'lucide-react';

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-content py-12">
      <div className="max-w-2xl">
        <p className="eyebrow">We're here to help</p>
        <h1 className="mt-2 heading text-4xl">Contact us</h1>
        <p className="mt-3 text-ink-500">Questions about an order, a product, or a return? Our team typically replies within a few hours, Monday–Friday.</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: Mail, title: 'Email', value: 'hello@haven.shop', sub: 'Best for order questions' },
            { icon: MessageCircle, title: 'Live chat', value: 'Bottom-right corner', sub: '9am–6pm ET, weekdays' },
            { icon: Phone, title: 'Phone', value: '+1 (555) 010-2025', sub: 'Mon–Fri, 9am–6pm ET' },
            { icon: MapPin, title: 'Studio', value: '48 Greenpoint Ave, Brooklyn, NY', sub: 'By appointment only' },
          ].map((c) => (
            <div key={c.title} className="flex gap-3 rounded-xl bg-white p-4 shadow-soft">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-700"><c.icon size={18} /></div>
              <div>
                <p className="text-sm font-medium text-ink-900">{c.title}</p>
                <p className="text-sm text-ink-700">{c.value}</p>
                <p className="text-xs text-ink-400">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center animate-scale-in">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-moss-500 text-white"><Send size={22} /></div>
                <h2 className="heading text-xl">Message sent!</h2>
                <p className="max-w-sm text-sm text-ink-500">Thanks for reaching out. We'll get back to you within a few hours.</p>
                <button onClick={() => setSent(false)} className="btn-secondary mt-2">Send another</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-lg text-ink-900">Send a message</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                  <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </div>
                <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input mt-3" />
                <textarea required placeholder="How can we help?" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input mt-3 resize-none" />
                <button type="submit" className="btn-primary mt-4 w-full">Send message <Send size={15} /></button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
