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

import { AnimalCard } from './animal-card';
import { CatalogSort } from './catalog-sort';
import { CatalogFilters } from './catalog-filters';

// ----------------------------------------------------------------------

// ponytail: el catálogo llega completo del servidor (page_size=100) y los
// filtros son en memoria; filtrar en servidor cuando pase de 100 animales.
// Las categorías (grupos raíz) son links reales para que Google las indexe.
export function CatalogView({ animals, categories, category = null }) {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('newest');

  const maxPrice = useMemo(() => Math.max(...animals.map((a) => a.price), 0), [animals]);

  const defaults = useMemo(() => ({ sex: [], priceRange: [0, maxPrice] }), [maxPrice]);

  const [state, setState] = useState(defaults);

  const filters = {
    state,
    setState: (patch) => setState((prev) => ({ ...prev, ...patch })),
    resetState: () => setState(defaults),
  };

  const canReset =
    state.sex.length > 0 || state.priceRange[0] !== 0 || state.priceRange[1] !== maxPrice;

  const filtered = applyFilter({ animals, state, sortBy });

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
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
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

function applyFilter({ animals, state, sortBy }) {
  let data = animals.filter(
    (a) =>
      (!state.sex.length || state.sex.includes(a.sex)) &&
      a.price >= state.priceRange[0] &&
      a.price <= state.priceRange[1]
  );

  // ponytail: sin created_at en la respuesta pública, el id ordena por llegada
  if (sortBy === 'newest') data = [...data].sort((a, b) => b.id - a.id);
  if (sortBy === 'priceAsc') data = [...data].sort((a, b) => a.price - b.price);
  if (sortBy === 'priceDesc') data = [...data].sort((a, b) => b.price - a.price);

  return data;
}
