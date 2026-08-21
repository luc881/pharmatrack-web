'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCart } from 'src/sections/catalog/use-cart';
import { useFavorites } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------
// Barra superior estática de las vistas interiores (no el home): tira de aviso
// + barra con nav simple, marca al centro y ES/EN · Favoritos · Carrito a la
// derecha. La barra flotante (marquee + píldora) aparece al hacer scroll.
// ----------------------------------------------------------------------

const linkSx = { color: 'inherit', textDecoration: 'none', transition: 'color 300ms', '&:hover': { color: 'var(--color-accent-700)' } };

export function OdTopbar() {
  const { ids } = useFavorites();
  const { count } = useCart();

  return (
    <Box sx={{ position: 'relative', zIndex: 60 }}>
      {/* Tira de aviso */}
      <Box sx={{ bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-200)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', px: 2.5, py: '9px' }}>
        Entrega en persona en CDMX — coordinamos por WhatsApp
      </Box>

      {/* Barra estática */}
      <Box
        component="header"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto 1fr' },
          alignItems: 'center',
          gap: { xs: 2, md: 3 },
          px: { xs: '18px', md: '40px' },
          py: { xs: '14px', md: '20px' },
          bgcolor: 'rgba(243,242,242,0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: '26px', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <Link component={RouterLink} href={paths.catalog} sx={linkSx}>
            Catálogo
          </Link>
          <Link component={RouterLink} href={paths.articles} sx={linkSx}>
            Divulgación
          </Link>
        </Box>
        {/* En móvil, la izquierda es un enlace al menú (mega-menú vive en la flotante) */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }} />

        <Link
          component={RouterLink}
          href={paths.root}
          sx={{ justifySelf: 'center', color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: { xs: 16, md: 21 }, letterSpacing: { xs: '0.18em', md: '0.34em' }, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
        >
          Opuntia Den
        </Link>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: { xs: 1.5, md: 2.5 }, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-flex' }, gap: 1, color: 'var(--color-neutral-600)' }}>
            <Box component="span" sx={{ color: 'var(--color-text)' }}>ES</Box>/EN
          </Box>
          <Link component={RouterLink} href={paths.favorites} sx={{ ...linkSx, whiteSpace: 'nowrap', display: { xs: 'none', sm: 'inline' } }}>
            Favoritos ({ids.length})
          </Link>
          <Link component={RouterLink} href={paths.cart} sx={{ ...linkSx, whiteSpace: 'nowrap' }}>
            Carrito ({count})
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
