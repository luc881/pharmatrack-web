'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Portada de carga del sitio público: el sello grande dentro de un anillo de
// rayitas (como el del propio sello) que se va llenando en un tiempo fijo, con
// un punto tuna en la punta. Al terminar, la capa se desvanece y el sello
// crece un poco, como si la página saliera de él.
//
//  - Todo es CSS con duraciones fijas: aunque el JS tarde o falle, la capa se
//    llena y se va sola (el HTML llega del servidor con ella encima).
//  - El JS solo evita que se repita: una vez por sesión, y se desmonta al
//    terminar la animación de salida.
//  - Con "reducir movimiento" el anillo se sigue llenando (informa), pero sin
//    escalas ni giros.
// ----------------------------------------------------------------------

const KEY = 'splash-shown';
const FILL_MS = 2400; // lo que tarda en llenarse el anillo
const EXIT_MS = 700; // desvanecido final

// 2πr con r = 46 (viewBox de 100)
const C = 2 * Math.PI * 46;
const EASE = 'cubic-bezier(0.45, 0, 0.2, 1)';
// 120 rayitas exactas alrededor del círculo (sin costura donde cierra)
const STEP = C / 120;
const TICKS = `${(STEP * 0.26).toFixed(3)} ${(STEP * 0.74).toFixed(3)}`;

const fill = keyframes`
  from { stroke-dashoffset: ${C}; }
  to { stroke-dashoffset: 0; }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const enter = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;
const leave = keyframes`
  to { opacity: 0; visibility: hidden; }
`;
const grow = keyframes`
  to { transform: scale(1.06); }
`;
const show = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export function SiteSplash() {
  const [skip, setSkip] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) setSkip(true);
    else sessionStorage.setItem(KEY, '1');
  }, []);

  if (skip || gone) return null;

  return (
    <Box
      aria-hidden
      onAnimationEnd={(e) => {
        // solo la animación de salida de la propia capa, no las de sus hijos
        if (e.target === e.currentTarget) setGone(true);
      }}
      sx={{
        inset: 0,
        zIndex: 9998,
        position: 'fixed',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'var(--od-crema)',
        animation: `${leave} ${EXIT_MS}ms ease-out ${FILL_MS + 150}ms forwards`,
      }}
    >
      <Box sx={{ display: 'grid', justifyItems: 'center', gap: { xs: '22px', md: '28px' } }}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: 240, md: 320 },
            aspectRatio: '1',
            animation: `${enter} 600ms ${EASE} both, ${grow} ${EXIT_MS}ms ease-in ${FILL_MS + 150}ms forwards`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          {/* Anillo: rayitas claras de fondo + las mismas en tinta, descubiertas
              por una máscara que avanza en sentido horario desde arriba */}
          <Box component="svg" viewBox="0 0 100 100" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, overflow: 'visible' }}>
            <defs>
              <mask id="od-splash-progress">
                <Box
                  component="circle"
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="8"
                  transform="rotate(-90 50 50)"
                  strokeDasharray={C}
                  sx={{ strokeDashoffset: C, animation: `${fill} ${FILL_MS}ms ${EASE} 200ms forwards` }}
                />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--od-linea)" strokeWidth="3.2" strokeDasharray={TICKS} />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--od-tinta)" strokeWidth="3.2" strokeDasharray={TICKS} mask="url(#od-splash-progress)" />
            <circle cx="50" cy="50" r="49.4" fill="none" stroke="var(--od-tinta)" strokeWidth="0.6" opacity="0.35" />
            {/* Punto tuna en la punta del avance: gira con la misma curva */}
            <Box
              component="g"
              sx={{
                transformOrigin: '50px 50px',
                transformBox: 'view-box',
                animation: `${spin} ${FILL_MS}ms ${EASE} 200ms both`,
              }}
            >
              <circle cx="50" cy="4" r="1.9" fill="var(--od-tuna)" />
            </Box>
          </Box>

          {/* Sello al centro */}
          <Box
            component="img"
            src="/brand/assets/logo/sello-claro.svg"
            alt=""
            sx={{ position: 'absolute', inset: '10%', width: '80%', height: '80%' }}
          />
        </Box>

        <Box
          sx={{
            fontSize: 11,
            letterSpacing: 'var(--od-tracking-label)',
            textTransform: 'uppercase',
            color: 'var(--od-gris)',
            animation: `${show} 600ms ease 400ms both`,
          }}
        >
          Vida en miniatura
        </Box>
      </Box>
    </Box>
  );
}
