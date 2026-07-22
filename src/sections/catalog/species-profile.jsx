import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { saleFormatLabel } from './utils';
import { MONO_FONT, TAXON_COLOR, TaxonomyBadge } from './scientific';

// ----------------------------------------------------------------------
// Ficha descriptiva estilo "museo" adaptada de phasmaMX: descripción con
// encabezados monospace a la izquierda y panel de taxonomía/datos a la
// derecha. Usa solo los campos que ya existen en el backend.
// ----------------------------------------------------------------------

const monoLabel = {
  fontFamily: MONO_FONT,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

// Encabezado de sección: icono + etiqueta mono + línea que llena el resto
function SectionHeader({ icon, children }) {
  return (
    <Box sx={{ mb: 2.5, gap: 1.5, display: 'flex', alignItems: 'center' }}>
      {icon && <Iconify icon={icon} width={18} sx={{ color: TAXON_COLOR }} />}
      <Box component="span" sx={{ ...monoLabel, color: TAXON_COLOR }}>
        {children}
      </Box>
      <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
    </Box>
  );
}

function Panel({ title, children, sx }) {
  return (
    <Box
      sx={[
        (theme) => ({ borderRadius: 2, border: `solid 1px ${theme.vars.palette.divider}` }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={{ ...monoLabel, px: 2.5, pt: 2, display: 'block', color: 'text.secondary' }}>
        {title}
      </Box>
      {children}
    </Box>
  );
}

function TaxonRow({ label, children, italic = false }) {
  return (
    <Box sx={{ px: 2.5, py: 1.25, gap: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ ...monoLabel, fontWeight: 400, color: 'text.secondary' }}>
        {label}
      </Box>
      <Typography
        component="span"
        variant="subtitle2"
        sx={{ textAlign: 'right', ...(italic && { fontFamily: MONO_FONT, fontStyle: 'italic' }) }}
      >
        {children}
      </Typography>
    </Box>
  );
}

// Convierte el texto libre del backend en párrafos (línea en blanco separa)
const toParagraphs = (text) => (text ?? '').split('\n').filter(Boolean);

export function SpeciesProfile({ species, category, morphs = [], description, sx }) {
  const sections = [
    // en páginas de morph, la descripción propia del morph; si no, la de la especie
    { icon: 'solar:notebook-bold-duotone', title: 'Descripción general', text: description ?? species.description },
    { icon: 'solar:home-angle-bold-duotone', title: 'Hábitat y comportamiento', text: species.habitat },
    { icon: 'custom:fast-food-fill', title: 'Alimentación', text: species.diet },
    { icon: 'solar:notes-bold-duotone', title: 'Notas de esta especie', text: species.notes },
  ].filter((section) => section.text);

  const subgroup = species.genus?.group?.name;
  const formatLabel = saleFormatLabel(species);

  const taxonomy = [
    { label: 'Grupo', value: category?.name },
    // el subgrupo solo aporta si es distinto del grupo raíz
    { label: 'Subgrupo', value: subgroup !== category?.name ? subgroup : null },
    { label: 'Género', value: species.genus?.name, italic: true },
    { label: 'Especie', value: species.name, italic: true },
    { label: 'Nombre común', value: species.common_name },
  ].filter((row) => row.value);

  const tags = [
    formatLabel,
    species.difficulty,
    species.rarity,
    ...morphs.map((morph) => morph.name),
  ].filter(Boolean);

  return (
    <Grid container spacing={{ xs: 4, md: 6 }} sx={sx}>
      <Grid size={{ xs: 12, md: 7 }}>
        {sections.length > 0 ? (
          <Stack spacing={5}>
            {sections.map((section) => (
              <Box key={section.title}>
                <SectionHeader icon={section.icon}>{section.title}</SectionHeader>
                <Stack spacing={2}>
                  {toParagraphs(section.text).map((paragraph, index) => (
                    <Typography key={index} variant="body1" sx={{ color: 'text.secondary' }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <>
            <SectionHeader icon="solar:notebook-bold-duotone">Descripción general</SectionHeader>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Pronto agregaremos la descripción de esta especie. Pregúntanos por WhatsApp cualquier
              duda sobre su cuidado.
            </Typography>
          </>
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={3}>
          <Panel title="Taxonomía">
            <Stack divider={<Divider />} sx={{ pt: 1, pb: 0.5 }}>
              {taxonomy.map((row) => (
                <TaxonRow key={row.label} label={row.label} italic={row.italic}>
                  {row.value}
                </TaxonRow>
              ))}
            </Stack>
          </Panel>

          {species.origin && (
            <Panel title="Distribución / Origen">
              <Box sx={{ px: 2.5, py: 2, gap: 1, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="custom:location-fill" width={18} sx={{ color: TAXON_COLOR }} />
                <Typography variant="body2">{species.origin}</Typography>
              </Box>
            </Panel>
          )}

          {tags.length > 0 && (
            <Panel title="Etiquetas">
              <Box sx={{ px: 2.5, py: 2, gap: 1, display: 'flex', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <TaxonomyBadge key={tag}>{tag}</TaxonomyBadge>
                ))}
              </Box>
            </Panel>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
