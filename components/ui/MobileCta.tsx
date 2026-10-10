'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from '@/components/providers/Booking';

/** Sticky "Book Appointment" bar for phones — appears once the hero is passed. */
export default function MobileCta() {
  const [show, setShow] = useState(false);
  const { open, isOpen } = useBooking();

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 200;
      setShow(window.scrollY > window.innerHeight * 0.7 && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && !isOpen && (
        <motion.div
          className="fixed inset-x-3 bottom-3 z-[60] md:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <button
            onClick={() => open()}
            className="flex w-full items-center justify-between bg-espresso/95 px-6 py-4 text-cream shadow-2xl shadow-black/30 backdrop-blur"
          >
            <span className="text-[12px] uppercase tracking-[0.24em]">Book Appointment</span>
            <span className="font-serif text-xl italic tracking-[0.08em] text-champagne">Aabha</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
