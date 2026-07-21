'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EmptyContent } from 'src/components/empty-content';

import { SpeciesCard } from './species-card';
import { useFavorites } from './use-favorites';

// ----------------------------------------------------------------------

export function FavoritesView({ items }) {
  const { ids } = useFavorites();

  const favorites = items.filter((item) => ids.includes(item.key));

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h3" component="h1" sx={{ mb: { xs: 3, md: 5 }, mt: { xs: 1, md: 3 } }}>
        Favoritos
      </Typography>

      {favorites.length ? (
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {favorites.map((item) => (
            <SpeciesCard key={item.key} item={item} />
          ))}
        </Box>
      ) : (
        <EmptyContent
          filled
          title="Aún no tienes favoritos"
          description="Toca el corazón de cualquier especie del catálogo para guardarla aquí."
          action={
            <Button
              component={RouterLink}
              href={paths.catalog}
              variant="contained"
              sx={{ mt: 3 }}
            >
              Ver catálogo
            </Button>
          }
          sx={{ py: 10 }}
        />
      )}
    </Container>
  );
}
