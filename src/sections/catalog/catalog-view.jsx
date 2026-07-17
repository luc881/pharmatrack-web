'use client';

import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { EmptyContent } from 'src/components/empty-content';

import { AnimalCard } from './animal-card';
import { CatalogSort } from './catalog-sort';
import { CatalogFilters } from './catalog-filters';

// ----------------------------------------------------------------------

// ponytail: el catálogo llega completo del servidor (page_size=100) y los
// filtros son en memoria; filtrar en servidor cuando pase de 100 animales
export function CatalogView({
  animals,
  initialGroupId = null,
  initialGenusId = null,
  initialSpeciesId = null,
}) {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('newest');

  const maxPrice = useMemo(
    () => Math.max(...animals.map((a) => a.price), 0),
    [animals]
  );

  const defaults = useMemo(
    () => ({ groupId: null, genusId: null, speciesId: null, sex: [], priceRange: [0, maxPrice] }),
    [maxPrice]
  );

  const [state, setStateRaw] = useState({
    ...defaults,
    groupId: initialGroupId,
    genusId: initialGenusId,
    speciesId: initialSpeciesId,
  });

  const filters = {
    state,
    setState: (patch) =>
      setStateRaw((prev) => {
        const next = { ...prev, ...patch };
        // cambiar de grupo o género invalida la selección más específica
        if ('groupId' in patch) Object.assign(next, { genusId: null, speciesId: null });
        if ('genusId' in patch) next.speciesId = null;
        return next;
      }),
    resetState: () => setStateRaw(defaults),
  };

  const groups = useMemo(() => {
    const map = new Map();
    animals.forEach((a) => {
      const g = a.species?.genus?.group;
      if (g) map.set(g.id, g.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [animals]);

  const genera = useMemo(() => {
    const map = new Map();
    animals.forEach((a) => {
      const g = a.species?.genus;
      if (g && (!state.groupId || g.group?.id === state.groupId)) map.set(g.id, g.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [animals, state.groupId]);

  const canReset =
    !!state.groupId ||
    !!state.genusId ||
    !!state.speciesId ||
    state.sex.length > 0 ||
    state.priceRange[0] !== 0 ||
    state.priceRange[1] !== maxPrice;

  const filtered = applyFilter({ animals, state, sortBy });

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        Catálogo
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        <Box sx={{ gap: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <CatalogFilters
            filters={filters}
            canReset={canReset}
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            options={{ groups, genera, maxPrice }}
          />

          <CatalogSort sort={sortBy} onSort={setSortBy} />
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
      (!state.groupId || a.species?.genus?.group?.id === state.groupId) &&
      (!state.genusId || a.species?.genus?.id === state.genusId) &&
      (!state.speciesId || a.species?.id === state.speciesId) &&
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
