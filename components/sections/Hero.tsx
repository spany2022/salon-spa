'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, isTouch } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import SplitReveal from '@/components/ui/SplitReveal';
import Magnetic from '@/components/ui/Magnetic';
import { useBooking } from '@/components/providers/Booking';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';

/**
 * 01 — You arrive.
 * Full-bleed interior that blooms out of darkness, a slow Ken Burns zoom,
 * and a pool of warm light that follows the cursor like a lamp moving
 * across a salon mirror.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const { open } = useBooking();
  const { scrollTo } = useSmoothScroll();

  // intro timeline, plays after the loader lifts
  useEffect(() => {
    if (!ready || !root.current) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero-fade, .hero-veil', { opacity: (i, el) => (el.classList.contains('hero-veil') ? 0 : 1) });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('.hero-veil', { opacity: 0, duration: 2.4, ease: 'power2.inOut' }, 0)
        .fromTo('.hero-media', { scale: 1.28, filter: 'brightness(0.4) saturate(0.6)' }, { scale: 1.12, filter: 'brightness(1) saturate(1)', duration: 3, ease: 'power2.out' }, 0)
        .fromTo('.hero-glow', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2.6 }, 0.2)
        .fromTo('.hero-ornament', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.6, stagger: 0.12 }, 1.1)
        .fromTo('.hero-fade', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12 }, 1.5)
        .fromTo('.hero-line', { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut' }, 1.2);
      // continuous, almost imperceptible breathing zoom
      gsap.to('.hero-media', { scale: 1.04, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 });

      // scroll-away: image sinks slower than the page, copy lifts and fades
      gsap.to('.hero-parallax', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-copy', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '80% top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // mouse-reactive light & depth
  useEffect(() => {
    const el = root.current;
    if (!el || isTouch() || prefersReducedMotion()) return;
    const bgX = gsap.quickTo(bg.current, 'x', { duration: 1.6, ease: 'power3.out' });
    const bgY = gsap.quickTo(bg.current, 'y', { duration: 1.6, ease: 'power3.out' });
    let lx = 50;
    let ly = 40;
    let tx = 50;
    let ty = 40;
    let raf = 0;
    const loop = () => {
      lx += (tx - lx) * 0.06;
      ly += (ty - ly) * 0.06;
      el.style.setProperty('--lx', `${lx}%`);
      el.style.setProperty('--ly', `${ly}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      tx = nx * 100;
      ty = ny * 100;
      bgX((nx - 0.5) * -26);
      bgY((ny - 0.5) * -18);
    };
    el.addEventListener('mousemove', move);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <section id="home" ref={root} data-tone="dark" data-ambient="entrance" className="hero relative h-[100svh] min-h-[640px] overflow-hidden bg-espresso text-cream">
      <div className="hero-parallax absolute inset-0">
        <div ref={bg} className="absolute -inset-8">
          {media.heroVideo ? (
            <video
              className="hero-media absolute inset-0 h-full w-full object-cover"
              src={media.heroVideo}
              poster={media.hero.src}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
          ) : (
            <Media item={media.hero} priority className="hero-media absolute inset-0 h-full w-full" sizes="100vw" />
          )}
        </div>
      </div>

      {/* grading: espresso vignette + warm bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_20%,rgba(33,27,24,0.55)_60%,rgba(33,27,24,0.95)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-espresso via-espresso/60 to-transparent" />
      {/* cursor light — like a lamp moving across a mirror */}
      <div className="hero-light pointer-events-none absolute inset-0 mix-blend-soft-light" />
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-0" />
      <div className="hero-sheen pointer-events-none absolute inset-0" />
      <div className="hero-veil absolute inset-0 bg-espresso" />

      {/* ornaments */}
      <div className="hero-ornament pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 opacity-0 sm:left-8 md:block">
        <p className="vertical-text text-[10px] uppercase tracking-luxe text-cream/50">Bhubaneswar · Odisha</p>
      </div>
      <div className="hero-ornament pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 opacity-0 sm:right-8 md:block">
        <p className="vertical-text text-[10px] uppercase tracking-luxe text-cream/50">Hair · Skin · Nails · Spa · Bridal</p>
      </div>

      <div className="hero-copy relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-[14vh] sm:px-10 md:pb-[12vh]">
        <p className="hero-fade mb-6 flex items-center gap-4 text-[11px] uppercase tracking-luxe text-champagne opacity-0">
          <span className="hero-line block h-px w-12 origin-left bg-gold" />
          Aabha Unisex Salon &amp; Spa
        </p>
        <SplitReveal
          as="h1"
          play={ready}
          delay={1.2}
          mode="lines"
          stagger={0.12}
          className="max-w-[12ch] font-serif text-[15vw] font-light leading-[0.88] tracking-[-0.02em] sm:text-[11vw] lg:text-[9.2vw] xl:text-[150px]"
        >
          The Art of <em className="font-normal italic text-champagne">Becoming</em> You.
        </SplitReveal>
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-sm text-[15px] leading-relaxed text-cream/75 opacity-0 sm:text-base">
            Where beauty, confidence, and relaxation come together.
          </p>
          <div className="hero-fade flex flex-wrap gap-3 opacity-0">
            <Magnetic className="btn-light" onClick={() => scrollTo('#services')}>
              <span>Explore Services</span>
            </Magnetic>
            <Magnetic className="btn-outline-light" onClick={() => open()} cursor="book">
              <span>Book Your Experience</span>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-fade absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-0 md:flex">
        <span className="text-[9px] uppercase tracking-luxe text-cream/50">Enter</span>
        <span className="scroll-cue block h-12 w-px overflow-hidden bg-cream/15" />
      </div>
    </section>
  );
}
