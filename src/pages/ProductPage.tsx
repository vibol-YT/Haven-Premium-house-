import { useEffect, useMemo, useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Heart, Minus, Plus, ChevronRight, Eye, Zap } from 'lucide-react';
import { useProduct, useReviews, useRelatedProducts } from '../lib/hooks';
import { useStore } from '../lib/store';
import { useNavigate } from '../lib/router';
import { formatPrice, discountPct, formatDate, classNames } from '../lib/format';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { toast } from '../components/Toast';
import { submitReview } from '../lib/hooks';

const VARIANTS = ['Natural', 'Clay', 'Charcoal'];

export function ProductPage({ slug }: { slug: string }) {
  const { product, images, loading, error } = useProduct(slug);
  const { reviews, loading: reviewsLoading } = useReviews(product?.id);
  const related = useRelatedProducts(product, 4);
  const { addToCart, toggleWishlist, isWishlisted, trackView } = useStore();
  const navigate = useNavigate();

  const [activeImg, setActiveImg] = useState(0);
  const [variant, setVariant] = useState(VARIANTS[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (product) trackView(product.id);
    setActiveImg(0); setQty(1); setVariant(VARIANTS[0]);
  }, [product?.id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.image_url, ...images.map((i) => i.url)];
  }, [product, images]);

  if (loading) {
    return (
      <div className="container-content py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-sand-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-sand-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-sand-100" />
            <div className="h-24 w-full animate-pulse rounded bg-sand-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-content py-24 text-center">
        <p className="text-ink-600">We couldn't find that product.</p>
        <button onClick={() => navigate({ name: 'shop' })} className="btn-secondary mt-4">Back to shop</button>
      </div>
    );
  }

  const disc = discountPct(product.price_cents, product.compare_at_cents);
  const lowStock = product.stock <= 5;
  const viewers = 8 + (product.slug.charCodeAt(0) % 15);

  const handleAdd = () => {
    addToCart(product, variant, qty);
    toast(`${product.name} added to cart`);
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;

  return (
    <div>
      <div className="container-content py-8">
        {/* breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-xs text-ink-400">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-ink-700">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate({ name: 'shop' })} className="hover:text-ink-700">Shop</button>
          <ChevronRight size={12} />
          <span className="text-ink-700">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* GALLERY */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-100">
              <img src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" />
              {disc && (
                <span className="absolute left-4 top-4 rounded-full bg-clay-500 px-3 py-1 text-xs font-semibold text-white">
                  -{disc}% off
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={classNames(
                      'h-20 w-20 overflow-hidden rounded-lg border-2 transition',
                      activeImg === i ? 'border-ink-800' : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <div className="flex flex-wrap gap-2">
              {product.badges?.map((b) => (
                <span key={b} className="rounded-full bg-sand-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-700">
                  {b}
                </span>
              ))}
            </div>
            <h1 className="mt-3 font-serif text-3xl font-medium text-ink-900 sm:text-4xl">{product.name}</h1>
            {product.short_desc && <p className="mt-2 text-ink-500">{product.short_desc}</p>}

            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={avgRating} size={16} />
              <button onClick={() => setTab('reviews')} className="text-sm text-ink-600 underline-offset-2 hover:underline">
                {product.review_count} reviews
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-ink-900">{formatPrice(product.price_cents)}</span>
              {product.compare_at_cents && (
                <span className="text-lg text-ink-300 line-through">{formatPrice(product.compare_at_cents)}</span>
              )}
              {disc && <span className="text-sm font-medium text-clay-500">Save {disc}%</span>}
            </div>

            {/* urgency */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {lowStock && (
                <span className="flex items-center gap-1.5 rounded-full bg-clay-500/10 px-3 py-1.5 font-medium text-clay-600">
                  <Zap size={13} /> Only {product.stock} left in stock
                </span>
              )}
              <span className="flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-ink-600">
                <Eye size={13} /> {viewers} people viewing this
              </span>
            </div>

            {/* variants */}
            <div className="mt-6">
              <p className="text-sm font-medium text-ink-800">Color: <span className="text-ink-500">{variant}</span></p>
              <div className="mt-2 flex gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={classNames(
                      'rounded-full border px-4 py-2 text-sm transition',
                      variant === v ? 'border-ink-800 bg-ink-800 text-sand-50' : 'border-ink-200 text-ink-700 hover:border-ink-400',
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* qty + add */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-ink-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 py-3 text-ink-600 hover:text-ink-900" aria-label="Decrease"><Minus size={15} /></button>
                <span className="min-w-[2.5rem] text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3.5 py-3 text-ink-600 hover:text-ink-900" aria-label="Increase"><Plus size={15} /></button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1 py-3.5 text-sm font-semibold">
                Add to cart · {formatPrice(product.price_cents * qty)}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink-200 text-ink-700 hover:border-ink-400"
                aria-label="Wishlist"
              >
                <Heart size={18} className={isWishlisted(product.id) ? 'fill-clay-500 text-clay-500' : ''} />
              </button>
            </div>

            {/* trust signals */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-sand-100/60 p-4 text-center">
              {[
                { icon: Truck, label: 'Free shipping over $75' },
                { icon: RotateCcw, label: '60-day returns' },
                { icon: ShieldCheck, label: 'Secure checkout' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1.5 text-ink-600">
                  <t.icon size={18} className="text-moss-500" />
                  <span className="text-[11px] leading-tight">{t.label}</span>
                </div>
              ))}
            </div>

            {/* tabs */}
            <div className="mt-8 border-b border-ink-100">
              <div className="flex gap-6">
                {(['description', 'specs', 'reviews'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={classNames(
                      'border-b-2 pb-3 text-sm font-medium capitalize transition',
                      tab === t ? 'border-ink-800 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700',
                    )}
                  >
                    {t === 'reviews' ? `Reviews (${product.review_count})` : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 min-h-[8rem]">
              {tab === 'description' && (
                <p className="text-sm leading-relaxed text-ink-600">{product.description}</p>
              )}
              {tab === 'specs' && (
                <ul className="space-y-2 text-sm text-ink-600">
                  <li className="flex justify-between border-b border-ink-100 pb-2"><span className="text-ink-400">Material</span><span>Premium natural</span></li>
                  <li className="flex justify-between border-b border-ink-100 pb-2"><span className="text-ink-400">Origin</span><span>Handcrafted</span></li>
                  <li className="flex justify-between border-b border-ink-100 pb-2"><span className="text-ink-400">Care</span><span>See product notes</span></li>
                  <li className="flex justify-between border-b border-ink-100 pb-2"><span className="text-ink-400">Warranty</span><span>Lifetime repair promise</span></li>
                </ul>
              )}
              {tab === 'reviews' && (
                <ReviewsTab reviews={reviews} loading={reviewsLoading} avg={avgRating} onWrite={() => setShowReviewForm(true)} />
              )}
            </div>
          </div>
        </div>

        {/* cross-sell: frequently bought together */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="heading text-2xl">You may also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>

      {showReviewForm && product && (
        <ReviewForm
          productId={product.id}
          onClose={() => setShowReviewForm(false)}
          onSubmitted={() => { setShowReviewForm(false); toast('Thanks! Your review has been submitted.'); }}
        />
      )}
    </div>
  );
}

function ReviewsTab({ reviews, loading, avg, onWrite }: {
  reviews: ReturnType<typeof useReviews>['reviews'];
  loading: boolean;
  avg: number;
  onWrite: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-3xl text-ink-900">{avg.toFixed(1)}</span>
          <div>
            <StarRating rating={avg} size={15} />
            <p className="text-xs text-ink-400">Based on {reviews.length} reviews</p>
          </div>
        </div>
        <button onClick={onWrite} className="btn-secondary py-2.5 text-xs">Write a review</button>
      </div>

      <div className="mt-6 space-y-5">
        {loading && <p className="text-sm text-ink-400">Loading reviews...</p>}
        {!loading && reviews.length === 0 && <p className="text-sm text-ink-400">No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-ink-100 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-sand-100 font-serif text-sm text-ink-700">{r.author[0]}</div>
                <div>
                  <p className="text-sm font-medium text-ink-800">{r.author}</p>
                  {r.verified && <p className="text-xs text-moss-600">Verified purchase</p>}
                </div>
              </div>
              <span className="text-xs text-ink-400">{formatDate(r.created_at)}</span>
            </div>
            <div className="mt-3"><StarRating rating={r.rating} size={13} /></div>
            {r.title && <h4 className="mt-2 text-sm font-semibold text-ink-900">{r.title}</h4>}
            <p className="mt-1 text-sm text-ink-600">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ productId, onClose, onSubmitted }: { productId: string; onClose: () => void; onSubmitted: () => void }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { ok, error } = await submitReview({ product_id: productId, author, rating, title, body });
    setSubmitting(false);
    if (ok) onSubmitted();
    else setErr(error ?? 'Something went wrong.');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl bg-sand-50 p-6 shadow-lift animate-scale-in">
        <h3 className="font-serif text-xl text-ink-900">Write a review</h3>
        <div className="mt-4 space-y-3">
          <input required placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} className="input" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-600">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} className="text-2xl">
                <span className={n <= rating ? 'text-clay-500' : 'text-ink-200'}>★</span>
              </button>
            ))}
          </div>
          <input placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          <textarea required placeholder="Your review" value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="input resize-none" />
        </div>
        {err && <p className="mt-2 text-xs text-clay-500">{err}</p>}
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Submitting...' : 'Submit review'}</button>
        </div>
      </form>
    </div>
  );
}
