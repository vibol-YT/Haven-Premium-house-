import { ArrowRight, Truck, RotateCcw, ShieldCheck, Leaf, Quote } from 'lucide-react';
import { useProducts, useCategories } from '../lib/hooks';
import { useNavigate } from '../lib/router';
import { ProductCard } from '../components/ProductCard';
import { StarRating } from '../components/StarRating';

const PRESS = ['VOGUE', 'Kinfolk', 'DWELL', 'Apartment Therapy', 'Remodelista'];

const TESTIMONIALS = [
  { quote: "Everything I've bought from Haven has outlasted the 'nice' stuff I paid more for elsewhere. The linen throw is on its third year.", name: 'Margaret O.', role: 'Verified buyer' },
  { quote: "The cast iron skillet replaced three pans. It's the one thing in my kitchen I'll never replace.", name: 'James R.', role: 'Verified buyer' },
  { quote: "Customer service actually answered in five minutes and helped me pick sheets that don't make me sweat. Genuinely impressed.", name: 'Rachel W.', role: 'Verified buyer' },
];

export function HomePage() {
  const { products: bestsellers, loading } = useProducts({ bestsellersOnly: true, limit: 8 });
  const { categories } = useCategories();
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900 text-sand-50">
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="A warm, minimal living room"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/50 to-transparent" />
        <div className="container-content relative flex min-h-[78vh] flex-col justify-center py-20">
          <div className="max-w-xl animate-fade-up">
            <p className="eyebrow text-sand-300">New season · 2026</p>
            <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
              Things made to be<br />used every day.
            </h1>
            <p className="mt-5 max-w-md text-base text-sand-200/85">
              Premium home & lifestyle goods, sourced from makers we know and built to outlast trends. Free shipping over $75.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate({ name: 'shop' })} className="btn bg-sand-50 px-7 py-3.5 text-sm font-medium text-ink-900 hover:bg-white">
                Shop New Arrivals <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate({ name: 'shop', category: 'living' })} className="btn border border-sand-300/40 px-7 py-3.5 text-sm font-medium text-sand-50 hover:bg-ink-800">
                Shop Bestsellers
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-sand-200/80">
              <StarRating rating={4.9} size={16} />
              <span>4.9 average from 2,400+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-content grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free shipping', sub: 'On orders over $75' },
            { icon: RotateCcw, title: '60-day returns', sub: 'No questions asked' },
            { icon: ShieldCheck, title: 'Secure checkout', sub: 'SSL encrypted payments' },
            { icon: Leaf, title: 'Made to last', sub: 'Quality you can feel' },
          ].map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-700">
                <t.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">{t.title}</p>
                <p className="text-xs text-ink-400">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRESS / AS SEEN IN */}
      <section className="border-b border-ink-100 bg-sand-50 py-6">
        <div className="container-content">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-ink-400">As seen in</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {PRESS.map((p) => (
              <span key={p} className="font-serif text-lg text-ink-300">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-content py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Bestsellers</p>
            <h2 className="mt-2 heading text-3xl sm:text-4xl">Most-loved this season</h2>
          </div>
          <button onClick={() => navigate({ name: 'shop' })} className="hidden items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 sm:flex">
            View all <ArrowRight size={15} />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-sand-100" />)
            : bestsellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="bg-sand-100/60 py-16">
        <div className="container-content">
          <p className="eyebrow">Shop by category</p>
          <h2 className="mt-2 heading text-3xl sm:text-4xl">Find your room</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate({ name: 'shop', category: c.slug })}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-sand-50">
                  <h3 className="font-serif text-2xl">{c.name}</h3>
                  {c.tagline && <p className="mt-1 text-sm text-sand-200/85">{c.tagline}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
                    Shop now <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE / DIFFERENTIATION */}
      <section className="container-content py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <img src="https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Craftsperson at work" className="h-full relative z-0 w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Why Haven</p>
            <h2 className="mt-2 heading text-3xl sm:text-4xl">Not cheaper. Made better.</h2>
            <p className="mt-4 text-ink-600">
              We work directly with small workshops and family-run makers — no middlemen, no markups for markup's sake. The result: honest prices for things that genuinely last.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { title: 'Direct from the maker', body: 'We visit every workshop. You pay what things actually cost to make well.' },
                { title: 'Materials that age well', body: 'Linen, oak, cast iron, stoneware — chosen to look better the more you use them.' },
                { title: 'A guarantee that means it', body: '60-day returns and a lifetime repair promise on furniture and cookware.' },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-moss-500 text-white">
                    <Leaf size={15} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-900">{f.title}</h4>
                    <p className="mt-1 text-sm text-ink-500">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate({ name: 'about' })} className="btn-secondary mt-8">
              Read our story <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <section className="bg-ink-900 py-20 text-sand-50">
        <div className="container-content">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center"><StarRating rating={4.9} size={22} /></div>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">10,000+ happy homes</h2>
            <p className="mt-3 text-sand-200/80">From first apartments to forever homes — here's what people say.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl bg-ink-800 p-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Quote size={22} className="text-clay-400" />
                <p className="mt-4 text-sm leading-relaxed text-sand-100/90">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-sand-50/10 font-serif text-sm">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-sand-300/70">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UGC / INSTAGRAM STRIP */}
      <section className="container-content py-16">
        <div className="text-center">
          <p className="eyebrow">#MyHaven</p>
          <h2 className="mt-2 heading text-3xl">Styled by you</h2>
          <p className="mt-2 text-sm text-ink-500">Tag us @haven.shop to be featured.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            'https://images.pexels.com/photos/6207365/pexels-photo-6207365.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/2889167/pexels-photo-2889167.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/4226822/pexels-photo-4226822.jpeg?auto=compress&cs=tinysrgb&w=400',
          ].map((src, i) => (
            <a key={i} href="#/" className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={src} alt="Customer photo" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-110" />
              <div className="absolute inset-0 bg-ink-900/0 transition group-hover:bg-ink-900/20" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
