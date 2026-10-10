import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';
import { rowFillSx } from 'src/layouts/od/od-styles';
import { Pill, OdPageHead, OdRowGroup } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Asesoría',
  description:
    'Asesoría gratuita para elegir especie y revisar tu montaje antes de comprar. Sin costo y sin compromiso.',
};

const WA = `https://wa.me/${CONFIG.whatsapp}`;

const STEPS = [
  {
    n: '01',
    title: 'Antes de comprar',
    body: 'Qué especie aguanta tu clima y qué necesitas tener listo.',
  },
  {
    n: '02',
    title: 'Revisión de montaje',
    body: 'Nos mandas fotos del terrario y te decimos qué corregir.',
  },
  {
    n: '03',
    title: 'Problemas de colonia',
    body: 'Moho, ácaros, población que no crece: diagnóstico y plan de ajuste.',
  },
];

export default function Page() {
  return (
    <OdLayout>
      <OdPageHead
        kicker="Asesoría"
        title="Te ayudamos a montar el terrario antes de comprar el animal"
        intro="Una sesión gratuita por videollamada o WhatsApp: revisamos tu contenedor, el sustrato y la especie que te conviene según el clima de tu casa. Sin costo y sin compromiso."
        introWidth="60ch"
      />

      <OdReveal>
        <Box
          component="section"
          sx={{
            px: { xs: '18px', md: 'var(--od-gutter)' },
            pt: { xs: 5, md: 6 },
            pb: { xs: 10, md: 15 },
            display: 'grid',
            gap: { xs: 5, md: '60px' },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)' },
          }}
        >
          <OdRowGroup sx={{ borderTop: '1px solid var(--color-divider)' }}>
            {/* Cada tema abre WhatsApp: misma fila con relleno que el índice de
                categorías del home */}
            {STEPS.map((s) => (
              <Box
                key={s.title}
                component="a"
                href={WA}
                target="_blank"
                rel="noopener"
                data-fx
                data-row
                sx={{
                  ...rowFillSx,
                  display: 'grid',
                  gridTemplateColumns: { xs: '40px 1fr', md: '56px 1fr 48px' },
                  gap: { xs: 1.5, md: 3 },
                  alignItems: 'center',
                  py: 3,
                  px: { md: 3 },
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                <Box className="od-row-num" sx={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
                  {s.n}
                </Box>
                <Box>
                  <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>{s.title}</Box>
                  <Box className="od-row-meta" sx={{ mt: 0.75, fontSize: 16, lineHeight: 1.7, color: 'var(--color-neutral-700)', textWrap: 'pretty' }}>
                    {s.body}
                  </Box>
                </Box>
                <Box
                  className="od-row-arrow od-magnet"
                  sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center', width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--color-divider)' }}
                >
                  <Iconify icon="eva:arrow-forward-fill" width={18} />
                </Box>
              </Box>
            ))}
          </OdRowGroup>

          {/* Tarjeta de la asesoría (gratis): se inclina hacia el cursor y la ilumina un foco tuna */}
          <Box
            component="aside"
            data-fx
            className="od-glow od-tilt"
            sx={{ position: { md: 'sticky' }, top: { md: 130 }, p: { xs: 3, md: '36px 36px' }, border: '1px solid var(--color-divider)', bgcolor: 'var(--color-surface)', '--od-glow': 'rgba(168,69,92,0.16)' }}
          >
            <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>
              Gratis
            </Box>
            <Box sx={{ mt: 1, mb: 3, fontSize: 14, color: 'var(--color-neutral-700)' }}>
              Sin costo y sin compromiso de compra. Solo escríbenos y agendamos.
            </Box>
            <Pill href={WA} target="_blank" rel="noopener" sx={{ width: 1, height: 52 }}>
              Agendar por WhatsApp
            </Pill>
          </Box>
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
