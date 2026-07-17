import { m } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

import { AnimalCard } from 'src/sections/catalog/animal-card';

// ----------------------------------------------------------------------

export function HomeFeatured({ animals, sx, ...other }) {
  const carousel = useCarousel(
    {
      align: 'start',
      loop: true,
      slideSpacing: '24px',
      slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  if (!animals.length) return null;

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Novedades
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Typography variant="h2" sx={{ my: 3 }}>
            Recién llegados
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />

          <Carousel carousel={carousel} sx={{ px: 0.5 }}>
            {animals.map((animal) => (
              <Box
                key={animal.id}
                component={m.div}
                variants={varFade('in')}
                sx={{ py: { xs: 5, md: 8 }, textAlign: 'left' }}
              >
                <AnimalCard animal={animal} />
              </Box>
            ))}
          </Carousel>
        </Box>

        <Button
          component={RouterLink}
          href={paths.catalog}
          size="large"
          color="inherit"
          variant="outlined"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={24} />}
          sx={{ mx: 'auto' }}
        >
          Ver todo el catálogo
        </Button>
      </Container>
    </Box>
  );
}
