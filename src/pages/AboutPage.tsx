import { Leaf, Hammer, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from '../lib/router';

export function AboutPage() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 text-sand-50">
        <img src="https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="container-content relative py-24">
          <p className="eyebrow text-sand-300">Our story</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            We started Haven because "nice things" kept breaking.
          </h1>
          <p className="mt-5 max-w-xl text-sand-200/85">
            In 2019, our founder replaced a "premium" lamp for the third time in two years. So she went looking for makers who build things to outlast the people who buy them — and Haven was born.
          </p>
        </div>
      </section>

      <section className="container-content py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { icon: Leaf, title: 'Sourced with care', body: 'We visit every workshop. Linen from Belgium, oak from the Pacific Northwest, ceramics from a family-run kiln in Portugal.' },
            { icon: Hammer, title: 'Made to be repaired', body: 'Furniture and cookware come with a lifetime repair promise. If it breaks, we fix it — not landfill it.' },
            { icon: Heart, title: 'Fair to makers', body: 'We pay our makers more and mark up less. You see honest prices; they get paid properly for their craft.' },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl bg-white p-7 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-moss-500 text-white"><v.icon size={22} /></div>
              <h3 className="mt-4 font-serif text-xl text-ink-900">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-100/60 py-16">
        <div className="container-content grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <img src="https://images.pexels.com/photos/266706/pexels-photo-266706.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Workshop" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">By the numbers</p>
            <h2 className="mt-2 heading text-3xl">A small company, a big standard</h2>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                { n: '47', l: 'Maker partners' },
                { n: '10k+', l: 'Happy customers' },
                { n: '4.9★', l: 'Average review' },
                { n: '60 day', l: 'Return window' },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-serif text-4xl text-ink-900">{s.n}</dt>
                  <dd className="mt-1 text-sm text-ink-500">{s.l}</dd>
                </div>
              ))}
            </dl>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-primary mt-8">Shop the collection <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
