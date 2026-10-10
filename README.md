# Aabha (आभा) Unisex Salon & Spa — website

*The Art of Becoming You.*
A scroll-driven website for Aabha, Bhubaneswar, built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Framer Motion and SplitType.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 20.9+. `sharp` is a dependency: without it, Next.js's image optimizer is slow enough that images in pinned sections can fail to appear.

## Before launch — fill these in

| What | Where |
|---|---|
| WhatsApp number (booking requests open WhatsApp pre-filled) | `lib/data.ts` → `business.whatsapp` |
| Phone number | `lib/data.ts` → `business.phone` |
| Instagram / Facebook URLs | `lib/data.ts` → `business.instagram`, `business.facebook` |
| Real Aabha photography | `lib/media.ts`. Every image is listed there. Put files in `public/media/` and use paths like `'/media/hero.webp'` |
| Optional hero video | `lib/media.ts` → `heroVideo: '/media/hero.mp4'` (the hero image is used as the poster) |

The images are **temporary Unsplash placeholders**. If any image is missing or fails to load, a soft branded placeholder that names the shot appears in its place, so the layout never breaks.

The booking form does **not** claim real-time availability. "Request Appointment" opens WhatsApp with the details (once a number is set) and tells the visitor the team will confirm. To send requests to a CRM or email, see the `TODO` in `components/providers/Booking.tsx`.

## The story (page order)

| # | Section | File | Signature motion |
|---|---|---|---|
| — | Loader | `components/ui/Loader.tsx` | The lotus draws itself → AABHA → आभा · Unisex Salon & Spa, then the curtain lifts |
| 1 | Hero | `sections/Hero.tsx` | Interior blooms out of darkness, slow zoom, light that follows the cursor |
| 2 | The Aabha Experience | `sections/Experience.tsx` | Arch image opens from a slit, gold rule grows |
| 3 | Signature Beauty Journey | `sections/Journey.tsx` | Pinned horizontal walk through 5 studios with layered depth (swipe carousel on mobile/tablet) |
| 4 | Hair Transformation | `sections/Hair.tsx` | Pinned Before → Transformation → Final Look through curved masks |
| 5 | Skin & Wellness | `sections/Skin.tsx` | Water-light caustics, images that respond to scroll velocity, hover preview list |
| 6 | The Spa Ritual | `sections/Spa.tsx` | Rising steam, water rings, an 8-second breathing guide |
| 7 | Nails + Grooming | `sections/NailsGrooming.tsx` | Split screen that leans toward the side the cursor is on |
| 8 | Bridal & Makeup | `sections/Bridal.tsx` | Pinned reveal: dark → light → portrait → details → gold frame |
| 9 | Gallery | `sections/Gallery.tsx` | Asymmetric grid, layered parallax, "View" cursor, lightbox |
| 10 | Why Aabha | `sections/Why.tsx` | Editorial numbered rows |
| 11 | Locations | `sections/Locations.tsx` | Line-drawn illustrative map; hovering a branch card lights its pin |
| 12 | Final CTA | `sections/FinalCta.tsx` | Arch window opens to full bleed with gold light |
| — | Footer | `sections/Footer.tsx` | Aabha logo and the meaning of आभा |

## Site-wide systems

- **Smooth scroll**: `components/providers/SmoothScroll.tsx` (Lenis synced to the GSAP ticker; publishes scroll velocity).
- **Text reveals**: `components/ui/SplitReveal.tsx` (SplitType: masked lines, soft-blur characters, words; nothing bounces).
- **Custom cursor**: `components/ui/Cursor.tsx`. Set `data-cursor="hair | spa | bridal | view | book"` on any element. Turned off on touch devices.
- **Magnetic buttons**: `components/ui/Magnetic.tsx`.
- **Light simulation**: `components/ui/Ambient.tsx` + `.ambient` in `globals.css` (each section has its own warmth).
- **Booking modal**: `components/providers/Booking.tsx`. Call `useBooking().open('hair')` from anywhere.

## Performance & accessibility

- `next/image` handles lazy loading and AVIF/WebP. The hero image is the only one with priority.
- Animations use transform, opacity and clip-path. Velocity effects run only while their section is on screen.
- `prefers-reduced-motion` turns off Lenis, pins and steam, and shows all content immediately.
- Three.js / React Three Fiber and Lottie were **left out on purpose**: every effect here works well with CSS, Canvas 2D and GSAP, which keeps the bundle small.

## Brand

Palette: Ivory `#F7F3EE` · Nude `#E8DDD4` · Espresso `#211B18` · Rose `#B98278` · Champagne `#D5B69A` · Gold `#B99A68` · Charcoal `#292321`.
Type: Cormorant Garamond (display), Manrope (body), Pinyon Script (rare accents).
**Aabha** (आभा) means radiance: the glow that comes from within. The logo is a fine-line lotus opening on still water, with three rays of light. It lives in `components/ui/Logo.tsx` (nav, footer, loader) and as standalone files: `public/brand/aabha-logo.svg` and the favicon `app/icon.svg`. Fonts: Tiro Devanagari Hindi for the आभा accent.

The previous L Zone logo files are kept in `_archive/lzone/` (outside `public/`, so they are not served).
