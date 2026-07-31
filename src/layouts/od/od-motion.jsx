'use client';

import { m, useReducedMotion } from 'framer-motion';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Animaciones suaves del rediseño (estilo editorial luminaire): fade + leve
// desplazamiento hacia arriba. OdReveal se dispara al entrar en viewport;
// OdFadeIn al montar (para el hero). Respetan prefers-reduced-motion.
// ----------------------------------------------------------------------

const EASE = [0.22, 1, 0.36, 1];

export function OdReveal({ children, y = 26, delay = 0, duration = 0.85, once = true, sx, ...other }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Box sx={sx} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration, ease: EASE, delay }}
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  );
}

// Fade-in "al cargar" del hero. Usa whileInView (no `animate`): con LazyMotion
// asíncrono el `animate` de montaje no dispara, pero whileInView sí en cuanto el
// observer arranca — y como el hero está en viewport, se revela de inmediato.
export function OdFadeIn({ children, y = 20, delay = 0, duration = 1, sx, ...other }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Box sx={sx} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration, ease: EASE, delay }}
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  );
}
