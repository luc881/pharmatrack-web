import Box from '@mui/material/Box';

import { slugify } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------
// Guías de cuidado en /links: se arman solas con las fichas publicadas.
// Un botón por grupo (lleva a /fichas ya filtrado) y un buscador que manda a
// /fichas?q=: /links no crece con cada especie nueva, solo con cada grupo.
// ----------------------------------------------------------------------

const focusSx = { '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' } };

const cardSx = {
  ...focusSx,
  minHeight: 56,
  px: 2.5,
  py: 1.5,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  bgcolor: 'var(--od-papel)',
  border: '1px solid var(--od-linea)',
  borderRadius: 'var(--od-radius-md)',
  boxShadow: 'var(--od-shadow-flat)',
  color: 'var(--od-tinta)',
  textDecoration: 'none',
  transition: 'transform 200ms ease, box-shadow 200ms ease',
  '@media (hover: hover)': {
    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: '5px 5px 0 rgba(28,35,32,0.12)' },
  },
};

// [{ id, name, count }] de los grupos con fichas publicadas, en orden alfabético
const groupsOf = (sheets) =>
  [
    ...sheets
      .filter((s) => s.group)
      .reduce((map, s) => {
        const g = map.get(s.group.id) ?? { ...s.group, count: 0 };
        return map.set(g.id, { ...g, count: g.count + 1 });
      }, new Map())
      .values(),
  ].sort((a, b) => a.name.localeCompare(b.name, 'es'));

export function OdGuides({ sheets, prefix }) {
  return (
    <>
      {/* GET normal: Enter lleva a /fichas?q=… sin JavaScript */}
      <Box component="form" action="/fichas" method="get" role="search" sx={{ mb: 1.5 }}>
        <Box
          component="input"
          type="search"
          name="q"
          placeholder="Buscar especie o grupo…"
          aria-label="Buscar guía de cuidado"
          sx={{
            ...focusSx,
            width: 1,
            minHeight: 48,
            px: 2.5,
            font: 'inherit',
            fontSize: 16, // 16px: iOS no hace zoom al enfocar
            color: 'var(--od-tinta)',
            bgcolor: 'transparent',
            border: '1px solid var(--od-tinta)',
            borderRadius: 999,
            '&::placeholder': { color: 'var(--od-text-muted)', opacity: 1 },
          }}
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {groupsOf(sheets).map((g) => (
          <Box
            key={g.id}
            component="a"
            href={`/fichas?grupo=${g.id}`}
            data-track={`clic_${prefix}guia_${slugify(g.name).replace(/-/g, '_')}`}
            sx={cardSx}
          >
            <Box sx={{ flex: 1, minWidth: 0, fontFamily: 'var(--od-font-display)', fontSize: 21, lineHeight: 1.2 }}>
              {g.name}
            </Box>
            <Box sx={{ fontSize: 13, color: 'var(--od-text-muted)' }}>
              {g.count} {g.count === 1 ? 'guía' : 'guías'}
            </Box>
            <Box component="span" aria-hidden sx={{ fontSize: 18 }}>
              →
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
