'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

import { AnimalGallery } from './animal-gallery';
import { SEX_LABELS, STATUS_LABELS, STATUS_COLORS, scientificName } from './utils';

// ----------------------------------------------------------------------

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

function InfoRow({ label, children }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Typography variant="body2" sx={{ width: 110, flexShrink: 0, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box sx={{ typography: 'body2', minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

export function AnimalDetailsView({ animal }) {
  const photos = [...new Set([...(animal.image ? [animal.image] : []), ...(animal.photos ?? [])])];
  const sci = scientificName(animal.species);
  const title = animal.species?.common_name ?? sci;
  const available = animal.status === 'available';

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Breadcrumbs sx={{ mb: { xs: 3, md: 5 } }}>
        <Link component={RouterLink} href={paths.root} color="inherit" variant="body2">
          Inicio
        </Link>
        <Link component={RouterLink} href={paths.catalog} color="inherit" variant="body2">
          Catálogo
        </Link>
        {animal.species?.genus && (
          <Link
            component={RouterLink}
            href={`${paths.catalog}?genus_id=${animal.species.genus.id}`}
            color="inherit"
            variant="body2"
            sx={{ fontStyle: 'italic' }}
          >
            {animal.species.genus.name}
          </Link>
        )}
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {animal.code}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ gap: 5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <AnimalGallery photos={photos} alt={title} />

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
            {!available && (
              <Label variant="soft" color={STATUS_COLORS[animal.status] ?? 'default'}>
                {STATUS_LABELS[animal.status] ?? animal.status}
              </Label>
            )}
          </Box>

          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            {sci} · {animal.code}
          </Typography>

          <Typography variant="h3" sx={{ color: 'primary.main' }}>
            {fCurrency(animal.price)}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {animal.morphs?.length > 0 && (
            <InfoRow label="Morphs">
              <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                {animal.morphs.map((m) => (
                  <Chip key={m.id} size="small" variant="outlined" label={m.name} />
                ))}
              </Box>
            </InfoRow>
          )}
          <InfoRow label="Sexo">{SEX_LABELS[animal.sex] ?? animal.sex}</InfoRow>
          {animal.birth_date && <InfoRow label="Nacimiento">{animal.birth_date}</InfoRow>}

          {animal.description && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                {animal.description}
              </Typography>
            </>
          )}

          {available && WHATSAPP && (
            <Button
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, me interesa ${title} (${animal.code})`)}`}
              target="_blank"
              rel="noopener"
              size="large"
              variant="contained"
              color="success"
              sx={{ mt: 1, alignSelf: 'flex-start' }}
            >
              Preguntar por WhatsApp
            </Button>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
