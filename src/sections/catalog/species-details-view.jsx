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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { CareInfo } from './care-info';
import { useFavorites } from './use-favorites';
import { AnimalGallery } from './animal-gallery';
import { RelatedSpecies } from './related-species';
import { SEX_LABELS, scientificName, saleFormatLabel } from './utils';

// ----------------------------------------------------------------------

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

// ponytail: textos de confianza placeholder; edítalos cuando definan la marca
const TRUST_ITEMS = [
  {
    title: 'Procedencia legal',
    description: 'Animales criados en cautiverio con documentación en regla.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: 'Criados con cuidado',
    description: 'Cada animal recibe la alimentación y el entorno adecuados.',
    icon: 'solar:heart-bold',
  },
  {
    title: 'Asesoría incluida',
    description: 'Te acompañamos con recomendaciones de manejo y cuidado.',
    icon: 'solar:chat-round-dots-bold',
  },
];

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
  const { species, photos, morphs, sexes, minPrice, maxPrice } = item;

  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(species.id);

  const sci = scientificName(species);
  const title = species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);

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
              <Typography variant="h4" component="h1">
                {title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.secondary' }}>
                {sci}
              </Typography>
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

            <Typography variant="h3">
              {minPrice !== maxPrice && (
                <Box component="span" sx={{ typography: 'h6', color: 'text.secondary', mr: 1, fontWeight: 400 }}>
                  Desde
                </Box>
              )}
              {fCurrency(minPrice)}
            </Typography>

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

            <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
              {WHATSAPP ? (
                <Button
                  fullWidth
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, me interesa ${title} (${sci})`)}`}
                  target="_blank"
                  rel="noopener"
                  size="large"
                  variant="contained"
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

            {formatLabel && (
              <Label variant="soft" color="info" sx={{ alignSelf: 'flex-start' }}>
                {formatLabel}
              </Label>
            )}
          </Stack>
        </Grid>
      </Grid>

      <CareInfo species={species} sx={{ mt: { xs: 6, md: 10 } }} />

      {paragraphs.length > 0 && (
        <Box component="section" sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography
            variant="h4"
            sx={{
              pb: 2,
              mb: 4,
              textAlign: 'center',
              borderBottom: (theme) => `solid 2px ${theme.vars.palette.divider}`,
            }}
          >
            Descripción
          </Typography>

          <Stack spacing={2} sx={{ mx: 'auto', maxWidth: 720 }}>
            {paragraphs.map((paragraph, index) => (
              <Typography key={index} variant="body1" sx={{ color: 'text.secondary' }}>
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          gap: 5,
          my: 10,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {TRUST_ITEMS.map((trust) => (
          <Box key={trust.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={trust.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {trust.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {trust.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <RelatedSpecies items={related} />
    </Container>
  );
}
