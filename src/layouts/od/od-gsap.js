'use client';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ----------------------------------------------------------------------
// GSAP con sus plugins registrados una sola vez (licencia estándar gratuita,
// también para uso comercial, desde 2025). Lo usan el scroll suave, los
// titulares con máscara y la entrada de la portada del home.
// ----------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, SplitText, ScrollTrigger };
