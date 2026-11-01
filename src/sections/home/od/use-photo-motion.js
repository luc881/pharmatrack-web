'use client';

import { useEffect } from 'react';

import { gsap, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// Fotos del home con GSAP:
//  [data-shutter]  la foto se revela como un obturador (recorte que se abre
//                  de abajo hacia arriba) mientras la imagen de adentro se
//                  aleja un poco; una vez, al entrar en pantalla.
//  [data-parallax] el fondo se desplaza más lento que la página (necesita
//                  sobrar alto: inset '-12% 0').
// Con movimiento reducido todo queda quieto y completo.
// ----------------------------------------------------------------------

export function usePhotoMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-shutter]').forEach((frame) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } });
        tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
        const img = frame.querySelector('img');
        if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0);
      });
      gsap.utils.toArray('[data-parallax]').forEach((layer) => {
        gsap.fromTo(layer, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);
}
