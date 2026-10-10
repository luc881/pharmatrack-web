import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';
import { Pill, OdPageHead } from 'src/layouts/od/od-ui';

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
    <OdLayout>
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
            px: { xs: '18px', md: 'var(--od-gutter)' },
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
              <Box sx={labelSx}>Entrega</Box>
              {/* Sin zona fija: el punto cambia (muchas veces una estación del
                  Metro), así que se acuerda en cada pedido */}
              <Box sx={{ m: 0, fontSize: 17 }}>
                Acordamos contigo el punto y la hora de entrega por WhatsApp, por lo general en
                alguna estación del Metro de la CDMX.
              </Box>
            </Box>
            <Box sx={rowSx}>
              <Box sx={labelSx}>Redes</Box>
              <Link href={CONFIG.instagram} target="_blank" rel="noopener" sx={valueSx}>
                {CONFIG.instagramHandle} en Instagram
              </Link>
            </Box>
          </Box>

          {/* Misma tarjeta que en Asesoría: foco tuna e inclinación al cursor */}
          <Box
            component="aside"
            data-fx
            className="od-glow od-tilt"
            sx={{ position: { md: 'sticky' }, top: { md: 130 }, p: { xs: 3, md: '36px 36px' }, border: '1px solid var(--color-divider)', bgcolor: 'var(--color-surface)', '--od-glow': 'rgba(168,69,92,0.16)' }}
          >
            <Box sx={{ mb: 1.25, fontFamily: 'var(--font-heading)', fontSize: 26, lineHeight: 1.2 }}>
              ¿Primera colonia?
            </Box>
            <Box sx={{ mb: 3, fontSize: 14, lineHeight: 1.7, color: 'var(--color-neutral-700)' }}>
              Dinos qué contenedor tienes y en qué clima vives; te decimos qué especie aguanta y qué
              necesitas comprar. La asesoría es completamente gratis.
            </Box>
            <Pill href={WA} target="_blank" rel="noopener" sx={{ width: 1, height: 52 }}>
              Abrir WhatsApp
            </Pill>
            {/* href simple: esta página es componente de servidor y no puede
                pasarle RouterLink (una función) al Link de MUI, que es de cliente */}
            <Link
              href={paths.advisory}
              className="od-link"
              sx={{ display: 'block', width: 'fit-content', mx: 'auto', mt: 2, fontSize: 13, color: 'var(--color-accent-700)', textDecoration: 'none' }}
            >
              Ver asesoría gratuita →
            </Link>
          </Box>
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
