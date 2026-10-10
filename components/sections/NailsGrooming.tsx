'use client';

import { useEffect, useRef } from 'react';
import { gsap, isTouch, prefersReducedMotion } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import { useBooking } from '@/components/providers/Booking';

const sides = [
  {
    id: 'nails-spa',
    key: 'nails',
    title: 'Nails',
    kicker: 'Hands & feet, finished beautifully',
    items: ['Manicure', 'Pedicure', 'Crystal Nail Care'],
    img: media.nails,
    tone: 'bg-[#E9DCD2] text-charcoal',
  },
  {
    id: 'grooming',
    key: 'grooming',
    title: 'Grooming',
    kicker: 'Clean lines, sharp details',
    items: ['Beard Styling', 'Shaving', 'Trimming', 'Waxing'],
    img: media.grooming,
    tone: 'bg-espresso text-cream',
  },
];

/**
 * 07 — Two moods, one studio.
 * The cursor's horizontal position sets --split (0 → 1): the side you are
 * nearer to widens, its photograph brightens and its light warms, while
 * the other recedes. A mirror sweep crosses each image on hover.
 */
export default function NailsGrooming() {
  const root = useRef<HTMLElement>(null);
  const { open } = useBooking();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ng-side', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, stagger: 0.18, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
    }, el);
    if (isTouch() || prefersReducedMotion()) return () => ctx.revert();

    const proxy = { v: 0.5 };
    const to = gsap.quickTo(proxy, 'v', {
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => el.style.setProperty('--split', proxy.v.toFixed(4)),
    });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      to(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
    };
    const leave = () => to(0.5);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      ctx.revert();
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <section id="nails-grooming" ref={root} data-tone="light" className="ng relative bg-ivory text-charcoal" style={{ ['--split' as any]: 0.5 }}>
      <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-28 sm:px-10 md:pt-36">
        <p className="eyebrow text-rose">Nails + Grooming</p>
        <SplitReveal className="mt-6 max-w-4xl font-serif text-[13vw] font-light leading-[0.92] sm:text-7xl lg:text-[96px]">
          The details <em className="italic text-rose">make the difference.</em>
        </SplitReveal>
      </div>

      <div className="ng-split flex flex-col md:h-[88vh] md:flex-row">
        {sides.map((s, i) => (
          <div key={s.key} className={`ng-side ng-${s.key} group relative flex min-h-[78vh] flex-col justify-end overflow-hidden md:min-h-0 ${s.tone}`} data-cursor={i === 0 ? 'spa' : 'hair'}>
            <div className="ng-media absolute inset-0">
              <Media item={s.img} className="absolute inset-0 h-full w-full" sizes="(min-width:768px) 60vw, 100vw" mirror />
              <div className={`absolute inset-0 ${i === 0 ? 'bg-gradient-to-t from-[#E9DCD2] via-[#E9DCD2]/50 to-transparent' : 'bg-gradient-to-t from-espresso via-espresso/60 to-transparent'}`} />
            </div>
            <div className="relative z-10 p-6 sm:p-10 lg:p-14">
              <p className="text-[11px] uppercase tracking-luxe opacity-70">{s.kicker}</p>
              <h3 className="mt-3 font-serif text-6xl font-light leading-none sm:text-7xl lg:text-8xl">{s.title}</h3>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <span className="h-px w-3 bg-gold" /> {it}
                  </li>
                ))}
              </ul>
              <button onClick={() => open(s.id)} className="link-underline mt-8 text-[12px] uppercase tracking-[0.22em]" data-cursor="book">
                Book {s.title.toLowerCase()} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
