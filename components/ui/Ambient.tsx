'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Light simulation + section awareness.
 * - Sets body[data-tone] (light/dark) for the nav and cursor.
 * - Sets body[data-zone] to the section in view; CSS shifts the colour and
 *   position of a soft overlay light so each "room" has its own warmth.
 * - Publishes --page-progress so the light drifts as you move through.
 */
export default function Ambient() {
  useEffect(() => {
    const body = document.body;
    const triggers: ScrollTrigger[] = [];
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id], footer[data-tone]'));
    sections.forEach((sec) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return;
            body.dataset.tone = sec.dataset.tone || 'light';
            body.dataset.zone = sec.id || 'footer';
          },
        }),
      );
    });
    // nav needs to know what's directly beneath it, not mid-screen
    sections.forEach((sec) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 40px',
          end: 'bottom 40px',
          onToggle: (self) => {
            if (self.isActive) body.dataset.navTone = sec.dataset.tone || 'light';
          },
        }),
      );
    });
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => document.documentElement.style.setProperty('--page-progress', self.progress.toFixed(4)),
      }),
    );
    // pins are created by sibling components; make sure order & positions are right
    const settle = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const t1 = window.setTimeout(settle, 300);
    const t2 = window.setTimeout(settle, 3000); // after loader + hero intro mount
    window.addEventListener('load', settle);
    body.dataset.tone = 'dark';
    body.dataset.navTone = 'dark';
    body.dataset.zone = 'home';
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', settle);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return <div aria-hidden className="ambient pointer-events-none fixed inset-0 z-[4]" />;
}
