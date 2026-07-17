import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Cada columna trae su color; el valor va sobre una franja más oscura del
// mismo tono, como en las fichas de cuidados de las tiendas del ramo.
const FIELDS = [
  { key: 'origin', label: 'Origen', icon: 'care:origin', main: '#C2707C', dark: '#AB5C68' },
  { key: 'temperature', label: 'Temp.', icon: 'care:temp', main: '#7C86C8', dark: '#6873B7' },
  { key: 'humidity', label: 'Humedad', icon: 'care:humidity', main: '#C3A22C', dark: '#AC8E1E' },
  { key: 'adult_size', label: 'Tamaño', icon: 'care:size', main: '#5FB0AC', dark: '#4C9D99' },
  { key: 'difficulty', label: 'Dificultad', icon: 'care:difficulty', main: '#A89384', dark: '#957F6F' },
  { key: 'rarity', label: 'Rareza', icon: 'care:rarity', main: '#7FA383', dark: '#6B9070' },
];

export function CareInfo({ species, sx, ...other }) {
  const columns = FIELDS.filter((field) => species[field.key]);

  if (!columns.length) return null;

  return (
    <Box component="section" sx={sx} {...other}>
      <Typography variant="h4" sx={{ mb: 2.5 }}>
        Ficha de cuidados
      </Typography>

      <Box
        sx={{
          display: 'grid',
          borderRadius: 2,
          overflow: 'hidden',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: `repeat(${columns.length}, 1fr)`,
          },
        }}
      >
        {columns.map((field) => (
          <Box key={field.key} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                py: 2.5,
                px: 1,
                gap: 1,
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: field.main,
                color: 'common.white',
              }}
            >
              <Iconify icon={field.icon} width={34} />
              <Typography
                variant="caption"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
              >
                {field.label}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 76,
                bgcolor: field.dark,
                color: 'common.white',
                textAlign: 'center',
                typography: 'subtitle2',
                textTransform: 'uppercase',
                lineHeight: 1.4,
              }}
            >
              {species[field.key]}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
