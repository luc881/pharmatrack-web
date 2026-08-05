import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { OdPageHead } from 'src/layouts/od/od-ui';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdLayout } from 'src/layouts/od/od-layout';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Asesoría',
  description:
    'Sesión de 30 minutos para elegir especie y revisar tu montaje antes de comprar. Se descuenta si compras el mismo día.',
};

const WA = `https://wa.me/${CONFIG.whatsapp}`;

const STEPS = [
  {
    title: '01 · Antes de comprar',
    body: 'Qué especie aguanta tu clima y qué necesitas tener listo.',
  },
  {
    title: '02 · Revisión de montaje',
    body: 'Nos mandas fotos del terrario y te decimos qué corregir.',
  },
  {
    title: '03 · Problemas de colonia',
    body: 'Moho, ácaros, población que no crece: diagnóstico y plan de ajuste.',
  },
];

export default function Page() {
  return (
    <OdLayout offsetTop>
      <OdPageHead
        kicker="Asesoría"
        title="Te ayudamos a montar el terrario antes de comprar el animal"
        intro="Una sesión de 30 minutos por videollamada o WhatsApp: revisamos tu contenedor, el sustrato y la especie que te conviene según el clima de tu casa."
        introWidth="60ch"
      />

      <OdReveal>
        <Box
          component="section"
          sx={{
            px: { xs: '18px', md: '40px' },
            pt: { xs: 5, md: 6 },
            pb: { xs: 10, md: 15 },
            display: 'grid',
            gap: { xs: 5, md: '60px' },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)' },
          }}
        >
          <Box sx={{ borderTop: '1px solid var(--color-divider)' }}>
            {STEPS.map((s) => (
              <Box key={s.title} sx={{ py: 3, borderBottom: '1px solid var(--color-divider)' }}>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{s.title}</Box>
                <Box sx={{ mt: 1, fontSize: 16, lineHeight: 1.8, color: 'var(--color-neutral-700)', textWrap: 'pretty' }}>
                  {s.body}
                </Box>
              </Box>
            ))}
          </Box>

          <Box component="aside" sx={{ p: { xs: 3, md: '30px 32px' }, border: '1px solid var(--color-divider)', borderRadius: '16px' }}>
            <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>
              $250 <Box component="span" sx={{ fontSize: 16, color: 'var(--color-neutral-600)' }}>MXN</Box>
            </Box>
            <Box sx={{ mt: 1, mb: 3, fontSize: 14, color: 'var(--color-neutral-700)' }}>
              30 minutos. Se descuenta si compras el mismo día.
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
              Agendar por WhatsApp
            </Box>
          </Box>
        </Box>
      </OdReveal>
    </OdLayout>
  );
}
