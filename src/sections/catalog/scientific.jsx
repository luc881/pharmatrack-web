import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Tratamiento tipográfico "de ficha de museo" tomado de phasmaMX:
// nombres científicos y datos de taxonomía en monospace, con un acento
// cálido tipo dorado. El acento reusa el token warning.dark del tema
// (sirve en claro y oscuro) — cámbialo aquí y afecta a todo el sitio.
// ----------------------------------------------------------------------

export const MONO_FONT = "'Space Mono', ui-monospace, monospace";
export const TAXON_COLOR = 'warning.dark';

// Nombre científico: monospace en cursiva, un poco espaciado
export function ScientificName({ children, sx }) {
  return (
    <Box
      component="span"
      sx={[
        {
          fontFamily: MONO_FONT,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
          color: 'text.secondary',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// Badge de taxonomía: fondo transparente, borde dorado tenue, mono en mayúsculas
export function TaxonomyBadge({ children, sx }) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => ({
          px: 1,
          py: 0.25,
          display: 'inline-block',
          borderRadius: 0.75,
          fontFamily: MONO_FONT,
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1.6,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: TAXON_COLOR,
          border: `solid 1px ${varAlpha(theme.vars.palette.warning.mainChannel, 0.32)}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// Divisor de sección: línea + etiqueta centrada en monospace mayúsculas
export function SectionLabel({ children, sx }) {
  const line = { flex: 1, height: '1px', bgcolor: 'divider', maxWidth: 48 };
  return (
    <Box
      sx={[
        { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={line} />
      <Box
        component="span"
        sx={{
          fontFamily: MONO_FONT,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: TAXON_COLOR,
        }}
      >
        {children}
      </Box>
      <Box sx={line} />
    </Box>
  );
}
