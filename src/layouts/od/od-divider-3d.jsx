'use client';

import Box from '@mui/material/Box';

import { FOTOS } from 'src/lib/fotos-ambiente';

import { OdScene } from './od-scene';
import { OdTicker } from './od-ticker';

// ----------------------------------------------------------------------
// Divisor 3D de las vistas interiores (no el home): marquesina de avisos, la
// mesa con una pecera y una roca (escena 'mesa', fondo negro) sobre una foto de naturaleza, y otra marquesina
// inversa. Degrada a imagen de respaldo en móvil / motion reducido.
// ----------------------------------------------------------------------

export function OdDivider3d({ media, ticker }) {
  return (
    <>
      <OdTicker items={ticker} />
      <Box component="section" data-dark="1" className="od-grain" sx={{ position: 'relative', display: 'grid', placeItems: 'center', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '96px' }, overflow: 'hidden', isolation: 'isolate' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -2, backgroundImage: `url(${FOTOS.corteza.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, bgcolor: 'rgba(32,31,29,0.22)' }} />
        <Box sx={{ display: 'grid', gap: '26px', justifyItems: 'center' }}>
          <OdScene
            scene="mesa"
            fallbackSrc={media.isopod_zebra}
            fallbackLabel="Mesa con una pecera y una roca"
            ratio="1 / 1"
            sx={{ width: 'min(460px, 74vw)' }}
          />
          <Box sx={{ fontSize: 13, color: 'var(--color-neutral-100)' }}>
            Opuntia Den · Pecera con roca
          </Box>
        </Box>
      </Box>
      <OdTicker items={ticker} reverse />
    </>
  );
}
