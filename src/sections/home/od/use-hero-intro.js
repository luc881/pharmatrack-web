'use client';

import { useEffect } from 'react';

import { gsap, SplitText, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// Entrada de la portada del home: el video se acerca un poco al cargar, las
// letras de «OPUNTIA» suben escalonadas desde su máscara, y luego «Criadero»
// y el texto de abajo. Al bajar, el nombre sube y se encoge un poco
// (parallax ligado al scroll). Con movimiento reducido todo queda quieto.
// Marcas en el JSX: data-hero-video, data-hero-word, data-hero-kicker,
// data-hero-bottom.
// ----------------------------------------------------------------------

export function useHeroIntro(ref) {
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return undefined;
    const ctx = gsap.context((self) => {
      const word = self.selector('[data-hero-word]')[0];
      // aria hidden: conserva el aria-label del h1 (más completo) y oculta las letras sueltas
      const split = SplitText.create(word, { type: 'chars', mask: 'chars', aria: 'hidden' });

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero-video]', { scale: 1.1, duration: 2.6, ease: 'power2.out' }, 0)
        .from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.06 }, 0.15)
        .from('[data-hero-kicker]', { autoAlpha: 0, y: 14, duration: 1 }, 0.55)
        .from('[data-hero-bottom] > *', { autoAlpha: 0, y: 26, duration: 1.1, stagger: 0.12 }, 0.75);

      gsap.to(word, {
        yPercent: -14,
        scale: 0.92,
        transformOrigin: '50% 0%',
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
