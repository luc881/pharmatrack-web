'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { SOCIALS } from 'src/sections/catalog/shop-info';

// ----------------------------------------------------------------------
// Pie del rediseño: cuatro columnas + línea inferior con © y redes.
// ----------------------------------------------------------------------

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Catálogo', href: paths.catalog },
      { label: 'Isópodos', href: paths.catalogCategory('isopodos') },
      { label: 'Sustratos y accesorios', href: paths.catalogCategory('sustratos-y-accesorios') },
      { label: 'Divulgación', href: paths.articles },
    ],
  },
  {
    title: 'Compra',
    links: [
      { label: 'Mis pedidos', href: paths.orders },
      { label: 'Favoritos', href: paths.favorites },
      { label: 'Mi cuenta', href: paths.account },
      { label: 'WhatsApp', href: `https://wa.me/${CONFIG.whatsapp}`, external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos', href: paths.terms },
      { label: 'Privacidad', href: paths.privacy },
      { label: 'Acceso', href: paths.appUrl, external: true },
    ],
  },
];

const colLinkSx = {
  display: 'block',
  color: 'var(--color-neutral-600)',
  fontSize: 14,
  py: 0.5,
  textDecoration: 'none',
  transition: 'color 350ms',
  '&:hover': { color: 'var(--color-accent-700)' },
};

export function OdFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: 'var(--color-bg)', borderTop: '1px solid var(--color-divider)' }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: '18px',
          py: { xs: 8, md: 11 },
          display: 'grid',
          gap: { xs: 5, md: 6 },
          gridTemplateColumns: { xs: '1fr 1fr', md: '1.6fr 1fr 1fr 1fr' },
        }}
      >
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
          <Box
            component={RouterLink}
            href={paths.root}
            sx={{
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            Opuntia Den
          </Box>
          <Box sx={{ mt: 2.5, maxWidth: 300, fontSize: 14, lineHeight: 1.7, color: 'var(--color-neutral-600)' }}>
            Cría de invertebrados de colección en la Ciudad de México. Entrega en persona, con
            parámetros medidos y garantía de llegada con vida.
          </Box>
        </Box>

        {COLUMNS.map((col) => (
          <Box key={col.title}>
            <Box
              sx={{
                mb: 2,
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-500)',
              }}
            >
              {col.title}
            </Box>
            {col.links.map((link) =>
              link.external ? (
                <Link key={link.label} href={link.href} target="_blank" rel="noopener" sx={colLinkSx}>
                  {link.label}
                </Link>
              ) : (
                <Link key={link.label} component={RouterLink} href={link.href} sx={colLinkSx}>
                  {link.label}
                </Link>
              )
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: '18px',
          py: 3,
          borderTop: '1px solid var(--color-divider)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>
          © {new Date().getFullYear()} Opuntia Den — Ciudad de México
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {SOCIALS.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener"
              aria-label={social.label}
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 34,
                height: 34,
                borderRadius: '999px',
                color: 'var(--color-neutral-600)',
                transition: 'color 350ms, background 350ms',
                '&:hover': { color: 'var(--color-accent-700)', bgcolor: 'var(--color-accent-100)' },
              }}
            >
              <Iconify icon={social.icon} width={17} />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
