'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Cuenta regresiva del próximo evento: días, horas, minutos y segundos.
// Solo en el cliente (en el servidor la hora sería otra y no coincidiría al
// hidratar); hasta montar reserva el alto para que la página no salte.
// ----------------------------------------------------------------------

const UNITS = [
  ['Días', 86400],
  ['Horas', 3600],
  ['Min', 60],
  ['Seg', 1],
];

export function OdCountdown({ target }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === 0) return null; // ya empezó: la tarjeta sigue, sin contador

  return (
    <Box role="timer" aria-label="Tiempo para el evento" sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 1, minHeight: 74 }}>
      {left !== null &&
        UNITS.map(([label, size], i) => {
          const value = i === 0 ? Math.floor(left / size) : Math.floor((left % UNITS[i - 1][1]) / size);
          return (
            <Box
              key={label}
              sx={{
                py: 1.25,
                textAlign: 'center',
                border: '1px solid var(--od-linea)',
                borderRadius: 'var(--od-radius-sm)',
                bgcolor: 'var(--od-crema)',
              }}
            >
              <Box sx={{ fontFamily: 'var(--od-font-display)', fontSize: 28, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {String(value).padStart(2, '0')}
              </Box>
              <Box className="od-label" sx={{ mt: 0.75, fontSize: 13 }}>
                {label}
              </Box>
            </Box>
          );
        })}
    </Box>
  );
}
