import Box from '@mui/material/Box';

import { CloseCursor } from 'src/layouts/components/close-cursor';

import { OdHeader } from './od-header';
import { OdFooter } from './od-footer';
import { OdSubscribe } from './od-subscribe';

// ----------------------------------------------------------------------
// Shell del rediseño editorial. Envuelve cada pantalla nueva con la barra
// flotante, la suscripción y el pie compartidos. La barra es fija, así que el
// contenido empieza pegado arriba (el hero a pantalla completa queda debajo).
// ----------------------------------------------------------------------

export function OdLayout({ children, subscribe = true, offsetTop = false }) {
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'hidden' }}>
      <OdHeader />
      {/* En el home el hero (100vh) va debajo de la barra fija; las demás
          pantallas empiezan pegadas arriba, así que se compensa su alto.
          ponytail: alto aproximado del marquee + píldora; ajustar si cambian */}
      <Box component="main" sx={offsetTop ? { pt: { xs: '100px', md: '118px' } } : undefined}>
        {children}
      </Box>
      {subscribe && <OdSubscribe />}
      <OdFooter />
      <CloseCursor />
    </Box>
  );
}
