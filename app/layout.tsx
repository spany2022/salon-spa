import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, Pinyon_Script, Tiro_Devanagari_Hindi } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Manrope({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-sans', display: 'swap' });
const script = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const deva = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-deva', display: 'swap' });

export const metadata: Metadata = {
  title: 'Aabha Unisex Salon & Spa — Bhubaneswar',
  description:
    'Aabha (आभा) Unisex Salon & Spa, Bhubaneswar — hair, skin, nails, grooming, makeup, bridal and spa experiences at Rasulgarh and Chandaka Industrial Estate.',
  keywords: ['Aabha', 'Aabha Salon', 'Aabha Spa', 'unisex salon Bhubaneswar', 'spa Bhubaneswar', 'bridal makeup Bhubaneswar', 'Rasulgarh salon', 'Chandaka salon'],
  openGraph: {
    title: 'Aabha Unisex Salon & Spa',
    description: 'The Art of Becoming You. Hair, skin, nails, grooming, makeup & spa in Bhubaneswar.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#211B18',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Aabha Unisex Salon & Spa',
  alternateName: 'आभा Salon & Spa',
  address: [
    { '@type': 'PostalAddress', streetAddress: 'E Canal Rd, Nigamananda Nagar, Rasulgarh', addressLocality: 'Bhubaneswar', addressRegion: 'Odisha', addressCountry: 'IN' },
    { '@type': 'PostalAddress', streetAddress: 'D-12, Maruti Villa, Chandaka Industrial Estate', addressLocality: 'Bhubaneswar', addressRegion: 'Odisha', addressCountry: 'IN' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable} ${deva.variable}`}>
      <body className="bg-ivory font-sans text-charcoal antialiased" data-tone="dark" suppressHydrationWarning={true}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
