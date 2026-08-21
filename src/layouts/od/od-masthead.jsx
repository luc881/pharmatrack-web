'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { AccountButton } from 'src/layouts/components/account-button';

// ----------------------------------------------------------------------
// Masthead editorial del home (solo en la portada): barra de enlaces simple +
// wordmark gigante "OPUNTIA" + línea de tags y ubicación. Es estático: al hacer
// scroll se va y aparece la barra flotante (ver revealOnScroll en OdHeader).
// ----------------------------------------------------------------------

const NAV = [
  { label: 'Catálogo', href: paths.catalog },
  { label: 'Especies', href: paths.catalogCategory('isopodos') },
  { label: 'El criadero', href: paths.breeding },
  { label: 'Divulgación', href: paths.articles },
  { label: 'Preguntas', href: '#preguntas', anchor: true },
];

const navLinkSx = {
  color: 'inherit',
  fontSize: 15,
  textDecoration: 'none',
  transition: 'color 300ms',
  '&:hover': { color: 'var(--color-accent-700)' },
};

export function OdMasthead() {
  return (
    <Box component="header" sx={{ px: { xs: '18px', md: '32px' }, pt: '18px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, md: 3 }, flexWrap: { xs: 'nowrap', md: 'wrap' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, gap: { xs: 2.5, md: '34px' } }}>
          <Box
            component={RouterLink}
            href={paths.root}
            aria-label="Opuntia Den — inicio"
            sx={{ display: 'inline-grid', placeItems: 'center', width: 26, height: 26, flexShrink: 0, borderRadius: '50%', bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', fontSize: 12, textDecoration: 'none' }}
          >
            ✳
          </Box>
          {/* En movil los cinco enlaces se envolvian en dos renglones y se
              encimaban con el logo. Aqui corren en una sola linea que se
              desliza, con el borde desvanecido para que se note que hay mas. */}
          <Box
            component="nav"
            sx={{
              display: 'flex',
              gap: { xs: 2, md: '30px' },
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              minWidth: 0,
              overflowX: { xs: 'auto', md: 'visible' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              '& a': { whiteSpace: 'nowrap' },
              maskImage: { xs: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)', md: 'none' },
              WebkitMaskImage: { xs: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)', md: 'none' },
            }}
          >
            {NAV.map((l) =>
              l.anchor ? (
                <Link key={l.label} href={l.href} sx={navLinkSx}>
                  {l.label}
                </Link>
              ) : (
                <Link key={l.label} component={RouterLink} href={l.href} sx={navLinkSx}>
                  {l.label}
                </Link>
              )
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Link
            component={RouterLink}
            href={paths.contact}
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'center', gap: 2, color: 'inherit', fontSize: 15, textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}
          >
            Apartar ejemplar
            <Box component="span" sx={{ flexShrink: 0, display: 'inline-grid', placeItems: 'center', width: 30, height: 30, border: '1px solid var(--color-text)', borderRadius: '4px' }}>
              →
            </Box>
          </Link>

          {/* La portada no lleva la barra estatica, asi que sin esto la cuenta
              no tiene ningun acceso en movil. */}
          <AccountButton sx={{ color: 'inherit', ml: { xs: 0, sm: 1.5 }, minHeight: { xs: 44, md: 'auto' } }} />
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: '26px' }}>
        <Box sx={{ mb: '2px', fontSize: 'clamp(13px, 1.35vw, 21px)', letterSpacing: '0.42em', textIndent: '0.42em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
          Criadero
        </Box>
        <Box sx={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(56px, 14.6vw, 220px)', lineHeight: 1, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
          Opuntia
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, m: '22px 0 26px', fontSize: 'clamp(12px, 1.05vw, 16px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-neutral-800)' }}>
        <Box sx={{ lineHeight: 1.35 }}>
          Isópodos, colémbolos,
          <br />
          sustratos y bioactivo
        </Box>
        <Box sx={{ textAlign: 'right', lineHeight: 1.35 }}>
          Col. Roma Norte,
          <br />
          Ciudad de México
        </Box>
      </Box>
    </Box>
  );
}
