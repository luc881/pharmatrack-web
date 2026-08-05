import Box from '@mui/material/Box';

import { OdPageHead } from 'src/layouts/od/od-ui';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Envíos y entregas',
  description:
    'Cómo llega tu pedido: entrega en persona en CDMX sin costo o envío exprés en caja térmica al resto del país.',
};

const ZONES = [
  { zone: 'CDMX', mode: 'Entrega en persona', time: '1 – 3 días', cost: 'Sin costo' },
  { zone: 'Área metropolitana', mode: 'Mensajería local', time: 'Mismo día', cost: '$120 MXN' },
  { zone: 'Resto del país', mode: 'Exprés con caja térmica', time: '24 – 48 h', cost: '$380 MXN' },
];

const POINTS = [
  {
    title: 'Días de salida',
    body: 'Solo lunes y martes, para que ningún paquete pase el fin de semana en tránsito.',
  },
  {
    title: 'Empaque',
    body: 'Vaso ventilado con sustrato húmedo y hojarasca, dentro de caja térmica con gel a temperatura ambiente.',
  },
  {
    title: 'Garantía de llegada con vida',
    body: 'Mándanos fotos dentro de las primeras 24 horas y reponemos los individuos afectados sin costo.',
  },
];

const cellSx = { px: 2, py: 1.75, borderBottom: '1px solid var(--color-divider)', fontSize: 15 };
const numSx = { ...cellSx, fontVariantNumeric: 'tabular-nums' };

export default function Page() {
  return (
    <OdLayout offsetTop>
      <OdPageHead
        kicker="Envíos y entregas"
        title="Cómo llega tu pedido"
        intro="Los invertebrados viajan mal con calor y con demora. Por eso solo salen a inicio de semana y en caja térmica, o se entregan en persona el mismo día."
        introWidth="60ch"
      />

      <OdReveal>
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 5, md: 7 } }}>
          <Box sx={{ maxWidth: 1180, overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', textAlign: 'left' }}>
              <Box component="thead">
                <Box component="tr">
                  {['Zona', 'Modo', 'Tiempo', 'Costo'].map((h) => (
                    <Box
                      key={h}
                      component="th"
                      scope="col"
                      sx={{
                        px: 2,
                        py: 1.25,
                        borderBottom: '1px solid var(--color-text)',
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-neutral-600)',
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {ZONES.map((z) => (
                  <Box component="tr" key={z.zone}>
                    <Box component="th" scope="row" sx={{ ...cellSx, fontWeight: 500 }}>
                      {z.zone}
                    </Box>
                    <Box component="td" sx={cellSx}>
                      {z.mode}
                    </Box>
                    <Box component="td" sx={numSx}>
                      {z.time}
                    </Box>
                    <Box component="td" sx={numSx}>
                      {z.cost}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </OdReveal>

      <OdReveal>
        <Box
          component="section"
          sx={{
            px: { xs: '18px', md: '40px' },
            pt: { xs: 7, md: 8 },
            pb: { xs: 10, md: 15 },
            display: 'grid',
            gap: '40px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          }}
        >
          {POINTS.map((p) => (
            <Box key={p.title}>
              <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 26 }}>
                {p.title}
              </Box>
              <Box sx={{ mt: 1.25, fontSize: 16, lineHeight: 1.8, color: 'var(--color-neutral-700)', textWrap: 'pretty' }}>
                {p.body}
              </Box>
            </Box>
          ))}
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
