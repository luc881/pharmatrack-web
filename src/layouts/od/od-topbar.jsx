'use client';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { SearchDialog } from 'src/layouts/components/search-dialog';
import { AccountButton } from 'src/layouts/components/account-button';
import { useNavCategories } from 'src/layouts/nav-categories-context';

import { useCart } from 'src/sections/catalog/use-cart';
import { useFavorites } from 'src/sections/catalog/use-favorites';

import { isCurrent } from './od-nav';
import { OdMegaMenu } from './od-mega-menu';

// ----------------------------------------------------------------------
// Barra superior estática de las vistas interiores (no el home): tira de aviso
// + barra con «Menú» y las rutas principales (TOP_NAV), marca al centro y ES/EN · Favoritos · Cotización · cuenta a la
// derecha. La barra flotante (marquee + píldora) aparece al hacer scroll.
// ----------------------------------------------------------------------

// Rutas de la barra, de la más a la menos importante; cada una aparece desde
// un ancho donde cabe sin tocar la marca (medido de 360 a 2560px; lo demás
// está en el menú).
const TOP_NAV = [
  { label: 'Catálogo', href: paths.catalog, sx: { display: { xs: 'none', md: 'inline' } } },
  { label: 'Fichas de cuidados', href: paths.careSheets, sx: { display: 'none', '@media (min-width: 1024px)': { display: 'inline' } } },
  { label: 'Divulgación', href: paths.articles, sx: { display: 'none', '@media (min-width: 1360px)': { display: 'inline' } } },
  { label: 'El criadero', href: paths.breeding, sx: { display: 'none', '@media (min-width: 1680px)': { display: 'inline' } } },
];

const linkSx = { color: 'inherit', textDecoration: 'none', transition: 'color 300ms', '&:hover': { color: 'var(--color-accent-700)' } };

export function OdTopbar() {
  const { ids } = useFavorites();
  const { count } = useCart();
  const nav = useBoolean();
  const search = useBoolean();
  const categories = useNavCategories();
  const pathname = usePathname();

  return (
    <>
    <Box sx={{ position: 'relative', zIndex: 60 }}>
      {/* Tira de aviso */}
      <Box sx={{ bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-200)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', px: 2.5, py: '9px' }}>
        Entrega en persona en CDMX — coordinamos por WhatsApp
      </Box>

      {/* Barra estática. Columnas laterales iguales que no crecen
          (minmax(0, 1fr)): la marca queda SIEMPRE al centro real. Antes la
          columna izquierda crecía con los 7 enlaces y la empujaba a la derecha.
          Ahora: «Menú» + solo las rutas principales, que aparecen según el
          ancho; Asesoría, Envíos y Contacto viven en el menú. */}
      <Box
        component="header"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: { xs: 2, md: 3 },
          px: { xs: '18px', md: 'var(--od-gutter)' },
          py: { xs: '14px', md: '18px' },
          bgcolor: 'rgba(243,242,242,0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: '18px', xl: '22px' }, minWidth: 0, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {/* En móvil el hamburguesa TIENE que estar aquí: la píldora flotante
              no aparece hasta pasar 320px de scroll. En escritorio lleva texto. */}
          <Box
            component="button"
            type="button"
            onClick={nav.onTrue}
            aria-label="Abrir menú"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: 44,
              ml: { xs: '-10px', md: 0 },
              px: { xs: '10px', md: 0 },
              border: 0,
              bgcolor: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              color: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'color 300ms',
              '&:hover': { color: 'var(--color-accent-700)' },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 20 }}>
              <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
              <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
              <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
            </Box>
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              Menú
            </Box>
          </Box>

          <Box component="nav" aria-label="Principal" sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: '18px', xl: '22px' }, minWidth: 0 }}>
            {TOP_NAV.map((l) => {
              const current = isCurrent(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  component={RouterLink}
                  href={l.href}
                  aria-current={current ? 'page' : undefined}
                  className="od-link"
                  sx={{
                    ...linkSx,
                    whiteSpace: 'nowrap',
                    ...l.sx,
                    // la página actual queda marcada en tuna
                    ...(current && { color: 'var(--od-tuna)' }),
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </Box>
        </Box>

        <Link
          component={RouterLink}
          href={paths.root}
          sx={{ justifySelf: 'center', color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: { xs: 16, md: 20, xl: 21 }, letterSpacing: { xs: '0.18em', md: '0.28em', xl: '0.34em' }, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
        >
          Opuntia Den
        </Link>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: { xs: 1.5, md: 2.5 }, minWidth: 0, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <Box component="span" sx={{ display: { xs: 'none', xl: 'inline-flex' }, gap: 1, color: 'var(--color-neutral-600)' }}>
            <Box component="span" sx={{ color: 'var(--color-text)' }}>ES</Box>/EN
          </Box>
          {/* En móvil y tablet favoritos y cotización están en el menú y en la
              barra inferior; aquí solo donde caben sin empujar la marca. */}
          <Link component={RouterLink} href={paths.favorites} sx={{ ...linkSx, whiteSpace: 'nowrap', display: { xs: 'none', lg: 'inline' } }}>
            Favoritos ({ids.length})
          </Link>
          <Link component={RouterLink} href={paths.cart} sx={{ ...linkSx, whiteSpace: 'nowrap', display: { xs: 'none', lg: 'inline' } }}>
            Cotización ({count})
          </Link>

          {/* La cuenta SI vive aqui en movil: la barra inferior no la lleva. */}
          <AccountButton sx={{ color: 'inherit', minHeight: { xs: 44, md: 'auto' } }} />
        </Box>
      </Box>
    </Box>

    <OdMegaMenu
      open={nav.value}
      onClose={nav.onFalse}
      onSearch={() => {
        nav.onFalse();
        search.onTrue();
      }}
      categories={categories}
    />
    <SearchDialog open={search.value} onClose={search.onFalse} />
    </>
  );
}
