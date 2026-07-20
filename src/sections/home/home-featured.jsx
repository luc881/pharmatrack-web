import { m } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

import { SectionLabel } from 'src/sections/catalog/scientific';
import { SpeciesCard } from 'src/sections/catalog/species-card';

// stagger más lento y entradas más largas: los reveals se sienten deliberados
const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

// ----------------------------------------------------------------------

export function HomeFeatured({
  items,
  label = 'Novedades',
  title = 'Recién llegados',
  href = paths.catalog,
  ctaLabel = 'Ver todo el catálogo',
  sx,
  ...other
}) {
  const carousel = useCarousel(
    {
      align: 'start',
      loop: true,
      slideSpacing: '24px',
      slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  if (!items.length) return null;

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container
        component={MotionViewport}
        variants={slowStagger}
        sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}
      >
        <m.div variants={slowFade('inDown')}>
          <SectionLabel>{label}</SectionLabel>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
            {title}
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          {items.length > 4 && (
            <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />
          )}

          <Carousel carousel={carousel} sx={{ px: 0.5 }}>
            {items.map((item) => (
              <Box
                key={item.species.id}
                component={m.div}
                variants={varFade('in')}
                sx={{ py: { xs: 5, md: 8 }, textAlign: 'left' }}
              >
                <SpeciesCard item={item} />
              </Box>
            ))}
          </Carousel>
        </Box>

        <Button
          component={RouterLink}
          href={href}
          size="large"
          color="inherit"
          variant="outlined"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={24} />}
          sx={{ mx: 'auto' }}
        >
          {ctaLabel}
        </Button>
      </Container>
    </Box>
  );
}
