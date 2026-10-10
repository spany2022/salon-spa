'use client';

import { useEffect, useRef } from 'react';
import { gsap, isTouch } from '@/lib/gsap';

/**
 * Minimal custom cursor. Its character changes with context:
 *   data-cursor="hair"   → soft circle
 *   data-cursor="spa"    → blurred glow
 *   data-cursor="bridal" → gold ring
 *   data-cursor="view"   → "View" label
 *   data-cursor="book"   → "Book" label
 * Nearest ancestor with data-cursor wins. Disabled on touch devices.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const d = dot.current!;
    const r = ring.current!;
    document.documentElement.classList.add('has-cursor');

    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3.out' });

    let mode = '';
    const setMode = (m: string) => {
      if (m === mode) return;
      mode = m;
      r.dataset.mode = m;
      d.dataset.mode = m;
      if (label.current) label.current.textContent = m === 'view' ? 'View' : m === 'book' ? 'Book' : m === 'drag' ? 'Drag' : '';
    };

    const move = (e: MouseEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor], a, button, input, select, textarea, label') as HTMLElement | null;
      if (!t) return setMode('');
      const m = t.dataset.cursor ?? (t.matches('input, select, textarea') ? 'text' : 'link');
      setMode(m);
    };
    const down = () => r.classList.add('is-down');
    const up = () => r.classList.remove('is-down');
    const leave = () => r.classList.add('is-hidden');
    const enter = () => r.classList.remove('is-hidden');

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-root pointer-events-none fixed inset-0 z-[200] hidden">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
