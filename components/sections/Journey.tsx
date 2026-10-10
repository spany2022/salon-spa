'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { categories } from '@/lib/data';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import { useBooking } from '@/components/providers/Booking';

const panelTone: Record<string, string> = {
  hair: 'bg-ivory text-charcoal',
  skin: 'bg-nude text-charcoal',
  'nails-spa': 'bg-[#EDE4DA] text-charcoal',
  grooming: 'bg-espresso text-cream',
  makeup: 'bg-[#2A211D] text-cream',
};

/**
 * 03 — You choose your experience.
 * Vertical scroll drives a horizontal walk through five studios.
 * Depth: foreground photographs travel faster than the page, the giant
 * numerals behind travel slower, the copy stays still and legible.
 * Below 1024px it becomes a native swipe carousel with snap points.
 */
export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { open } = useBooking();

  useEffect(() => {
    const section = root.current;
    const tr = track.current;
    if (!section || !tr) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set('.jr-progress-bar', { scaleX: self.progress });
          },
        },
      });

      gsap.utils.toArray<HTMLElement>('.jr-panel').forEach((panel) => {
        const st = { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true };
        const fg = panel.querySelector('.jr-fg');
        const bg = panel.querySelector('.jr-num');
        const detail = panel.querySelector('.jr-detail');
        if (fg) gsap.fromTo(fg, { xPercent: 10 }, { xPercent: -10, ease: 'none', scrollTrigger: st });
        if (detail) gsap.fromTo(detail, { xPercent: 40, yPercent: 8 }, { xPercent: -40, yPercent: -8, ease: 'none', scrollTrigger: st });
        if (bg) gsap.fromTo(bg, { xPercent: -25 }, { xPercent: 25, ease: 'none', scrollTrigger: st });
        const img = panel.querySelector('.jr-fg .media');
        if (img)
          gsap.fromTo(
            img,
            { clipPath: 'inset(0% 0% 0% 100%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 95%', end: 'left 35%', scrub: true } },
          );
      });
      return () => {};
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);

  return (
    <section id="services" ref={root} data-tone="light" className="journey relative overflow-hidden bg-ivory text-charcoal">
      <div
        ref={track}
        className="jr-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:snap-none lg:overflow-visible"
        data-lenis-prevent-touch
      >
        {/* intro panel */}
        <div className="jr-intro relative flex w-[88vw] shrink-0 snap-start flex-col justify-center px-6 py-24 sm:w-[70vw] sm:px-10 lg:h-screen lg:w-[52vw] lg:py-0 lg:pl-[6vw]">
          <p className="eyebrow text-rose">Signature beauty journey</p>
          <SplitReveal className="mt-6 font-serif text-[11vw] font-light leading-[0.9] sm:text-[8.4vw] lg:text-[6.2vw]">
            Your Transformation, <em className="italic text-rose">Your Way.</em>
          </SplitReveal>
          <p className="mt-8 max-w-sm leading-relaxed text-charcoal/70">
            Five studios under one roof. Walk through them — and choose where your story begins.
          </p>
          <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-charcoal/60">
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3">
                {c.studio.replace('The ', '')}
                {i < categories.length - 1 && <span className="text-gold">→</span>}
              </li>
            ))}
          </ol>
          <p className="mt-12 hidden items-center gap-3 text-[10px] uppercase tracking-luxe text-charcoal/40 lg:flex">
            Scroll to walk through <span className="inline-block h-px w-16 bg-charcoal/30" />
          </p>
          <p className="mt-10 text-[10px] uppercase tracking-luxe text-charcoal/40 lg:hidden">Swipe →</p>
        </div>

        {categories.map((c) => (
          <article
            key={c.id}
            id={`studio-${c.id}`}
            className={`jr-panel relative flex w-[88vw] shrink-0 snap-start flex-col overflow-hidden sm:w-[70vw] lg:h-screen lg:w-[86vw] lg:flex-row lg:items-center ${panelTone[c.id]}`}
            data-cursor={c.id === 'nails-spa' ? 'spa' : c.id === 'makeup' ? 'bridal' : 'hair'}
          >
            <span aria-hidden className="jr-num pointer-events-none absolute -bottom-[0.18em] right-[4%] select-none font-serif text-[52vw] font-light leading-none outline-text opacity-60 lg:text-[34vw]">
              {c.index}
            </span>

            <div className="relative z-10 order-2 px-6 pb-14 pt-8 sm:px-10 lg:order-1 lg:w-[38%] lg:py-0 lg:pl-[5vw]">
              <p className="flex items-center gap-3 text-[11px] uppercase tracking-luxe opacity-60">
                <span className="text-gold">{c.index}</span> {c.studio}
              </p>
              <h3 className="mt-5 font-serif text-6xl font-light leading-[0.9] sm:text-7xl lg:text-[6.4vw]">{c.title}</h3>
              <p className="mt-5 max-w-sm leading-relaxed opacity-75">{c.line}</p>
              <ul className="rule-soft mt-8 grid max-w-md grid-cols-2 gap-x-6 border-t pt-6 text-[13px] opacity-90">
                {c.services.map((s) => (
                  <li key={s} className="service-item flex items-center gap-2 py-1.5">
                    <span className="h-px w-3 bg-gold" />
                    {s}
                  </li>
                ))}
              </ul>
              <button onClick={() => open(c.id)} className="link-underline mt-9 text-[12px] uppercase tracking-[0.22em]" data-cursor="book">
                Book {c.title} →
              </button>
            </div>

            <div className="relative order-1 h-[52vh] w-full lg:order-2 lg:h-full lg:w-[62%]">
              <div className="jr-fg absolute inset-x-6 bottom-0 top-6 sm:inset-x-10 lg:inset-x-auto lg:left-[6%] lg:top-[12%] lg:h-[76%] lg:w-[58%]">
                <Media item={c.image} className="absolute inset-0 h-full w-full" sizes="(min-width:1024px) 40vw, 90vw" mirror />
              </div>
              <div className="jr-detail absolute bottom-[8%] right-[6%] hidden h-[38%] w-[26%] shadow-2xl shadow-black/20 lg:block">
                <Media item={c.detail} className="absolute inset-0 h-full w-full" sizes="20vw" />
              </div>
            </div>
          </article>
        ))}
        <div className="hidden w-[8vw] shrink-0 lg:block" />
      </div>

      <div className="jr-progress pointer-events-none absolute bottom-8 left-[6vw] right-[6vw] z-20 hidden h-px bg-charcoal/10 lg:block">
        <div className="jr-progress-bar h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  );
}
