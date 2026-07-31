'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Slider from '@mui/material/Slider';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Display } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

import { OdCatalogCard } from './od-catalog-card';
import { slugify, offerPct, scientificName, saleFormatLabel } from '../utils';

// ----------------------------------------------------------------------

const VIEWS = [
  { key: 'grid', icon: 'mingcute:grid-fill', label: 'Cuadrícula' },
  { key: 'two', icon: 'mingcute:layout-grid-fill', label: 'Dos columnas' },
  { key: 'list', icon: 'ic:round-view-list', label: 'Filas' },
];

const GRID_COLUMNS = {
  grid: 'repeat(auto-fill, minmax(240px, 1fr))',
  two: 'repeat(2, 1fr)',
  list: '1fr',
};

// ----------------------------------------------------------------------
// Catálogo editorial: cabecera con miga de pan + título display, barra lateral
// (control segmentado de categoría + rango de precio) y rejilla. Datos reales;
// el filtro de categoría alterna entre listados de animales y productos.
// ----------------------------------------------------------------------

const pad2 = (n) => String(n).padStart(2, '0');

export const animalToCard = (i) => {
  const pct = offerPct(i.minPrice, i.compareAt);
  const fmt = saleFormatLabel(i.species);
  return {
    key: i.key,
    href: paths.catalogSpecies(i.slug),
    image: i.photos?.[0],
    title: i.title,
    subtitle: scientificName(i.species),
    subtitleItalic: true,
    tag: pct ? `-${pct}%` : fmt,
    tagVariant: pct ? 'accent' : 'neutral',
    price: i.minPrice !== i.maxPrice ? `Desde ${fCurrency(i.minPrice)}` : `${fCurrency(i.minPrice)} MXN`,
    favKey: i.key,
  };
};

export const productToCard = (p) => {
  const soldOut = p.tracks_batches && (p.stock ?? 0) <= 0;
  const pct = offerPct(p.price_retail, p.compare_at_price);
  const unit = p.unit_name && p.unit_name !== 'pieza' ? ` / ${p.unit_name}` : '';
  return {
    key: `pr-${p.id}`,
    href: paths.product(`${slugify(p.title)}-${p.id}`),
    image: p.image,
    title: p.title,
    subtitle: p.category ?? null,
    subtitleItalic: false,
    tag: soldOut ? 'Agotado' : pct ? `-${pct}%` : null,
    tagVariant: soldOut ? 'outline' : 'accent',
    price: `${fCurrency(p.price_retail)}${unit} MXN`,
    favKey: null,
  };
};

