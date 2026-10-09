'use client';

import { useRef, useState, useEffect } from 'react';
import { m, animate, useInView, useReducedMotion } from 'framer-motion';

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

// Número que cuenta desde 0 cuando entra en pantalla. En el HTML del servidor
// va el valor final (sin JS o con movimiento reducido se queda así); al montar,
// si todavía no se ve, se pone en 0 para contar después.
export function OdCountUp({ value, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);

  useEffect(() => {
    if (!reduce && !inView) setN(0);
    // ponytail: solo al montar; el conteo lo dispara el efecto de abajo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, value, { duration, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return <span ref={ref}>{n}</span>;
}
