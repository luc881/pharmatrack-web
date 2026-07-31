'use client';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { OdImage } from 'src/layouts/od/od-ui';

import { useFavorites } from '../use-favorites';

// ----------------------------------------------------------------------
// Tarjeta del catálogo editorial. Recibe un modelo ya normalizado (sirve para
// listados de animales y para productos). El corazón (favoritos, solo animales)
// no navega; el resto de la tarjeta lleva al detalle. `horizontal` la pone en
// fila (imagen a la izquierda) para la vista de lista.
// ----------------------------------------------------------------------

const TAG_VARIANTS = {
  accent: { bgcolor: 'var(--color-accent-400)', color: 'var(--color-accent-900)' },
  neutral: { bgcolor: 'rgba(243,242,242,0.92)', color: 'var(--color-neutral-900)' },
  outline: { bgcolor: 'rgba(243,242,242,0.92)', color: 'var(--color-neutral-900)', border: '1px solid var(--color-divider)' },
};

export function OdCatalogCard({ card, horizontal = false }) {
  const { ids, toggle } = useFavorites();
  const isFavorite = card.favKey ? ids.includes(card.favKey) : false;

  const media = (
    <Box sx={{ position: 'relative', flexShrink: 0, width: horizontal ? { xs: 130, sm: 200 } : '100%' }}>
      <OdImage src={card.image} alt={card.title} label={card.title} ratio="4 / 5" />

      {card.tag && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            px: '14px',
            py: '5px',
            fontSize: 12,
            borderRadius: '999px',
            ...TAG_VARIANTS[card.tagVariant ?? 'neutral'],
          }}
        >
          {card.tag}
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
            top: 10,
            right: 12,
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            color: isFavorite ? 'var(--color-accent-600)' : 'var(--color-neutral-600)',
            transition: 'color 350ms, transform 350ms',
            '&:hover': { transform: 'scale(1.15)' },
          }}
        >
          {isFavorite ? '♥' : '♡'}
        </Box>
      )}
    </Box>
  );

  const info = (
    <Box sx={horizontal ? { minWidth: 0, alignSelf: 'center' } : undefined}>
      <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: horizontal ? 22 : 20 }}>
        {card.title}
      </Box>
      {card.subtitle && (
        <Box sx={{ mt: '3px', mb: '10px', fontSize: 12, opacity: 0.62, fontStyle: card.subtitleItalic ? 'italic' : 'normal' }}>
          {card.subtitle}
        </Box>
      )}
      <Box sx={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{card.price}</Box>
    </Box>
  );

  return (
    <Box
      component={RouterLink}
      href={card.href}
      sx={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: horizontal ? { xs: '18px', md: '28px' } : '14px',
        color: 'inherit',
        textDecoration: 'none',
        '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
        ...(horizontal && { alignItems: 'stretch', py: 2.5, borderBottom: '1px solid var(--color-divider)' }),
      }}
    >
      {media}
      {info}
    </Box>
  );
}
