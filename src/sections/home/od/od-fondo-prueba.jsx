'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { OdFlowGradient } from 'src/layouts/od/od-flow-gradient';

// ----------------------------------------------------------------------
// Fondo de «Todo para tu terrario»: el flow claro animado (OdFlowGradient)
// con grano notorio. El título va centrado en un recuadro de cristal del ancho
// de la tarjeta; mientras se elige hay tres variantes (oscuro, claro, lechoso). Con ?fondo-terrario en la URL aparece un
// botón para recorrerlas; sin él se ve FONDO_ELEGIDO.
// ponytail: al elegir, dejar solo la variante elegida y borrar el selector.
// ----------------------------------------------------------------------

const CLARO = ['#173E36', '#247465', '#55B895', '#ACDDB5', '#E5F1CD'];
const OPCIONES = [
  { id: 'oscuro', nombre: 'Cristal oscuro', titulo: 'oscuro' },
  { id: 'claro', nombre: 'Cristal claro con borde', titulo: 'claro' },
  { id: 'lechoso', nombre: 'Cristal lechoso, letras oscuras', titulo: 'lechoso' },
];

const FONDO_ELEGIDO = 'oscuro';

export function OdFondoTerrario() {
  const [i, setI] = useState(() => OPCIONES.findIndex((o) => o.id === FONDO_ELEGIDO));
  const [probando, setProbando] = useState(false);

  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('fondo-terrario'));
  }, []);

  const o = OPCIONES[i];

  // el título vive en la sección: se marca en ella
  useEffect(() => {
    const sec = document.querySelector('[data-terr-section]');
    if (sec) sec.dataset.titulo = o.titulo;
  }, [o.titulo]);

  return (
    <>
      <Box aria-hidden className="od-terr-bg" sx={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <OdFlowGradient colors={CLARO} />
        {/* grano notorio encima de la animación (elegido) */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'var(--od-noise)', backgroundSize: '140px', opacity: 1, mixBlendMode: 'overlay' }} />
      </Box>

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
