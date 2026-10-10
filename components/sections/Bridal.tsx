'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { media } from '@/lib/media';
import Media from '@/components/ui/Media';
import Magnetic from '@/components/ui/Magnetic';
import { useBooking } from '@/components/providers/Booking';

const details = [
  { t: 'Bridal Makeup', d: 'The full ceremony look' },
  { t: 'Engagement Makeup', d: 'Soft, luminous, camera-ready' },
  { t: 'Party Makeup', d: 'For evenings to remember' },
  { t: 'Family Makeup', d: 'Everyone, beautifully in step' },
  { t: 'Eye Makeup', d: 'Definition that lasts' },
];

/**
 * 08 — You see yourself differently.
 * Pinned scene, scrubbed by scroll:
 *   darkness → a soft light rises → the portrait opens through a vertical
 *   mask → makeup details arrive → a gold frame draws itself → full reveal.
 */
export default function Bridal() {
  const root = useRef<HTMLElement>(null);
  const { open } = useBooking();

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isMobile = window.innerWidth < 900;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.br-stage', start: 'top top', end: isMobile ? '+=160%' : '+=240%', pin: true, scrub: 1.2, anticipatePin: 1 },
        });
        tl.fromTo('.br-light', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 1 }, 0)
          .fromTo('.br-portrait', { clipPath: 'inset(0% 50% 0% 50% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.4 }, 0.5)
          .fromTo('.br-portrait .media', { scale: 1.35, filter: 'brightness(0.25) saturate(0.4)' }, { scale: 1, filter: 'brightness(1) saturate(1)', duration: 2.2 }, 0.5)
          .fromTo('.br-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
          .fromTo('.br-detail', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.22 }, 1.4)
          .fromTo('.br-frame-path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2 }, 1.6)
          .fromTo('.br-orn', { opacity: 0, scale: 0.6, rotate: -30 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, stagger: 0.1 }, 2.1)
          .fromTo('.br-final', { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 2.6)
          .to({}, { duration: 0.4 });
      });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="bridal" ref={root} data-tone="dark" data-cursor="bridal" className="bridal relative bg-[#16110F] text-cream">
      <div className="br-stage relative flex min-h-screen items-center overflow-hidden py-20 lg:h-screen lg:py-0">
        <div className="br-light pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(213,182,154,0.25),rgba(185,154,104,0.08)_40%,transparent_68%)]" />

        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-12">
          <div className="br-head relative z-10 lg:col-span-4">
            <p className="eyebrow text-champagne">Makeup &amp; Bridal</p>
            <h2 className="mt-6 font-serif text-[12vw] font-light leading-[0.95] sm:text-6xl xl:text-[76px]">
              For Moments That Deserve to Be <em className="italic text-champagne">Remembered.</em>
            </h2>
          </div>

          <div className="relative mx-auto h-[62vh] w-[78vw] max-w-[440px] lg:col-span-4 lg:h-[78vh] lg:w-full">
            <div className="br-portrait absolute inset-0 overflow-hidden rounded-t-full">
              <Media item={media.bridal} className="absolute inset-0 h-full w-full" sizes="(min-width:1024px) 30vw, 80vw" priority={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16110F]/70 via-transparent to-transparent" />
            </div>
            <svg className="br-frame pointer-events-none absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
              <path
                className="br-frame-path"
                d="M2 138 V50 A48 48 0 0 1 98 50 V138 Z"
                fill="none"
                stroke="#B99A68"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
              />
            </svg>
            <span className="br-orn absolute -left-3 top-[30%] text-2xl text-gold">✦</span>
            <span className="br-orn absolute -right-2 top-[55%] text-sm text-gold">✦</span>
            <span className="br-orn absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gold">✦</span>
          </div>

          <div className="relative z-10 lg:col-span-4 lg:pl-8">
            <ul className="space-y-0">
              {details.map((d) => (
                <li key={d.t} className="br-detail flex items-center gap-4 border-b border-cream/10 py-4">
                  <span className="h-px w-8 bg-gold" />
                  <div>
                    <p className="font-serif text-2xl font-light">{d.t}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">{d.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="br-final mt-10">
              <p className="font-script text-5xl text-gold sm:text-6xl">Your Moment. Your Glow.</p>
              <Magnetic className="btn-gold mt-8" onClick={() => open('makeup')} cursor="book">
                <span>Explore Bridal Services</span>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
