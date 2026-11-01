'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Fondo de «Todo para tu terrario» mientras se elige. Opciones: degradados
// Musgo de Feral (public/brand/degradados/*.jpg) que derivan lento, o las
// manchas en movimiento (.od-musgo-flow). Con ?fondo-terrario en la URL
// aparece un botón para recorrerlas; sin él se ve FONDO_ELEGIDO.
// ponytail: al elegir, dejar solo la opción elegida y borrar el selector.
// ----------------------------------------------------------------------

const OPCIONES = [
  { id: 'movimiento', nombre: 'Musgo en movimiento (actual)', flow: true },
  { id: 'ondas', nombre: 'Ondas', img: 'cierre-ondas.jpg', velo: 0.3 },
  { id: 'amanecer', nombre: 'Amanecer', img: 'cierre-amanecer.jpg', velo: 0.3 },
  { id: 'fluido', nombre: 'Fluido', img: 'cierre-fluido.jpg', velo: 0.35 },
  { id: 'formas', nombre: 'Formas', img: 'cierre-formas.jpg', velo: 0.3 },
  { id: 'columnas', nombre: 'Columnas', img: 'cierre-columnas.jpg' },
  { id: 'niebla', nombre: 'Niebla', img: 'cierre-niebla.jpg' },
  { id: 'aurora', nombre: 'Aurora', img: 'aurora-musgo.jpg' },
  { id: 'prisma', nombre: 'Prisma', img: 'cierre-prisma.jpg' },
];

const FONDO_ELEGIDO = 'movimiento';

export function OdFondoTerrario() {
  const [i, setI] = useState(() => OPCIONES.findIndex((o) => o.id === FONDO_ELEGIDO));
  const [probando, setProbando] = useState(false);

  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('fondo-terrario'));
  }, []);

  const o = OPCIONES[i];

  return (
    <>
      {o.flow ? (
        <Box aria-hidden className="od-musgo-flow">
          <span />
          <span />
          <span />
        </Box>
      ) : (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden' }}>
          {/* la imagen deriva lento (.od-fondo-drift); el velo oscurece las claras */}
          <Box
            key={o.id}
            className="od-fondo-drift"
            sx={{
              position: 'absolute',
              inset: '-8%',
              backgroundImage: `linear-gradient(rgba(22,27,25,${o.velo ?? 0}), rgba(22,27,25,${o.velo ?? 0})), url(/brand/degradados/${o.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Box>
      )}

      {probando && (
        <Box
          component="button"
          type="button"
          onClick={() => setI((n) => (n + 1) % OPCIONES.length)}
          sx={{ position: 'fixed', left: 20, bottom: 20, zIndex: 1500, px: 2.5, py: 1.5, border: 0, borderRadius: '999px', font: 'inherit', fontSize: 14, cursor: 'pointer', bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
        >
          Fondo del terrario: {o.nombre} ({i + 1}/{OPCIONES.length}) · Siguiente →
        </Box>
      )}
    </>
  );
}
