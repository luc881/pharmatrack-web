'use client';

import Box from '@mui/material/Box';

import { OdScene } from './od-scene';

// ----------------------------------------------------------------------
// Divisor 3D de las vistas interiores (no el home): marquesina de avisos, la
// mesa de frascos (stack-scene) sobre una foto de naturaleza, y otra marquesina
// inversa. Degrada a imagen de respaldo en móvil / motion reducido.
// ----------------------------------------------------------------------

const TICKER = ['Nueva camada — Cubaris Rubber Ducky', 'Entrega en persona en CDMX', 'Camada de julio disponible', 'Apartas con el 50%'];

function Ticker({ reverse = false }) {
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER];
  return (
    <Box data-dark="1" sx={{ bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-200)', py: '11px', overflow: 'hidden' }}>
      <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontSize: 13, letterSpacing: '0.05em', animation: `${reverse ? 'odMarqueeR' : 'odMarquee'} 52s linear infinite` }}>
        {items.map((t, i) => (
          <Box component="span" key={i} sx={{ px: '40px' }}>
            {t}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function OdDivider3d() {
  return (
    <>
      <Ticker />
      <Box component="section" data-dark="1" sx={{ position: 'relative', display: 'grid', placeItems: 'center', px: '40px', py: { xs: '64px', md: '96px' }, overflow: 'hidden', isolation: 'isolate' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -2, backgroundImage: 'url(/assets/redesign/moss-forest-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, bgcolor: 'rgba(32,31,29,0.22)' }} />
        <Box sx={{ display: 'grid', gap: '26px', justifyItems: 'center' }}>
          <OdScene
            scene="stack"
            fallbackSrc="/assets/redesign/terrarium.jpg"
            fallbackLabel="Cultivos por especie"
            ratio="1 / 1"
            sx={{ width: 'min(460px, 74vw)' }}
          />
          <Box sx={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-neutral-100)' }}>
            Opuntia Den · Cultivos por especie
          </Box>
        </Box>
      </Box>
      <Ticker reverse />
    </>
  );
}
