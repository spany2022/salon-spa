'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap, isTouch } from '@/lib/gsap';
import { media } from '@/lib/media';
import { useVelocity } from '@/lib/useVelocity';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import { useBooking } from '@/components/providers/Booking';

const treatments = [
  { name: 'Classic Facials', note: 'Cleanse · exfoliate · nourish', img: media.skin },
  { name: 'Clean-ups', note: 'A quick reset for tired skin', img: media.skinDetail },
  { name: 'Glow Facials', note: 'For a soft, lit-from-within finish', img: media.skin },
  { name: 'Tan Removal', note: 'Even, refreshed tone', img: media.skinDetail },
  { name: 'Skin Treatments', note: 'Tailored to your skin’s needs', img: media.spaBotanical },
  { name: 'Facial Spa Treatments', note: 'Slow, sensory, restorative', img: media.spaStill },
];

/**
 * 05 — The temperature softens.
 * Everything slows: longer eases, water-light caustics, botanical frames.
 * Images respond to scroll *velocity* rather than position — calm when you
 * linger, slightly livelier when you hurry.
 */
export default function Skin() {
  const root = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const { open } = useBooking();
  useVelocity(root);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skin-par').forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '0.2');
        gsap.fromTo(el, { yPercent: speed * 60 }, { yPercent: -speed * 60, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      });
      gsap.fromTo('.skin-mask', { clipPath: 'inset(50% 50% 50% 50% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 2.4, ease: 'expo.out', scrollTrigger: { trigger: '.skin-mask', start: 'top 85%', once: true } });
      gsap.fromTo('.skin-row', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.skin-list', start: 'top 80%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  // floating preview follows cursor over the list
  useEffect(() => {
    const p = preview.current;
    if (!p || isTouch()) return;
    const xTo = gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' });
    const yTo = gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' });
    const list = root.current?.querySelector('.skin-list') as HTMLElement | null;
    if (!list) return;
    const move = (e: MouseEvent) => {
      const r = list.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    list.addEventListener('mousemove', move);
    return () => list.removeEventListener('mousemove', move);
  }, []);

  return (
    <section id="skin" ref={root} data-tone="light" data-cursor="spa" className="skin relative overflow-hidden bg-[#EFE7DF] py-28 text-charcoal md:py-44">
      <div aria-hidden className="caustics pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="relative grid items-center gap-12 md:grid-cols-12">
          <div className="relative z-10 md:col-span-6">
            <p className="eyebrow text-rose">Skin &amp; Wellness</p>
            <SplitReveal mode="chars" stagger={0.035} className="mt-6 font-serif text-[16vw] font-light leading-[0.88] sm:text-8xl lg:text-[128px]">
              Glow From Within.
            </SplitReveal>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-charcoal/70">
              Unhurried facials and skin rituals in a calm, softly lit room — so your skin looks rested because you actually were.
            </p>
          </div>

          <div className="relative h-[70vh] min-h-[460px] md:col-span-6">
            <div className="skin-par absolute right-0 top-0 h-[78%] w-[72%]" data-speed="0.15">
              <div data-vel="0.6" className="h-full w-full">
                <div className="skin-mask h-full w-full overflow-hidden rounded-full">
                  <Media item={media.skin} className="absolute inset-0 h-full w-full" sizes="(min-width:768px) 36vw, 70vw" mirror />
                </div>
              </div>
            </div>
            <div className="skin-par absolute bottom-0 left-0 h-[42%] w-[40%]" data-speed="0.45">
              <div data-vel="1.4" className="h-full w-full overflow-hidden rounded-t-full shadow-xl shadow-espresso/10">
                <Media item={media.skinDetail} className="absolute inset-0 h-full w-full" sizes="25vw" />
              </div>
            </div>
            <span className="skin-par absolute bottom-[10%] right-[6%] font-script text-6xl text-gold/80" data-speed="0.7">
              radiance
            </span>
          </div>
        </div>

        <div className="skin-list relative mt-24 md:mt-32">
          <div className="mb-6 flex items-end justify-between border-b border-charcoal/15 pb-4">
            <p className="text-[11px] uppercase tracking-luxe text-charcoal/50">Skin rituals</p>
            <button onClick={() => open('skin')} className="link-underline text-[12px] uppercase tracking-[0.2em]" data-cursor="book">
              Book a facial →
            </button>
          </div>
          <ul onMouseLeave={() => setHover(null)}>
            {treatments.map((t, i) => (
              <li
                key={t.name}
                onMouseEnter={() => setHover(i)}
                className="skin-row group flex cursor-default items-baseline justify-between gap-6 border-b border-charcoal/10 py-5 md:py-6"
              >
                <span className="flex items-baseline gap-5">
                  <span className="text-[11px] text-gold">0{i + 1}</span>
                  <span className="font-serif text-3xl font-light transition-transform duration-700 ease-silk group-hover:translate-x-3 md:text-5xl">{t.name}</span>
                </span>
                <span className="hidden text-sm text-charcoal/50 transition-colors duration-500 group-hover:text-rose sm:block">{t.note}</span>
              </li>
            ))}
          </ul>
          <div ref={preview} className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[320px] w-[240px] md:block" style={{ marginLeft: -120, marginTop: -160 }}>
            <AnimatePresence>
              {hover !== null && (
                <motion.div
                  key={hover}
                  className="absolute inset-0 overflow-hidden rounded-t-full"
                  initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Media item={treatments[hover].img} className="absolute inset-0 h-full w-full" sizes="240px" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
