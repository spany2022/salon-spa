'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import SplitReveal from '@/components/ui/SplitReveal';

const values = [
  {
    t: 'Expertise',
    d: 'Professional beauty and styling services, delivered with skill and care.',
    glyph: <path d="M12 3 L14.2 9.8 L21 12 L14.2 14.2 L12 21 L9.8 14.2 L3 12 L9.8 9.8 Z" />,
  },
  {
    t: 'Personalised Experience',
    d: 'Services designed around your hair, your skin, your occasion — never one-size-fits-all.',
    glyph: <path d="M12 21c-4.5-3-8-6.2-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 11c0 3.8-3.5 7-8 10Z" />,
  },
  {
    t: 'Complete Beauty Care',
    d: 'Hair, skin, nails, grooming, makeup and spa — together, under one roof.',
    glyph: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
      </>
    ),
  },
  {
    t: 'Transformation',
    d: 'Helping every client look — and feel — their very best.',
    glyph: <path d="M4 19 C8 19 8 5 12 5 S16 19 20 19" />,
  },
];

/** 10 — Beauty, done with intention. Editorial rows, not icon cards. */
export default function Why() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.why-row').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
        tl.fromTo(row.querySelector('.why-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' })
          .fromTo(row.querySelectorAll('.why-in'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform' }, 0.35);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={root} data-tone="light" className="relative bg-nude py-28 text-charcoal md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow text-rose">Why Aabha</p>
            <SplitReveal className="mt-6 font-serif text-[14vw] font-light leading-[0.9] sm:text-7xl lg:text-[92px]">
              Beauty, Done With <em className="italic text-rose">Intention.</em>
            </SplitReveal>
            <p className="mt-8 max-w-sm leading-relaxed text-charcoal/65">Four promises we hold ourselves to, every appointment.</p>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {values.map((v, i) => (
            <li key={v.t} className="why-row group relative py-10 md:py-12">
              <span className="why-rule absolute inset-x-0 top-0 h-px origin-left bg-charcoal/20" />
              <div className="grid grid-cols-[auto_1fr] items-start gap-6 md:grid-cols-[90px_1fr_auto] md:gap-10">
                <span className="why-in font-serif text-5xl font-light leading-none text-gold md:text-6xl">0{i + 1}</span>
                <div>
                  <h3 className="why-in font-serif text-4xl font-light leading-tight transition-colors duration-500 group-hover:text-rose md:text-5xl">{v.t}</h3>
                  <p className="why-in mt-3 max-w-md leading-relaxed text-charcoal/65">{v.d}</p>
                </div>
                <svg
                  className="why-glyph why-in hidden h-12 w-12 text-gold transition-transform duration-1000 ease-silk group-hover:rotate-[20deg] md:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  aria-hidden
                >
                  {v.glyph}
                </svg>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
