/**
 * ─────────────────────────────────────────────────────────────
 *  MEDIA LIBRARY — every image on the site comes from here.
 * ─────────────────────────────────────────────────────────────
 *  These are temporary Unsplash placeholders. Replace each `src`
 *  with real Aabha photography (e.g. '/media/hero.webp' placed in
 *  /public/media). If an image fails to load, the <Media> component
 *  shows a soft branded placeholder with the label below, so the
 *  layout never breaks.
 */

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`;

export type MediaItem = { src: string; alt: string; label: string };

export const media = {
  hero: { src: u('1560066984-138dadb4c035'), alt: 'Warm-lit salon interior with styling chairs and mirrors', label: 'Salon interior' },
  heroVideo: '', // optional: '/media/hero.mp4' — a slow, ambient interior clip. Poster = hero image.
  experience: { src: u('1600948836101-f9ffda59d250'), alt: 'Elegant salon styling station', label: 'The Aabha studio' },

  hairBefore: { src: u('1562322140-8baeececf3df'), alt: 'Hair colouring in progress', label: 'Hair — consultation' },
  hairDuring: { src: u('1522337360788-8b13dee7a37e'), alt: 'Stylist styling a client’s hair', label: 'Hair — styling' },
  hairFinal: { src: u('1519699047748-de8e457a634e'), alt: 'Finished hair look', label: 'Hair — final look' },

  skin: { src: u('1570172619644-dfd03ed5d881'), alt: 'Facial skincare treatment', label: 'Skin ritual' },
  skinDetail: { src: u('1556228578-8c89e6adf883'), alt: 'Skincare products on a soft surface', label: 'Skin products' },

  spa: { src: u('1544161515-4ab6ce6db874'), alt: 'Relaxing spa therapy', label: 'Spa therapy' },
  spaStill: { src: u('1540555700478-4be289fbecef'), alt: 'Calm spa setting', label: 'Spa room' },
  spaBotanical: { src: u('1515377905703-c4788e51af15'), alt: 'Spa stones and flowers', label: 'Botanical spa' },

  nails: { src: u('1604654894610-df63bc536371'), alt: 'Manicured nails', label: 'Nail care' },
  grooming: { src: u('1503951914875-452162b0f3f1'), alt: 'Beard grooming at a barber chair', label: 'Grooming' },
  groomingTools: { src: u('1621605815971-fbc98d665033'), alt: 'Grooming tools and razor', label: 'Grooming tools' },

  makeup: { src: u('1487412947147-5cebf100ffc2'), alt: 'Makeup artistry close-up', label: 'Makeup artistry' },
  makeupProducts: { src: u('1512496015851-a90fb38ba796'), alt: 'Cosmetics and brushes', label: 'Makeup products' },
  makeupBrushes: { src: u('1596462502278-27bfdc403348'), alt: 'Makeup brushes', label: 'Makeup brushes' },
  bridal: { src: u('1583939003579-730e3918a45a'), alt: 'Bridal portrait', label: 'Bridal portrait' },

  finale: { src: u('1521590832167-7bcbfaa6381f'), alt: 'Salon interior in warm evening light', label: 'Aabha at night' },
} satisfies Record<string, MediaItem | string>;
