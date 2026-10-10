import { media, type MediaItem } from './media';

/**
 * ─────────────────────────────────────────────────────────────
 *  BUSINESS DETAILS — fill in the TODOs before launch.
 * ─────────────────────────────────────────────────────────────
 */
export const business = {
  name: 'Aabha Unisex Salon & Spa',
  short: 'Aabha',
  city: 'Bhubaneswar, Odisha',
  // TODO: WhatsApp number in international format, digits only, e.g. '9198XXXXXXXX'.
  // When set, "Request Appointment" opens WhatsApp with the booking details pre-filled.
  whatsapp: '',
  // TODO: phone number shown in the booking confirmation, e.g. '+91 98XXX XXXXX'.
  phone: '',
  // TODO: social profile URLs.
  instagram: '#',
  facebook: '#',
};

export type ServiceCategory = {
  id: 'hair' | 'skin' | 'nails-spa' | 'grooming' | 'makeup';
  index: string;
  title: string;
  studio: string;
  line: string;
  services: string[];
  image: MediaItem;
  detail: MediaItem;
};

export const categories: ServiceCategory[] = [
  {
    id: 'hair',
    index: '01',
    title: 'Hair',
    studio: 'The Hair Studio',
    line: 'Cuts, colour and care — shaped around the way you live.',
    services: ['Haircuts', 'Styling & Blow Dry', 'Coloring & Highlights', 'Keratin', 'Cysteine', 'Hair Spa', 'Deep Conditioning', 'Straightening', 'Rebonding'],
    image: media.hairDuring,
    detail: media.hairBefore,
  },
  {
    id: 'skin',
    index: '02',
    title: 'Skin',
    studio: 'The Skin Studio',
    line: 'Facials and rituals for skin that looks rested and feels cared for.',
    services: ['Classic Facials', 'Glow Facials', 'Tan Removal', 'Skin Treatments', 'Facial Spa Treatments'],
    image: media.skin,
    detail: media.skinDetail,
  },
  {
    id: 'nails-spa',
    index: '03',
    title: 'Nails & Spa',
    studio: 'The Spa Room',
    line: 'Slow hands, warm water, and an hour that belongs to you.',
    services: ['Manicure', 'Pedicure', 'Crystal Nail Care', 'Spa Therapies'],
    image: media.spa,
    detail: media.nails,
  },
  {
    id: 'grooming',
    index: '04',
    title: 'Grooming',
    studio: 'The Grooming Bar',
    line: 'Precise lines, clean finishes, unhurried attention.',
    services: ['Beard Styling', 'Shaving', 'Trimming', 'Waxing', 'Full Body Waxing', 'Fruit Waxing', 'Bikini-Line Waxing'],
    image: media.grooming,
    detail: media.groomingTools,
  },
  {
    id: 'makeup',
    index: '05',
    title: 'Makeup & Bridal',
    studio: 'The Bridal Studio',
    line: 'For the days you will remember — and the photographs that remember them.',
    services: ['Bridal Makeup', 'Engagement Makeup', 'Party Makeup', 'Family Makeup', 'Basic Makeup', 'Eye Makeup'],
    image: media.makeup,
    detail: media.makeupBrushes,
  },
];

export type Branch = {
  id: string;
  name: string;
  tag: string;
  address: string;
  mapsQuery: string;
};

export const branches: Branch[] = [
  {
    id: 'rasulgarh',
    name: 'Rasulgarh',
    tag: 'Main Branch',
    address: 'E Canal Rd, Nigamananda Nagar, Rasulgarh, Bhubaneswar',
    mapsQuery: 'E Canal Rd, Nigamananda Nagar, Rasulgarh, Bhubaneswar',
  },
  {
    id: 'chandaka',
    name: 'Chandaka Industrial Estate',
    tag: 'Second Branch',
    address: 'D-12, In Front Of Royal Enfield Showroom, Maruti Villa, Chandaka Industrial Estate, Bhubaneswar',
    mapsQuery: 'D-12, Maruti Villa, Chandaka Industrial Estate, Bhubaneswar',
  },
];

export const directionsUrl = (b: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery)}`;

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Bridal', href: '#bridal' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Locations', href: '#locations' },
];

export const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
