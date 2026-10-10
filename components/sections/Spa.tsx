'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import Magnetic from '@/components/ui/Magnetic';
import { useBooking } from '@/components/providers/Booking';

const words = ['Pause.', 'Breathe.', 'Restore.'];

/**
 * 06 — You relax.
 * The atmosphere changes: dim warm light, rising steam, water rings,
 * and a breathing guide that inhales and exhales on a slow 8s cycle.
 * Words arrive one at a time as you scroll, never all at once.
 */
export default function Spa() {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const { open } = useBooking();

  useEffect(() => {
    if (!root.current) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo('.spa-bg', { yPercent: -10, scale: 1.15 }, { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 2 } });
      if (reduced) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.spa-words', start: 'top 75%', end: 'bottom 40%', scrub: 2 } });
      gsap.utils.toArray<HTMLElement>('.spa-word').forEach((w, i) => {
        tl.fromTo(w, { opacity: 0, filter: 'blur(16px)', y: 40, letterSpacing: '0.12em' }, { opacity: 1, filter: 'blur(0px)', y: 0, letterSpacing: '-0.01em', duration: 1, ease: 'power1.out' }, i * 0.9);
      });
      gsap.fromTo('.spa-steam', { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'top 20%', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="spa" ref={root} data-tone="dark" data-cursor="spa" className="spa relative overflow-hidden bg-[#2B221E] py-32 text-cream md:py-48">
      <div className="absolute inset-0 overflow-hidden">
        <div className="spa-bg absolute inset-0 opacity-40">
          <Media item={media.spaStill} className="absolute inset-0 h-full w-full" sizes="100vw" imgClassName="saturate-[0.7]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(213,182,154,0.16),rgba(43,34,30,0.85)_70%,#2B221E_100%)]" />
      </div>

      {/* steam */}
      <div aria-hidden className="spa-steam pointer-events-none absolute inset-x-0 bottom-0 h-[85%] opacity-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="steam" style={{ left: `${8 + i * 13}%`, animationDelay: `${i * -2.3}s`, animationDuration: `${13 + (i % 3) * 3}s` }} />
        ))}
      </div>

      {/* water rings */}
      <svg aria-hidden className="ripples pointer-events-none absolute left-1/2 top-[58%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 100 100">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="50" cy="50" r="10" className="ripple" style={{ animationDelay: `${i * 2.5}s` }} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1400px] px-5 text-center sm:px-10">
        <p className="eyebrow text-champagne">The Spa Ritual</p>

        <h2 className="spa-words mt-10 font-serif text-[17vw] font-light leading-[0.95] sm:text-[11vw] lg:text-[150px]">
          {words.map((w, i) => (
            <span key={w} className={`spa-word block ${i === 1 ? 'italic text-champagne' : ''}`}>
              {w}
            </span>
          ))}
        </h2>

        <div className="mx-auto mt-16 flex flex-col items-center">
          <div className="breath relative flex h-40 w-40 items-center justify-center" data-phase={phase} aria-hidden>
            <span className="breath-ring absolute inset-0 rounded-full border border-champagne/40" />
            <span className="breath-core absolute inset-6 rounded-full bg-champagne/10 blur-md" />
            <span className="relative text-[10px] uppercase tracking-luxe text-champagne/80">{phase === 'in' ? 'Breathe in' : 'Breathe out'}</span>
          </div>
          <p className="mx-auto mt-12 max-w-xl text-lg leading-relaxed text-cream/70">
            Step out of the day. Warm towels, soft light and skilled hands — spa therapies, manicures and pedicures designed to slow everything
            down.
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-cream/60">
            {['Spa Therapies', 'Facial Spa', 'Hair Spa', 'Manicure', 'Pedicure'].map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-gold" /> {s}
              </li>
            ))}
          </ul>
          <Magnetic className="btn-outline-light mt-12" onClick={() => open('nails-spa')} cursor="book">
            <span>Reserve a Spa Ritual</span>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
