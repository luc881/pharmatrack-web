'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { OdReveal } from 'src/layouts/od/od-motion';
import { Pill, Kicker, Display } from 'src/layouts/od/od-ui';

import { useFavorites } from '../use-favorites';
import { OdProductCard } from '../../home/od/od-product-card';

// ----------------------------------------------------------------------
// Favoritos: mini-catálogo con la piel editorial (localStorage vía useFavorites).
// ----------------------------------------------------------------------

export function OdFavoritesView({ items = [] }) {
  const { ids } = useFavorites();
  const favorites = items.filter((item) => ids.includes(item.key));

  return (
    <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <Box className="od-rise">
        <Kicker sx={{ mb: 2.5 }}>Tu selección</Kicker>
        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02, mb: { xs: 4, md: 6 } }}>
          Favoritos
        </Display>
      </Box>

      {favorites.length ? (
        <Box sx={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {favorites.map((item, i) => (
            <OdReveal key={item.key} delay={Math.min(i, 8) * 0.06}>
              <OdProductCard item={item} />
            </OdReveal>
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Box sx={{ mb: 1, fontFamily: 'var(--font-heading)', fontSize: 24 }}>Aún no tienes favoritos</Box>
          <Box sx={{ mb: 4, fontSize: 15, color: 'var(--color-neutral-600)' }}>
            Toca el corazón de cualquier especie del catálogo para guardarla aquí.
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pill href={paths.catalog}>Ver catálogo</Pill>
          </Box>
        </Box>
      )}
    </Box>
  );
}
