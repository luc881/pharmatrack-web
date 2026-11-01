'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Fondo del cierre del home. Mientras se elige, hay varias opciones (Feral,
// paleta Musgo, en public/brand/degradados/cierre-*.jpg, más el degradado en
// movimiento de «Todo para tu terrario»). Con ?fondo-cierre en la URL aparece
// un botón para recorrerlas; sin él se ve FONDO_ELEGIDO.
// ponytail: al elegir, dejar solo la opción elegida y borrar el selector.
// ----------------------------------------------------------------------

const OPCIONES = [
  { id: 'prisma', nombre: 'Prisma (actual)', img: 'cierre-prisma.jpg', pos: 'center 40%' },
  { id: 'ondas', nombre: 'Ondas', img: 'cierre-ondas.jpg', velo: 0.3 },
  { id: 'amanecer', nombre: 'Amanecer', img: 'cierre-amanecer.jpg', velo: 0.3 },
  { id: 'fluido', nombre: 'Fluido', img: 'cierre-fluido.jpg', velo: 0.35 },
  { id: 'formas', nombre: 'Formas', img: 'cierre-formas.jpg', velo: 0.3 },
  { id: 'columnas', nombre: 'Columnas', img: 'cierre-columnas.jpg' },
  { id: 'niebla', nombre: 'Niebla', img: 'cierre-niebla.jpg' },
  { id: 'aurora', nombre: 'Aurora (la de la banda de cifras)', img: 'aurora-musgo.jpg' },
  { id: 'movimiento', nombre: 'Musgo en movimiento', flow: true },
];

const FONDO_ELEGIDO = 'prisma';

export function OdCierreFondo() {
  const [i, setI] = useState(() => OPCIONES.findIndex((o) => o.id === FONDO_ELEGIDO));
  const [probando, setProbando] = useState(false);

  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('fondo-cierre'));
  }, []);

  const o = OPCIONES[i];

  return (
    <>
      {o.flow ? (
        <Box aria-hidden className="od-musgo-flow" sx={{ zIndex: -1 }}>
          <span />
          <span />
          <span />
        </Box>
      ) : (
        // velo: oscurece las opciones claras para que el texto blanco se lea
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            backgroundImage: `linear-gradient(rgba(22,27,25,${o.velo ?? 0}), rgba(22,27,25,${o.velo ?? 0})), url(/brand/degradados/${o.img})`,
            backgroundSize: 'cover',
            backgroundPosition: o.pos ?? 'center',
          }}
        />
      )}

      {probando && (
        <Box
          component="button"
          type="button"
          onClick={() => setI((n) => (n + 1) % OPCIONES.length)}
          sx={{ position: 'fixed', left: 20, bottom: 20, zIndex: 1500, px: 2.5, py: 1.5, border: 0, borderRadius: '999px', font: 'inherit', fontSize: 14, cursor: 'pointer', bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
        >
          Fondo del cierre: {o.nombre} ({i + 1}/{OPCIONES.length}) · Siguiente →
        </Box>
      )}
    </>
  );
}
