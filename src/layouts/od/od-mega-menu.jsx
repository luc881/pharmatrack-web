'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { useCart } from 'src/sections/catalog/use-cart';
import { useFavorites } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------
// Menú (pantalla completa, 2 columnas) del rediseño, fondo noche.
// Izquierda: las secciones del sitio en grande y numeradas (Catálogo con sus
// categorías). Derecha, en bloques rotulados: tu selección (favoritos,
// cotización, buscar), ayuda y contacto. Se abre como un círculo que crece
// desde el botón y los enlaces entran escalonados; se cierra al revés.
// Con prefers-reduced-motion la regla global apaga las animaciones.
// ----------------------------------------------------------------------

const LINE = '1px solid rgba(229,241,205,0.16)';
const CLOSE_MS = 320;

const MAIN = [
  { label: 'Fichas de cuidados', href: paths.careSheets },
  { label: 'Divulgación', href: paths.articles },
  { label: 'El criadero', href: paths.breeding },
  { label: 'Asesoría', href: paths.advisory },
];

const HELP = [
  { label: 'Envíos y entregas', href: paths.shipping },
  { label: 'Preguntas frecuentes', href: `${paths.root}#preguntas` },
  { label: 'Contacto', href: paths.contact },
  { label: 'Términos y privacidad', href: paths.terms },
];

// entrada escalonada: cada bloque sube un poco después del anterior
const enter = (i) => ({ animation: `odRise 0.7s var(--od-ease) ${0.18 + i * 0.06}s both` });

const bigLinkSx = {
  display: 'flex',
  alignItems: 'baseline',
  gap: { xs: 1.5, md: 2.5 },
  py: { xs: 1.25, md: 1.5 },
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(30px, 3.6vw, 48px)',
  lineHeight: 1.1,
  color: 'var(--color-neutral-100)',
  textDecoration: 'none',
  transition: 'color 300ms',
  // al pasar: aparece la flecha y el texto se corre un poco
  '& .od-mm-text': { transition: 'transform 400ms var(--od-ease)' },
  '& .od-mm-arrow': {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'opacity 300ms, transform 400ms var(--od-ease)',
  },
  '&:hover, &:focus-visible': { color: 'var(--color-accent-300)' },
  '&:hover .od-mm-text, &:focus-visible .od-mm-text': { transform: 'translateX(8px)' },
  '&:hover .od-mm-arrow, &:focus-visible .od-mm-arrow': { opacity: 1, transform: 'none' },
};

const smallLinkSx = {
  justifySelf: 'start',
  fontSize: { xs: 17, md: 18 },
  color: 'var(--color-neutral-300)',
  textDecoration: 'none',
  transition: 'color 300ms',
  '&:hover, &:focus-visible': { color: 'var(--color-neutral-100)' },
};

const selectionSx = { ...smallLinkSx, fontFamily: 'var(--font-heading)', fontSize: 26 };

const labelSx = {
  mb: 1.5,
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-500)',
};

