'use client';

import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EmptyContent } from 'src/components/empty-content';

import { SpeciesCard } from './species-card';
import { CatalogSort } from './catalog-sort';
import { CatalogFilters } from './catalog-filters';

// ----------------------------------------------------------------------

// ponytail: el catálogo llega completo del servidor (page_size=100) y los
// filtros son en memoria; filtrar en servidor cuando pase de 100 animales.
// items = especies agrupadas (buildSpeciesList) — el público no ve folios.
export function CatalogView({ items, categories, category = null }) {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('newest');

  const maxPrice = useMemo(() => Math.max(...items.map((i) => i.maxPrice), 0), [items]);

  const defaults = useMemo(() => ({ sex: [], priceRange: [0, maxPrice] }), [maxPrice]);

  const [state, setState] = useState(defaults);

  const filters = {
    state,
    setState: (patch) => setState((prev) => ({ ...prev, ...patch })),
    resetState: () => setState(defaults),
  };

  const canReset =
    state.sex.length > 0 || state.priceRange[0] !== 0 || state.priceRange[1] !== maxPrice;

  const filtered = applyFilter({ items, state, sortBy });

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        {category ? category.name : 'Catálogo'}
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {categories.length > 1 ? (
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                clickable
                component={RouterLink}
                href={paths.catalog}
                label="Todos"
                variant={category ? 'outlined' : 'filled'}
                color={category ? 'default' : 'primary'}
              />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  clickable
                  component={RouterLink}
                  href={paths.catalogCategory(c.slug)}
                  label={c.name}
                  variant={category?.id === c.id ? 'filled' : 'outlined'}
                  color={category?.id === c.id ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          ) : (
            <div />
          )}

          <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
            <CatalogFilters
              filters={filters}
              canReset={canReset}
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              options={{ maxPrice }}
            />

            <CatalogSort sort={sortBy} onSort={setSortBy} />
          </Box>
        </Box>

        {canReset && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>{filtered.length}</strong> resultado{filtered.length === 1 ? '' : 's'}
          </Typography>
        )}
      </Stack>

      {filtered.length ? (
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {filtered.map((item) => (
            <SpeciesCard key={item.species.id} item={item} />
          ))}
        </Box>
      ) : (
        <EmptyContent
          filled
          title={canReset ? 'Sin resultados' : 'No hay animales disponibles por el momento'}
          sx={{ py: 10 }}
        />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ items, state, sortBy }) {
  let data = items.filter(
    (i) =>
      (!state.sex.length || i.sexes.some((s) => state.sex.includes(s))) &&
      i.minPrice >= state.priceRange[0] &&
      i.minPrice <= state.priceRange[1]
  );

  // ponytail: sin created_at en la respuesta pública, el id ordena por llegada
  if (sortBy === 'newest') data = [...data].sort((a, b) => b.latestId - a.latestId);
  if (sortBy === 'priceAsc') data = [...data].sort((a, b) => a.minPrice - b.minPrice);
  if (sortBy === 'priceDesc') data = [...data].sort((a, b) => b.minPrice - a.minPrice);

  return data;
}
