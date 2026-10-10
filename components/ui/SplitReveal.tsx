'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** 'lines' masks each line and slides it up; 'chars' softly un-blurs each character; 'words' fades words in */
  mode?: 'lines' | 'chars' | 'words';
  delay?: number;
  /** Reveal immediately when `play` turns true instead of on scroll */
  play?: boolean;
  start?: string;
  stagger?: number;
  id?: string;
};

/**
 * Editorial text reveal using SplitType + GSAP.
 * No bouncing — mask slide, fade and a whisper of blur only.
 */
export default function SplitReveal({ as: Tag = 'h2', children, className = '', mode = 'lines', delay = 0, play, start = 'top 82%', stagger, id }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      return;
    }
    if (play === false) return;

    let split: SplitType | null = null;
    let tween: gsap.core.Tween | null = null;
    let ready = false;

    const build = () => {
      split?.revert();
      split = new SplitType(el, { types: mode === 'chars' ? 'lines,words,chars' : 'lines,words' });
      el.style.opacity = '1';
      const lines = split.lines ?? [];
      lines.forEach((l) => l.classList.add('split-line'));

      const targets = mode === 'chars' ? split.chars : split.words;
      const from: gsap.TweenVars =
        mode === 'lines'
          ? { yPercent: 115, rotate: 2.5, opacity: 0 }
          : mode === 'chars'
            ? { opacity: 0, filter: 'blur(10px)', y: 18 }
            : { opacity: 0, y: 24, filter: 'blur(6px)' };

      tween = gsap.from(targets, {
        ...from,
        duration: mode === 'chars' ? 1.2 : 1.35,
        ease: 'expo.out',
        stagger: stagger ?? (mode === 'chars' ? 0.025 : mode === 'lines' ? 0.06 : 0.05),
        delay,
        immediateRender: true,
        scrollTrigger: play === undefined ? { trigger: el, start, once: true } : undefined,
      });
      ready = true;
    };

    // fonts change line breaks — wait for them before splitting
    const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
    let cancelled = false;
    fontsReady.then(() => {
      if (!cancelled) {
        build();
        ScrollTrigger.refresh();
      }
    });

    let w = window.innerWidth;
    const onResize = () => {
      if (!ready || Math.abs(window.innerWidth - w) < 40) return;
      w = window.innerWidth;
      tween?.progress(1).kill();
      split?.revert();
      split = new SplitType(el, { types: mode === 'chars' ? 'lines,words,chars' : 'lines,words' });
      split.lines?.forEach((l) => l.classList.add('split-line'));
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [mode, delay, play, start, stagger]);

  return (
    <Tag ref={ref} id={id} className={`split-reveal ${className}`}>
      {children}
    </Tag>
  );
}
