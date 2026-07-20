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
import { QuickAddButton } from './quick-add-button';
import { NoPhoto, CatalogCard } from './catalog-card';
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

function PriceText({ minPrice, maxPrice, compareAt = null, sx }) {
  return (
    <Box component="span" sx={[{ typography: 'subtitle1' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {minPrice !== maxPrice && (
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary', mr: 0.5 }}>
          Desde
        </Box>
      )}
      {compareAt > minPrice && (
        <Box
          component="span"
          sx={{ mr: 0.75, typography: 'body2', color: 'text.disabled', textDecoration: 'line-through' }}
        >
          {fCurrency(compareAt)}
        </Box>
      )}
      {fCurrency(minPrice)}
    </Box>
  );
}

// "-15%" cuando hay precio anterior
export function offerPct(price, compareAt) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

// ----------------------------------------------------------------------

export function SpeciesCard({ item, horizontal = false }) {
  const { species, slug, photos, minPrice, maxPrice, compareAt = null } = item;
  const pct = offerPct(minPrice, compareAt);
  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);
  const groupName = species.genus?.group?.name;
  const href = paths.catalogSpecies(slug);
  const hoverPhoto = photos[1];

  // Agregado rápido: con escalas de precio usa el paquete más chico
  // (misma llave que el detalle para que se acumulen juntos)
  const firstTier = (species.price_tiers ?? [])[0];
  const cartItem = {
    key: `sp-${species.id}-${firstTier?.quantity ?? 'u'}`,
    title,
    detail: firstTier ? `Paquete de ${firstTier.quantity}` : sci,
    price: firstTier ? firstTier.price : minPrice,
    qty: 1,
    image: photos[0] ?? null,
  };

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

          <PriceText minPrice={minPrice} maxPrice={maxPrice} compareAt={compareAt} />

          <Box sx={{ pt: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
            <Button component={RouterLink} href={href} size="small" variant="outlined">
              Ver detalle
            </Button>
            <FavoriteButton speciesId={species.id} />
            <QuickAddButton item={cartItem} sx={{ opacity: 1, transform: 'none' }} />
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <CatalogCard
      href={href}
      alt={title}
      photo={photos[0]}
      hoverPhoto={hoverPhoto}
      topLeft={
        (formatLabel || pct) && (
          <Stack spacing={0.5} sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute', alignItems: 'flex-start' }}>
            {pct && (
              <Label variant="filled" color="error">
                -{pct}%
              </Label>
            )}
            {formatLabel && (
              <Label variant="filled" color="info">
                {formatLabel}
              </Label>
            )}
          </Stack>
        )
      }
      topRight={
        <Stack spacing={0.75} sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}>
          <FavoriteButton reveal speciesId={species.id} />
          <QuickAddButton item={cartItem} />
        </Stack>
      }
    >
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

        <PriceText minPrice={minPrice} maxPrice={maxPrice} compareAt={compareAt} sx={{ pt: 1 }} />
      </Stack>
    </CatalogCard>
  );
}
