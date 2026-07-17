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

export function HomeGroups({ animals, sx, ...other }) {
  // ponytail: los grupos salen de los animales ya cargados; foto = primer animal con imagen
  const groups = [];
  const seen = new Map();
  animals.forEach((animal) => {
    const group = animal.species?.genus?.group;
    if (!group) return;
    if (!seen.has(group.id)) {
      const entry = { id: group.id, name: group.name, count: 0, photo: null };
      seen.set(group.id, entry);
      groups.push(entry);
    }
    const entry = seen.get(group.id);
    entry.count += 1;
    if (!entry.photo) entry.photo = animal.image ?? animal.photos?.[0] ?? null;
  });

  if (groups.length < 2) return null;

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
          {groups.map((group) => (
            <Box key={group.id} component={m.div} variants={varFade('inUp')}>
              <Card
                sx={{
                  position: 'relative',
                  '&:hover img': { transform: 'scale(1.06)' },
                }}
              >
                <Link
                  component={RouterLink}
                  href={`${paths.catalog}?group_id=${group.id}`}
                  color="inherit"
                  underline="none"
                >
                  {group.photo ? (
                    <Image
                      alt={group.name}
                      src={group.photo}
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
                    <Typography variant="h5">{group.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                      {group.count} {group.count === 1 ? 'disponible' : 'disponibles'}
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