function BigLink({ n, href, onClick, children, sx }) {
  return (
    <Link component={RouterLink} href={href} onClick={onClick} sx={[bigLinkSx, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box
        component="span"
        aria-hidden
        sx={{
          minWidth: 22,
          fontFamily: 'var(--od-font-body)',
          fontSize: 12,
          letterSpacing: '0.12em',
          color: 'var(--color-neutral-500)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(n).padStart(2, '0')}
      </Box>
      <Box component="span" className="od-mm-text" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box component="span" className="od-mm-arrow" aria-hidden sx={{ fontSize: '0.6em' }}>
        →
      </Box>
    </Link>
  );
}

export function OdMegaMenu({ open, onClose, onSearch, categories }) {
  const [subOpen, setSubOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { ids } = useFavorites();
  const { count } = useCart();

  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Cerrar con animación (botón y Escape). Al navegar se cierra directo.
  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, CLOSE_MS);
  }, [onClose]);

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
        requestClose();
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
  }, [open, requestClose]);

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
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.25fr) minmax(0, 1fr)' },
        alignContent: { xs: 'start', md: 'stretch' },
        bgcolor: 'var(--color-accent-900)',
        color: 'var(--color-neutral-200)',
        overflowY: 'auto',
        animation: `${closing ? 'odMenuOut' : 'odMenuIn'} ${closing ? CLOSE_MS : 650}ms var(--od-ease) both`,
      }}
    >
      {/* Izquierda: cerrar + secciones en grande */}
      <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: '24px 22px 8px', md: '40px 56px' } }}>
        <Box
          ref={closeRef}
          component="button"
          type="button"
          onClick={requestClose}
          aria-label="Cerrar menú"
          sx={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            minHeight: 44,
            px: 1.5,
            mx: -1.5,
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            color: 'inherit',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transition: 'color 300ms',
            '&:hover': { color: 'var(--color-accent-300)' },
            '&:hover .od-mm-x': { transform: 'rotate(90deg)' },
          }}
        >
          Cerrar
          <Box
            component="span"
            className="od-mm-x"
            aria-hidden
            sx={{ display: 'inline-block', transition: 'transform 400ms var(--od-ease)' }}
          >
            ✕
          </Box>
        </Box>

        <Box component="nav" aria-label="Secciones" sx={{ mt: { xs: 3, md: 'auto' }, pt: { md: 5 } }}>
          <Box sx={{ ...labelSx, ...enter(0) }}>Secciones</Box>
          <Box sx={{ borderTop: LINE }}>
            {/* Catálogo con sus categorías */}
            <Box sx={{ borderBottom: LINE, ...enter(1) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BigLink n={1} href={paths.catalog} onClick={onClose} sx={{ flex: 1 }}>
                  Catálogo
                </BigLink>
                {subcats.length > 0 && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setSubOpen((v) => !v)}
                    aria-expanded={subOpen}
                    aria-label={subOpen ? 'Ocultar categorías' : 'Mostrar categorías'}
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      border: '1px solid rgba(229,241,205,0.24)',
                      borderRadius: '50%',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      color: 'inherit',
                      fontSize: 18,
                      transform: subOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 400ms var(--od-ease), border-color 300ms',
                      '&:hover': { borderColor: 'var(--color-neutral-100)' },
                    }}
                  >
                    +
                  </Box>
                )}
              </Box>
              {subOpen && subcats.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                    gap: '6px 18px',
                    pb: 2.5,
                    pl: { xs: 4.5, md: 6 },
                  }}
                >
                  {subcats.map((c, i) => (
                    <Link
                      key={c.slug}
                      component={RouterLink}
                      href={paths.catalogCategory(c.slug)}
                      onClick={onClose}
                      sx={{ ...smallLinkSx, fontSize: 16, py: 0.5, animation: `odFade 0.4s ease ${i * 0.03}s both` }}
                    >
                      {c.title}
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
            {MAIN.map((l, i) => (
              <Box key={l.href} sx={{ borderBottom: LINE, ...enter(i + 2) }}>
                <BigLink n={i + 2} href={l.href} onClick={onClose}>
                  {l.label}
                </BigLink>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Derecha: bloques rotulados, alineados abajo con las secciones */}
      <Box
        sx={{
          display: 'grid',
          alignContent: 'end',
          gap: { xs: 4, md: 5 },
          p: { xs: '32px 22px 96px', md: '40px 56px' },
          borderLeft: { md: LINE },
        }}
      >
        {/* En móvil favoritos, cotización y buscar ya están en la barra de abajo */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, ...enter(3) }}>
          <Box sx={labelSx}>Tu selección</Box>
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            <Link component={RouterLink} href={paths.favorites} onClick={onClose} sx={selectionSx}>
              Favoritos ({ids.length})
            </Link>
            <Link component={RouterLink} href={paths.cart} onClick={onClose} sx={selectionSx}>
              Cotización ({count})
            </Link>
            {onSearch && (
              <Box
                component="button"
                type="button"
                onClick={onSearch}
                sx={{ ...selectionSx, border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer', textAlign: 'left' }}
              >
                Buscar
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
          <Box sx={enter(4)}>
            <Box sx={labelSx}>Ayuda</Box>
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {HELP.map((l) => (
                <Link key={l.href} component={RouterLink} href={l.href} onClick={onClose} sx={smallLinkSx}>
                  {l.label}
                </Link>
              ))}
            </Box>
          </Box>
          <Box sx={enter(5)}>
            <Box sx={labelSx}>Escríbenos</Box>
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              <Link href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" sx={smallLinkSx}>
                WhatsApp · {CONFIG.phone}
              </Link>
              <Link href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" sx={smallLinkSx}>
                Instagram · {CONFIG.instagramHandle}
              </Link>
            </Box>
          </Box>
        </Box>

        <Box sx={{ ...labelSx, mb: 0, ...enter(6) }}>Ciudad de México · Entrega en persona</Box>
      </Box>
    </Box>
  );
}