export function OdCatalogView({ items = [], products = [], category = null }) {
  // Grupos inmediatos presentes en los listados (p. ej. Isópodos) para el
  // control segmentado — refleja el inventario real, no solo las raíces.
  const animalGroups = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      const g = i.species?.genus?.group;
      if (g && !map.has(g.id)) map.set(g.id, g.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [items]);

  const segments = [
    { key: 'all', label: 'Todo' },
    ...animalGroups.map((g) => ({ key: `g${g.id}`, label: g.name, groupId: g.id })),
    ...(products.length ? [{ key: 'prod', label: 'Sustratos y accesorios' }] : []),
  ];
  const [seg, setSeg] = useState('all');

  const maxPrice = useMemo(
    () => Math.ceil(Math.max(0, ...items.map((i) => i.maxPrice), ...products.map((p) => p.price_retail))),
    [items, products]
  );
  const [range, setRange] = useState([0, maxPrice]);
  const inRange = (v) => v >= range[0] && v <= range[1];

  const [view, setView] = useState('grid');

  const groupId = seg.startsWith('g') ? Number(seg.slice(1)) : null;
  const showAnimals = seg === 'all' || groupId != null;
  const showProducts = seg === 'all' || seg === 'prod';

  const animalCards = showAnimals
    ? [...items]
        .filter((i) => (!groupId || i.species?.genus?.group?.id === groupId) && inRange(i.minPrice))
        .sort((a, b) => b.latestId - a.latestId)
        .map(animalToCard)
    : [];
  const productCards = showProducts
    ? products.filter((p) => inRange(p.price_retail)).map(productToCard)
    : [];
  const cards = [...animalCards, ...productCards];

  const title = category ? category.name : 'Catálogo';

  return (
    <>
      {/* Cabecera */}
      <Box
        component="section"
        sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 5, md: 8 }, pb: { xs: 4, md: 5 }, borderBottom: '1px solid var(--color-divider)' }}
      >
        <Box sx={{ mb: 2, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
          <Link component={RouterLink} href={paths.root} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
            Inicio
          </Link>
          {' / '}
          {category ? (
            <>
              <Link component={RouterLink} href={paths.catalog} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
                Catálogo
              </Link>
              {` / ${category.name}`}
            </>
          ) : (
            'Catálogo'
          )}
        </Box>

        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02 }}>
          {title}
        </Display>

        <Box sx={{ mt: 2.5, maxWidth: '52ch', fontSize: 15, lineHeight: 1.6, opacity: 0.8 }}>
          Todo lo que hay disponible hoy. Los ejemplares se reservan con anticipo y se entregan en
          persona en CDMX.
        </Box>
      </Box>

      {/* Cuerpo: barra lateral fija + rejilla */}
      <Box sx={{ display: 'grid', alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: '232px minmax(0, 1fr)' } }}>
        <Box
          component="aside"
          sx={{
            px: { xs: '18px', md: '32px' },
            py: { xs: 4, md: 5 },
            borderRight: { md: '1px solid var(--color-divider)' },
            borderBottom: { xs: '1px solid var(--color-divider)', md: 'none' },
            // se queda fija mientras la rejilla de productos hace scroll
            position: { md: 'sticky' },
            top: { md: 130 },
            alignSelf: { md: 'start' },
          }}
        >
          <Box sx={{ mb: 2, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
            Categoría
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: { xs: '8px', md: 0 },
              border: { md: '1px solid var(--color-divider)' },
              borderRadius: { md: '14px' },
              overflow: 'hidden',
            }}
          >
            {segments.map((s, idx) => {
              const active = seg === s.key;
              return (
                <Box
                  key={s.key}
                  component="button"
                  type="button"
                  onClick={() => setSeg(s.key)}
                  sx={{
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: 12,
                    textAlign: 'left',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    px: '14px',
                    py: '11px',
                    borderRadius: { xs: '999px', md: 0 },
                    border: { xs: '1px solid var(--color-divider)', md: 0 },
                    borderTop: { md: idx === 0 ? 0 : '1px solid var(--color-divider)' },
                    transition: 'background 300ms, color 300ms',
                    ...(active
                      ? { bgcolor: 'var(--color-accent-600)', color: '#fff' }
                      : { bgcolor: 'transparent', color: 'inherit', '&:hover': { bgcolor: 'var(--color-accent-100)' } }),
                  }}
                >
                  {s.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ mt: 4.5, mb: 1.5, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
            Precio
          </Box>
          <Slider
            size="small"
            value={range}
            min={0}
            max={maxPrice}
            onChange={(_, v) => setRange(v)}
            valueLabelDisplay="off"
            sx={{ color: 'var(--color-accent)', maxWidth: { xs: 260, md: '100%' } }}
          />
          <Box sx={{ fontSize: 12, color: 'var(--color-neutral-600)', fontVariantNumeric: 'tabular-nums' }}>
            {fCurrency(range[0])} – {fCurrency(range[1])} MXN
          </Box>
        </Box>

        <Box sx={{ px: { xs: '18px', md: '40px' }, py: { xs: 4, md: 5 }, pb: { xs: 8, md: 11 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              pb: 2.5,
              borderBottom: '1px solid var(--color-divider)',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-600)',
            }}
          >
            <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {pad2(cards.length)} resultado{cards.length === 1 ? '' : 's'}
            </Box>
            {/* Toggle de vista: cuadrícula / dos columnas / filas */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>Ver</Box>
              <Box sx={{ display: 'flex', border: '1px solid var(--color-divider)', borderRadius: '999px', overflow: 'hidden' }}>
                {VIEWS.map((v) => (
                  <Box
                    key={v.key}
                    component="button"
                    type="button"
                    onClick={() => setView(v.key)}
                    aria-label={v.label}
                    aria-pressed={view === v.key}
                    sx={{
                      border: 0,
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      width: 40,
                      height: 34,
                      transition: 'background 250ms, color 250ms',
                      ...(view === v.key
                        ? { bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)' }
                        : { bgcolor: 'transparent', color: 'var(--color-neutral-600)', '&:hover': { bgcolor: 'var(--color-accent-100)' } }),
                    }}
                  >
                    <Iconify icon={v.icon} width={16} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {cards.length ? (
            <Box
              sx={{
                pt: view === 'list' ? 2 : 5,
                display: 'grid',
                gap: view === 'list' ? 0 : '44px 28px',
                gridTemplateColumns: { xs: view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))', md: GRID_COLUMNS[view] },
              }}
            >
              {cards.map((card) => (
                <OdCatalogCard key={card.key} card={card} horizontal={view === 'list'} />
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 12, textAlign: 'center', color: 'var(--color-neutral-500)' }}>
              No hay resultados con estos filtros.
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
