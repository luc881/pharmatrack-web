'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { SOCIALS } from 'src/sections/catalog/shop-info';

import { Display } from './od-ui';

// ----------------------------------------------------------------------
// Pie del rediseño: columnas de enlaces + bloque de suscripción a la derecha
// (como la referencia) + marca y redes. La suscripción se muestra si
// `newsletter` (se apaga en cuenta/pedidos/legales).
// ponytail: la suscripción solo confirma en el cliente; falta el POST a un
// endpoint que guarde el correo (audiencia de Resend).
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
    title: 'Cuenta y ayuda',
    links: [
      { label: 'Mis pedidos', href: paths.orders },
      { label: 'Favoritos', href: paths.favorites },
      { label: 'Mi cuenta', href: paths.account },
      { label: 'WhatsApp', href: `https://wa.me/${CONFIG.whatsapp}`, external: true },
      { label: 'Términos', href: paths.terms },
      { label: 'Privacidad', href: paths.privacy },
    ],
  },
];

const colLinkSx = {
  display: 'block',
  color: 'var(--color-neutral-700)',
  fontSize: 15,
  py: 0.6,
  textDecoration: 'none',
  transition: 'color 300ms',
  '&:hover': { color: 'var(--color-accent-700)' },
};

function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Box>
      {sent ? (
        <Display size="clamp(26px, 2.6vw, 38px)" weight={400} sx={{ lineHeight: 1.2 }}>
          Listo — te avisamos de cada camada nueva.
        </Display>
      ) : (
        <>
          <Display size="clamp(28px, 2.8vw, 44px)" weight={400} sx={{ lineHeight: 1.12, maxWidth: '16ch' }}>
            Suscríbete y entérate de cada camada nueva
          </Display>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              maxWidth: 460,
              borderBottom: '1px solid var(--color-divider)',
            }}
          >
            <Box
              component="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              aria-label="Tu correo"
              sx={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 'none',
                bgcolor: 'transparent',
                color: 'var(--color-text)',
                font: 'inherit',
                fontSize: 16,
                py: 1.25,
                '&::placeholder': { color: 'var(--color-neutral-500)' },
              }}
            />
            <Box
              component="button"
              type="submit"
              aria-label="Suscribirme"
              sx={{
                border: 0,
                bgcolor: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-text)',
                display: 'grid',
                placeItems: 'center',
                p: 1,
                transition: 'color 300ms, transform 300ms',
                '&:hover': { color: 'var(--color-accent-700)', transform: 'translateX(3px)' },
              }}
            >
              <Iconify icon="eva:arrow-forward-outline" width={22} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export function OdFooter({ newsletter = true }) {
  return (
    <Box component="footer" sx={{ bgcolor: 'var(--color-neutral-100)', borderTop: '1px solid var(--color-divider)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: '18px', md: '40px' }, py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 6, md: 8 },
            gridTemplateColumns: { xs: '1fr', md: newsletter ? '1fr 1fr' : '1fr' },
            alignItems: 'start',
          }}
        >
          {/* Columnas de enlaces */}
          <Box sx={{ display: 'grid', gap: { xs: 5, sm: 6 }, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {COLUMNS.map((col) => (
              <Box key={col.title}>
                <Box sx={{ mb: 2, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
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

          {newsletter && <Newsletter />}
        </Box>

        {/* Marca + redes */}
        <Box
          sx={{
            mt: { xs: 8, md: 11 },
            pt: 4,
            borderTop: '1px solid var(--color-divider)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component={RouterLink}
            href={paths.root}
            sx={{ color: 'var(--color-text)', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            Opuntia Den
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
                  width: 40,
                  height: 40,
                  borderRadius: '999px',
                  color: 'var(--color-neutral-700)',
                  border: '1px solid var(--color-divider)',
                  transition: 'color 300ms, background 300ms, border-color 300ms',
                  '&:hover': { color: 'var(--color-accent-700)', borderColor: 'var(--color-accent)', bgcolor: 'var(--color-accent-100)' },
                }}
              >
                <Iconify icon={social.icon} width={18} />
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Barra inferior */}
      <Box sx={{ borderTop: '1px solid var(--color-divider)' }}>
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            px: { xs: '18px', md: '40px' },
            py: 2.5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            color: 'var(--color-neutral-600)',
          }}
        >
          <Box>© {new Date().getFullYear()} Opuntia Den — Ciudad de México</Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link component={RouterLink} href={paths.terms} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Términos
            </Link>
            <Link component={RouterLink} href={paths.privacy} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Privacidad
            </Link>
            <Link href={paths.appUrl} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Acceso
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
