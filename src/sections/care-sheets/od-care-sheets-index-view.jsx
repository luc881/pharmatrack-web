'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { OdImage } from 'src/layouts/od/od-ui';
import { OdGutterNote } from 'src/layouts/od/od-gutter-note';

import { SheetHoverPreview } from './sheet-hover-preview';

// ----------------------------------------------------------------------
// Índice /fichas (estilo catálogo sistemático, como PhasmaMX): buscador,
// filtro por grupo, vista índice (agrupada) o cuadrícula. Los grupos salen
// de las fichas publicadas: un grupo sin fichas no aparece.
// ----------------------------------------------------------------------

const LABEL = {
  fontFamily: 'var(--od-font-body)',
  fontWeight: 500,
  fontSize: 'var(--od-text-xs)',
  letterSpacing: 'var(--od-tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--od-text-muted)',
};

const focusSx = {
  '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' },
};

const fold = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const href = (s) => `/fichas/${s.slug}/`;

function SciName({ sheet, size = 'var(--od-text-lg)' }) {
  return (
    <Box
      component="span"
      sx={{ fontFamily: 'var(--od-font-display)', fontSize: size, lineHeight: 1.25 }}
    >
      <em>{sheet.scientific_name}</em>
      {sheet.locality && ` “${sheet.locality}”`}
    </Box>
  );
}

