'use client';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { OdReveal } from 'src/layouts/od/od-motion';
import { rowFillSx } from 'src/layouts/od/od-styles';
import { RiseWords } from 'src/layouts/od/od-ornaments';
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

export function OdProductRail({ items }) {
  const ref = useRef(null);
  // flechas para escritorio: avanzan una tarjeta (el scroll-snap la centra)
  const step = (dir) => {
    const el = ref.current;
    const card = el?.querySelector('[data-card]');
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Carrusel en perspectiva (paso 5d): scroll nativo con scroll-snap; la
          inclinación de los lados sale de una animación ligada al scroll
          horizontal (.od-cover-card en global.css). Sin soporte: tarjetas
          planas. */}
      <Box
        ref={ref}
        tabIndex={0}
        aria-label="Insumos para tu terrario"
        sx={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          // relleno para que la primera y la última puedan quedar al centro
          px: 'calc(50% - min(43vw, 300px))',
          py: 3,
          '&:focus-visible': { outline: '2px solid var(--od-papel)', outlineOffset: -4 },
        }}
      >
        {items.map((c) => (
          <Link
            key={c.key}
            data-card
            className="od-cover-card"
            component={RouterLink}
            href={c.href}
            underline="none"
            sx={{
              flex: '0 0 min(86vw, 600px)',
              scrollSnapAlign: 'center',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 2.5 },
              borderRadius: '4px',
              bgcolor: 'var(--od-papel)',
              color: 'var(--od-tinta)',
              '&:hover .od-img-zoom': { transform: 'scale(1.05)' },
              '&:focus-visible': { outline: '2px solid var(--od-accent)', outlineOffset: 3 },
            }}
          >
            <Box sx={{ order: { xs: 2, sm: 1 }, display: 'flex', flexDirection: 'column', minHeight: { sm: 300 } }}>
              <Box sx={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>{c.category}</Box>
              <Box sx={{ mt: 0.75, fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 28 }, lineHeight: 1.12 }}>{c.title}</Box>
              {c.description && <Box sx={{ mt: 1.5, fontSize: 15, lineHeight: 1.6, color: 'var(--color-neutral-700)' }}>{c.description}</Box>}
              <Box sx={{ mt: 'auto', pt: 2.5, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 30 }, fontVariantNumeric: 'tabular-nums', color: c.soldOut ? 'var(--od-neutro-700)' : 'inherit' }}>
                  {c.soldOut ? 'Agotado' : c.price}
                </Box>
                <Box component="span" sx={{ fontSize: 14, color: 'var(--od-accent)' }}>
                  Ver producto →
                </Box>
              </Box>
            </Box>
            <Box sx={{ order: { xs: 1, sm: 2 }, overflow: 'hidden', borderRadius: '2px' }}>
              <OdImage src={c.image} alt={c.title} label={c.title} ratio="1 / 1" radius={0} sx={{ height: 1 }} />
            </Box>
          </Link>
        ))}
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 1.5, mt: 2 }}>
        <ArrowButton label="Anterior" onClick={() => step(-1)} size={52} sx={{ bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', borderColor: 'var(--od-papel)', '&:hover': { borderColor: 'var(--od-papel)' } }}>
          ←
        </ArrowButton>
        <ArrowButton label="Siguiente" onClick={() => step(1)} size={52} sx={{ bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', borderColor: 'var(--od-papel)', '&:hover': { borderColor: 'var(--od-papel)' } }}>
          →
        </ArrowButton>
      </Box>
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
        <RiseWords>Tres pasos, sin sorpresas</RiseWords>
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
