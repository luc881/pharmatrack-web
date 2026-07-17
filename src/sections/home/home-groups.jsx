import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

// Recibe las categorías raíz (arácnidos, reptiles, etc.) ya armadas en el servidor
export function HomeGroups({ categories, sx, ...other }) {
  if (categories.length < 2) return null;

  return (
    <Box
      component="section"
      sx={[
        { bgcolor: 'background.neutral', overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ py: { xs: 8, md: 12 } }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Categorías
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 3, mb: 5 }}>
            Explora por grupo
          </Typography>
        </m.div>

        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {categories.map((category) => (
            <Box key={category.id} component={m.div} variants={varFade('inUp')}>
              <Card
                sx={{
                  position: 'relative',
                  '&:hover img': { transform: 'scale(1.06)' },
                }}
              >
                <Link
                  component={RouterLink}
                  href={paths.catalogCategory(category.slug)}
                  color="inherit"
                  underline="none"
                >
                  {category.photo ? (
                    <Image
                      alt={category.name}
                      src={category.photo}
                      ratio="4/3"
                      slotProps={{
                        overlay: {
                          sx: (theme) => ({
                            backgroundImage: `linear-gradient(to bottom, transparent 40%, ${theme.vars.palette.grey[900]})`,
                          }),
                        },
                      }}
                      sx={{ '& img': { transition: 'transform 0.4s ease' } }}
                    />
                  ) : (
                    <Box sx={{ aspectRatio: '4/3', bgcolor: 'background.default' }} />
                  )}

                  <Box
                    sx={{
                      p: 3,
                      left: 0,
                      width: 1,
                      bottom: 0,
                      zIndex: 9,
                      position: 'absolute',
                      color: 'common.white',
                    }}
                  >
                    <Typography variant="h5">{category.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                      Ver disponibles
                    </Typography>
                  </Box>
                </Link>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
