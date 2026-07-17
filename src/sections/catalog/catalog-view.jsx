'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { AnimalCard } from './animal-card';

// ----------------------------------------------------------------------

// ponytail: el catálogo llega completo del servidor (page_size=100) y los
// filtros son en memoria; filtrar en servidor cuando pase de 100 animales
export function CatalogView({ animals, initialGenusId = null, initialSpeciesId = null }) {
  const [genusId, setGenusId] = useState(initialGenusId);
  const [groupId, setGroupId] = useState(null);
  // species solo llega por URL compartida; cualquier click en chips lo limpia
  const [speciesId, setSpeciesId] = useState(initialSpeciesId);

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
      if (g && (!groupId || g.group?.id === groupId)) map.set(g.id, g.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [animals, groupId]);

  const filtered = animals.filter(
    (a) =>
      (!groupId || a.species?.genus?.group?.id === groupId) &&
      (!genusId || a.species?.genus?.id === genusId) &&
      (!speciesId || a.species?.id === speciesId)
  );

  const selectGroup = (id) => {
    setGroupId(id);
    setGenusId(null);
    setSpeciesId(null);
  };

  const selectGenus = (id) => {
    setGenusId(id);
    setSpeciesId(null);
  };

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
        Catálogo
      </Typography>

      {groups.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Todos"
            variant={groupId ? 'outlined' : 'filled'}
            color={groupId ? 'default' : 'primary'}
            onClick={() => selectGroup(null)}
          />
          {groups.map((g) => (
            <Chip
              key={g.id}
              label={g.name}
              variant={groupId === g.id ? 'filled' : 'outlined'}
              color={groupId === g.id ? 'primary' : 'default'}
              onClick={() => selectGroup(g.id)}
            />
          ))}
        </Stack>
      )}

      {genera.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {genera.map((g) => (
            <Chip
              key={g.id}
              size="small"
              label={g.name}
              variant={genusId === g.id ? 'filled' : 'outlined'}
              color={genusId === g.id ? 'primary' : 'default'}
              onClick={() => selectGenus(genusId === g.id ? null : g.id)}
              sx={{ fontStyle: 'italic' }}
            />
          ))}
        </Stack>
      )}

      {filtered.length ? (
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          }}
        >
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </Box>
      ) : (
        <Typography sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
          No hay animales disponibles por el momento.
        </Typography>
      )}
    </Container>
  );
}
