'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { media } from '@/lib/media';
import { categories } from '@/lib/data';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import Magnetic from '@/components/ui/Magnetic';
import { useBooking } from '@/components/providers/Booking';

const stages = [
  { k: 'Before', t: 'Consultation', d: 'We listen first — your hair, your routine, the way you want to feel.' },
  { k: 'During', t: 'Transformation', d: 'Cut, colour or care, shaped by hand with patience and precision.' },
  { k: 'After', t: 'The Final Look', d: 'A finish that moves with you, and still looks right tomorrow.' },
];

/**
 * 04 — You transform.
 * Pinned on desktop: three frames dissolve into one another through
 * flowing curved masks (like hair falling) with a light sweep between.
 */
export default function Hair() {
  const root = useRef<HTMLElement>(null);
  const { open } = useBooking();
  const hair = categories.find((c) => c.id === 'hair')!;

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.hair-stage', start: 'top top', end: '+=220%', pin: true, scrub: 1, anticipatePin: 1 },
        });
        tl.fromTo('.hair-f1 .media', { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
          .fromTo('.hair-f2', { clipPath: 'ellipse(0% 0% at 0% 100%)' }, { clipPath: 'ellipse(150% 150% at 0% 100%)', duration: 1 }, 0.6)
          .fromTo('.hair-f2 .media', { scale: 1.3 }, { scale: 1.02, duration: 1.4 }, 0.6)
          .fromTo('.hair-sweep', { xPercent: -120 }, { xPercent: 120, duration: 0.8 }, 1.3)
          .fromTo('.hair-f3', { clipPath: 'ellipse(0% 0% at 100% 0%)' }, { clipPath: 'ellipse(150% 150% at 100% 0%)', duration: 1 }, 1.7)
          .fromTo('.hair-f3 .media', { scale: 1.3 }, { scale: 1, duration: 1.3 }, 1.7)
          .to('.hair-stage-label-0', { yPercent: -100, opacity: 0, duration: 0.3 }, 0.8)
          .fromTo('.hair-stage-label-1', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3 }, 0.9)
          .to('.hair-stage-label-1', { yPercent: -100, opacity: 0, duration: 0.3 }, 1.9)
          .fromTo('.hair-stage-label-2', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3 }, 2.0)
          .fromTo('.hair-bar', { scaleY: 0 }, { scaleY: 1, duration: 2.7 }, 0)
          .fromTo('.hair-word', { xPercent: 10 }, { xPercent: -25, duration: 2.7 }, 0);
      });
      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('.hair-m').forEach((el) => {
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });
      });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="hair" ref={root} data-tone="light" data-cursor="hair" className="relative bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-28 sm:px-10 md:pt-40">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-rose">Hair Transformation</p>
            <SplitReveal className="mt-6 font-serif text-[14vw] font-light leading-[0.9] sm:text-7xl lg:text-[104px]">
              A New Look <em className="italic text-rose">Starts Here.</em>
            </SplitReveal>
          </div>
          <div className="self-end md:col-span-4 md:col-start-9">
            <p className="leading-relaxed text-charcoal/70">
              Whether it’s a sharp cut, a softer colour, or hair that finally behaves — every change begins with a conversation.
            </p>
          </div>
        </div>
      </div>

      {/* desktop pinned stage */}
      <div className="hair-stage relative hidden h-screen overflow-hidden min-[900px]:block">
        <span aria-hidden className="hair-word pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[22vw] font-light italic leading-none text-nude">
          transformation
        </span>
        <div className="relative mx-auto grid h-full max-w-[1400px] grid-cols-12 items-center gap-10 px-10">
          <div className="relative col-span-3 h-[46vh]">
            <span className="absolute left-0 top-0 h-full w-px bg-charcoal/10" />
            <span className="hair-bar absolute left-0 top-0 h-full w-px origin-top bg-gold" />
            <div className="relative h-full pl-8">
              {stages.map((s, i) => (
                <div key={s.k} className={`hair-stage-label-${i} absolute inset-x-8 top-0 ${i === 0 ? '' : 'opacity-0'}`}>
                  <p className="text-[11px] uppercase tracking-luxe text-gold">0{i + 1} · {s.k}</p>
                  <p className="mt-4 font-serif text-5xl font-light leading-none">{s.t}</p>
                  <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-charcoal/65">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative col-span-6 h-[78vh] overflow-hidden rounded-t-[40vw]">
            <div className="hair-f1 absolute inset-0">
              <Media item={media.hairBefore} className="absolute inset-0 h-full w-full" sizes="50vw" />
            </div>
            <div className="hair-f2 absolute inset-0" style={{ clipPath: 'ellipse(0% 0% at 0% 100%)' }}>
              <Media item={media.hairDuring} className="absolute inset-0 h-full w-full" sizes="50vw" />
            </div>
            <div className="hair-f3 absolute inset-0" style={{ clipPath: 'ellipse(0% 0% at 100% 0%)' }}>
              <Media item={media.hairFinal} className="absolute inset-0 h-full w-full" sizes="50vw" />
            </div>
            <div className="hair-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-[60%] bg-gradient-to-r from-transparent via-white/35 to-transparent mix-blend-soft-light" />
          </div>

          <div className="col-span-3">
            <ul className="space-y-0 border-t border-charcoal/10">
              {hair.services.map((s) => (
                <li key={s} className="service-row flex items-center justify-between border-b border-charcoal/10 py-2.5 text-[13px]">
                  <span>{s}</span>
                  <span className="service-dot h-1.5 w-1.5 rounded-full bg-gold opacity-0" />
                </li>
              ))}
            </ul>
            <Magnetic className="btn-primary mt-8" onClick={() => open('hair')} cursor="book">
              <span>Explore Hair Services</span>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* mobile / reduced motion */}
      <div className="px-5 pb-24 min-[900px]:hidden sm:px-10">
        <div className="grid grid-cols-3 gap-2">
          {[media.hairBefore, media.hairDuring, media.hairFinal].map((m, i) => (
            <div key={m.label} className="hair-m relative aspect-[3/5] overflow-hidden rounded-t-full">
              <Media item={m} className="absolute inset-0 h-full w-full" sizes="33vw" />
              <span className="absolute inset-x-0 bottom-2 text-center text-[9px] uppercase tracking-[0.25em] text-cream drop-shadow">{stages[i].k}</span>
            </div>
          ))}
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-charcoal/10 pt-4 text-sm">
          {hair.services.map((s) => (
            <li key={s} className="border-b border-charcoal/10 py-2.5">{s}</li>
          ))}
        </ul>
        <Magnetic className="btn-primary mt-8" onClick={() => open('hair')} cursor="book">
          <span>Explore Hair Services</span>
        </Magnetic>
      </div>
    </section>
  );
}
