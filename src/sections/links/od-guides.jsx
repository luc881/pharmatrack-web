'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { SciName } from 'src/layouts/od/od-ui';

import { slugify } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------
// Guías de cuidado con buscador. Las `sub` (especies) cuelgan de la guía
// general de arriba: si coincide cualquiera del grupo se muestra el grupo
// entero, así "argopuro" trae también Fásmidos. Sin acentos ni mayúsculas.
// ----------------------------------------------------------------------

const waGuide = (name) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hola, quiero la guía de cuidados de ${name}.`)}`;

const fold = (s) => slugify(s).replace(/-/g, ' ');

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
    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: '5px 5px 0 rgba(23,62,54,0.12)' },
  },
};

// Guía sin url: todavía no hay página, se pide por WhatsApp (no se inventa
// contenido de cuidados). Las `sub` son especies: sangría y nombre científico.
function GuideCard({ g, prefix }) {
  const todo = !g.url;
  const link = todo ? { href: waGuide(g.name), target: '_blank', rel: 'noopener' } : { href: g.url };
  return (
    <Box component="a" {...link} data-track={`clic_${prefix}guia_${slugify(g.name).replace(/-/g, '_')}`} sx={[cardSx, g.sub && { ml: 3, minHeight: 48 }]}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ fontFamily: 'var(--od-font-display)', fontSize: g.sub ? 17 : 21, lineHeight: 1.2 }}>
          {g.sub ? <SciName>{g.name}</SciName> : g.name}
        </Box>
        {todo && <Box sx={{ mt: 0.5, fontSize: 13, color: 'var(--od-text-muted)' }}>Pídela por WhatsApp</Box>}
      </Box>
      <Box component="span" aria-hidden sx={{ fontSize: 18 }}>
        {todo ? '↗' : '→'}
      </Box>
    </Box>
  );
}

export function OdGuides({ guides, prefix }) {
  const [q, setQ] = useState('');

  const groups = [];
  guides.forEach((g, i) => {
    const item = { g, key: `${i}${g.name}` };
    if (g.sub && groups.length) groups[groups.length - 1].push(item);
    else groups.push([item]);
  });

  const needle = fold(q.trim());
  const shown = needle ? groups.filter((grp) => grp.some(({ g }) => fold(g.name).includes(needle))) : groups;

  return (
    <>
      <Box
        component="input"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar especie o grupo…"
        aria-label="Buscar guía de cuidado"
        sx={{
          ...focusSx,
          width: 1,
          minHeight: 48,
          px: 2.5,
          mb: 1.5,
          font: 'inherit',
          fontSize: 16, // 16px: iOS no hace zoom al enfocar
          color: 'var(--od-tinta)',
          bgcolor: 'transparent',
          border: '1px solid var(--od-tinta)',
          borderRadius: 999,
          '&::placeholder': { color: 'var(--od-text-muted)', opacity: 1 },
        }}
      />
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {shown.flat().map(({ g, key }) => (
          <GuideCard key={key} g={g} prefix={prefix} />
        ))}
        {!shown.length && (
          <Box component="a" href={waGuide(q.trim())} target="_blank" rel="noopener" data-track={`clic_${prefix}guia_sin_resultado`} sx={[cardSx, { fontSize: 15 }]}>
            <Box sx={{ flex: 1 }}>No la tenemos aún. Pídela por WhatsApp</Box>
            <Box component="span" aria-hidden sx={{ fontSize: 18 }}>
              ↗
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
