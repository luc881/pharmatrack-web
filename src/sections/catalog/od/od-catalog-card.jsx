'use client';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { OdImage } from 'src/layouts/od/od-ui';

import { useFavorites } from '../use-favorites';

// ----------------------------------------------------------------------
// Tarjeta del catálogo editorial. Imagen cuadrada; al hover baja una cortina
// con la segunda foto, aparece el corazón y sube la barra de acción desde el
// borde inferior. Debajo: etiqueta CÓDIGO · CATEGORÍA + nombre + precio.
// `horizontal` la pone en fila (vista de lista). El estado de hover se pasa a
// los hijos con la variable --od-h (0 → 1).
// ----------------------------------------------------------------------

const BADGE_VARIANTS = {
  accent: { bgcolor: 'var(--color-accent-400)', color: 'var(--color-accent-900)' },
  neutral: { bgcolor: 'rgba(243,242,242,0.92)', color: 'var(--color-neutral-900)' },
  outline: { bgcolor: 'rgba(243,242,242,0.92)', color: 'var(--color-neutral-900)', border: '1px solid var(--color-divider)' },
};

const pad3 = (n) => String(n).padStart(3, '0');

export function OdCatalogCard({ card, index = 0, horizontal = false }) {
  const { ids, toggle } = useFavorites();
  const isFavorite = card.favKey ? ids.includes(card.favKey) : false;
  const soldOut = card.badge === 'Agotado';

  const code = card.codePrefix ? `${card.codePrefix}-${pad3(index + 1)}` : null;

  const media = (
    <Box sx={{ position: 'relative', flexShrink: 0, width: horizontal ? { xs: 130, sm: 200 } : '100%', aspectRatio: '1 / 1', overflow: 'hidden', bgcolor: 'var(--color-neutral-200)' }}>
      <Box sx={{ position: 'absolute', inset: 0, opacity: soldOut ? 0.55 : 1 }}>
        <OdImage src={card.image} alt={card.title} label={card.title} ratio="1 / 1" radius={0} sx={{ width: 1, height: 1 }} />
      </Box>

      {/* Cortina: segunda foto que baja desde arriba al hover */}
      {!horizontal && card.image2 && card.image2 !== card.image && (
        <Box
          component="img"
          src={card.image2}
          alt=""
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            clipPath: 'inset(0 0 calc(100% - var(--od-h, 0) * 100%) 0)',
            transition: 'clip-path 700ms var(--od-ease)',
          }}
        />
      )}

      {card.badge && (
        <Box sx={{ position: 'absolute', top: 12, left: 12, px: '12px', py: '5px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', ...BADGE_VARIANTS[card.badgeVariant ?? 'neutral'] }}>
          {card.badge}
        </Box>
      )}

      {card.favKey && (
        <Box
          component="button"
          type="button"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggle(card.favKey);
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'grid',
            placeItems: 'center',
            width: 38,
            height: 38,
            border: 0,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            bgcolor: 'rgba(243,242,242,0.9)',
            color: isFavorite ? 'var(--color-accent-700)' : 'var(--color-neutral-700)',
            // en escritorio aparece al hover; en móvil (sin hover) siempre visible
            opacity: { xs: 1, md: 'var(--od-h, 0)' },
            transition: 'opacity 420ms ease, color 300ms',
            '&:hover': { color: 'var(--color-accent-700)' },
          }}
        >
          {isFavorite ? '♥' : '♡'}
        </Box>
      )}

      {/* Barra de acción que sube desde el borde inferior */}
      {!horizontal && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: '14px',
            py: '12px',
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            bgcolor: 'rgba(243,242,242,0.94)',
            color: 'var(--color-neutral-900)',
            transform: 'translateY(calc((1 - var(--od-h, 0)) * 100%))',
            transition: 'transform 700ms var(--od-ease)',
            // en móvil (sin hover) siempre visible
            '@media (hover: none)': { transform: 'none' },
          }}
        >
          {card.addLabel}
        </Box>
      )}
    </Box>
  );

  const info = (
    <Box sx={horizontal ? { minWidth: 0, alignSelf: 'center' } : { mt: '16px' }}>
      <Box sx={{ mb: '10px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {code && <Box component="span" sx={{ color: 'var(--color-accent-700)', fontVariantNumeric: 'tabular-nums' }}>{code}&nbsp;&nbsp;|&nbsp;&nbsp;</Box>}
        <Box component="span" sx={{ color: 'var(--color-neutral-600)' }}>{card.category}</Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px' }}>
        <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: horizontal ? 22 : 20 }}>
          {card.title}
        </Box>
        <Box sx={{ fontSize: 14, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{card.price}</Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component={RouterLink}
      href={card.href}
      sx={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: horizontal ? { xs: '18px', md: '28px' } : 0,
        color: 'inherit',
        textDecoration: 'none',
        '--od-h': 0,
        '&:hover': { '--od-h': 1 },
        '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
        ...(horizontal && { alignItems: 'stretch', py: 2.5, borderBottom: '1px solid var(--color-divider)' }),
      }}
    >
      {media}
      {info}
    </Box>
  );
}
