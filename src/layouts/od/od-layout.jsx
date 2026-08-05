import Box from '@mui/material/Box';

import { CloseCursor } from 'src/layouts/components/close-cursor';

import { OdHeader } from './od-header';
import { OdFooter } from './od-footer';
import { OdTopbar } from './od-topbar';
import { OdTabBar } from './od-tab-bar';
import { OdDivider3d } from './od-divider-3d';

// ----------------------------------------------------------------------
// Shell del rediseño editorial. Envuelve cada pantalla nueva con la barra
// flotante y el pie (que incluye la suscripción). La barra es fija, así que el
// contenido empieza pegado arriba (el hero a pantalla completa queda debajo).
// `overflowX: clip` (no `hidden`) evita el scroll horizontal SIN romper
// position: sticky de las barras laterales interiores.
// ----------------------------------------------------------------------

// `subscribe` y `offsetTop` se aceptan por compatibilidad con las páginas pero
// ya no gobiernan nada: la barra flotante siempre aparece al hacer scroll, y el
// tope lo da el masthead (home) o la barra estática OdTopbar (interiores).
// `divider3d` muestra el divisor 3D (mesa de frascos) antes del pie; se apaga
// en flujos utilitarios como el carrito.
// `hideTabBar` oculta la barra inferior de pestañas en móvil (la ficha pone su
// propia barra de "Añadir" en su lugar).
export function OdLayout({ children, homeMasthead = false, divider3d = true, hideTabBar = false }) {
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'clip', pb: { xs: '66px', md: 0 } }}>
      {/* La barra flotante arranca oculta y aparece al bajar en todas las vistas.
          El pb del contenedor reserva 66px abajo en móvil por la barra de pestañas. */}
      <OdHeader revealOnScroll />
      {!homeMasthead && <OdTopbar />}
      <Box component="main">{children}</Box>
      {!homeMasthead && divider3d && <OdDivider3d />}
      <OdFooter />
      {!hideTabBar && <OdTabBar />}
      <CloseCursor />
    </Box>
  );
}
