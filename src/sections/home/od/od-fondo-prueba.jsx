'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { OdFlowGradient } from 'src/layouts/od/od-flow-gradient';

// ----------------------------------------------------------------------
// Fondo de «Todo para tu terrario» mientras se elige. Opciones: el flow
// animado (OdFlowGradient, WebGL), las manchas en movimiento (.od-musgo-flow)
// o degradados de Feral (public/brand/degradados/*.jpg) que derivan lento. Con ?fondo-terrario en la URL
// aparece un botón para recorrerlas; sin él se ve FONDO_ELEGIDO.
// ponytail: al elegir, dejar solo la opción elegida y borrar el selector.
// ----------------------------------------------------------------------

// texto: cómo se lee el título sobre el flow claro (opciones de taste-skill:
// velo neutro solo bajo el texto, tinta oscura, tarjeta sólida del color
// de la página que lo lleva, o franja opaca; la de cristal la pidió el
// usuario aunque taste desaconseja el vidrio esmerilado)
const CLARO = ['#173E36', '#247465', '#55B895', '#ACDDB5', '#E5F1CD'];
const OPCIONES = [
  { id: 'flow', nombre: 'Flow musgo', flow: ['#0f2420', '#173E36', '#247465', '#55B895', '#ACDDB5'] },
  { id: 'flow-hondo', nombre: 'Flow musgo hondo', flow: ['#101714', '#132b25', '#173E36', '#247465', '#3f9a7f'] },
  { id: 'flow-claro', nombre: 'Flow claro · velo parejo 30%', flow: CLARO, velo: 0.3 },
  { id: 'flow-claro-arriba', nombre: 'Flow claro · velo solo bajo el título', flow: CLARO, arriba: true },
  { id: 'flow-claro-tinta', nombre: 'Flow claro · título en tinta oscura', flow: CLARO, texto: 'tinta' },
  { id: 'flow-claro-pastilla', nombre: 'Flow claro · título en tarjeta clara', flow: CLARO, texto: 'pastilla' },
  { id: 'flow-claro-cristal', nombre: 'Flow claro · franja de cristal', flow: CLARO, texto: 'cristal' },
  { id: 'flow-claro-franja', nombre: 'Flow claro · franja opaca (taste)', flow: CLARO, texto: 'franja' },
  { id: 'movimiento', nombre: 'Manchas en movimiento (actual)', manchas: true },
  { id: 'fluido', nombre: 'Fluido (estática 4)', img: 'cierre-fluido.jpg', velo: 0.35 },
  { id: 'prisma', nombre: 'Prisma (estática 9)', img: 'cierre-prisma.jpg' },
];

const FONDO_ELEGIDO = 'movimiento';

export function OdFondoTerrario() {
  const [i, setI] = useState(() => OPCIONES.findIndex((o) => o.id === FONDO_ELEGIDO));
  const [probando, setProbando] = useState(false);

  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('fondo-terrario'));
  }, []);

  const o = OPCIONES[i];

  useEffect(() => {
    const sec = document.querySelector('[data-terr-section]');
    if (!sec) return;
    if (o.texto) sec.dataset.texto = o.texto;
    else delete sec.dataset.texto;
  }, [o.texto]);

  return (
    <>
      {o.flow && (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <OdFlowGradient key={o.id} colors={o.flow} />
          {o.velo && <Box sx={{ position: 'absolute', inset: 0, bgcolor: `rgba(22,27,25,${o.velo})` }} />}
          {/* velo neutro que se desvanece: solo bajo el título */}
          {o.arriba && <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(22,27,25,0.55) 0%, rgba(22,27,25,0.35) 18%, rgba(22,27,25,0) 34%)' }} />}
        </Box>
      )}
      {o.manchas && (
        <Box aria-hidden className="od-musgo-flow">
          <span />
          <span />
          <span />
        </Box>
      )}
      {o.img && (
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