function ForSale({ n }) {
  return n > 0 ? (
    <Box component="span" sx={{ color: 'var(--od-text)' }}>
      {n} en venta
    </Box>
  ) : (
    <Box component="span" sx={{ color: 'var(--od-text-muted)' }}>
      —
    </Box>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={active}
      sx={{
        ...focusSx,
        ...LABEL,
        cursor: 'pointer',
        px: 1.75,
        py: 1,
        border: '1px solid',
        borderColor: active ? 'var(--od-tinta)' : 'var(--od-linea)',
        borderRadius: 'var(--od-radius-sm)',
        bgcolor: active ? 'var(--od-tinta)' : 'transparent',
        color: active ? 'var(--od-papel)' : 'var(--od-text)',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      {children}
    </Box>
  );
}

// Vista índice: un bloque por grupo, una fila por ficha
function IndexView({ groups, preview }) {
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {groups.map((g) => (
        <Box component="li" key={g.name} sx={{ mt: 4 }}>
          <Box
            component="h2"
            sx={{
              ...LABEL,
              m: 0,
              pb: 1.25,
              color: 'var(--od-text)',
              borderBottom: 'var(--od-rule)',
            }}
          >
            {g.name}{' '}
            <Box component="span" sx={{ color: 'var(--od-text-muted)' }}>
              ({g.sheets.length})
            </Box>
          </Box>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {g.sheets.map((s) => (
              <li key={s.slug}>
                <Box
                  component={RouterLink}
                  href={href(s)}
                  onMouseEnter={(e) => preview.current?.show(s, e)}
                  onMouseLeave={() => preview.current?.hide()}
                  sx={{
                    ...focusSx,
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr auto',
                      md: 'minmax(0, 2fr) minmax(0, 1.3fr) 110px 110px 24px',
                    },
                    gap: { xs: 0.5, md: 2 },
                    alignItems: 'center',
                    py: 2,
                    borderBottom: 'var(--od-rule)',
                    color: 'var(--od-text)',
                    textDecoration: 'none',
                    transition: 'background-color 200ms ease',
                    '&:hover': { bgcolor: 'var(--od-crema-hueso)' },
                    // al pasar: el nombre se corre y la flecha avanza
                    '& .od-row-name, & .od-row-arrow': {
                      transition: 'transform 400ms var(--od-ease)',
                    },
                    '&:hover .od-row-name': { transform: 'translateX(6px)' },
                    '&:hover .od-row-arrow': { transform: 'translateX(4px)' },
                  }}
                >
                  <Box className="od-row-name" sx={{ minWidth: 0 }}>
                    <SciName sheet={s} />
                    {/* en celular, el nombre común va debajo */}
                    <Box
                      sx={{
                        display: { md: 'none' },
                        mt: 0.25,
                        fontSize: 'var(--od-text-sm)',
                        color: 'var(--od-text-muted)',
                      }}
                    >
                      {[s.common_name, s.difficulty].filter(Boolean).join(' · ')}
                    </Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>{s.common_name ?? '—'}</Box>
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      fontSize: 'var(--od-text-sm)',
                      color: 'var(--od-text-muted)',
                    }}
                  >
                    {s.difficulty ?? '—'}
                  </Box>
                  <Box
                    sx={{ fontSize: 'var(--od-text-sm)', textAlign: { xs: 'right', md: 'left' } }}
                  >
                    <ForSale n={s.available_count} />
                  </Box>
                  <Box
                    className="od-row-arrow"
                    component="span"
                    aria-hidden
                    sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}
                  >
                    →
                  </Box>
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Vista cuadrícula: tarjeta con foto
function GridView({ sheets }) {
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        mt: 4,
        p: 0,
        listStyle: 'none',
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {sheets.map((s) => (
        <li key={s.slug}>
          <Box
            component={RouterLink}
            href={href(s)}
            sx={{ ...focusSx, display: 'block', color: 'var(--od-text)', textDecoration: 'none' }}
          >
            <OdImage
              src={s.cover}
              alt={s.common_name ?? s.scientific_name}
              label={s.scientific_name}
              ratio="4 / 5"
              radius={10}
              width={480}
            />
            <Box sx={{ ...LABEL, mt: 1.5 }}>{s.group?.name}</Box>
            <Box sx={{ mt: 0.5 }}>
              <SciName sheet={s} size="var(--od-text-base)" />
            </Box>
            <Box sx={{ mt: 0.25, fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}>
              {[s.common_name, s.difficulty].filter(Boolean).join(' · ')}
            </Box>
            {s.available_count > 0 && (
              <Box sx={{ mt: 0.5, fontSize: 'var(--od-text-sm)' }}>
                <ForSale n={s.available_count} />
              </Box>
            )}
          </Box>
        </li>
      ))}
    </Box>
  );
}

export function OdCareSheetsIndexView({ sheets }) {
  const params = useSearchParams();
  const [q, setQ] = useState('');
  const [groupId, setGroupId] = useState(() => Number(params.get('grupo')) || null);
  const [view, setView] = useState('index');
  const preview = useRef(null);

  // grupos con al menos una ficha publicada, en orden alfabético
  const allGroups = [
    ...new Map(sheets.filter((s) => s.group).map((s) => [s.group.id, s.group])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const needle = fold(q.trim());
  const shown = sheets.filter(
    (s) =>
      (!groupId || s.group?.id === groupId) &&
      (!needle ||
        fold([s.scientific_name, s.locality, s.common_name, s.group?.name].join(' ')).includes(
          needle
        ))
  );
  const groups = allGroups
    .map((g) => ({ name: g.name, sheets: shown.filter((s) => s.group?.id === g.id) }))
    .filter((g) => g.sheets.length);

  const stats = [
    { value: sheets.length, label: sheets.length === 1 ? 'Ficha' : 'Fichas' },
    { value: allGroups.length, label: allGroups.length === 1 ? 'Grupo' : 'Grupos' },
    { value: sheets.filter((s) => s.available_count > 0).length, label: 'En venta' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        px: { xs: '18px', md: 'var(--od-gutter)' },
        pt: { xs: 4, md: 6 },
        pb: { xs: 6, md: 10 },
      }}
    >
      {/* notas al margen en pantallas anchas, como en Divulgación */}
      <OdGutterNote
        n={String(sheets.length).padStart(2, '0')}
        label="Fichas publicadas"
        start={320}
      />
      <SheetHoverPreview apiRef={preview} />

      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          <Box component="p" sx={{ ...LABEL, m: 0 }}>
            Opuntia Den · Historia natural
          </Box>
          <Box
            component="h1"
            sx={{
              m: 0,
              mt: 1.5,
              fontFamily: 'var(--od-font-display)',
              fontWeight: 400,
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              lineHeight: 'var(--od-leading-tight)',
            }}
          >
            Fichas de <em>cuidados</em>
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 2.5,
              fontSize: 'var(--od-text-lg)',
              lineHeight: 'var(--od-leading-body)',
              color: 'var(--od-text-muted)',
            }}
          >
            Cómo mantener a cada especie: ficha técnica, datos rápidos y cuidados paso a paso,
            escritos desde el criadero.
          </Box>
        </Box>
        <Box component="dl" sx={{ m: 0, display: 'flex', gap: { xs: 3, md: 5 } }}>
          {stats.map((st) => (
            // dt antes que dd (HTML válido); se ve número arriba con column-reverse
            <Box
              key={st.label}
              sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column-reverse' }}
            >
              <Box component="dt" sx={{ ...LABEL, mt: 1 }}>
                {st.label}
              </Box>
              <Box
                component="dd"
                sx={{
                  m: 0,
                  fontFamily: 'var(--od-font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  lineHeight: 1,
                }}
              >
                {st.value}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Buscador, vista y conteo */}
      <Box
        sx={{
          mt: { xs: 4, md: 6 },
          pt: 3,
          borderTop: 'var(--od-rule)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Box
          component="input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar especie, nombre común o grupo…"
          aria-label="Buscar ficha de cuidados"
          sx={{
            ...focusSx,
            flex: '1 1 260px',
            minHeight: 48,
            px: 2,
            font: 'inherit',
            fontSize: 16, // 16px: iOS no hace zoom al enfocar
            color: 'var(--od-text)',
            bgcolor: 'var(--od-papel)',
            border: '1px solid var(--od-linea)',
            borderRadius: 'var(--od-radius-sm)',
            '&::placeholder': { color: 'var(--od-text-muted)', opacity: 1 },
          }}
        />
        <Box role="group" aria-label="Vista" sx={{ display: 'flex', gap: 1 }}>
          <Chip active={view === 'index'} onClick={() => setView('index')}>
            Índice
          </Chip>
          <Chip active={view === 'grid'} onClick={() => setView('grid')}>
            Cuadrícula
          </Chip>
        </Box>
        <Box aria-live="polite" sx={{ ...LABEL, ml: { md: 'auto' } }}>
          {shown.length} / {sheets.length} {sheets.length === 1 ? 'ficha' : 'fichas'}
        </Box>
      </Box>

      {/* Filtro por grupo: solo los que tienen fichas */}
      {allGroups.length > 1 && (
        <Box
          role="group"
          aria-label="Filtrar por grupo"
          sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}
        >
          <Chip active={!groupId} onClick={() => setGroupId(null)}>
            Todos
          </Chip>
          {allGroups.map((g) => (
            <Chip key={g.id} active={groupId === g.id} onClick={() => setGroupId(g.id)}>
              {g.name}
            </Chip>
          ))}
        </Box>
      )}

      {/* Encabezados de la vista índice (escritorio) */}
      {view === 'index' && shown.length > 0 && (
        <Box
          aria-hidden
          sx={{
            ...LABEL,
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.3fr) 110px 110px 24px',
            gap: 2,
            mt: 4,
          }}
        >
          <span>Especie</span>
          <span>Nombre común</span>
          <span>Dificultad</span>
          <span>Ejemplares</span>
          <span />
        </Box>
      )}

      {shown.length > 0 &&
        (view === 'index' ? (
          <IndexView groups={groups} preview={preview} />
        ) : (
          <GridView sheets={shown} />
        ))}

      {!shown.length && (
        <Box sx={{ mt: 5, color: 'var(--od-text-muted)' }}>
          {sheets.length
            ? 'No encontramos esa especie. '
            : 'Pronto publicaremos las primeras fichas. '}
          <Box
            component="a"
            href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hola, busco la ficha de cuidados de ${q.trim() || 'una especie'}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ...focusSx, color: 'var(--od-text)', fontWeight: 600 }}
          >
            Pregúntanos por WhatsApp
          </Box>
        </Box>
      )}
    </Box>
  );
}
