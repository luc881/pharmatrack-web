// Fusionar SOLO el bloque theme.extend con el tailwind.config existente del repo.
// Los valores apuntan a las variables de styles/tokens.css: un único punto de verdad.
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        divider: 'var(--color-divider)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
        },
        neutral: {
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      fontSize: {
        // Escala del prototipo. Los display van en weight 300.
        kicker: ['11px', { lineHeight: '1.4', letterSpacing: '0.2em' }],
        meta: ['13px', { lineHeight: '1.5' }],
        base: ['15px', { lineHeight: '1.7' }],
        body: ['16px', { lineHeight: '1.85' }],
        prose: ['17px', { lineHeight: '1.8' }],
        'card-title': ['18px', { lineHeight: '1.3' }],
        'card-lg': ['21px', { lineHeight: '1.2' }],
        'price-lg': ['40px', { lineHeight: '1' }],
        'display-sm': ['clamp(32px, 3.6vw, 58px)', { lineHeight: '1.06' }],
        'display-md': ['clamp(36px, 4.4vw, 62px)', { lineHeight: '1.04' }],
        'display-lg': ['clamp(38px, 5.4vw, 84px)', { lineHeight: '1.02' }],
        'display-xl': ['clamp(48px, 7.4vw, 122px)', { lineHeight: '1' }],
      },
      letterSpacing: {
        kicker: '0.2em',
        kickerWide: '0.22em',
        brand: '0.3em',
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        strip: 'var(--radius-strip)',
        nav: 'var(--radius-nav)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        od: 'var(--ease)',
      },
      transitionDuration: {
        color: '350ms',
        pill: '400ms',
        lift: '450ms',
        slide: '600ms',
        zoom: '1100ms',
      },
      aspectRatio: {
        card: '3 / 4.3',
        portrait: '3 / 4',
        plate: '4 / 5',
        wide: '16 / 10',
        hero: '16 / 9',
      },
      maxWidth: {
        measure: '68ch',
        lead: '54ch',
        excerpt: '38ch',
      },
      keyframes: {
        odMarquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        odSlide: {
          from: { transform: 'translateX(56px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        odFade: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        marquee: 'odMarquee 26s linear infinite',
        slide: 'odSlide 600ms var(--ease) both',
        fade: 'odFade 500ms var(--ease) both',
      },
    },
  },
  plugins: [],
};

export default config;
