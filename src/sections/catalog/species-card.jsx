import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';

import { scientificName, saleFormatLabel } from './utils';

// ----------------------------------------------------------------------

export function SpeciesCard({ item }) {
  const { species, slug, photos, minPrice, maxPrice } = item;
  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);
  const href = paths.catalogSpecies(slug);

  return (
    <Card sx={{ height: 1 }}>
      {formatLabel && (
        <Label
          variant="filled"
          color="info"
          sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}
        >
          {formatLabel}
        </Label>
      )}

      <Box sx={{ p: 1 }}>
        <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
          {photos[0] ? (
            <Image alt={title} src={photos[0]} ratio="1/1" sx={{ borderRadius: 1.5 }} />
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
        <Link component={RouterLink} href={href} color="inherit" variant="subtitle2" noWrap>
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
          {sci}
        </Box>

        <Box component="span" sx={{ pt: 1, typography: 'subtitle1' }}>
          {minPrice === maxPrice ? (
            fCurrency(minPrice)
          ) : (
            <>
              <Box component="span" sx={{ typography: 'body2', color: 'text.secondary', mr: 0.5 }}>
                Desde
              </Box>
              {fCurrency(minPrice)}
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
