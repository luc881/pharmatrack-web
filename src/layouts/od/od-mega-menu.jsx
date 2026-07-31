'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Pill, OdImage } from './od-ui';

// ----------------------------------------------------------------------
// Menú a pantalla completa (mega-menú): columnas de enlaces, una columna con
// texto + píldora, y una tira de imágenes abajo. Se abre desde "Menú" en la
// barra. Las categorías del catálogo salen de la nav real.
// ----------------------------------------------------------------------

const WA = `https://wa.me/${CONFIG.whatsapp}`;

const IMAGES = [
  { src: '/assets/redesign/moss-forest-1.jpg', label: 'Catálogo', href: paths.catalog },
  { src: '/assets/redesign/isopod-zebra.jpg', label: 'Isópodos', href: paths.catalogCategory('isopodos') },
  { src: '/assets/redesign/terrarium.jpg', label: 'Sustratos', href: paths.catalogCategory('sustratos-y-accesorios') },
  { src: '/assets/redesign/leaf-litter.jpg', label: 'Divulgación', href: paths.articles },
];

const colTitleSx = {
  mb: 2.5,
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-600)',
};

const linkSx = {
  display: 'block',
  py: '7px',
  color: 'inherit',
  textDecoration: 'none',
  fontSize: { xs: 18, md: 20 },
  fontFamily: 'var(--font-heading)',
  transition: 'color 300ms',
  '&:hover': { color: 'var(--color-accent-700)' },
};

function MenuLink({ href, label, external, onClose }) {
  return external ? (
    <Link href={href} target="_blank" rel="noopener" sx={linkSx} onClick={onClose}>
      {label}
    </Link>
  ) : (
    <Link component={RouterLink} href={href} sx={linkSx} onClick={onClose}>
      {label}
    </Link>
  );
}

export function OdMegaMenu({ open, onClose, categories }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // bloquea el scroll del fondo mientras el menú está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const catLinks = [
    { label: 'Todo el catálogo', href: paths.catalog },
    ...(categories ?? []).map((c) => ({ label: c.title, href: paths.catalogCategory(c.slug) })),
  ];

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        bgcolor: 'var(--color-bg)',
        color: 'var(--color-text)',
        overflowY: 'auto',
        animation: 'odFade 0.3s ease both',
      }}
    >
      {/* Barra superior del menú */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          px: '18px',
          py: '14px',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <Box>
          <Box
            component="button"
            type="button"
            onClick={onClose}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: 0,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 13,
              px: '20px',
              py: '12px',
              borderRadius: '999px',
              bgcolor: 'var(--color-neutral-900)',
              color: 'var(--color-neutral-100)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'background 300ms',
              '&:hover': { bgcolor: 'var(--color-accent-700)' },
            }}
          >
            <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>✕</Box> Cerrar
          </Box>
        </Box>
        <Link
          component={RouterLink}
          href={paths.root}
          onClick={onClose}
          sx={{ justifySelf: 'center', color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontSize: { xs: 15, md: 21 }, letterSpacing: '0.3em', textTransform: 'uppercase' }}
        >
          Opuntia Den
        </Link>
        <Box />
      </Box>

      {/* Columnas */}
      <Box sx={{ px: { xs: '18px', md: '40px' }, py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 5, md: 4 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          }}
        >
          <Box>
            <Box sx={colTitleSx}>Catálogo</Box>
            {catLinks.map((l) => (
              <MenuLink onClose={onClose} key={l.label} href={l.href} label={l.label} />
            ))}
          </Box>

          <Box>
            <Box sx={colTitleSx}>Divulgación</Box>
            <Box sx={{ mb: 3, fontSize: 15, lineHeight: 1.75, color: 'var(--color-neutral-700)', maxWidth: '30ch' }}>
              Notas de cría, montaje de terrarios bioactivos y fichas de especie — para que no
              repitas nuestros errores.
            </Box>
            <Pill href={paths.articles} onClick={onClose}>
              Ver divulgación
            </Pill>
          </Box>

          <Box>
            <Box sx={colTitleSx}>Tu cuenta</Box>
            <MenuLink onClose={onClose} href={paths.account} label="Mi cuenta" />
            <MenuLink onClose={onClose} href={paths.orders} label="Mis pedidos" />
            <MenuLink onClose={onClose} href={paths.favorites} label="Favoritos" />
            <MenuLink onClose={onClose} href={paths.cart} label="Cotización" />
          </Box>

          <Box>
            <Box sx={colTitleSx}>Contacto</Box>
            <Box sx={{ mb: 3, fontSize: 15, lineHeight: 1.75, color: 'var(--color-neutral-700)', maxWidth: '30ch' }}>
              Mayoreo, asesoría de montaje o dudas de una especie: escríbenos y coordinamos la
              entrega en persona en CDMX.
            </Box>
            <Pill href={WA} onClick={onClose}>
              WhatsApp
            </Pill>
          </Box>
        </Box>

        {/* Tira de imágenes */}
        <Box
          sx={{
            mt: { xs: 6, md: 9 },
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          }}
        >
          {IMAGES.map((img) => (
            <Link
              key={img.label}
              component={RouterLink}
              href={img.href}
              onClick={onClose}
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover .od-img-zoom': { transform: 'scale(1.06)' } }}
            >
              <OdImage src={img.src} alt={img.label} ratio="4 / 3" />
              <Box sx={{ mt: 1.25, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
                {img.label}
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
