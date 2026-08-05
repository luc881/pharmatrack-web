import Box from '@mui/material/Box';

import { CloseCursor } from 'src/layouts/components/close-cursor';

import { OdHeader } from './od-header';
import { OdFooter } from './od-footer';
import { OdTabBar } from './od-tab-bar';

// ----------------------------------------------------------------------
// Shell del rediseño editorial. Envuelve cada pantalla nueva con la barra
// flotante y el pie (que incluye la suscripción). La barra es fija, así que el
// contenido empieza pegado arriba (el hero a pantalla completa queda debajo).
// `overflowX: clip` (no `hidden`) evita el scroll horizontal SIN romper
// position: sticky de las barras laterales interiores.
// ----------------------------------------------------------------------

export function OdLayout({ children, subscribe = true, offsetTop = false }) {
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'clip', pb: { xs: '66px', md: 0 } }}>
      <OdHeader />
      {/* En el home el hero (100vh) va debajo de la barra fija; las demás
          pantallas empiezan pegadas arriba, así que se compensa su alto.
          ponytail: alto aproximado del marquee + píldora; ajustar si cambian.
          El pb del contenedor reserva 66px abajo en móvil por la barra de pestañas. */}
      <Box component="main" sx={offsetTop ? { pt: { xs: '100px', md: '118px' } } : undefined}>
        {children}
      </Box>
      <OdFooter newsletter={subscribe} />
      <OdTabBar />
      <CloseCursor />
    </Box>
  );
}
