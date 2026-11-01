'use client';

import { useRef, useState } from 'react';
import { useScroll, useReducedMotion, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Texto que se entinta al bajar (rediseño, inspirado en Reelio): las palabras
// pasan de tinta tenue a tinta plena conforme el párrafo cruza la pantalla.
// Con movimiento reducido se ve entero desde el inicio. El texto completo
// está en el DOM desde el principio (lectores de pantalla y buscadores).
// ----------------------------------------------------------------------

export function OdInkText({ children, component = 'p', sx }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const words = String(children).split(' ');
  const [filled, setFilled] = useState(reduce ? words.length : 0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduce) setFilled(Math.round(v * words.length));
  });

  return (
    <Box ref={ref} component={component} sx={[{ m: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {words.map((w, i) => (
        <Box key={i} component="span" sx={{ opacity: reduce || i < filled ? 1 : 0.28, transition: 'opacity 350ms ease' }}>
          {w}{i < words.length - 1 ? ' ' : ''}
        </Box>
      ))}
    </Box>
  );
}
