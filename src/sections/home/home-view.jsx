'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { AnimalCard } from 'src/sections/catalog/animal-card';

// ----------------------------------------------------------------------

export function HomeView({ featured }) {
  return (
    <>
      {/* Hero */}
      <Box
        sx={(theme) => ({
          py: { xs: 10, md: 15 },
          textAlign: 'center',
          background: `linear-gradient(180deg, ${theme.vars.palette.background.neutral}, ${theme.vars.palette.background.default})`,
        })}
      >
        <Container>
          <Typography variant="h1" sx={{ mb: 2 }}>
            {CONFIG.appName}
          </Typography>
          <Typography sx={{ mb: 4, mx: 'auto', maxWidth: 480, color: 'text.secondary' }}>
            Tarántulas, reptiles y más animales exóticos con procedencia legal, criados con
            cuidado y listos para un nuevo hogar.
          </Typography>
          <Button
            component={RouterLink}
            href={paths.catalog}
            size="large"
            variant="contained"
            color="primary"
          >
            Ver catálogo
          </Button>
        </Container>
      </Box>

      {/* Destacados */}
      {featured.length > 0 && (
        <Container sx={{ py: { xs: 5, md: 8 } }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Recién llegados
          </Typography>
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            }}
          >
            {featured.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </Box>
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button component={RouterLink} href={paths.catalog} size="large" variant="outlined">
              Ver todo el catálogo
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
}
