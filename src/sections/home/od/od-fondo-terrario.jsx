import Box from '@mui/material/Box';

import { OdFlowGradient } from 'src/layouts/od/od-flow-gradient';

// ----------------------------------------------------------------------
// Fondo de «Todo para tu terrario»: el flow claro animado (OdFlowGradient)
// con grano notorio encima. El título va en un recuadro de cristal lechoso
// (elegido entre varias pruebas; estilos en la sección, od-home-view).
// ----------------------------------------------------------------------

const CLARO = ['#173E36', '#247465', '#55B895', '#ACDDB5', '#E5F1CD'];

export function OdFondoTerrario() {
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1 }}>
      <OdFlowGradient colors={CLARO} />
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'var(--od-noise)', backgroundSize: '140px', opacity: 1, mixBlendMode: 'overlay' }} />
    </Box>
  );
}
