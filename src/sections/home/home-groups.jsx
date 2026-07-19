import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';

import { SectionLabel } from 'src/sections/catalog/scientific';

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

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
      <Container
        component={MotionViewport}
        variants={slowStagger}
        sx={{ py: { xs: 8, md: 12 } }}
      >
        <m.div variants={slowFade('inDown')}>
          <SectionLabel sx={{ justifyContent: 'flex-start' }}>Categorías</SectionLabel>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 2, mb: 5 }}>
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
                  // zoom lento con easing suave + el texto sube y revela el CTA
                  '& img': { transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)' },
                  '&:hover img': { transform: 'scale(1.07)' },
                  '& .grp-text': {
                    transform: 'translateY(22px)',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  },
                  '&:hover .grp-text': { transform: 'translateY(0)' },
                  '& .grp-cta': {
                    opacity: 0,
                    transform: 'translateY(6px)',
                    transition: 'opacity 0.4s ease 0.08s, transform 0.4s ease 0.08s',
                  },
                  '&:hover .grp-cta': { opacity: 1, transform: 'translateY(0)' },
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
                    />
                  ) : (
                    <Box sx={{ aspectRatio: '4/3', bgcolor: 'background.default' }} />
                  )}

                  <Box
                    className="grp-text"
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
                    <Box
                      className="grp-cta"
                      sx={{ gap: 0.5, display: 'flex', alignItems: 'center', typography: 'body2' }}
                    >
                      Ver disponibles
                      <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                    </Box>
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
