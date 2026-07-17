'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

import { SpeciesCard } from './species-card';

// ----------------------------------------------------------------------

export function RelatedSpecies({ items, sx, ...other }) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 },
  });

  if (!items.length) return null;

  return (
    <Box component="section" sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        También te puede interesar
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />

        <Carousel carousel={carousel} sx={{ px: 0.5, py: 1 }}>
          {items.map((item) => (
            <SpeciesCard key={item.species.id} item={item} />
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}
