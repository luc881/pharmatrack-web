'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { Pill, Display } from 'src/layouts/od/od-ui';

// ----------------------------------------------------------------------
// 404 en la paleta neutra (lo que no existe o no está disponible), sobre el
// degradado neutro de Feral (public/brand/degradados/neutro.jpg). Sin la
// ilustración genérica de la plantilla.
// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <Box component="section" sx={{ px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          borderRadius: '6px',
          overflow: 'hidden',
          bgcolor: 'var(--od-neutro-500)',
          backgroundImage: 'url(/brand/degradados/neutro.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'var(--od-neutro-900)',
          px: { xs: 3, md: 8 },
          py: { xs: 9, md: 14 },
        }}
      >
        <Box sx={{ fontSize: 15 }}>Error 404</Box>
        <Display component="h1" size="clamp(40px, 6vw, 84px)" weight={400} sx={{ mt: 1.5, lineHeight: 1.04, maxWidth: '14ch' }}>
          Esta página no existe
        </Display>
        <Box component="p" sx={{ mt: 2.5, mb: 0, maxWidth: '44ch', fontSize: 18, lineHeight: 1.6 }}>
          Quizá cambió de dirección o se escribió mal. El catálogo y las fichas de cuidados siguen aquí.
        </Box>
        <Box sx={{ mt: 4, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Pill href={paths.root}>Volver al inicio</Pill>
          <Pill variant="light" href={paths.catalog}>
            Ver catálogo
          </Pill>
        </Box>
      </Box>
    </Box>
  );
}
