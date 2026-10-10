'use client';

import { motion } from 'framer-motion';

/**
 * Aabha (आभा, "radiance") brand mark: a fine-line lotus opening on still
 * water, with three rays of light rising from it. Petals use currentColor;
 * the rays and waterline are always gold.
 */
const petals = [
  'M32 15 C38.5 24 38.5 35 32 45 C25.5 35 25.5 24 32 15 Z',
  'M32 45 C24 41.5 17 33.5 15.5 24 C23.5 26 29.5 33 32 45 Z',
  'M32 45 C40 41.5 47 33.5 48.5 24 C40.5 26 34.5 33 32 45 Z',
  'M32 47 C22.5 47.5 11.5 43.5 7 35.5 C17 34 26 39 32 47 Z',
  'M32 47 C41.5 47.5 52.5 43.5 57 35.5 C47 34 38 39 32 47 Z',
];
const rays = ['M32 3.5 V9.5', 'M21.5 6.5 L24.2 11.4', 'M42.5 6.5 L39.8 11.4'];
const water = ['M13 52.5 H51', 'M21 57 H43'];

type MarkProps = { className?: string; strokeWidth?: number; draw?: boolean };

export function LotusMark({ className = 'h-10 w-10', strokeWidth = 1.3, draw = false }: MarkProps) {
  const anim = (i: number) =>
    draw
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.4, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        }
      : {};
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {petals.map((d, i) => (
        <motion.path key={d} d={d} stroke="currentColor" strokeWidth={strokeWidth} {...anim(i)} />
      ))}
      {rays.map((d, i) => (
        <motion.path key={d} d={d} stroke="#B99A68" strokeWidth={strokeWidth} {...anim(petals.length + i)} />
      ))}
      {water.map((d, i) => (
        <motion.path key={d} d={d} stroke="#B99A68" strokeWidth={strokeWidth * 0.8} opacity={i ? 0.55 : 1} {...anim(2 + i)} />
      ))}
    </svg>
  );
}

type LogoProps = { size?: 'sm' | 'lg'; className?: string };

/** Mark + AABHA wordmark + "Unisex Salon & Spa". Inherits text colour. */
export default function Logo({ size = 'sm', className = '' }: LogoProps) {
  const lg = size === 'lg';
  return (
    <span className={`inline-flex items-center ${lg ? 'gap-4' : 'gap-2.5'} leading-none ${className}`}>
      <LotusMark className={lg ? 'h-16 w-16' : 'h-9 w-9'} strokeWidth={lg ? 1.1 : 1.4} />
      <span className="flex flex-col">
        <span className={`font-serif font-medium ${lg ? 'text-[44px] tracking-[0.2em]' : 'text-[24px] tracking-[0.18em]'}`}>AABHA</span>
        <span className={`mt-1 uppercase opacity-70 ${lg ? 'text-[10px] tracking-[0.42em]' : 'text-[8px] tracking-[0.34em]'}`}>
          Unisex Salon &amp; Spa
        </span>
      </span>
    </span>
  );
}
