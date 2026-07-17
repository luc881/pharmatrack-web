'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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
import { Iconify } from 'src/components/iconify';

import { AnimalGallery } from './animal-gallery';
import { SEX_LABELS, STATUS_LABELS, STATUS_COLORS, scientificName } from './utils';

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

export function AnimalDetailsView({ animal, category = null }) {
  const photos = [...new Set([...(animal.image ? [animal.image] : []), ...(animal.photos ?? [])])];
  const sci = scientificName(animal.species);
  const title = animal.species?.common_name ?? sci;
  const available = animal.status === 'available';

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
          {animal.code}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <AnimalGallery photos={photos} alt={title} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
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

            <Typography variant="h3">{fCurrency(animal.price)}</Typography>

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
            {animal.species?.genus?.group && (
              <InfoRow label="Grupo">{animal.species.genus.group.name}</InfoRow>
            )}
            {animal.species?.genus && (
              <InfoRow label="Género">
                <Box component="span" sx={{ fontStyle: 'italic' }}>
                  {animal.species.genus.name}
                </Box>
              </InfoRow>
            )}
            {animal.species && (
              <InfoRow label="Especie">
                <Box component="span" sx={{ fontStyle: 'italic' }}>
                  {animal.species.name}
                </Box>
              </InfoRow>
            )}

            {available && WHATSAPP && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Button
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, me interesa ${title} (${animal.code})`)}`}
                  target="_blank"
                  rel="noopener"
                  size="large"
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                >
                  Preguntar por WhatsApp
                </Button>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          gap: 5,
          my: 10,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {TRUST_ITEMS.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      {animal.description && (
        <Card>
          <Typography variant="h6" sx={{ px: 3, pt: 3 }}>
            Descripción
          </Typography>
          <Typography
            variant="body2"
            sx={{ p: 3, color: 'text.secondary', whiteSpace: 'pre-wrap' }}
          >
            {animal.description}
          </Typography>
        </Card>
      )}
    </Container>
  );
}
