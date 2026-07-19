'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useFavorites } from './use-favorites';
import { scientificName, saleFormatLabel } from './utils';
import { TaxonomyBadge, ScientificName } from './scientific';

// ----------------------------------------------------------------------

function FavoriteButton({ speciesId, reveal = false, sx }) {
  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(speciesId);

  return (
    <IconButton
      size="small"
      className="fav-btn"
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
        // aparece suave al pasar el cursor; si ya es favorito (o es táctil) queda fijo
        reveal && !isFavorite && {
          opacity: 0,
          transform: 'translateY(-6px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
          '@media (hover: none)': { opacity: 1, transform: 'none' },
        },
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

function NoPhoto() {
  return (
    <Box
      sx={{
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
}

// ----------------------------------------------------------------------

export function SpeciesCard({ item, horizontal = false }) {
  const { species, slug, photos, minPrice, maxPrice } = item;
  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);
  const groupName = species.genus?.group?.name;
  const href = paths.catalogSpecies(slug);
  const hoverPhoto = photos[1];

  if (horizontal) {
    return (
      <Card sx={{ display: 'flex', '&:hover img': { transform: 'scale(1.06)' } }}>
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
            {photos[0] ? (
              <Image
                alt={title}
                src={photos[0]}
                ratio="1/1"
                sx={{
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  '& img': { transition: 'transform 0.6s ease' },
                }}
              />
            ) : (
              <Box sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                <NoPhoto />
              </Box>
            )}
          </Link>
        </Box>

        <Stack spacing={1} sx={{ p: 3, flexGrow: 1, minWidth: 0, justifyContent: 'center' }}>
          {groupName && (
            <Box>
              <TaxonomyBadge>{groupName}</TaxonomyBadge>
            </Box>
          )}

          <Link component={RouterLink} href={href} color="inherit" variant="subtitle1" noWrap>
            {title}
          </Link>

          <ScientificName
            sx={{
              display: 'block',
              typography: 'body2',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {sci}
          </ScientificName>

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
        // la foto principal cede a la segunda con un zoom suave que se asienta
        ...(hoverPhoto
          ? {
              '&:hover .img-main': { opacity: 0 },
              '&:hover .img-hover': { opacity: 1, transform: 'scale(1)' },
            }
          : { '&:hover .img-main img': { transform: 'scale(1.08)' } }),
        '&:hover .quick-cta': { opacity: 1, transform: 'translateY(0)' },
        '&:hover .fav-btn': { opacity: 1, transform: 'translateY(0)' },
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
        reveal
        speciesId={species.id}
        sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}
      />

      <Box sx={{ p: 1, position: 'relative' }}>
        <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
          <Box sx={{ borderRadius: 1.5, overflow: 'hidden', position: 'relative' }}>
            {photos[0] ? (
              <>
                <Image
                  alt={title}
                  src={photos[0]}
                  ratio="1/1"
                  className="img-main"
                  sx={{
                    transition: 'opacity 0.5s ease',
                    '& img': { transition: 'transform 0.6s ease' },
                  }}
                />
                {hoverPhoto && (
                  <Image
                    alt={title}
                    src={hoverPhoto}
                    ratio="1/1"
                    className="img-hover"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      transform: 'scale(1.12)',
                      transition: 'opacity 0.5s ease, transform 1s ease',
                    }}
                  />
                )}
              </>
            ) : (
              <NoPhoto />
            )}
          </Box>
        </Link>

        {/* Barra integrada al contenedor de la imagen: mismo ancho y esquinas,
            sube desde el borde inferior en lugar de flotar encima de la foto */}
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
            height: 42,
            position: 'absolute',
            borderRadius: '0 0 12px 12px',
            opacity: 0,
            transform: 'translateY(100%)',
            transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          Ver detalle
        </Button>
      </Box>

      <Stack spacing={0.5} sx={{ p: 3, pt: 2, textAlign: 'center', alignItems: 'center' }}>
        {groupName && <TaxonomyBadge>{groupName}</TaxonomyBadge>}

        <Link
          component={RouterLink}
          href={href}
          color="inherit"
          variant="subtitle2"
          noWrap
          sx={{ maxWidth: 1 }}
        >
          {title}
        </Link>

        <ScientificName
          sx={{
            maxWidth: 1,
            typography: 'caption',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sci}
        </ScientificName>

        <PriceText minPrice={minPrice} maxPrice={maxPrice} sx={{ pt: 1 }} />
      </Stack>
    </Card>
  );
}
