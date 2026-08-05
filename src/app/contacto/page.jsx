import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';
import { OdImage, OdPageHead } from 'src/layouts/od/od-ui';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Contacto',
  description: 'Escríbenos por WhatsApp y coordinamos la entrega en persona en la Ciudad de México.',
};

const WA = `https://wa.me/${CONFIG.whatsapp}`;
const EMAIL = 'opuntiaden@gmail.com';

const rowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '200px minmax(0, 1fr)' },
  gap: { xs: 0.75, sm: 2.5 },
  py: 2.75,
  borderBottom: '1px solid var(--color-divider)',
};
const labelSx = {
  m: 0,
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-600)',
};
const valueSx = { m: 0, fontSize: 17, color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } };

export default function Page() {
  return (
    <OdLayout offsetTop>
      <OdPageHead
        kicker="Contacto"
        title="Escríbenos y coordinamos la entrega"
        intro="Todo se coordina por WhatsApp: te decimos qué hay disponible esta semana y acordamos punto y hora. Respondemos el mismo día."
        introWidth="58ch"
      />

      <OdReveal>
        <Box
          component="section"
          sx={{
            px: { xs: '18px', md: '40px' },
            pt: { xs: 4, md: 5 },
            pb: { xs: 10, md: 15 },
            display: 'grid',
            gap: { xs: 5, md: '60px' },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(280px, 0.8fr)' },
          }}
        >
          <Box sx={{ borderTop: '1px solid var(--color-divider)' }}>
            <Box sx={rowSx}>
              <Box sx={labelSx}>WhatsApp</Box>
              <Link href={WA} target="_blank" rel="noopener" sx={valueSx}>
                Escríbenos por WhatsApp ↗
              </Link>
            </Box>
            <Box sx={rowSx}>
              <Box sx={labelSx}>Correo</Box>
              <Link href={`mailto:${EMAIL}`} sx={valueSx}>
                {EMAIL}
              </Link>
            </Box>
            <Box sx={rowSx}>
              <Box sx={labelSx}>Horario</Box>
              <Box sx={{ m: 0, fontSize: 17 }}>Lunes a sábado, 10:00 – 19:00 h</Box>
            </Box>
            <Box sx={rowSx}>
              <Box sx={labelSx}>Zona de entrega</Box>
              <Box>
                <Box sx={{ mb: 2, fontSize: 17 }}>
                  Roma, Condesa, Coyoacán, Del Valle y Centro. Otras alcaldías por acuerdo.
                </Box>
                <OdImage label="Mapa de zona de entrega" ratio="16 / 9" radius={0} sx={{ maxWidth: 460 }} />
              </Box>
            </Box>
            <Box sx={rowSx}>
              <Box sx={labelSx}>Redes</Box>
              <Link href="https://instagram.com/opuntiaden" target="_blank" rel="noopener" sx={valueSx}>
                @opuntiaden en Instagram
              </Link>
            </Box>
          </Box>

          <Box component="aside" sx={{ p: { xs: 3, md: '30px 32px' }, border: '1px solid var(--color-divider)', borderRadius: '16px' }}>
            <Box sx={{ mb: 1.25, fontFamily: 'var(--font-heading)', fontSize: 26, lineHeight: 1.2 }}>
              ¿Primera colonia?
            </Box>
            <Box sx={{ mb: 3, fontSize: 14, lineHeight: 1.7, color: 'var(--color-neutral-700)' }}>
              Dinos qué contenedor tienes y en qué clima vives; te decimos qué especie aguanta y qué
              necesitas comprar.
            </Box>
            <Box
              component="a"
              href={WA}
              target="_blank"
              rel="noopener"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                px: 4,
                width: 1,
                borderRadius: '999px',
                bgcolor: 'var(--color-neutral-900)',
                color: 'var(--color-neutral-100)',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'background 350ms',
                '&:hover': { bgcolor: 'var(--color-accent-700)' },
              }}
            >
              Abrir WhatsApp
            </Box>
            <Link
              component={RouterLink}
              href={paths.advisory}
              sx={{ display: 'block', mt: 1.75, textAlign: 'center', fontSize: 13, color: 'var(--color-accent-700)', textDecoration: 'none' }}
            >
              Ver asesoría guiada
            </Link>
          </Box>
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
