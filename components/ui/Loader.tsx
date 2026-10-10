'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { prefersReducedMotion } from '@/lib/gsap';
import { LotusMark } from '@/components/ui/Logo';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Cinematic loader: the lotus draws itself → AABHA → आभा · Unisex Salon & Spa → curtain lifts.
 * ~2.6s total. Skipped (near-instant) for reduced motion.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
    stop();
    const reduced = prefersReducedMotion();
    const t = reduced ? [0, 0, 0, 200] : [350, 1050, 1750, 2500];
    const timers = [
      setTimeout(() => setStage(1), t[0]),
      setTimeout(() => setStage(2), t[1]),
      setTimeout(() => setStage(3), t[2]),
      setTimeout(() => {
        setVisible(false);
        start();
        onDone();
      }, t[3]),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-espresso text-cream"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 1.1, ease } }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
          aria-label="Loading Aabha"
          role="status"
        >
          {/* soft light blooming behind the mark */}
          <motion.div
            className="absolute h-[60vmin] w-[60vmin] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(213,182,154,0.28), rgba(185,154,104,0.06) 45%, transparent 70%)' }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: stage >= 1 ? 1.25 : 0.6, opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 2.2, ease }}
          />
          <div className="relative flex flex-col items-center">
            <div className="mb-6 h-20 w-20 sm:h-24 sm:w-24">
              {stage >= 1 && <LotusMark draw className="h-full w-full text-champagne" strokeWidth={1} />}
            </div>
            <div className="flex pl-[0.2em] font-serif text-[15vw] font-light leading-none tracking-[0.2em] sm:text-[7rem]" aria-hidden>
              {'AABHA'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                  animate={stage >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                  transition={{ duration: 0.8, delay: i * 0.07, ease }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-4 h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: stage >= 2 ? 160 : 0 }}
              transition={{ duration: 1, ease }}
            />
            <motion.p
              className="mt-5 flex items-center text-[10px] uppercase tracking-luxe text-champagne sm:text-xs"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={stage >= 3 ? { opacity: 1, letterSpacing: '0.32em' } : {}}
              transition={{ duration: 1, ease }}
            >
              <span className="font-deva text-[1.6em] normal-case tracking-normal text-gold">आभा</span>
              <span className="mx-3 text-gold/60">·</span>
              Unisex Salon &amp; Spa
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
