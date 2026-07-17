'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { varFade, MotionViewport } from 'src/components/animate';
import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from './home-hero';
import { HomeGroups } from './home-groups';
import { HomeFeatured } from './home-featured';

// ----------------------------------------------------------------------

export function HomeView({ animals }) {
  const pageProgress = useScrollProgress();

  // ponytail: sin created_at en la respuesta pública, el id ordena por llegada
  const featured = [...animals].sort((a, b) => b.id - a.id).slice(0, 8);

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      <HomeHero />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        <HomeFeatured animals={featured} />

        <HomeGroups animals={animals} />

        <HomeCTA />
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

function HomeCTA() {
  return (
    <Box component="section" sx={{ overflow: 'hidden' }}>
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <m.div variants={varFade('inUp')}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            ¿Buscas algo en especial?
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Typography sx={{ mx: 'auto', maxWidth: 480, color: 'text.secondary', mb: 5 }}>
            Revisa el catálogo completo con fotos, precios y detalles de cada animal.
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Button
            component={RouterLink}
            href={paths.catalog}
            size="large"
            variant="contained"
            color="primary"
          >
            Ver catálogo
          </Button>
        </m.div>
      </Container>
    </Box>
  );
}
