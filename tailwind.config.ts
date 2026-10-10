import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EE',
        nude: '#E8DDD4',
        espresso: '#211B18',
        rose: '#B98278',
        champagne: '#D5B69A',
        gold: '#B99A68',
        charcoal: '#292321',
        cream: '#F8F4EF',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
        deva: ['var(--font-deva)', 'serif'],
      },
      letterSpacing: {
        luxe: '0.32em',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
