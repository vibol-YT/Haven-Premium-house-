import { ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from '../lib/router';

const POSTS = [
  {
    title: 'How to care for cast iron (so it lasts a lifetime)',
    excerpt: 'A simple, once-a-month routine that keeps your skillet nonstick and rust-free — no soap myths required.',
    category: 'Kitchen',
    read: '6 min',
    image: 'https://images.pexels.com/photos/3236394/pexels-photo-3236394.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'The linen cheat sheet: how to make it soft, not scratchy',
    excerpt: 'Why your new linen feels stiff and the three things that fix it within two washes.',
    category: 'Living',
    read: '4 min',
    image: 'https://images.pexels.com/photos/6207365/pexels-photo-6207365.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Lighting a room: a no-rules guide to warm light',
    excerpt: 'Forget the 3-light rule. Here\'s how to actually make a room feel good in the evening.',
    category: 'Lighting',
    read: '5 min',
    image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Why we chose organic cotton (and what GOTS actually means)',
    excerpt: 'A plain-English breakdown of the certification on our bedding — and why it matters for your skin.',
    category: 'Bedding',
    read: '7 min',
    image: 'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'A small kitchen, well-kept: the 5 tools that earn their spot',
    excerpt: 'If counter space is tight, these are the five things worth keeping and everything you can ditch.',
    category: 'Kitchen',
    read: '8 min',
    image: 'https://images.pexels.com/photos/266706/pexels-photo-266706.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'The case for buying less, better',
    excerpt: 'Our founder on why Haven will never release a "new collection" every season.',
    category: 'Brand',
    read: '5 min',
    image: 'https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function BlogPage() {
  const navigate = useNavigate();
  return (
    <div className="container-content py-12">
      <div className="max-w-2xl">
        <p className="eyebrow">Guides & Journal</p>
        <h1 className="mt-2 heading text-4xl">Read before you buy</h1>
        <p className="mt-3 text-ink-500">Honest guides on care, materials, and living with fewer, better things.</p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post, i) => (
          <article key={i} className="group cursor-pointer animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand-100">
              <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-full bg-sand-50/90 px-3 py-1 text-xs font-medium text-ink-700">{post.category}</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Clock size={13} /> {post.read} read
              </div>
              <h2 className="mt-2 font-serif text-xl text-ink-900 group-hover:text-ink-700">{post.title}</h2>
              <p className="mt-1.5 text-sm text-ink-500">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-700">
                Read article <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-ink-900 p-10 text-center text-sand-50">
        <h2 className="font-serif text-2xl">Get our guides in your inbox</h2>
        <p className="mt-2 text-sm text-sand-200/80">One thoughtful email a month. No spam, unsubscribe anytime.</p>
        <button onClick={() => navigate({ name: 'home' })} className="btn mt-5 bg-sand-50 px-6 py-3 text-sm font-medium text-ink-900 hover:bg-white">Subscribe</button>
      </div>
    </div>
  );
}
