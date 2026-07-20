'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCart } from './use-cart';
import { CareInfo } from './care-info';
import { SHOP_INFO } from './shop-info';
import { useFavorites } from './use-favorites';
import { AnimalGallery } from './animal-gallery';
import { RelatedSpecies } from './related-species';
import { SpeciesProfile } from './species-profile';
import { TaxonomyBadge, ScientificName } from './scientific';
import { SEX_LABELS, scientificName, saleFormatLabel } from './utils';

// ----------------------------------------------------------------------

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

function MetaRow({ label, children }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, typography: 'body2' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        {label}:
      </Box>
      <Box component="span" sx={{ minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // el usuario canceló: sin ruido
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? '¡Link copiado!' : 'Compartir'}>
      <IconButton onClick={handleShare} sx={{ border: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
        <Iconify icon="solar:share-bold" width={20} />
      </IconButton>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------

export function SpeciesDetailsView({ item, category = null, related = [] }) {
  const { species, photos, morphs, sexes, minPrice, maxPrice, compareAt = null } = item;

  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(species.id);
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);

  // Escalas de precio por cantidad (p. ej. isópodos: 6 / 12 / 18)
  const tiers = species.price_tiers ?? [];
  const [tierIndex, setTierIndex] = useState(0);
  const selectedTier = tiers[tierIndex];

  const whatsappText = `Hola, me interesa ${title} (${sci})${selectedTier ? ` — paquete de ${selectedTier.quantity}` : ''}`;

  const paragraphs = (species.description ?? '').split('\n').filter(Boolean);
  const excerpt = paragraphs[0];

  return (
    <Container sx={{ mb: 10 }}>
      <Breadcrumbs sx={{ mb: 5, mt: { xs: 1, md: 3 } }}>
        <Link component={RouterLink} href={paths.root} color="inherit" variant="body2">
          Inicio
        </Link>
        <Link component={RouterLink} href={paths.catalog} color="inherit" variant="body2">
          Catálogo
        </Link>
        {category && (
          <Link
            component={RouterLink}
            href={paths.catalogCategory(category.slug)}
            color="inherit"
            variant="body2"
          >
            {category.name}
          </Link>
        )}
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <AnimalGallery photos={photos} alt={title} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Stack spacing={2}>
            <Box>
              {category && <TaxonomyBadge sx={{ mb: 1 }}>{category.name}</TaxonomyBadge>}
              <Typography variant="h4" component="h1">
                {title}
              </Typography>
              <ScientificName sx={{ display: 'block', mt: 0.5, typography: 'body1' }}>
                {sci}
              </ScientificName>
            </Box>

            {excerpt && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {excerpt}
              </Typography>
            )}

            <Stack spacing={0.5}>
              {category && <MetaRow label="Grupo">{category.name}</MetaRow>}
              <MetaRow label="Disponibilidad">
                <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
                  Disponible
                </Box>
              </MetaRow>
              <MetaRow label="Formato">
                {formatLabel
                  ? species.sale_format === 'package'
                    ? `Paquete de ${species.package_size} ejemplares`
                    : 'Cepa (colonia establecida)'
                  : 'Ejemplar individual'}
              </MetaRow>
              {species.sale_format === 'individual' && sexes.length > 0 && (
                <MetaRow label="Sexos">{sexes.map((s) => SEX_LABELS[s] ?? s).join(', ')}</MetaRow>
              )}
            </Stack>

            {tiers.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Cantidad
                </Typography>
                <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
                  {tiers.map((tier, index) => (
                    <Box
                      key={tier.quantity}
                      component="button"
                      type="button"
                      onClick={() => setTierIndex(index)}
                      sx={(theme) => ({
                        px: 2.5,
                        py: 1,
                        cursor: 'pointer',
                        borderRadius: 1,
                        typography: 'subtitle2',
                        color: 'text.primary',
                        bgcolor: 'transparent',
                        border: `solid 1px ${theme.vars.palette.divider}`,
                        transition: theme.transitions.create(['border-color', 'box-shadow']),
                        ...(index === tierIndex && {
                          borderColor: 'text.primary',
                          boxShadow: `inset 0 0 0 1px ${theme.vars.palette.text.primary}`,
                        }),
                      })}
                    >
                      {tier.quantity}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="h3">
                {!selectedTier && minPrice !== maxPrice && (
                  <Box component="span" sx={{ typography: 'h6', color: 'text.secondary', mr: 1, fontWeight: 400 }}>
                    Desde
                  </Box>
                )}
                {!selectedTier && compareAt > minPrice && (
                  <Box
                    component="span"
                    sx={{ mr: 1.5, typography: 'h5', fontWeight: 400, color: 'text.disabled', textDecoration: 'line-through' }}
                  >
                    {fCurrency(compareAt)}
                  </Box>
                )}
                {fCurrency(selectedTier ? selectedTier.price : minPrice)}
              </Typography>
              {selectedTier && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Paquete de {selectedTier.quantity} ejemplares
                </Typography>
              )}
            </Box>

            {morphs.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Morphs disponibles
                </Typography>
                <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                  {morphs.map((m) => (
                    <Chip key={m.id} size="small" variant="outlined" label={m.name} />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:cart-plus-bold" width={22} />}
              onClick={() => {
                cart.add({
                  key: `sp-${species.id}-${selectedTier?.quantity ?? 'u'}`,
                  title,
                  detail: selectedTier ? `Paquete de ${selectedTier.quantity}` : sci,
                  price: selectedTier ? selectedTier.price : minPrice,
                  qty: 1,
                  image: photos[0] ?? null,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? 'Agregado ✓' : 'Agregar a cotización'}
            </Button>

            <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
              {WHATSAPP ? (
                <Button
                  fullWidth
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener"
                  size="large"
                  variant="outlined"
                  color="success"
                >
                  Preguntar por WhatsApp
                </Button>
              ) : (
                <Box sx={{ flexGrow: 1 }} />
              )}

              <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
                <IconButton
                  onClick={() => toggle(species.id)}
                  sx={{ border: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
                >
                  <Iconify
                    width={20}
                    icon={isFavorite ? 'solar:heart-bold' : 'solar:heart-outline'}
                    sx={{ color: isFavorite ? 'error.main' : 'text.secondary' }}
                  />
                </IconButton>
              </Tooltip>

              <ShareButton title={title} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* Info de compra/envío — editable en shop-info.js */}
            <Stack spacing={2}>
              {SHOP_INFO.map((info) => (
                <Box key={info.title} sx={{ gap: 1.5, display: 'flex' }}>
                  <Iconify icon={info.icon} width={24} sx={{ color: info.color, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: info.color }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {info.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <CareInfo species={species} sx={{ mt: { xs: 6, md: 10 } }} />

      {/* Ficha estilo museo: descripción + taxonomía/origen/etiquetas */}
      <SpeciesProfile
        species={species}
        category={category}
        morphs={morphs}
        sx={{ mt: { xs: 6, md: 10 } }}
      />

      <RelatedSpecies items={related} sx={{ mt: { xs: 6, md: 10 } }} />
    </Container>
  );
}
