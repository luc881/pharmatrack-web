import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';

import { STATUS_LABELS, STATUS_COLORS, scientificName } from './utils';

// ----------------------------------------------------------------------

export function AnimalCard({ animal }) {
  const photo = animal.image ?? animal.photos?.[0];
  const sci = scientificName(animal.species);
  const title = animal.species?.common_name ?? sci;
  const available = animal.status === 'available';

  return (
    <Card sx={{ height: 1 }}>
      {!available && (
        <Label
          variant="filled"
          color={STATUS_COLORS[animal.status] ?? 'default'}
          sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}
        >
          {STATUS_LABELS[animal.status] ?? animal.status}
        </Label>
      )}

      <Box sx={{ p: 1 }}>
        <Link
          component={RouterLink}
          href={paths.catalogDetails(animal.id)}
          sx={{ display: 'block' }}
        >
          {photo ? (
            <Image
              alt={title}
              src={photo}
              ratio="1/1"
              sx={{ borderRadius: 1.5, ...(!available && { opacity: 0.64 }) }}
            />
          ) : (
            <Box
              sx={{
                borderRadius: 1.5,
                aspectRatio: '1/1',
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
        </Link>
      </Box>

      <Stack spacing={0.5} sx={{ p: 3, pt: 2 }}>
        <Link
          component={RouterLink}
          href={paths.catalogDetails(animal.id)}
          color="inherit"
          variant="subtitle2"
          noWrap
        >
          {title}
        </Link>

        <Box
          component="span"
          sx={{
            typography: 'caption',
            fontStyle: 'italic',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sci} · {animal.code}
        </Box>

        <Box component="span" sx={{ pt: 1, typography: 'subtitle1' }}>
          {fCurrency(animal.price)}
        </Box>
      </Stack>
    </Card>
  );
}
