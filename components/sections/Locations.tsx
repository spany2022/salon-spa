'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { branches, directionsUrl } from '@/lib/data';
import SplitReveal from '@/components/ui/SplitReveal';
import Magnetic from '@/components/ui/Magnetic';

// Approximate relative positions on an illustrative city sketch (not to scale)
const pins: Record<string, { x: number; y: number }> = {
  chandaka: { x: 250, y: 120 },
  rasulgarh: { x: 405, y: 285 },
};

/**
 * 11 — Find your Aabha.
 * An illustrative line-drawn map of Bhubaneswar instead of a generic
 * embed: hovering a branch card lights its pin and draws the route line.
 */
export default function Locations() {
  const root = useRef<HTMLElement>(null);
  const [hl, setHl] = useState<string | null>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.map-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, stagger: 0.12, ease: 'power2.inOut', scrollTrigger: { trigger: '.map', start: 'top 80%', once: true } });
      gsap.fromTo('.map-pin', { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 1, stagger: 0.2, delay: 1.2, ease: 'back.out(2)', scrollTrigger: { trigger: '.map', start: 'top 80%', once: true } });
      gsap.fromTo('.loc-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.loc-cards', start: 'top 85%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="locations" ref={root} data-tone="light" className="relative overflow-hidden bg-ivory py-28 text-charcoal md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <p className="eyebrow text-rose">Locations</p>
        <SplitReveal className="mt-6 font-serif text-[14vw] font-light leading-[0.9] sm:text-7xl lg:text-[104px]">
          Find Your <em className="italic text-rose">Aabha.</em>
        </SplitReveal>

        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-12">
          <div className="map relative lg:col-span-7">
            <svg viewBox="0 0 600 420" className="h-auto w-full" role="img" aria-label="Illustrative map of Bhubaneswar showing the two Aabha branches">
              <defs>
                <radialGradient id="pinGlow">
                  <stop offset="0%" stopColor="#B98278" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#B98278" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* faint grid */}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="420" stroke="#292321" strokeOpacity="0.04" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 60} x2="600" y2={i * 60} stroke="#292321" strokeOpacity="0.04" />
              ))}
              {/* river to the east */}
              <path className="map-line" pathLength={1} strokeDasharray="1" d="M560 0 C 520 90, 590 160, 540 240 S 520 360, 575 420" fill="none" stroke="#D5B69A" strokeWidth="10" strokeOpacity="0.35" strokeLinecap="round" />
              {/* NH-16 spine */}
              <path className="map-line" pathLength={1} strokeDasharray="1" d="M230 0 C 270 90, 300 160, 360 230 S 470 360, 520 420" fill="none" stroke="#292321" strokeOpacity="0.35" strokeWidth="1.4" />
              {/* secondary roads */}
              <path className="map-line" pathLength={1} strokeDasharray="1" d="M0 300 C 120 280, 260 300, 405 285 S 560 250, 600 260" fill="none" stroke="#292321" strokeOpacity="0.18" strokeWidth="1" />
              <path className="map-line" pathLength={1} strokeDasharray="1" d="M60 0 C 120 120, 160 220, 120 420" fill="none" stroke="#292321" strokeOpacity="0.12" strokeWidth="1" />
              <path className="map-line" pathLength={1} strokeDasharray="1" d="M0 130 C 150 120, 300 110, 600 150" fill="none" stroke="#292321" strokeOpacity="0.12" strokeWidth="1" />
              {/* connection between branches */}
              <path
                d={`M${pins.chandaka.x} ${pins.chandaka.y} C 300 170, 360 210, ${pins.rasulgarh.x} ${pins.rasulgarh.y}`}
                fill="none"
                stroke="#B99A68"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                className={`transition-opacity duration-700 ${hl ? 'opacity-100' : 'opacity-40'}`}
              />
              <text x="20" y="400" fontSize="10" letterSpacing="3" fill="#292321" fillOpacity="0.35">
                BHUBANESWAR · ILLUSTRATIVE, NOT TO SCALE
              </text>
              <g transform="translate(560 40)" fill="#292321" fillOpacity="0.5">
                <path d="M0 -14 L5 4 L0 0 L-5 4 Z" />
                <text y="18" fontSize="9" textAnchor="middle" letterSpacing="2">N</text>
              </g>

              {branches.map((b) => {
                const p = pins[b.id];
                const on = hl === b.id;
                return (
                  <g key={b.id} className="map-pin" style={{ transformBox: 'fill-box' } as any} onMouseEnter={() => setHl(b.id)} onMouseLeave={() => setHl(null)}>
                    <circle cx={p.x} cy={p.y} r={on ? 46 : 30} fill="url(#pinGlow)" style={{ transition: 'r .8s cubic-bezier(.22,1,.36,1)' }} />
                    <circle cx={p.x} cy={p.y} r="5" fill={on ? '#B98278' : '#211B18'} style={{ transition: 'fill .5s' }} />
                    <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="#B99A68" strokeWidth="1" className="pin-pulse" />
                    <text x={p.x + 18} y={p.y - 10} fontSize="15" fontFamily="var(--font-serif)" fill="#292321">
                      {b.name.split(' ')[0]}
                    </text>
                    <text x={p.x + 18} y={p.y + 6} fontSize="8" letterSpacing="2" fill="#292321" fillOpacity="0.5">
                      {b.tag.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="loc-cards grid gap-5 lg:col-span-5">
            {branches.map((b, i) => (
              <article
                key={b.id}
                onMouseEnter={() => setHl(b.id)}
                onMouseLeave={() => setHl(null)}
                className={`loc-card group relative overflow-hidden border p-7 transition-colors duration-700 sm:p-9 ${hl === b.id ? 'border-gold bg-[#FBF8F4]' : 'border-charcoal/10 bg-transparent'}`}
              >
                <span className="absolute right-6 top-5 font-serif text-6xl font-light text-nude transition-colors duration-700 group-hover:text-champagne/60">0{i + 1}</span>
                <p className="text-[11px] uppercase tracking-luxe text-rose">{b.tag}</p>
                <h3 className="mt-3 font-serif text-4xl font-light leading-tight">{b.name}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/65">{b.address}</p>
                <Magnetic className="btn-ghost mt-7" href={directionsUrl(b)} external strength={0.2}>
                  <span>Get Directions ↗</span>
                </Magnetic>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
