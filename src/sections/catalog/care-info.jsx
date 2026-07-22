import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Cada columna alude a lo que mide: temperatura cálida, humedad azul, origen
// verde-tierra, dificultad ámbar, rareza morada. Tonos pastel con tinta
// oscura del mismo matiz — el texto blanco sobre color medio que había antes
// se leía peor y competía con el resto de la página.
const FIELDS = [
  { key: 'origin', label: 'Origen', icon: 'care:origin',
    main: '#E5EBD9', dark: '#D3DCC1', ink: '#3D5130' },
  { key: 'temperature', label: 'Temp.', icon: 'care:temp',
    main: '#F8DED7', dark: '#F1C8BE', ink: '#8B3B2C' },
  { key: 'humidity', label: 'Humedad', icon: 'care:humidity',
    main: '#D9E7F3', dark: '#C3D8EC', ink: '#22557F' },
  { key: 'adult_size', label: 'Tamaño', icon: 'care:size',
    main: '#E6E7E9', dark: '#D6D8DC', ink: '#3E464F' },
  { key: 'difficulty', label: 'Dificultad', icon: 'care:difficulty',
    main: '#F9E8CE', dark: '#F2D9B2', ink: '#845517' },
  { key: 'rarity', label: 'Rareza', icon: 'care:rarity',
    main: '#E8E0F0', dark: '#D9CBE7', ink: '#583D79' },
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
                color: field.ink,
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
                color: field.ink,
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
