'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, prefersReducedMotion, isTouch } from './gsap';

/**
 * Elements inside `scope` with data-vel="<factor>" drift with scroll
 * velocity: almost still when the visitor scrolls slowly, a little more
 * alive when they move fast. Kept small to avoid any "distortion" feel.
 */
export function useVelocity(scope: RefObject<HTMLElement>, opts: { skew?: boolean } = {}) {
  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-vel]'));
    const damp = isTouch() ? 0.4 : 1;
    const setters = els.map((el) => ({
      f: parseFloat(el.dataset.vel || '1') * damp,
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
      s: opts.skew ? gsap.quickTo(el, 'skewY', { duration: 1.2, ease: 'power3.out' }) : null,
    }));
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '20% 0px' });
    io.observe(root);
    const tick = () => {
      if (!visible) return;
      const v = (window as any).__aabhaVelocity ?? 0;
      for (const s of setters) {
        s.y(-v * 2.2 * s.f);
        s.s?.(Math.max(-2, Math.min(2, v * 0.06 * s.f)));
      }
    };
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [scope, opts.skew]);
}
