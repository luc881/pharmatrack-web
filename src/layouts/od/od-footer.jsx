'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
// Pie del rediseño (global): fondo terracota oscuro, navegación en tipografía
// grande, datos de la tienda, redes, barra inferior con reloj vivo y el
// wordmark "OPUNTIA" a sangre. La suscripción vive ahora en la sección
// "Novedades" del home, no aquí.
// ----------------------------------------------------------------------

const WA = `https://wa.me/${CONFIG.whatsapp}`;
const EMAIL = 'opuntiaden@gmail.com';

const NAV = [
  { label: 'Catálogo', href: paths.catalog },
  { label: 'Ejemplares', href: paths.catalogCategory('isopodos') },
  { label: 'El criadero', href: paths.breeding },
  { label: 'Divulgación', href: paths.articles },
  { label: 'Preguntas', href: `${paths.root}#preguntas`, hash: true },
];

const REDES = [
  { label: 'Instagram ↗', href: 'https://instagram.com/opuntiaden', external: true },
  { label: 'WhatsApp ↗', href: WA, external: true },
  { label: 'Cómo llegar ↗', href: paths.contact },
];

const navBd = '1px solid rgba(240,235,224,0.14)';

function useClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function OdFooter() {
  const now = useClock();
  const clock = now ? now.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '';
  const today = now ? now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <Box component="footer" data-dark="1" sx={{ bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-200)', px: { xs: '18px', md: '40px' }, pt: { xs: '48px', md: '74px' }, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gap: { xs: 5, md: '56px' }, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 1.5fr) minmax(240px, 1fr) minmax(160px, 0.6fr)' } }}>
        {/* Navegación */}
        <Box>
          <Box sx={{ mb: { xs: 3, md: '34px' }, display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 13, color: 'var(--color-neutral-400)' }}>
            <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'var(--color-neutral-500)' }} />
            Navegación
          </Box>
          {NAV.map((l) => (
            <Link
              key={l.label}
              {...(l.hash ? { href: l.href } : { component: RouterLink, href: l.href })}
              sx={{ display: 'block', py: 1.5, borderBottom: navBd, fontFamily: 'var(--font-heading)', fontSize: { xs: 30, md: 46 }, lineHeight: 1.12, color: 'var(--color-neutral-100)', textDecoration: 'none', transition: 'color 300ms', '&:hover': { color: 'var(--color-accent-300)' } }}
            >
              {l.label}
            </Link>
          ))}
        </Box>

        {/* Datos de la tienda */}
        <Box>
          <Box sx={{ mb: { xs: 2.5, md: '26px' }, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>(Datos de la tienda)</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, px: 1.875, py: 1, borderRadius: '999px', bgcolor: 'rgba(240,235,224,0.08)', fontSize: 13, color: 'var(--color-neutral-200)' }}>
            <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'var(--color-accent-400)' }} />
            Apartados abiertos
          </Box>
          <Box sx={{ mt: 3, mb: 2.25 }}>
            <Link href={`mailto:${EMAIL}`} sx={{ fontSize: 15, color: 'var(--color-neutral-100)', borderBottom: '1px solid rgba(240,235,224,0.4)', pb: '2px', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-300)' } }}>
              {EMAIL}
            </Link>
          </Box>
          <Box sx={{ mb: 2.25, fontSize: 14, lineHeight: 1.65, color: 'var(--color-neutral-400)' }}>
            Entrega en persona
            <br />
            Ciudad de México y área metropolitana
            <br />
            55 1234 5678
          </Box>
          <Box sx={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-neutral-400)' }}>
            Lun a vie 11–19 h · Sáb 11–15 h
            <br />
            Envíos coordinados por WhatsApp
          </Box>
        </Box>

        {/* Redes */}
        <Box>
          <Box sx={{ mb: { xs: 2.5, md: '26px' }, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>(Redes)</Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, fontSize: 17 }}>
            {REDES.map((r) => (
              <Link
                key={r.label}
                {...(r.external ? { href: r.href, target: '_blank', rel: 'noopener' } : { component: RouterLink, href: r.href })}
                sx={{ color: 'var(--color-neutral-100)', textDecoration: 'none', transition: 'color 300ms', '&:hover': { color: 'var(--color-accent-300)' } }}
              >
                {r.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Barra inferior */}
      <Box sx={{ mt: { xs: 6, md: '76px' }, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, fontSize: 13, color: 'var(--color-neutral-500)' }}>
        <Box>
          <Box>Ciudad de México {clock}</Box>
          <Box sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>{today}</Box>
        </Box>
        <Box>
          <Box>
            <Link href={paths.root} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-neutral-200)' } }}>
              Volver arriba ↑
            </Link>
          </Box>
          <Box>Camadas nuevas cada mes</Box>
        </Box>
        <Box sx={{ textAlign: { sm: 'right' } }}>©{new Date().getFullYear()} Opuntia Den</Box>
      </Box>

      {/* Wordmark a sangre */}
      <Box sx={{ mt: { xs: 4, md: '40px' }, pb: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 0.75, fontFamily: 'var(--font-body)', fontSize: 22, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--color-neutral-400)' }}>Invertebrados</Box>
        <Box sx={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '15.5vw', lineHeight: 1.02, letterSpacing: '0.01em', textTransform: 'uppercase', color: 'var(--color-neutral-100)' }}>Opuntia</Box>
      </Box>
    </Box>
  );
}
