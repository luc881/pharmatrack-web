'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { OdReveal } from 'src/layouts/od/od-motion';
import { Pill, Display, OdEmpty } from 'src/layouts/od/od-ui';

import { useFavorites } from '../use-favorites';
import { animalToCard } from './od-catalog-view';
import { OdCatalogCard } from './od-catalog-card';

// ----------------------------------------------------------------------
// Favoritos: mini-catálogo con la piel editorial (localStorage vía useFavorites).
// ----------------------------------------------------------------------

export function OdFavoritesView({ items = [] }) {
  const { ids } = useFavorites();
  const favorites = items.filter((item) => ids.includes(item.key));

  return (
    <Box component="section" sx={{ px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <Box className="od-rise">
        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02, mb: { xs: 4, md: 6 } }}>
          Favoritos
        </Display>
      </Box>

      {favorites.length ? (
        <Box sx={{ display: 'grid', gap: '44px 28px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {favorites.map((item, i) => (
            <OdReveal key={item.key} delay={Math.min(i, 8) * 0.06}>
              <OdCatalogCard card={animalToCard(item)} index={i} />
            </OdReveal>
          ))}
        </Box>
      ) : (
        <OdEmpty title="Aún no tienes favoritos" action={<Pill href={paths.catalog}>Ver catálogo</Pill>}>
          Toca el corazón de cualquier especie del catálogo para guardarla aquí.
        </OdEmpty>
      )}
    </Box>
  );
}
