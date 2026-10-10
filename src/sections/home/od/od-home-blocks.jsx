'use client';

import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { OdPanel } from 'src/layouts/od/od-panel';
import { OdReveal } from 'src/layouts/od/od-motion';
import { rowFillSx } from 'src/layouts/od/od-styles';
import { OdImage, RollText, OdRowGroup } from 'src/layouts/od/od-ui';

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
// Índice de categorías en filas grandes. En escritorio, al pasar el cursor una
// sola vista previa sigue al puntero (patrón "hover image list"); se mueve con
// variables CSS desde un ref, sin re-render por cada pixel. En táctil no hay
// hover: cada fila lleva su miniatura en línea.

export function OdCategoryIndex({ items }) {
  const previewRef = useRef(null);
  const [active, setActive] = useState(null);

  const onMove = (e) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.setProperty('--x', `${e.clientX}px`);
    el.style.setProperty('--y', `${e.clientY}px`);
  };

  return (
    <Box onMouseMove={onMove} onMouseLeave={() => setActive(null)} sx={{ borderBottom: '1px solid var(--color-divider)' }}>
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
            onMouseEnter={() => setActive(i)}
            sx={{
              ...rowFillSx,
              display: 'grid',
              gridTemplateColumns: { xs: '56px 1fr auto', md: '64px 1fr auto 48px' },
              alignItems: 'center',
              gap: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
              px: { md: 3 },
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            <Box className="od-row-num" sx={{ display: { xs: 'none', md: 'block' }, fontSize: 12, letterSpacing: '0.2em', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
              {String(i + 1).padStart(2, '0')}
            </Box>
            {/* miniatura en línea solo en táctil/móvil */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, width: 56 }}>
              <OdImage src={c.img} alt="" ratio="1 / 1" radius={6} />
            </Box>
            <Box sx={{ minWidth: 0, fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 'clamp(34px, 3.6vw, 56px)' }, lineHeight: 1.05 }}>
              <RollText>{c.title}</RollText>
            </Box>
            <Box className="od-row-meta" sx={{ fontSize: { xs: 12, md: 13 }, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-neutral-600)', whiteSpace: 'nowrap', textAlign: 'right' }}>
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

      {/* Vista previa que sigue al cursor (solo con puntero fino). Cada foto
          entra con una cortina de abajo hacia arriba y un zoom que se asienta. */}
      <Box
        ref={previewRef}
        aria-hidden
        sx={{
          display: 'none',
          '@media (hover: hover) and (pointer: fine)': { display: 'block' },
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 5,
          width: 240,
          aspectRatio: '4 / 5',
          pointerEvents: 'none',
          transform: 'translate(calc(var(--x, 0px) - 50%), calc(var(--y, 0px) - 50%))',
          transition: 'transform 500ms var(--od-ease)',
        }}
      >
        {items.map((c, i) => (
          <Box
            key={c.href}
            sx={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              clipPath: i === active ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
              transition: 'clip-path 650ms var(--od-ease)',
              '& img': { transform: i === active ? 'scale(1)' : 'scale(1.3)', transition: 'transform 900ms var(--od-ease)' },
            }}
          >
            <OdImage src={c.img} alt="" ratio="4 / 5" radius={0} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Banda de productos que avanza sola (como la original) y se pausa al pasar el
// cursor; la sección padre pausa `.od-band`. Movimiento reducido: la regla
// global de prefers-reduced-motion la detiene.

export function OdProductRail({ items }) {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Box className="od-band" sx={{ display: 'flex', gap: '18px', width: 'max-content', animation: `odMarquee ${Math.max(40, items.length * 9)}s linear infinite` }}>
        {[...items, ...items].map((c, i) => (
          <Link
            key={`${c.key}-${i}`}
            component={RouterLink}
            href={c.href}
            underline="none"
            data-fx
            aria-hidden={i >= items.length || undefined}
            tabIndex={i >= items.length ? -1 : undefined}
            sx={{
              flex: '0 0 clamp(240px, 21vw, 360px)',
              color: 'inherit',
              '& .od-rail-cta': { transition: 'opacity 300ms, transform 400ms var(--od-ease)' },
              '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
              '@media (hover: hover)': {
                '& .od-rail-cta': { opacity: 0, transform: 'translateY(6px)' },
                '&:hover .od-rail-cta, &:focus-visible .od-rail-cta': { opacity: 1, transform: 'none' },
              },
            }}
          >
            <Box className="od-tilt-lg od-glare" data-fx sx={{ position: 'relative', overflow: 'hidden', '--od-tilt-k': 1.8, '--od-tilt-s': 1.07 }}>
              <OdImage src={c.image} alt={c.title} label={c.title} ratio="4 / 3" radius={0} />
            </Box>
            <Box sx={{ mt: 1.75, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>{c.category}</Box>
            <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
              <Box component="span" sx={{ fontFamily: 'var(--font-heading)', fontSize: 18 }}>{c.title}</Box>
              <Box component="span" sx={{ fontSize: 14, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{c.price}</Box>
            </Box>
            {c.description && (
              <Box sx={{ mt: 0.75, fontSize: 13, lineHeight: 1.55, color: 'var(--color-neutral-600)', maxWidth: '34ch' }}>{c.description}</Box>
            )}
            <Box className="od-rail-cta" sx={{ mt: 1.25, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
              Ver producto →
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Cómo comprar: tres pasos sobre la foto a sangre (antes solo un titular).

const STEPS = [
  { n: '01', title: 'Elige', body: 'Explora el catálogo y abre la ficha: precio, existencias y cuidados de cada especie.' },
  { n: '02', title: 'Paga o aparta', body: 'Con Mercado Pago en línea, o cierra por WhatsApp y aparta con el 50%.' },
  { n: '03', title: 'Recibe', body: 'Te llega la confirmación por correo y coordinamos la entrega en persona en CDMX.' },
];

export function OdHowToBuy({ bg }) {
  return (
    <OdPanel
      id="como-comprar"
      sx={{ scrollMarginTop: 80, px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '72px', md: '110px' }, color: '#f6f4f1' }}
    >
      <OdImage
        src={bg}
        alt=""
        ratio="auto"
        radius={0}
        width={1600}
        sx={{ position: 'absolute', inset: 0, zIndex: -2, aspectRatio: 'auto', borderRadius: 0 }}
      />
      <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, rgba(32,31,29,0.72), rgba(32,31,29,0.5))' }} />

      <OdReveal sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
        <Box sx={{ mb: 1.5, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8 }}>Cómo comprar</Box>
        <Box component="h2" sx={{ m: 0, mx: 'auto', maxWidth: '18ch', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(32px, 4.2vw, 58px)', lineHeight: 1.08 }}>
          Tres pasos, sin sorpresas
        </Box>
      </OdReveal>

      <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, maxWidth: 1200, mx: 'auto' }}>
        {STEPS.map((s, i) => (
          <OdReveal key={s.n} delay={i * 0.1}>
            <Box
              data-fx
              className="od-glow od-tilt"
              sx={{
                '--od-glow': 'rgba(168,69,92,0.45)',
                height: 1,
                p: { xs: '24px 22px', md: '34px 30px' },
                bgcolor: 'rgba(246,244,241,0.08)',
                border: '1px solid rgba(246,244,241,0.22)',
                // el desenfoque cuesta en cada cuadro del scroll: solo escritorio
                backdropFilter: { md: 'blur(6px)' },
                '& .od-step-n': { transition: 'color 300ms' },
                '&:hover': { borderColor: 'rgba(246,244,241,0.5)' },
                '&:hover .od-step-n': { color: 'var(--od-tuna)' },
              }}
            >
              <Box className="od-step-n" sx={{ fontFamily: 'var(--font-heading)', fontSize: 44, lineHeight: 1, opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>{s.n}</Box>
              <Box component="h3" sx={{ m: 0, mt: 2, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 24 }}>{s.title}</Box>
              <Box sx={{ mt: 1, fontSize: 15, lineHeight: 1.65, opacity: 0.85 }}>{s.body}</Box>
            </Box>
          </OdReveal>
        ))}
      </Box>
    </OdPanel>
  );
}
