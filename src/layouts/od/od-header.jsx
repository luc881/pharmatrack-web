'use client';

import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { SearchDialog } from 'src/layouts/components/search-dialog';
import { AccountButton } from 'src/layouts/components/account-button';
import { useNavCategories } from 'src/layouts/nav-categories-context';
import { FavoritesButton } from 'src/layouts/components/favorites-button';

import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

import { OdMegaMenu } from './od-mega-menu';
import { useNavTheme } from './use-nav-theme';

// ----------------------------------------------------------------------
// Barra del rediseño editorial: marquee oscuro + barra flotante en píldora.
// Reutiliza tal cual los botones con lógica (carrito→Mercado Pago, favoritos,
// cuenta con Google, búsqueda) — solo cambia la piel, no el comportamiento.
// ----------------------------------------------------------------------

// Ícono de carrito que lleva a la página /carrito (antes abría un drawer)
function OdCartLink() {
  const { count } = useCart();
  return (
    <IconButton component={RouterLink} href={paths.cart} aria-label="Cotización" sx={{ color: 'inherit' }}>
      <Badge badgeContent={count} color="error" max={99}>
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Badge>
    </IconButton>
  );
}

const MARQUEE = [
  'Entrega en persona en CDMX',
  'Coordinamos por WhatsApp',
  'Reservas con anticipo',
  'Camadas criadas con parámetros medidos',
];

// enlace de texto con subrayado que crece de 0% a 100% al hover
const linkSx = {
  color: 'inherit',
  fontSize: 13,
  whiteSpace: 'nowrap',
  px: '16px',
  py: '16px',
  borderLeft: '1px solid var(--od-nav-bd)',
  textDecoration: 'none',
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '16px 78%',
  backgroundSize: '0% 1px',
  transition: 'background-size 450ms var(--od-ease), color 350ms',
  '&:hover': { color: 'var(--color-accent-700)', backgroundSize: '100% 1px' },
};

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]; // duplicado 2× para el bucle continuo
  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: '11px',
        bgcolor: 'var(--color-neutral-900)',
        color: 'var(--color-neutral-200)',
      }}
    >
      <Box
        className="od-marquee"
        sx={{
          display: 'flex',
          width: 'max-content',
          whiteSpace: 'nowrap',
          fontSize: 13,
          letterSpacing: '0.05em',
          animation: 'odMarquee 26s linear infinite',
        }}
      >
        {items.map((text, i) => (
          <Box component="span" key={i} sx={{ px: '40px' }}>
            {text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function OdHeader({ revealOnScroll = false }) {
  const nav = useBoolean();
  const search = useBoolean();
  const { onToggle: onToggleSearch } = search;

  const categories = useNavCategories();

  // En el home la barra flotante arranca oculta (el masthead ocupa el tope) y
  // aparece al bajar; en el resto de páginas está visible desde el inicio.
  const [revealed, setRevealed] = useState(!revealOnScroll);
  useEffect(() => {
    if (!revealOnScroll) return undefined;
    const onScroll = () => setRevealed(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [revealOnScroll]);

  // Inversión de la barra según la sección de fondo (ver useNavTheme).
  const onDark = useNavTheme();
  const nt = onDark
    ? { bg: 'color-mix(in srgb, var(--color-bg) 94%, transparent)', fg: 'var(--color-text)', bd: 'var(--color-divider)' }
    : { bg: 'rgba(28,26,24,0.9)', fg: 'var(--color-neutral-100)', bd: 'rgba(240,235,224,0.24)' };

  // ⌘K / Ctrl+K abre el buscador (mismo atajo que el layout original)
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggleSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onToggleSearch]);

  return (
    <>
      {/* fija arriba: marquee y píldora viajan juntos al hacer scroll */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          transform: revealed ? 'translateY(0)' : 'translateY(-110%)',
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? 'auto' : 'none',
          transition: 'transform 500ms var(--od-ease), opacity 400ms var(--od-ease)',
        }}
      >
        <Marquee />

        <Box sx={{ px: '18px', pt: '14px' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: '14px',
              border: '1px solid',
              boxShadow: 'var(--shadow-sm)',
              backdropFilter: 'blur(10px)',
              // inversión suave según la sección de fondo
              '--od-nav-bd': nt.bd,
              bgcolor: nt.bg,
              color: nt.fg,
              borderColor: nt.bd,
              transition: 'background-color 450ms var(--od-ease), color 450ms var(--od-ease), border-color 450ms var(--od-ease)',
            }}
          >
            {/* Izquierda: menú + enlaces (ocultos en móvil por espacio) */}
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <Box
                component="button"
                type="button"
                onClick={nav.onTrue}
                aria-label="Abrir menú"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 0,
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 13,
                  color: 'inherit',
                  px: '20px',
                  py: '16px',
                  transition: 'color 350ms',
                  '&:hover': { color: 'var(--color-accent-700)' },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 20 }}>
                  <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
                  <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
                  <Box sx={{ height: '1px', bgcolor: 'currentColor' }} />
                </Box>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Menú
                </Box>
              </Box>

              <Link
                href={`https://wa.me/${CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener"
                sx={{ ...linkSx, display: { xs: 'none', md: 'block' } }}
              >
                Mayoreo
              </Link>
              <Link
                component={RouterLink}
                href={paths.advisory}
                sx={{ ...linkSx, display: { xs: 'none', md: 'block' } }}
              >
                Asesoría
              </Link>
            </Box>

            {/* Centro: marca */}
            <Link
              component={RouterLink}
              href={paths.root}
              sx={{
                justifySelf: 'center',
                px: 1,
                color: 'inherit',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: { xs: 14, sm: 18, md: 21 },
                letterSpacing: { xs: '0.06em', sm: '0.16em', md: '0.3em' },
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Opuntia Den
            </Link>

            {/* Derecha: buscar · moneda · favoritos · carrito · cuenta */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifySelf: 'end', minWidth: 0 }}>
              <Box
                component="button"
                type="button"
                onClick={search.onTrue}
                aria-label="Buscar en el catálogo"
                sx={{
                  border: 0,
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: { xs: 'none', sm: 'grid' },
                  placeItems: 'center',
                  px: '14px',
                  py: '14px',
                  borderLeft: '1px solid var(--od-nav-bd)',
                  transition: 'color 350ms',
                  '&:hover': { color: 'var(--color-accent-700)' },
                }}
              >
                <Iconify icon="ri:search-line" width={20} />
              </Box>

              <Box
                component="span"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  px: '14px',
                  py: '16px',
                  borderLeft: '1px solid var(--od-nav-bd)',
                  color: 'inherit',
                }}
              >
                ES{' '}
                <Box component="span" sx={{ opacity: 0.6 }}>
                  · MXN
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pl: { xs: 0.5, sm: '6px' },
                  borderLeft: { sm: '1px solid var(--od-nav-bd)' },
                  color: 'inherit',
                }}
              >
                {/* favoritos: oculto en móvil (está en el menú y en la cuenta);
                    ahorra ancho para que la marca no se encime */}
                <FavoritesButton sx={{ color: 'inherit', display: { xs: 'none', sm: 'inline-flex' } }} />
                <OdCartLink />
                <AccountButton sx={{ color: 'inherit', ml: { xs: 0.5, sm: 0 } }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <OdMegaMenu open={nav.value} onClose={nav.onFalse} categories={categories} />
      <SearchDialog open={search.value} onClose={search.onFalse} />
    </>
  );
}
