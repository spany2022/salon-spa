'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

type ScrollApi = {
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {}, stop: () => {}, start: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Lenis smooth scroll, synced to GSAP's ticker so ScrollTrigger
 * and Lenis never disagree about where the page is.
 *
 * Also publishes scroll velocity as the CSS variable --scroll-vel
 * (and on window.__aabhaVelocity) so components can respond to how
 * fast the visitor is moving — calmer when slow, livelier when fast.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  // stop() can be called by children before Lenis exists (child effects run first)
  const stoppedRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    let smoothVel = 0;
    let raf = 0;

    const publish = (v: number) => {
      smoothVel += (v - smoothVel) * 0.12;
      const clamped = Math.max(-40, Math.min(40, smoothVel));
      (window as any).__aabhaVelocity = clamped;
      root.style.setProperty('--scroll-vel', clamped.toFixed(3));
    };

    if (prefersReducedMotion()) {
      root.classList.add('reduced-motion');
      return;
    }

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenisRef.current = lenis;
    if (stoppedRef.current) lenis.stop();
    root.classList.add('lenis', 'lenis-smooth');

    let lastVel = 0;
    lenis.on('scroll', (e: any) => {
      lastVel = e.velocity ?? 0;
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // velocity smoothing runs every frame so it decays back to 0 at rest
    const loop = () => {
      publish(lastVel);
      lastVel *= 0.9;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      root.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  const scrollTo = useCallback<ScrollApi['scrollTo']>((target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target as any, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.6 });
      return;
    }
    const el = typeof target === 'string' ? (document.querySelector(target) as HTMLElement | null) : target;
    if (typeof el === 'number') window.scrollTo({ top: el });
    else el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = 'hidden';
  }, []);
  const start = useCallback(() => {
    stoppedRef.current = false;
    lenisRef.current?.start();
    document.documentElement.style.overflow = '';
  }, []);

  return <ScrollContext.Provider value={{ scrollTo, stop, start }}>{children}</ScrollContext.Provider>;
}
