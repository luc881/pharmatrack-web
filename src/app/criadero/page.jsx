import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { OdScene } from 'src/layouts/od/od-scene';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';
import { Pill, OdImage, OdPageHead } from 'src/layouts/od/od-ui';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'El criadero',
  description:
    'Criamos invertebrados en la Ciudad de México desde 2019: colonias con registro propio, nunca capturados.',
};

const PHOTOS = [
  { src: '/assets/redesign/terrarium.jpg', label: 'Estantería de colonias' },
  { src: '/assets/redesign/moss-forest-1.jpg', label: 'Montaje de un frasco' },
  { src: '/assets/redesign/leaf-litter.jpg', label: 'Hojarasca curada' },
];

const STATS = [
  { n: '38', label: 'colonias activas con registro propio' },
  { n: '14', label: 'especies disponibles todo el año' },
  { n: '100%', label: 'nacidos en casa, nunca capturados' },
  { n: '72 h', label: 'de apartado mientras coordinamos' },
];

export default function Page() {
  return (
    <OdLayout offsetTop>
      <OdPageHead
        kicker="El criadero"
        title="Criamos invertebrados en la Ciudad de México desde 2019."
        intro="Opuntia Den empezó como cuatro frascos en una repisa. Hoy son 38 colonias con registro individual de temperatura, humedad y camadas. Todo lo que vendemos nació aquí: no revendemos importaciones ni ejemplares capturados."
      />

      <OdReveal>
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            }}
          >
            {PHOTOS.map((p) => (
              <OdImage key={p.label} src={p.src} alt={p.label} ratio="4 / 5" radius={0} />
            ))}
          </Box>
        </Box>
      </OdReveal>

      <OdReveal>
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 7, md: 9 }, display: 'grid', gap: { xs: 4, md: '48px' }, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.8fr) minmax(0, 1fr)' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <OdScene
              scene="log"
              fallbackSrc="/assets/redesign/moss-forest-1.jpg"
              fallbackLabel="Tronco con musgo del taller"
              ratio="4 / 5"
              sx={{ maxWidth: 420 }}
            />
          </Box>
          <Box>
            <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(28px, 3.4vw, 48px)', lineHeight: 1.12 }}>
              Corteza, musgo y hojarasca: el mismo montaje que va en cada frasco.
            </Box>
            <Box sx={{ mt: 2.5, maxWidth: '52ch', fontSize: 16, lineHeight: 1.8, color: 'var(--color-neutral-700)', textWrap: 'pretty' }}>
              Reproducimos el suelo de bosque en miniatura —madera blanda en descomposición, colonias
              de musgo y hoja curada— para que las colonias tengan refugio, humedad y comida sin
              intervención diaria.
            </Box>
          </Box>
        </Box>
      </OdReveal>

      <OdReveal>
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 7, md: 9 }, pb: { xs: 10, md: 15 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: '40px',
              pt: 5,
              borderTop: '1px solid var(--color-divider)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            }}
          >
            {STATS.map((s) => (
              <Box key={s.label}>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 44, fontVariantNumeric: 'tabular-nums' }}>
                  {s.n}
                </Box>
                <Box sx={{ mt: 0.75, fontSize: 14, color: 'var(--color-neutral-700)' }}>{s.label}</Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: { xs: 6, md: 8 }, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Pill href={paths.catalog}>Ver el catálogo</Pill>
            <Pill variant="light" href={paths.shipping} sx={{ border: '1px solid var(--color-divider)' }}>
              Cómo es la entrega
            </Pill>
          </Box>
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
