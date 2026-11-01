import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { Pill } from 'src/layouts/od/od-ui';
import { OdTicker } from 'src/layouts/od/od-ticker';
import { MaskLines } from 'src/layouts/od/od-mask-lines';

import { OdCierreFondo } from './od-cierre-fondo';

// ----------------------------------------------------------------------
// Cierre del home (paso 5f): el degradado prisma musgo de Feral
// (public/brand/degradados/cierre-prisma.jpg), oscuro arriba donde va el
// texto y luminoso abajo. Cierra con color igual que la banda del criadero.
// Reemplaza a la suscripción, que no guardaba el correo.
// ----------------------------------------------------------------------

const WA_TEXT = 'Hola, tengo una duda antes de comprar.';

export function OdCierre({ ticker }) {
  return (
    <>
      <OdTicker items={ticker} />
      <Box
        component="section"
        data-dark="1"
        className="od-grain"
        sx={{
          // compacto y con el texto centrado en el alto (antes 82% de pantalla)
          minHeight: { xs: 440, md: 'clamp(420px, 52svh, 600px)' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: '18px', md: 'var(--od-gutter)' },
          py: { xs: '72px', md: '96px' },
          textAlign: 'center',
          color: 'var(--od-papel)',
          bgcolor: 'var(--od-noche)',
          overflow: 'clip',
        }}
      >
        <OdCierreFondo />
        <Box component="h2" sx={{ m: 0, mx: 'auto', maxWidth: '16ch', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(40px, 5.4vw, 84px)', lineHeight: 1.04 }}>
          <MaskLines>¿Dudas antes de comprar?</MaskLines>
        </Box>
        <Box component="p" sx={{ mt: 2.5, mb: 0, mx: 'auto', maxWidth: '44ch', fontSize: { xs: 16, md: 18 }, lineHeight: 1.6, opacity: 0.88 }}>
          Escríbenos por WhatsApp: te ayudamos a elegir tu primera colonia y a armar su terrario.
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Pill variant="light" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(WA_TEXT)}`} target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </Pill>
          <Pill variant="outline" href={paths.catalog}>
            Ver catálogo
          </Pill>
        </Box>
      </Box>
    </>
  );
}
