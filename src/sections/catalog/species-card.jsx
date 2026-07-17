'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useFavorites } from './use-favorites';
import { scientificName, saleFormatLabel } from './utils';

// ----------------------------------------------------------------------

function FavoriteButton({ speciesId, sx }) {
  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(speciesId);

  return (
    <IconButton
      size="small"
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(speciesId);
      }}
      sx={[
        (theme) => ({
          bgcolor: 'background.paper',
          boxShadow: theme.vars.customShadows?.z8,
          '&:hover': { bgcolor: 'background.paper' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Iconify
        width={18}
        icon={isFavorite ? 'solar:heart-bold' : 'solar:heart-outline'}
        sx={{ color: isFavorite ? 'error.main' : 'text.secondary' }}
      />
    </IconButton>
  );
}

function PriceText({ minPrice, maxPrice, sx }) {
  return (
    <Box component="span" sx={[{ typography: 'subtitle1' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {minPrice !== maxPrice && (
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary', mr: 0.5 }}>
          Desde
        </Box>
      )}
      {fCurrency(minPrice)}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function SpeciesCard({ item, horizontal = false }) {
  const { species, slug, photos, minPrice, maxPrice } = item;
  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);
  const groupName = species.genus?.group?.name;
  const href = paths.catalogSpecies(slug);

  const renderImage = (sx) =>
    photos[0] ? (
      <Image alt={title} src={photos[0]} ratio="1/1" sx={sx} />
    ) : (
      <Box
        sx={{
          ...sx,
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
    );

  if (horizontal) {
    return (
      <Card sx={{ display: 'flex', '&:hover img': { transform: 'scale(1.08)' } }}>
        <Box sx={{ p: 1, position: 'relative', width: { xs: 144, sm: 240 }, flexShrink: 0 }}>
          {formatLabel && (
            <Label
              variant="filled"
              color="info"
              sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute' }}
            >
              {formatLabel}
            </Label>
          )}
          <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
            {renderImage({
              borderRadius: 1.5,
              overflow: 'hidden',
              '& img': { transition: 'transform 0.4s ease' },
            })}
          </Link>
        </Box>

        <Stack spacing={1} sx={{ p: 3, flexGrow: 1, minWidth: 0, justifyContent: 'center' }}>
          {groupName && (
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              {groupName}
            </Typography>
          )}

          <Link component={RouterLink} href={href} color="inherit" variant="subtitle1" noWrap>
            {title}
          </Link>

          <Typography
            variant="body2"
            noWrap
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            {sci}
          </Typography>

          <PriceText minPrice={minPrice} maxPrice={maxPrice} />

          <Box sx={{ pt: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
            <Button component={RouterLink} href={href} size="small" variant="outlined">
              Ver detalle
            </Button>
            <FavoriteButton speciesId={species.id} />
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: 1,
        '&:hover img': { transform: 'scale(1.08)' },
        '&:hover .quick-cta': { opacity: 1, transform: 'translateY(0)' },
      }}
    >
      {formatLabel && (
        <Label
          variant="filled"
          color="info"
          sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute' }}
        >
          {formatLabel}
        </Label>
      )}

      <FavoriteButton
        speciesId={species.id}
        sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}
      />

      <Box sx={{ p: 1, position: 'relative' }}>
        <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
          {renderImage({
            borderRadius: 1.5,
            overflow: 'hidden',
            '& img': { transition: 'transform 0.4s ease' },
          })}
        </Link>

        <Button
          className="quick-cta"
          component={RouterLink}
          href={href}
          fullWidth
          variant="contained"
          color="inherit"
          sx={{
            left: 8,
            right: 8,
            bottom: 8,
            zIndex: 9,
            width: 'auto',
            position: 'absolute',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: (theme) =>
              theme.transitions.create(['opacity', 'transform'], { duration: 250 }),
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          Ver detalle
        </Button>
      </Box>

      <Stack spacing={0.5} sx={{ p: 3, pt: 2, textAlign: 'center', alignItems: 'center' }}>
        {groupName && (
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            {groupName}
          </Typography>
        )}

        <Link component={RouterLink} href={href} color="inherit" variant="subtitle2" noWrap sx={{ maxWidth: 1 }}>
          {title}
        </Link>

        <Box
          component="span"
          sx={{
            maxWidth: 1,
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

        <PriceText minPrice={minPrice} maxPrice={maxPrice} sx={{ pt: 1 }} />
      </Stack>
    </Card>
  );
}
