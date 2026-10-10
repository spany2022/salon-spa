'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, branches, business } from '@/lib/data';
import { useBooking } from '@/components/providers/Booking';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import Magnetic from './Magnetic';
import Logo from './Logo';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Nav({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { open } = useBooking();
  const { scrollTo, stop, start } = useSmoothScroll();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > 600 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y < 600) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menuWasOpen = useRef(false);
  useEffect(() => {
    if (menu) stop();
    else if (menuWasOpen.current) start();
    menuWasOpen.current = menu;
  }, [menu, stop, start]);

  const go = (href: string) => (e: ReactMouseEvent) => {
    e.preventDefault();
    setMenu(false);
    setTimeout(() => scrollTo(href, { offset: 0 }), menu ? 450 : 0);
  };

  return (
    <>
      <motion.header
        className={`nav fixed inset-x-0 top-0 z-[80] ${scrolled ? 'nav-scrolled' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? { y: hidden && !menu ? -110 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="nav-bar mx-auto flex items-center justify-between px-5 sm:px-8">
          <a href="#home" onClick={go('#home')} className="group flex" aria-label="Aabha — home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={go(l.href)} className="nav-link text-[12px] uppercase tracking-[0.2em]">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="btn-nav hidden sm:inline-flex" onClick={() => open()} cursor="book">
              <span>Book Now</span>
            </Magnetic>
            <button
              className="menu-btn relative h-11 w-11 lg:hidden"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              <span className={`menu-line ${menu ? 'top-1/2 rotate-45' : 'top-[42%]'}`} />
              <span className={`menu-line ${menu ? 'top-1/2 -rotate-45' : 'top-[58%]'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-espresso px-6 pb-10 pt-28 text-cream lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.9, ease }}
            data-lenis-prevent
          >
            <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={go(l.href)}
                  className="flex items-baseline gap-4 py-2 font-serif text-[13vw] font-light leading-none sm:text-6xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.8, ease }}
                >
                  <span className="font-sans text-[10px] tracking-[0.2em] text-gold">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="border-t border-cream/15 pt-6 text-xs leading-relaxed text-cream/60">
              {branches.map((b) => (
                <p key={b.id} className="mb-2">
                  <span className="text-champagne">{b.name}</span> — {b.address}
                </p>
              ))}
              <div className="mt-4 flex gap-6 uppercase tracking-[0.2em]">
                <a href={business.instagram}>Instagram</a>
                <a href={business.facebook}>Facebook</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
