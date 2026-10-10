'use client';

import { useEffect, useRef, type ReactNode, type MouseEventHandler } from 'react';
import { gsap, isTouch } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: MouseEventHandler;
  strength?: number;
  cursor?: string;
  ariaLabel?: string;
  external?: boolean;
};

/**
 * Magnetic CTA — drifts gently toward the cursor, text follows a little
 * further, and a soft glow tracks the pointer inside the button.
 */
export default function Magnetic({ children, className = 'btn-primary', href, onClick, strength = 0.28, cursor, ariaLabel, external }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch()) return;
    const inner = el.querySelector('span');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
    const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' }) : null;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.35);
      iyTo?.(dy * strength * 0.35);
      el.style.setProperty('--gx', `${e.clientX - r.left}px`);
      el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      ixTo?.(0);
      iyTo?.(0);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [strength]);

  if (href) {
    return (
      <a
        ref={(n) => {
          ref.current = n;
        }}
        href={href}
        onClick={onClick}
        className={`magnetic ${className}`}
        data-cursor={cursor}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={(n) => {
        ref.current = n;
      }}
      type="button"
      onClick={onClick}
      className={`magnetic ${className}`}
      data-cursor={cursor}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
