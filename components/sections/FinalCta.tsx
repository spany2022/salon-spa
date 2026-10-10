'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import Magnetic from '@/components/ui/Magnetic';
import SplitReveal from '@/components/ui/SplitReveal';
import { useBooking } from '@/components/providers/Booking';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';

/**
 * 12 — You leave feeling confident. You come back.
 * The page darkens into espresso; an arched window onto the salon opens
 * to full bleed while warm gold light gathers behind the headline.
 */
export default function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const { open } = useBooking();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fin-window',
        { clipPath: 'inset(22% 34% 12% 34% round 999px 999px 0 0)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0 0)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top top', scrub: 1 } },
      );
      gsap.fromTo('.fin-window .media', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.fromTo('.fin-gold', { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 40%', end: 'top top', scrub: true } });
      gsap.fromTo('.fin-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.fin-copy', start: 'top 70%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="book" ref={root} data-tone="dark" data-cursor="book" className="relative min-h-[110vh] overflow-hidden bg-espresso text-cream">
      <div className="fin-window absolute inset-0">
        <Media item={media.finale} className="absolute inset-0 h-full w-full" sizes="100vw" imgClassName="brightness-[0.55]" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-espresso/30 to-espresso" />
      </div>
      <div className="fin-gold pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(185,154,104,0.35),transparent_70%)] mix-blend-screen" />

      <div className="fin-copy relative z-10 mx-auto flex min-h-[110vh] max-w-[1200px] flex-col items-center justify-center px-5 text-center sm:px-10">
        <p className="fin-fade font-script text-4xl text-champagne sm:text-5xl">Until next time,</p>
        <SplitReveal mode="lines" className="mt-4 font-serif text-[15vw] font-light leading-[0.9] sm:text-8xl lg:text-[140px]">
          Your Next Look <em className="italic text-champagne">Starts Here.</em>
        </SplitReveal>
        <p className="fin-fade mt-8 max-w-md text-lg leading-relaxed text-cream/75">
          Step into Aabha and make your next beauty experience unforgettable.
        </p>
        <div className="fin-fade mt-12 flex flex-wrap justify-center gap-3">
          <Magnetic className="btn-gold" onClick={() => open()} cursor="book">
            <span>Book Your Experience</span>
          </Magnetic>
          <Magnetic className="btn-outline-light" onClick={() => scrollTo('#services')}>
            <span>Explore Services</span>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
