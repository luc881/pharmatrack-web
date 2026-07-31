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

export function OdLayout({ children, subscribe = true }) {
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'hidden' }}>
      <OdHeader />
      <Box component="main">{children}</Box>
      {subscribe && <OdSubscribe />}
      <OdFooter />
      <CloseCursor />
    </Box>
  );
}
