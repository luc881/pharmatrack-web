'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { OdImage } from 'src/layouts/od/od-ui';

import { useFavorites } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------
// Tarjeta de la selección de isópodos (home). Datos reales del catálogo;
// reutiliza el toggle de favoritos. El corazón no navega (para y detiene el
// evento); el resto de la tarjeta lleva a la ficha.
// ----------------------------------------------------------------------

export function OdProductCard({ item, isNew = false }) {
  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(item.key);

  const category = item.species?.genus?.group?.name ?? 'Isópodos';
  const priceLabel =
    item.minPrice !== item.maxPrice ? `Desde ${fCurrency(item.minPrice)}` : fCurrency(item.minPrice);

  return (
    <Box
      component={RouterLink}
      href={paths.catalogSpecies(item.slug)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        color: 'inherit',
        textDecoration: 'none',
        borderRadius: '16px',
        bgcolor: 'var(--color-neutral-100)',
        border: '1px solid var(--color-divider)',
        transition: 'transform 450ms var(--od-ease), box-shadow 450ms',
        '&:hover': { transform: 'translateY(-8px)', boxShadow: 'var(--shadow-md)' },
        '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
      }}
    >
      <Box sx={{ position: 'relative', m: '10px' }}>
        <OdImage src={item.photos?.[0]} alt={item.title} label={item.title} ratio="3 / 4.3" />

        {isNew && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              px: '14px',
              py: '5px',
              fontSize: 12,
              borderRadius: '999px',
              bgcolor: 'var(--color-accent-400)',
              color: 'var(--color-accent-900)',
            }}
          >
            Nuevo
          </Box>
        )}

        <Box
          component="button"
          type="button"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggle(item.key);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            fontSize: 17,
            lineHeight: 1,
            color: isFavorite ? 'var(--color-accent-600)' : 'var(--color-neutral-600)',
            transition: 'color 350ms, transform 350ms',
            '&:hover': { transform: 'scale(1.15)' },
          }}
        >
          {isFavorite ? '♥' : '♡'}
        </Box>
      </Box>

      <Box sx={{ px: '18px', pt: '16px', pb: '20px', mt: 'auto' }}>
        <Box sx={{ mb: 0.5, fontSize: 13, color: 'var(--color-neutral-600)' }}>{category}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px' }}>
          <Box
            component="h3"
            sx={{
              m: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '0.02em',
            }}
          >
            {item.title}
          </Box>
          <Box sx={{ fontSize: 14, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {priceLabel}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
