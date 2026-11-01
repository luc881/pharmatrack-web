'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { gsap, ScrollTrigger, prefersReducedMotion } from './od-gsap';

// ----------------------------------------------------------------------
// Scroll suave con «peso» (Lenis) en el home, sincronizado con ScrollTrigger.
// Reglas de la skill: solo con mouse (en táctil el scroll nativo ya es suave),
// apagado con movimiento reducido y sin capturar la rueda dentro de modales,
// menús o listas con su propio scroll.
// ----------------------------------------------------------------------

export function OdSmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      lerp: 0.12,
      anchors: true,
      prevent: (node) => !!node.closest?.('.MuiModal-root, .MuiPopover-root, [data-lenis-prevent]'),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
