import Box from '@mui/material/Box';

import { Star } from './od-ui';

// ----------------------------------------------------------------------
// Notas al margen para pantallas anchas (2K/4K). El contenido se queda en
// --od-max y los costados quedaban vacíos; aquí van como en un libro impreso:
// a la izquierda el número y nombre de la sección, a la derecha el folio de la
// marca. Ambos quedan pegados (sticky) mientras la sección está en pantalla.
// Solo aparecen cuando el margen mide más de ~120px (≥ 1680px de ancho).
// La sección que lo use necesita `position: relative`. `width` y `minScreen`
// sirven para páginas con su propio ancho de contenido (el catálogo). `start` baja la nota
// cuando la sección abre con algo a todo lo ancho (marquesina, titular gigante).
// ----------------------------------------------------------------------

const vertical = {
  writingMode: 'vertical-rl',
  fontSize: 12,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

export function OdGutterNote({ n, label, dark = false, start = 80, width = 'var(--od-gutter)', minScreen = 1680, folio = 'Opuntia Den — Criadero en CDMX' }) {
  const tone = dark ? 'var(--color-neutral-500)' : 'var(--color-neutral-600)';
  const line = dark ? 'rgba(240,235,224,0.22)' : 'var(--color-divider)';

  const side = (pos) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [pos]: 0,
    width,
    display: 'none',
    justifyContent: 'center',
    pointerEvents: 'none',
    [`@media (min-width: ${minScreen}px)`]: { display: 'flex' },
  });

  const sticky = {
    position: 'sticky',
    top: '28vh',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mt: `${start}px`,
    mb: '80px',
    color: tone,
  };

  return (
    <>
      <Box aria-hidden sx={side('left')}>
        <Box sx={sticky}>
          <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 46, lineHeight: 1, color: dark ? 'var(--color-neutral-300)' : 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
            {n}
          </Box>
          <Box sx={{ width: '1px', height: 110, bgcolor: line, transformOrigin: 'top', animation: 'odGrowY linear both', animationTimeline: 'view()', animationRange: 'entry 10% cover 40%' }} />
          <Box sx={{ ...vertical, transform: 'rotate(180deg)' }}>{label}</Box>
        </Box>
      </Box>
      <Box aria-hidden sx={side('right')}>
        <Box sx={sticky}>
          <Star sx={{ width: 12, height: 12 }} />
          <Box sx={{ width: '1px', height: 110, bgcolor: line }} />
          <Box sx={vertical}>{folio}</Box>
        </Box>
      </Box>
    </>
  );
}
