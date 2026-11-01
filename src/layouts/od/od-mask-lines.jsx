'use client';

import { useRef, useEffect } from 'react';

import { gsap, SplitText, prefersReducedMotion } from './od-gsap';

// ----------------------------------------------------------------------
// Titular con máscara (estilo Aldena): el texto se parte en renglones y cada
// uno sube desde detrás de su propia línea al entrar en pantalla. Se vuelve a
// partir solo si cambia el ancho o cargan las fuentes (autoSplit). Con
// movimiento reducido el texto queda quieto. El texto real siempre está en el
// DOM (buscadores y lectores de pantalla).
// ----------------------------------------------------------------------

export function MaskLines({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.09,
            delay,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }),
      });
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return (
    <span ref={ref} style={{ display: 'block' }}>
      {children}
    </span>
  );
}
