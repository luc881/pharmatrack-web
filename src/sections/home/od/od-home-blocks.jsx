'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';
import { OdReveal } from 'src/layouts/od/od-motion';
import { rowFillSx } from 'src/layouts/od/od-styles';
import { MaskLines } from 'src/layouts/od/od-mask-lines';
import { OdHoverPreview } from 'src/layouts/od/od-hover-preview';
import { OdImage, RollText, OdRowGroup, ArrowButton } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// Bloques del home reestructurado (2026-10). Siguen tres pautas de UX:
// señales de confianza justo bajo el hero, categorías navegables y un "cómo
// comprar" explícito antes de pedir el pago.
// ----------------------------------------------------------------------

const TRUST = [
  { icon: 'solar:verified-check-bold', title: 'Criados en casa', body: 'Cada colonia nace en el criadero' },
  { icon: 'mingcute:location-fill', title: 'Entrega en persona', body: 'En CDMX y área metropolitana' },
  { icon: 'solar:shield-check-bold', title: 'Pago seguro', body: 'Mercado Pago o cierre por WhatsApp' },
  { icon: 'solar:file-text-bold', title: 'Ficha de cuidados', body: 'Cada ejemplar sale con sus parámetros' },
];

export function OdTrustBar() {
  return (
    <Box
      component="section"
      aria-label="Por qué comprar aquí"
      sx={{
        px: { xs: '18px', md: 'var(--od-gutter)' },
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      {TRUST.map((t, i) => (
        <Box
          key={t.title}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.25, md: 1.75 },
            py: { xs: 2.25, md: 3 },
            px: { xs: 0.5, md: 2.5 },
            borderLeft: { md: i ? '1px solid var(--color-divider)' : 0 },
            '&:hover .od-trust-ico': { bgcolor: 'var(--od-tuna)', color: '#fff' },
          }}
          data-fx
        >
          <Box
            className="od-trust-ico od-magnet"
            sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: '50%', bgcolor: 'var(--color-neutral-200)', color: 'var(--color-neutral-900)' }}
          >
            <Iconify icon={t.icon} width={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: { xs: 13, md: 15 }, fontWeight: 600, lineHeight: 1.3 }}>{t.title}</Box>
            <Box sx={{ mt: 0.25, fontSize: { xs: 12, md: 13 }, lineHeight: 1.4, color: 'var(--color-neutral-600)' }}>{t.body}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Índice de categorías en filas grandes. En escritorio, al pasar el cursor
// aparece la misma vista previa flotante del índice de fichas (sigue al
// cursor con suavidad y se inclina con la velocidad). En táctil no hay hover:
// cada fila lleva su miniatura en línea.

export function OdCategoryIndex({ items }) {
  const preview = useRef(null);

  return (
    <Box sx={{ borderBottom: '1px solid var(--color-divider)' }}>
      <OdRowGroup>
      {items.map((c, i) => (
        <OdReveal key={c.href} delay={Math.min(i, 6) * 0.05}>
          {/* Hover: el bloque oscuro del grupo se desliza a esta fila, el
              nombre rueda y la flecha se deja jalar por el cursor. */}
          <Link
            component={RouterLink}
            href={c.href}
            underline="none"
            data-fx
            data-row
            onMouseEnter={(e) => preview.current?.show({ key: c.href, cover: c.img, kicker: c.meta, title: c.title }, e)}
            onMouseLeave={() => preview.current?.hide()}
            sx={{
              ...rowFillSx,
              display: 'grid',
              gridTemplateColumns: { xs: '56px 1fr auto', md: '1fr auto 48px' },
              alignItems: 'center',
              gap: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
              px: { md: 3 },
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            {/* miniatura en línea solo en táctil/móvil */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, width: 56 }}>
              <OdImage src={c.img} alt="" ratio="1 / 1" radius={6} />
            </Box>
            <Box sx={{ minWidth: 0, fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 'clamp(34px, 3.6vw, 56px)' }, lineHeight: 1.05 }}>
              <RollText>{c.title}</RollText>
            </Box>
            <Box className="od-row-meta" sx={{ fontSize: { xs: 13, md: 13 }, color: 'var(--color-neutral-600)', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {c.meta}
            </Box>
            <Box
              className="od-row-arrow od-magnet"
              sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center', width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--color-divider)' }}
            >
              <Iconify icon="eva:arrow-forward-fill" width={18} />
            </Box>
          </Link>
        </OdReveal>
      ))}
      </OdRowGroup>
      <OdHoverPreview apiRef={preview} />
    </Box>
  );
}

// ----------------------------------------------------------------------
// Banda de productos que avanza sola (como la original) y se pausa al pasar el
// cursor; la sección padre pausa `.od-band`. Movimiento reducido: la regla
// global de prefers-reduced-motion la detiene.

// Carrusel 3D de insumos (estilo Reelio): tarjetas anchas, la del centro de
// frente y las de los lados giradas hacia atrás, como flotando. Es scroll
// nativo con scroll-snap (deslizar en táctil, flechas en escritorio); el giro
// lo calcula useCoverflow según la distancia de cada tarjeta al centro. Al
// pasar el mouse la foto se encoge sobre un fondo desenfocado de sí misma.
const CARD_W = 'min(88vw, 980px)';
const CARD_HALF = 'min(44vw, 490px)';

function useCoverflow(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const cards = [...el.querySelectorAll('[data-card]')];
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      cards.forEach((c) => {
        const d = Math.max(-1.2, Math.min(1.2, (c.offsetLeft + c.offsetWidth / 2 - mid) / c.offsetWidth));
        // se gira el hijo, no el elemento con scroll-snap: el navegador ancla
        // con la caja ya girada y se detenía antes del centro
        const card = c.firstElementChild;
        card.style.transformOrigin = d > 0 ? 'left center' : 'right center';
        card.style.transform = `perspective(1600px) rotateY(${d * 34}deg) scale(${1 - Math.min(Math.abs(d), 1) * 0.12})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
}

const railArrowSx = { bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', borderColor: 'var(--od-papel)', '&:hover': { borderColor: 'var(--od-papel)' } };
const eyebrowSx = { fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' };
const sansSx = { fontFamily: 'var(--od-font-body)', fontWeight: 600, letterSpacing: '-0.03em' };

export function OdProductRail({ items }) {
  const ref = useRef(null);
  useCoverflow(ref);
  // flechas para escritorio: avanzan una tarjeta (el scroll-snap la centra)
  const step = (dir) => {
    const el = ref.current;
    const card = el?.querySelector('[data-card]');
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 48), behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={ref}
        tabIndex={0}
        aria-label="Insumos para tu terrario"
        sx={{
          position: 'relative',
          display: 'flex',
          gap: '48px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          // relleno para que la primera y la última puedan quedar al centro
          px: `calc(50% - ${CARD_HALF})`,
          py: 4,
          '&:focus-visible': { outline: '2px solid var(--od-papel)', outlineOffset: -4 },
        }}
      >
        {items.map((c) => (
          <Box key={c.key} data-card sx={{ flex: `0 0 ${CARD_W}`, scrollSnapAlign: 'center', display: 'flex' }}>
          <Link
            component={RouterLink}
            href={c.href}
            underline="none"
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 0, md: 3 },
              p: { xs: 1.5, md: 2 },
              borderRadius: '2px',
              bgcolor: 'var(--od-papel)',
              color: 'var(--od-tinta)',
              '@media (hover: hover)': {
                '&:hover .od-terr-bg': { opacity: 1 },
                '&:hover .od-terr-label': { color: '#f6f4f1' },
                '&:hover .od-terr-img': { transform: 'scale(0.62)', boxShadow: '0 22px 44px rgba(0,0,0,0.4)' },
              },
              '&:focus-visible': { outline: '2px solid var(--od-accent)', outlineOffset: 3 },
            }}
          >
            <Box sx={{ order: { xs: 2, md: 1 }, display: 'flex', flexDirection: 'column', p: { xs: 1, md: 1.5 }, pt: { xs: 2.5, md: 1.5 }, minHeight: { md: 380 } }}>
              <Box sx={eyebrowSx}>{c.category}</Box>
              <Box sx={{ ...sansSx, mt: 1, fontSize: 'clamp(26px, 2.6vw, 40px)', lineHeight: 1.05 }}>{c.title}</Box>
              {c.description && <Box sx={{ mt: 2.5, maxWidth: '44ch', fontSize: 16, lineHeight: 1.55, color: 'var(--color-neutral-700)' }}>{c.description}</Box>}
              <Box sx={{ mt: 'auto', pt: 3 }}>
                <Box sx={eyebrowSx}>{c.soldOut ? 'Por ahora' : 'Precio'}</Box>
                <Box sx={{ ...sansSx, mt: 0.5, fontSize: 'clamp(28px, 2.8vw, 44px)', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums', color: c.soldOut ? 'var(--od-neutro-700)' : 'inherit' }}>
                  {c.soldOut ? 'Agotado' : c.price}
                </Box>
              </Box>
            </Box>
            <Box className="od-grain" sx={{ order: { xs: 1, md: 2 }, position: 'relative', overflow: 'hidden', aspectRatio: { xs: '4 / 3', md: 'auto' }, bgcolor: 'var(--od-noche)' }}>
              {c.image ? (
                <>
                  <Box className="od-terr-bg" component="img" src={cdnImage(c.image, 400)} alt="" aria-hidden loading="lazy" sx={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(22px) brightness(0.5)', opacity: 0, transition: 'opacity 700ms var(--od-ease)' }} />
                  <Box className="od-terr-img" component="img" src={cdnImage(c.image, 900)} alt={c.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', transition: 'transform 800ms var(--od-ease), box-shadow 800ms var(--od-ease)' }} />
                </>
              ) : (
                // sin foto: el recuadro de la marca hace el mismo gesto (se encoge sobre el fondo oscuro)
                <Box className="od-terr-img" sx={{ position: 'absolute', inset: 0, transition: 'transform 800ms var(--od-ease), box-shadow 800ms var(--od-ease)' }}>
                  <OdImage label={c.title} radius={0} sx={{ width: 1, height: 1, aspectRatio: 'auto' }} />
                </Box>
              )}
              <Box component="span" className="od-terr-label" sx={{ position: 'absolute', top: 16, right: 18, zIndex: 3, fontSize: 13, fontWeight: 600, color: c.image ? '#f6f4f1' : 'var(--od-tinta)', textShadow: c.image ? '0 1px 8px rgba(0,0,0,0.4)' : 'none', transition: 'color 500ms ease' }}>
                Ver producto →
              </Box>
            </Box>
          </Link>
          </Box>
        ))}
      </Box>

      {/* flechas a los lados de la tarjeta del centro, en el hueco entre tarjetas */}
      {[
        { dir: -1, label: 'Anterior', left: `calc(50% - ${CARD_HALF} - 24px)`, glyph: '←' },
        { dir: 1, label: 'Siguiente', left: `calc(50% + ${CARD_HALF} + 24px)`, glyph: '→' },
      ].map((a) => (
        <Box key={a.label} sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: '50%', left: a.left, zIndex: 2, transform: 'translate(-50%, -50%)' }}>
          <ArrowButton label={a.label} onClick={() => step(a.dir)} size={44} sx={railArrowSx}>
            {a.glyph}
          </ArrowButton>
        </Box>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Cómo comprar: tres pasos sobre la foto a sangre (antes solo un titular).

const STEPS = [
  { title: 'Elige', body: 'Explora el catálogo y abre la ficha: precio, existencias y cuidados de cada especie.' },
  { title: 'Paga o aparta', body: 'Con Mercado Pago en línea, o cierra por WhatsApp y aparta con el 50%.' },
  { title: 'Recibe', body: 'Te llega la confirmación por correo y coordinamos la entrega en persona en CDMX.' },
];

export function OdHowToBuy() {
  // Claro y sin foto (rediseño): antes era otra sección oscura con foto junto
  // a «Todo para tu terrario». Las tres palabras cargan el orden; sin 01/02/03.
  return (
    <Box component="section" id="como-comprar" sx={{ scrollMarginTop: 80, px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '72px', md: '130px' }, bgcolor: 'var(--od-papel)' }}>
      <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(30px, 3.4vw, 48px)', lineHeight: 1.08 }}>
        <MaskLines>Tres pasos, sin sorpresas</MaskLines>
      </Box>
      <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, mt: { xs: 5, md: 8 }, display: 'grid', gap: { xs: 5, md: 6 }, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        {STEPS.map((step, i) => (
          <Box component="li" key={step.title}>
            <OdReveal delay={i * 0.08}>
              <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 4.6vw, 68px)', lineHeight: 1, color: 'var(--od-accent)' }}>{step.title}</Box>
              <Box component="p" sx={{ mt: 2.5, mb: 0, maxWidth: '34ch', fontSize: 17, lineHeight: 1.6 }}>
                {step.body}
              </Box>
            </OdReveal>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
