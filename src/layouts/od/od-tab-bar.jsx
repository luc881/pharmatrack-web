'use client';

import { usePathname } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { SearchDialog } from 'src/layouts/components/search-dialog';

import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

import { useNavTheme } from './use-nav-theme';

// ----------------------------------------------------------------------
// Barra inferior de 5 pestañas (solo móvil): Inicio · Catálogo · Buscar ·
// Favoritos · Carrito. "Buscar" abre el mismo diálogo de búsqueda del header.
// El layout reserva 66px abajo en móvil para que no tape el contenido.
//
//  - Borde superior con la cinta de rayitas de la marca (.od-ticks).
//  - La pestaña activa es un bloque tuna de toda la celda que se desliza;
//    su ícono pasa a la versión sólida. Al tocar, el ícono da un rebote.
//  - Íconos duotono (dos tonos) para que no se pierdan en el fondo.
//  - En contraste con lo que tenga detrás (pedido del usuario): noche sobre
//    fondo claro, crema sobre secciones oscuras (detección data-dark).
// ----------------------------------------------------------------------

const TABS = [
  { key: 'home', label: 'Inicio', href: paths.root, icon: 'solar:home-2-bold-duotone', iconOn: 'solar:home-2-bold' },
  { key: 'catalog', label: 'Catálogo', href: paths.catalog, icon: 'solar:widget-2-bold-duotone', iconOn: 'solar:widget-2-bold' },
  { key: 'search', label: 'Buscar', icon: 'solar:magnifer-bold-duotone' },
  { key: 'favorites', label: 'Favoritos', href: paths.favorites, icon: 'solar:heart-bold-duotone', iconOn: 'solar:heart-bold' },
  { key: 'cart', label: 'Cotización', href: paths.cart, icon: 'solar:cart-plus-bold-duotone', iconOn: 'solar:cart-plus-bold' },
];

const HEIGHT = 66;
// franja que mira para decidir el tono: la propia barra
const band = () => [window.innerHeight - HEIGHT, window.innerHeight];

const itemSx = (active) => ({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  minHeight: 44,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  border: 0,
  bgcolor: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 10,
  letterSpacing: '0.06em',
  textDecoration: 'none',
  color: active ? '#fff' : 'var(--tab-off)',
  fontWeight: active ? 600 : 400,
  transition: 'color 300ms ease',
  WebkitTapHighlightColor: 'transparent',
  '& .od-tab-ico': { transition: 'transform 400ms var(--od-ease)' },
  // rebote al tocar
  '&:active .od-tab-ico': { transform: 'scale(0.82)', transition: 'transform 120ms ease' },
});

export function OdTabBar() {
  const pathname = usePathname();
  const search = useBoolean();
  const { count } = useCart();
  const onDark = useNavTheme(band);

  const isActive = (href) => (href === paths.root ? pathname === href : pathname.startsWith(href));
  const activeIndex = TABS.findIndex((t) => t.href && isActive(t.href));

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
          height: HEIGHT,
          display: { xs: 'flex', md: 'none' },
          alignItems: 'stretch',
          // tonos de las pestañas según el fondo
          // invertido: barra oscura sobre fondo claro y clara sobre oscuro
          '--tab-off': onDark ? 'var(--od-tinta)' : 'var(--od-papel)',
          // opaco: con transparencia se alcanzaban a leer los títulos de abajo
          bgcolor: onDark ? 'rgb(240,235,224)' : 'rgb(46,41,36)',
          color: onDark ? 'var(--od-tinta)' : 'var(--od-papel)',
          transition: 'background-color 400ms ease, color 400ms ease',
          // cinta de rayitas de la marca como borde superior
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 5,
            background: 'repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 5px)',
            opacity: 0.28,
            pointerEvents: 'none',
          },
        }}
      >
        {/* indicador que se desliza a la pestaña activa */}
        {activeIndex >= 0 && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${100 / TABS.length}%`,
              height: 1,
              display: 'flex',
              justifyContent: 'center',
              transform: `translateX(${activeIndex * 100}%)`,
              transition: 'transform 500ms var(--od-ease)',
              pointerEvents: 'none',
            }}
          >
            {/* bloque cuadrado de toda la celda (bajo la cinta de rayitas) */}
            <Box sx={{ position: 'absolute', top: 5, bottom: 0, left: 0, right: 0, bgcolor: 'var(--od-tuna)' }} />
          </Box>
        )}

        {TABS.map((t) => {
          if (t.key === 'search') {
            return (
              <Box key={t.key} component="button" type="button" onClick={search.onTrue} aria-label="Buscar" sx={itemSx(false)}>
                <Iconify className="od-tab-ico" icon={t.icon} width={22} />
                {t.label}
              </Box>
            );
          }
          const active = isActive(t.href);
          const icon = <Iconify className="od-tab-ico" icon={active ? t.iconOn : t.icon} width={22} />;
          return (
            <Box key={t.key} component={RouterLink} href={t.href} aria-current={active ? 'page' : undefined} sx={itemSx(active)}>
              <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                {icon}
                {t.key === 'cart' && count > 0 && (
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -10,
                      minWidth: 18,
                      height: 18,
                      px: '5px',
                      borderRadius: '9px',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                      bgcolor: '#fff',
                      color: 'var(--od-tuna)',
                      boxShadow: '0 0 0 1.5px var(--od-tuna)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {count > 99 ? '99+' : count}
                  </Box>
                )}
              </Box>
              {t.label}
            </Box>
          );
        })}
      </Box>

      <SearchDialog open={search.value} onClose={search.onFalse} />
    </>
  );
}
