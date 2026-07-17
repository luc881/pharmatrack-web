import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { scientificName } from './utils';

// ----------------------------------------------------------------------

export function AnimalCard({ animal }) {
  const photo = animal.image ?? animal.photos?.[0];
  const sci = scientificName(animal.species);
  const title = animal.species?.common_name ?? sci;

  return (
    <Card sx={{ height: 1 }}>
      <Link
        component={RouterLink}
        href={paths.catalogDetails(animal.id)}
        color="inherit"
        underline="none"
        sx={{ display: 'block', height: 1 }}
      >
        {photo ? (
          <Box
            component="img"
            src={photo}
            alt={title}
            sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box
            sx={{
              width: 1,
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.neutral',
              color: 'text.disabled',
              typography: 'caption',
            }}
          >
            Sin foto
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            {sci} · {animal.code}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, color: 'primary.main' }}>
            {fCurrency(animal.price)}
          </Typography>
        </Box>
      </Link>
    </Card>
  );
}
