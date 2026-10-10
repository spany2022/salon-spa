'use client';

import { useState } from 'react';
import SmoothScroll from '@/components/providers/SmoothScroll';
import BookingProvider from '@/components/providers/Booking';
import Loader from '@/components/ui/Loader';
import Cursor from '@/components/ui/Cursor';
import Ambient from '@/components/ui/Ambient';
import Nav from '@/components/ui/Nav';
import MobileCta from '@/components/ui/MobileCta';
import Hero from '@/components/sections/Hero';
import Experience from '@/components/sections/Experience';
import Journey from '@/components/sections/Journey';
import Hair from '@/components/sections/Hair';
import Skin from '@/components/sections/Skin';
import Spa from '@/components/sections/Spa';
import NailsGrooming from '@/components/sections/NailsGrooming';
import Bridal from '@/components/sections/Bridal';
import Gallery from '@/components/sections/Gallery';
import Why from '@/components/sections/Why';
import Locations from '@/components/sections/Locations';
import FinalCta from '@/components/sections/FinalCta';
import Footer from '@/components/sections/Footer';

/**
 * The Aabha story, in order:
 * Enter → Discover → Choose → Transform → Relax → Reveal → Return.
 */
export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <SmoothScroll>
      <BookingProvider>
        <Loader onDone={() => setReady(true)} />
        <Cursor />
        <Ambient />
        <div className="grain-overlay pointer-events-none fixed inset-0 z-[6]" aria-hidden />
        <Nav ready={ready} />
        <main>
          <Hero ready={ready} />
          <Experience />
          <Journey />
          <Hair />
          <Skin />
          <Spa />
          <NailsGrooming />
          <Bridal />
          <Gallery />
          <Why />
          <Locations />
          <FinalCta />
        </main>
        <Footer />
        <MobileCta />
      </BookingProvider>
    </SmoothScroll>
  );
}
