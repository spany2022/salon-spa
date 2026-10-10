'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';

/**
 * 02 — You discover.
 * Split composition: the image opens from a narrow slit to a full frame
 * as you scroll, the text arrives line by line, a gold rule grows.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-frame',
        { clipPath: 'inset(18% 32% 18% 32% round 999px 999px 0 0)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: '.exp-frame', start: 'top 90%', end: 'center 45%', scrub: 1 },
        },
      );
      gsap.fromTo('.exp-img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.exp-frame', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.exp-rule', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      gsap.fromTo(
        '.exp-p',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.exp-copy', start: 'top 75%', once: true } },
      );
      gsap.to(root.current, {
        backgroundColor: '#EFE7DF',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top center', end: 'bottom center', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} data-tone="light" className="relative overflow-hidden bg-ivory py-28 text-charcoal md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-10 md:grid-cols-12 md:gap-10">
        <div className="relative md:col-span-6 lg:col-span-5 lg:col-start-1">
          <div className="exp-frame relative aspect-[4/5] overflow-hidden rounded-t-full" data-cursor="hair">
            <Media item={media.experience} className="exp-img absolute inset-0" sizes="(min-width: 768px) 45vw, 100vw" mirror />
          </div>
          <p className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-luxe text-charcoal/50">
            <span className="h-px w-8 bg-gold" /> Inside the studio
          </p>
          <span className="pointer-events-none absolute -right-6 -top-10 hidden select-none font-script text-[110px] leading-none text-rose/25 lg:block">Aabha</span>
        </div>

        <div className="exp-copy relative md:col-span-6 lg:col-span-6 lg:col-start-7">
          <span className="exp-rule absolute -left-6 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-gold via-gold/40 to-transparent md:block lg:-left-12" />
          <p className="eyebrow text-rose">The Aabha Experience</p>
          <SplitReveal className="mt-6 font-serif text-[13vw] font-light leading-[0.92] tracking-[-0.015em] sm:text-7xl lg:text-[96px]">
            More Than a Salon. <em className="italic text-rose">An Experience.</em>
          </SplitReveal>
          <p className="exp-p mt-10 max-w-lg text-lg leading-relaxed text-charcoal/80">
            From a fresh new look to moments of complete relaxation, Aabha brings hair, skin, grooming, nails, makeup and spa experiences
            together under one roof.
          </p>
          <p className="exp-p mt-5 max-w-lg leading-relaxed text-charcoal/60">
            Two studios in Bhubaneswar. One unhurried philosophy: listen first, then create something that feels like you — only more so.
          </p>
          <div className="exp-p mt-12 grid max-w-lg grid-cols-3 border-t border-charcoal/10 pt-8">
            {['Hair & Skin', 'Nails & Spa', 'Makeup & Bridal'].map((t, i) => (
              <div key={t}>
                <span className="font-serif text-3xl text-gold">0{i + 1}</span>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-charcoal/60">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
