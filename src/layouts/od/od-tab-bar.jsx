'use client';

import { usePathname } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { SearchDialog } from 'src/layouts/components/search-dialog';

import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

// ----------------------------------------------------------------------
// Barra inferior de 5 pestañas (solo móvil): Inicio · Catálogo · Buscar ·
// Favoritos · Carrito. "Buscar" abre el mismo diálogo de búsqueda del header.
// El layout reserva 66px abajo en móvil para que no tape el contenido.
// ----------------------------------------------------------------------

const TABS = [
  { key: 'home', label: 'Inicio', href: paths.root, icon: 'solar:home-2-linear' },
  { key: 'catalog', label: 'Catálogo', href: paths.catalog, icon: 'solar:widget-2-linear' },
  { key: 'search', label: 'Buscar', icon: 'ri:search-line' },
  { key: 'favorites', label: 'Favoritos', href: paths.favorites, icon: 'solar:heart-linear' },
  { key: 'cart', label: 'Cotización', href: paths.cart, icon: 'solar:cart-plus-linear' },
];

const itemSx = (active) => ({
  flex: 1,
  minWidth: 0,
  minHeight: 44,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  border: 0,
  bgcolor: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 10,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  color: active ? 'var(--color-accent-700)' : 'var(--color-neutral-600)',
  transition: 'color 250ms',
});

export function OdTabBar() {
  const pathname = usePathname();
  const search = useBoolean();
  const { count } = useCart();

  const isActive = (href) => (href === paths.root ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <Box
        component="nav"
        aria-label="Navegación móvil"
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          height: 66,
          display: { xs: 'flex', md: 'none' },
          alignItems: 'stretch',
          bgcolor: 'color-mix(in srgb, var(--color-bg) 96%, transparent)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--color-divider)',
        }}
      >
        {TABS.map((t) => {
          const icon = <Iconify icon={t.icon} width={22} />;
          if (t.key === 'search') {
            return (
              <Box key={t.key} component="button" type="button" onClick={search.onTrue} aria-label="Buscar" sx={itemSx(false)}>
                {icon}
                {t.label}
              </Box>
            );
          }
          const active = isActive(t.href);
          return (
            <Box key={t.key} component={RouterLink} href={t.href} sx={itemSx(active)}>
              {t.key === 'cart' ? (
                <Badge badgeContent={count} color="error" max={99}>
                  {icon}
                </Badge>
              ) : (
                icon
              )}
              {t.label}
            </Box>
          );
        })}
      </Box>

      <SearchDialog open={search.value} onClose={search.onFalse} />
    </>
  );
}
