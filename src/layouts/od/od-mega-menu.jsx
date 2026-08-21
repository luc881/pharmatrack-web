'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCart } from 'src/sections/catalog/use-cart';
import { useFavorites } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------
// Menú (drawer a pantalla completa, 2 columnas) del rediseño: fondo terracota
// oscuro. Izquierda: enlaces grandes (Catálogo con subcategorías desplegables,
// Favoritos, Carrito, Divulgación). Derecha: enlaces secundarios + Buscar.
// ----------------------------------------------------------------------

const bigLinkSx = {
  display: 'block',
  py: 1.5,
  borderBottom: '1px solid rgba(240,235,224,0.16)',
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(28px, 4vw, 46px)',
  lineHeight: 1.14,
  color: 'var(--color-neutral-100)',
  textDecoration: 'none',
  transition: 'color 300ms',
  '&:hover': { color: 'var(--color-accent-300)' },
};

const smallLinkSx = {
  color: 'var(--color-neutral-300)',
  textDecoration: 'none',
  transition: 'color 300ms',
  '&:hover': { color: 'var(--color-neutral-100)' },
};

export function OdMegaMenu({ open, onClose, onSearch, categories }) {
  const [subOpen, setSubOpen] = useState(false);
  const { ids } = useFavorites();
  const { count } = useCart();

  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    // Al abrir, el foco entra al panel; al cerrar, vuelve a donde estaba (el
    // hamburguesa). Sin esto, quien navega con teclado abria el menu y seguia
    // tabulando por la pagina de atras, que esta tapada pero sigue enfocable:
    // aria-modal se lo dice al lector de pantalla, no al navegador.
    const prevFocus = document.activeElement;
    closeRef.current?.focus();

    // Elementos enfocables VISIBLES: varios enlaces estan en display:none en
    // movil, y enfocar uno de esos rompe el ciclo.
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? []).filter(
        (el) => el.offsetParent !== null
      );

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const subcats = categories ?? [];

  return (
    <Box
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
        bgcolor: 'var(--color-accent-900)',
        color: 'var(--color-neutral-200)',
        overflowY: 'auto',
        animation: 'odFade 0.32s ease both',
      }}
    >
      {/* Columna izquierda: cerrar + enlaces grandes */}
      <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: '28px 22px', md: '40px 46px' } }}>
        <Box
          ref={closeRef}
          component="button"
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          sx={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', minHeight: 44, px: 1.5, mx: -1.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit', color: 'inherit', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'color 300ms', '&:hover': { color: 'var(--color-accent-300)' } }}
        >
          Cerrar ✕
        </Box>

        <Box sx={{ mt: 'auto', pt: { xs: 5, md: 5 } }}>
          <Box sx={{ borderBottom: '1px solid rgba(240,235,224,0.16)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, py: 1.5 }}>
              <Link component={RouterLink} href={paths.catalog} onClick={onClose} sx={{ ...bigLinkSx, flex: 1, borderBottom: 0, py: 0 }}>
                Catálogo
              </Link>
              {subcats.length > 0 && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setSubOpen((v) => !v)}
                  aria-expanded={subOpen}
                  aria-label="Mostrar categorías"
                  sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'inherit', fontSize: 20, p: 1.25, transform: subOpen ? 'rotate(180deg)' : 'none', transition: 'transform 300ms' }}
                >
                  ⌄
                </Box>
              )}
            </Box>
            {subOpen && subcats.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', pb: 2, pl: 0.75, animation: 'odFade 0.3s ease both' }}>
                {subcats.map((c) => (
                  <Link key={c.slug} component={RouterLink} href={paths.catalogCategory(c.slug)} onClick={onClose} sx={{ py: 1.25, fontSize: 16, color: 'var(--color-neutral-300)', textDecoration: 'none', '&:hover': { color: 'var(--color-neutral-100)' } }}>
                    {c.title}
                  </Link>
                ))}
              </Box>
            )}
          </Box>

          {/* En movil estos dos ya estan en la barra inferior de pestanas; aqui
              solo repetirian lo que el pulgar ya tiene a la mano. */}
          <Link component={RouterLink} href={paths.favorites} onClick={onClose} sx={{ ...bigLinkSx, display: { xs: 'none', md: 'block' } }}>
            Favoritos ({ids.length})
          </Link>
          <Link component={RouterLink} href={paths.cart} onClick={onClose} sx={{ ...bigLinkSx, display: { xs: 'none', md: 'block' } }}>
            Carrito ({count})
          </Link>
          <Link component={RouterLink} href={paths.articles} onClick={onClose} sx={bigLinkSx}>
            Divulgación
          </Link>
        </Box>
      </Box>

      {/* Columna derecha: enlaces secundarios + buscar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3.25, p: { xs: '28px 22px 40px', md: '40px 46px' }, borderLeft: { md: '1px solid rgba(240,235,224,0.16)' } }}>
        <Box sx={{ display: 'grid', gap: 1.75, fontSize: 15 }}>
          <Link component={RouterLink} href={paths.breeding} onClick={onClose} sx={smallLinkSx}>
            El criadero
          </Link>
          <Link component={RouterLink} href={paths.shipping} onClick={onClose} sx={smallLinkSx}>
            Envíos y entregas
          </Link>
          <Link component={RouterLink} href={paths.advisory} onClick={onClose} sx={smallLinkSx}>
            Asesoría
          </Link>
          <Link component={RouterLink} href={paths.contact} onClick={onClose} sx={smallLinkSx}>
            Contacto y entrega
          </Link>
          <Link component={RouterLink} href={paths.terms} onClick={onClose} sx={smallLinkSx}>
            Términos y privacidad
          </Link>
          {onSearch && (
            <Box component="button" type="button" onClick={onSearch} sx={{ justifySelf: 'start', border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer', font: 'inherit', ...smallLinkSx }}>
              Buscar
            </Box>
          )}
        </Box>
        <Box sx={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          Ciudad de México · Entrega en persona
        </Box>
      </Box>
    </Box>
  );
}
