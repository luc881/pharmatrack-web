'use client';

import { useRef, useState } from 'react';
import { useScroll, useReducedMotion, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Texto que se entinta al bajar (rediseño, inspirado en Reelio): las palabras
// pasan de tinta tenue a tinta plena conforme el texto cruza la pantalla.
// `children` puede ser un texto o una lista de párrafos: con lista, el
// entintado recorre todos en orden, de arriba hacia abajo (un solo avance,
// no uno por párrafo). Con movimiento reducido se ve entero desde el inicio.
// El texto completo está en el DOM desde el principio (lectores y buscadores).
// ----------------------------------------------------------------------

export function OdInkText({ children, component = 'p', gap = '0.9em', sx }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const paragraphs = (Array.isArray(children) ? children : [children]).map((p) => String(p).split(' '));
  const total = paragraphs.reduce((n, words) => n + words.length, 0);
  const [filled, setFilled] = useState(reduce ? total : 0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduce) setFilled(Math.round(v * total));
  });

  let offset = 0;
  const rendered = paragraphs.map((words, pi) => {
    const start = offset;
    offset += words.length;
    return (
      <Box key={pi} component={component} sx={{ m: 0, mt: pi ? gap : 0 }}>
        {words.map((w, i) => (
          <Box key={i} component="span" sx={{ opacity: reduce || start + i < filled ? 1 : 0.28, transition: 'opacity 350ms ease' }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </Box>
        ))}
      </Box>
    );
  });

  return (
    <Box ref={ref} sx={[{ m: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {rendered}
    </Box>
  );
}
