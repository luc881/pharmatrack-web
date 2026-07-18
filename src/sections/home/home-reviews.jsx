import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';

import { SectionLabel } from 'src/sections/catalog/scientific';

import { REVIEWS } from './home-content';

// ----------------------------------------------------------------------

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

export function HomeReviews({ sx, ...other }) {
  const carousel = useCarousel({ loop: true, slidesToShow: 1 });

  if (!REVIEWS.length) return null;

  const average = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <Box
      component="section"
      sx={[
        { bgcolor: 'background.neutral', overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container
        component={MotionViewport}
        variants={slowStagger}
        sx={{ py: { xs: 8, md: 12 }, maxWidth: { md: 880 }, textAlign: 'center' }}
      >
        <m.div variants={slowFade('inDown')}>
          <SectionLabel>Reseñas</SectionLabel>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 2, mb: 1 }}>
            Lo que dicen nuestros clientes
          </Typography>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 5, alignItems: 'center', justifyContent: 'center' }}
          >
            <Rating value={average} precision={0.1} readOnly size="small" />
            <Typography variant="subtitle2">{average.toFixed(1)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({REVIEWS.length})
            </Typography>
          </Stack>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Carousel carousel={carousel}>
            {REVIEWS.map((review, index) => (
              <Stack
                key={index}
                spacing={2.5}
                sx={{
                  px: { xs: 3, md: 10 },
                  py: { xs: 4, md: 6 },
                  alignItems: 'center',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Iconify
                  icon="mingcute:quote-left-fill"
                  width={40}
                  sx={{ color: 'primary.main' }}
                />

                <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 640 }}>
                  {review.text}
                </Typography>

                <Rating value={review.rating} readOnly />

                <Typography variant="subtitle1">{review.name}</Typography>

                {review.species && review.href && (
                  <Link
                    component={RouterLink}
                    href={review.href}
                    variant="body2"
                    color="inherit"
                    sx={{ textDecoration: 'underline' }}
                  >
                    {review.species}
                  </Link>
                )}
              </Stack>
            ))}
          </Carousel>

          {REVIEWS.length > 1 && (
            <CarouselArrowBasicButtons
              {...carousel.arrows}
              options={carousel.options}
              sx={{ mt: 4, gap: 1, justifyContent: 'center' }}
            />
          )}
        </m.div>
      </Container>
    </Box>
  );
}
