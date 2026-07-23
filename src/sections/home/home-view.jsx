'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeFaq } from './home-faq';
import { HomeHero } from './home-hero';
import { HomeGroups } from './home-groups';
import { HomeReviews } from './home-reviews';
import { HomeFeatured } from './home-featured';
import { HomeArticles } from './home-articles';

// ----------------------------------------------------------------------

export function HomeView({
  species,
  categories,
  featuredCategories = [],
  showCategoryBrowse = true,
  shippingEnabled = true,
  articles = [],
}) {
  const pageProgress = useScrollProgress();

  // ponytail: sin created_at en la respuesta pública, el id ordena por llegada
  const featured = [...species].sort((a, b) => b.latestId - a.latestId).slice(0, 8);

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
        <HomeFeatured items={featured} />

        {/* Mini-catálogos por categoría destacada (toggle por grupo en el dashboard) */}
        {featuredCategories.map((category) => (
          <HomeFeatured
            key={category.id}
            items={category.species}
            label="Categoría"
            title={category.name}
            href={paths.catalogCategory(category.slug)}
            ctaLabel={`Ver todos los ${category.name.toLowerCase()}`}
          />
        ))}

        {showCategoryBrowse && <HomeGroups categories={categories} />}

        <HomeArticles articles={articles} />

        <HomeReviews />

        <HomeFaq shippingEnabled={shippingEnabled} />

        <HomeCTA />
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

function HomeCTA() {
  return (
    <Box component="section" sx={{ overflow: 'hidden' }}>
      <Container
        component={MotionViewport}
        variants={varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } })}
        sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}
      >
        <m.div variants={varFade('inUp', { distance: 40, transitionIn: { duration: 0.9 } })}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            ¿Buscas algo en especial?
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp', { distance: 40, transitionIn: { duration: 0.9 } })}>
          <Typography sx={{ mx: 'auto', maxWidth: 480, color: 'text.secondary', mb: 5 }}>
            Revisa el catálogo completo con fotos, precios y detalles de cada animal.
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp', { distance: 40, transitionIn: { duration: 0.9 } })}>
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
