'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { media, type MediaItem } from '@/lib/media';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';

type Shot = { item: MediaItem; cat: string; cls: string; speed: number; shape?: string };

/** Asymmetric editorial grid on a 12-col base. `speed` drives parallax depth. */
const shots: Shot[] = [
  { item: media.hero, cat: 'Salon Interior', cls: 'md:col-span-5 aspect-[4/5]', speed: -0.08 },
  { item: media.hairDuring, cat: 'Hair Styling', cls: 'md:col-span-4 md:col-start-7 aspect-[3/4] md:mt-24', speed: 0.12, shape: 'rounded-t-full' },
  { item: media.makeupProducts, cat: 'Makeup', cls: 'md:col-span-2 aspect-square md:mt-60', speed: 0.22 },
  { item: media.nails, cat: 'Nails', cls: 'md:col-span-3 md:col-start-6 aspect-[4/5]', speed: 0.05 },
  { item: media.bridal, cat: 'Bridal', cls: 'md:col-span-4 aspect-[3/4] md:-mt-16', speed: -0.12, shape: 'rounded-t-full' },
  { item: media.spaBotanical, cat: 'Spa', cls: 'md:col-span-6 aspect-[16/10]', speed: 0.1 },
  { item: media.grooming, cat: 'Grooming', cls: 'md:col-span-3 md:col-start-8 aspect-[3/4] md:-mt-20', speed: -0.06 },
  { item: media.skinDetail, cat: 'Products', cls: 'md:col-span-2 aspect-[3/4] md:mt-24', speed: 0.18 },
  { item: media.makeup, cat: 'Makeup Artistry', cls: 'md:col-span-5 md:col-start-2 aspect-[5/4]', speed: 0.08 },
];

/**
 * 09 — The Aabha Gallery.
 * Masonry-like asymmetric layout, layered parallax (each frame moves at its
 * own speed), mask-in reveals, hover zoom + mirror sweep + category label,
 * a "View" cursor, and a keyboard-friendly lightbox.
 */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.g-item').forEach((el) => {
        gsap.fromTo(el.querySelector('.g-mask'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.g-item').forEach((el) => {
          const sp = parseFloat(el.dataset.speed || '0');
          gsap.fromTo(el, { yPercent: sp * 100 }, { yPercent: -sp * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        });
      });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((d: number) => setActive((a) => (a === null ? a : (a + d + shots.length) % shots.length)), []);

  useEffect(() => {
    if (active === null) return;
    stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      start();
    };
  }, [active, close, step, stop, start]);

  return (
    <section id="gallery" ref={root} data-tone="light" className="relative overflow-hidden bg-ivory py-28 text-charcoal md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-28 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-rose">The Aabha Gallery</p>
            <SplitReveal className="mt-6 font-serif text-[14vw] font-light leading-[0.9] sm:text-7xl lg:text-[104px]">
              Moments <em className="italic text-rose">from the studio.</em>
            </SplitReveal>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-charcoal/60">
            Looks, rituals and quiet details from inside Aabha. Tap any frame to view it larger.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-6">
          {shots.map((s, i) => (
            <button
              key={i}
              data-speed={s.speed}
              data-cursor="view"
              onClick={() => setActive(i)}
              className={`g-item group relative block text-left ${s.cls} ${i % 3 === 0 ? 'col-span-2' : 'col-span-1'}`}
              aria-label={`View ${s.cat}`}
            >
              <div className={`g-mask absolute inset-0 overflow-hidden ${s.shape ?? ''}`}>
                <Media
                  item={s.item}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="transition-transform duration-[1.6s] ease-silk group-hover:scale-[1.08]"
                  sizes="(min-width:768px) 40vw, 50vw"
                  mirror
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/0 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-4 opacity-0 transition-all duration-700 ease-silk group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <span className="text-[10px] uppercase tracking-luxe text-cream">{s.cat}</span>
                  <span className="font-serif text-lg italic text-champagne">0{i + 1}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-espresso/95 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            role="dialog"
            aria-modal="true"
            aria-label={shots[active].cat}
            onClick={close}
            data-lenis-prevent
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="relative h-[78vh] w-full max-w-5xl"
                initial={{ opacity: 0, scale: 0.96, clipPath: 'inset(8% 8% 8% 8%)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <Media item={shots[active].item} className="absolute inset-0 h-full w-full" imgClassName="!object-contain" sizes="90vw" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-6 text-cream sm:px-10" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => step(-1)} className="text-[11px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100">← Prev</button>
              <p className="text-[11px] uppercase tracking-luxe text-champagne">
                {shots[active].cat} · {active + 1}/{shots.length}
              </p>
              <button onClick={() => step(1)} className="text-[11px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100">Next →</button>
            </div>
            <button onClick={close} className="absolute right-5 top-5 text-[11px] uppercase tracking-[0.25em] text-cream/80 hover:text-cream sm:right-10 sm:top-8" aria-label="Close gallery">
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
