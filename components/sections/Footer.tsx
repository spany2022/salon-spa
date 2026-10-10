'use client';

import { branches, business, directionsUrl } from '@/lib/data';
import Logo from '@/components/ui/Logo';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Hair', href: '#hair' },
  { label: 'Skin', href: '#skin' },
  { label: 'Spa', href: '#spa' },
  { label: 'Makeup', href: '#studio-makeup' },
  { label: 'Bridal', href: '#bridal' },
  { label: 'Locations', href: '#locations' },
  { label: 'Contact', href: '#book' },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();
  const wa = business.whatsapp ? `https://wa.me/${business.whatsapp}` : '#';

  return (
    <footer data-tone="dark" className="relative bg-[#171210] pb-28 pt-24 text-cream/80 md:pb-12">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="grid gap-14 border-b border-cream/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo size="lg" className="text-cream" />
            <p className="mt-5 text-sm text-cream/50">
              <span className="font-deva text-lg text-gold">आभा</span> — radiance, the glow that comes from within.
            </p>
            <p className="mt-8 max-w-sm font-serif text-3xl font-light leading-snug text-cream">
              “Beauty is not a moment. <em className="text-champagne">It’s an experience.</em>”
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="text-[10px] uppercase tracking-luxe text-cream/40">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(l.href);
                    }}
                    className="link-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-luxe text-cream/40">Visit</p>
            <div className="mt-5 space-y-6 text-sm leading-relaxed">
              {branches.map((b) => (
                <div key={b.id}>
                  <p className="font-serif text-xl text-cream">
                    {b.name} <span className="ml-1 text-[10px] uppercase tracking-[0.2em] text-gold">{b.tag}</span>
                  </p>
                  <a href={directionsUrl(b)} target="_blank" rel="noopener noreferrer" className="mt-1 block text-cream/60 hover:text-cream">
                    {b.address}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-6 text-[11px] uppercase tracking-[0.22em]">
              <a href={business.instagram} className="link-underline" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={business.facebook} className="link-underline" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={wa} className="link-underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-8 text-[11px] uppercase tracking-[0.2em] text-cream/35 sm:flex-row">
          <p>© {year} {business.name} · {business.city}</p>
          <button onClick={() => scrollTo(0)} className="text-left hover:text-cream sm:text-right">Back to top ↑</button>
        </div>
      </div>
    </footer>
  );
}
