'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Slider from '@mui/material/Slider';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Display } from 'src/layouts/od/od-ui';
import { OdReveal } from 'src/layouts/od/od-motion';

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

// Paginación "Cargar más": 8 iniciales, +6 por clic.
const PAGE = 8;
const STEP = 6;

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
    // campos numéricos ocultos para ordenar (no se pintan)
    _price: i.minPrice,
    _new: i.latestId,
    _avail: 1,
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
    _price: p.price_retail,
    _new: p.id,
    _avail: soldOut ? 0 : 1,
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

  // Niveles de dificultad presentes en el inventario real (se adapta a la data;
  // si ninguna especie trae dificultad, el filtro no se muestra).
  const levels = useMemo(() => {
    const set = new Set();
    items.forEach((i) => i.species?.difficulty && set.add(i.species.difficulty));
    return [...set];
  }, [items]);
  const [level, setLevel] = useState('all');

  // Orden: recién llegados (fuente) · precio ↑ · precio ↓ · disponibilidad
  const [sort, setSort] = useState('rel');

  // "Cargar más" se reinicia al cambiar cualquier filtro/orden
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [seg, level, sort, range]);

  const groupId = seg.startsWith('g') ? Number(seg.slice(1)) : null;
  const showAnimals = seg === 'all' || groupId != null;
  // los productos no tienen nivel: al filtrar por nivel se ocultan
  const showProducts = (seg === 'all' || seg === 'prod') && level === 'all';

  const animalCards = showAnimals
    ? [...items]
        .filter(
          (i) =>
            (!groupId || i.species?.genus?.group?.id === groupId) &&
            (level === 'all' || i.species?.difficulty === level) &&
            inRange(i.minPrice)
        )
        .sort((a, b) => b.latestId - a.latestId)
        .map(animalToCard)
    : [];
  const productCards = showProducts
    ? products.filter((p) => inRange(p.price_retail)).map(productToCard)
    : [];

  const SORTERS = {
    asc: (a, b) => a._price - b._price,
    desc: (a, b) => b._price - a._price,
    stock: (a, b) => b._avail - a._avail || b._new - a._new,
  };
  const allCards = [...animalCards, ...productCards];
  const cards = SORTERS[sort] ? [...allCards].sort(SORTERS[sort]) : allCards;
  const visible = cards.slice(0, shown);

  // Chips activos: cada uno limpia su propio filtro
  const priceFull = range[0] === 0 && range[1] === maxPrice;
  const chips = [
    seg !== 'all' && { label: segments.find((s) => s.key === seg)?.label, clear: () => setSeg('all') },
    level !== 'all' && { label: level, clear: () => setLevel('all') },
    !priceFull && { label: `${fCurrency(range[0])} – ${fCurrency(range[1])}`, clear: () => setRange([0, maxPrice]) },
  ].filter(Boolean);
  const clearAll = () => {
    setSeg('all');
    setLevel('all');
    setRange([0, maxPrice]);
    setSort('rel');
  };

  const title = category ? category.name : 'Catálogo';

  return (
    <>
      {/* Cabecera */}
      <Box
        component="section"
        className="od-rise"
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

          {levels.length > 0 && (
            <>
              <Box sx={{ mt: 4.5, mb: 1.5, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
                Nivel
              </Box>
              <Box role="radiogroup" aria-label="Nivel" sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, flexDirection: { md: 'column' }, gap: { xs: '8px', md: '10px' }, fontSize: 13 }}>
                {[{ v: 'all', label: 'Cualquiera' }, ...levels.map((l) => ({ v: l, label: l }))].map((opt) => {
                  const active = level === opt.v;
                  return (
                    <Box
                      key={opt.v}
                      component="button"
                      type="button"
                      onClick={() => setLevel(opt.v)}
                      aria-pressed={active}
                      sx={{
                        cursor: 'pointer',
                        font: 'inherit',
                        fontSize: 13,
                        textAlign: 'left',
                        px: { xs: '12px', md: 0 },
                        py: { xs: '7px', md: 0 },
                        border: { xs: '1px solid var(--color-divider)', md: 0 },
                        borderRadius: { xs: '999px', md: 0 },
                        bgcolor: 'transparent',
                        transition: 'color 250ms',
                        color: active ? 'var(--color-accent-700)' : 'inherit',
                        '&:hover': { color: 'var(--color-accent-700)' },
                        '&::before': {
                          content: '""',
                          display: { xs: 'none', md: 'inline-block' },
                          width: 8,
                          height: 8,
                          mr: 1.25,
                          borderRadius: '999px',
                          verticalAlign: 'middle',
                          bgcolor: active ? 'var(--color-accent)' : 'transparent',
                          boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--color-neutral-500)',
                        },
                      }}
                    >
                      {opt.label}
                    </Box>
                  );
                })}
              </Box>
            </>
          )}

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
              {/* Orden */}
              <Box
                component="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Ordenar"
                sx={{
                  font: 'inherit',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  textTransform: 'none',
                  color: 'inherit',
                  bgcolor: 'transparent',
                  border: '1px solid var(--color-divider)',
                  borderRadius: '999px',
                  px: 1.5,
                  py: 0.75,
                  cursor: 'pointer',
                }}
              >
                <option value="rel">Recién llegados</option>
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
                <option value="stock">Disponibilidad</option>
              </Box>
              {/* Toggle de vista: cuadrícula / dos columnas / filas */}
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

          {/* Chips activos */}
          {chips.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', pt: 2.5 }}>
              <Box component="span" sx={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
                Filtros
              </Box>
              {chips.map((c) => (
                <Box
                  key={c.label}
                  component="button"
                  type="button"
                  onClick={c.clear}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: 12,
                    px: 1.75,
                    py: 0.875,
                    border: '1px solid var(--color-divider)',
                    borderRadius: '999px',
                    bgcolor: 'transparent',
                    color: 'inherit',
                    transition: 'border-color 250ms, color 250ms',
                    '&:hover': { borderColor: 'var(--color-accent)', color: 'var(--color-accent-700)' },
                  }}
                >
                  {c.label} ✕
                </Box>
              ))}
              <Box
                component="button"
                type="button"
                onClick={clearAll}
                sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-600)', '&:hover': { color: 'var(--color-accent-700)' } }}
              >
                Limpiar todo
              </Box>
            </Box>
          )}

          {cards.length ? (
            <>
              <Box
                sx={{
                  pt: view === 'list' ? 2 : 5,
                  display: 'grid',
                  gap: view === 'list' ? 0 : '44px 28px',
                  gridTemplateColumns: { xs: view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))', md: GRID_COLUMNS[view] },
                }}
              >
                {visible.map((card, i) => (
                  <OdReveal key={card.key} delay={Math.min(i, 8) * 0.05}>
                    <OdCatalogCard card={card} horizontal={view === 'list'} />
                  </OdReveal>
                ))}
              </Box>

              {cards.length > shown && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 6, md: 8 } }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setShown((n) => n + STEP)}
                    sx={{
                      cursor: 'pointer',
                      font: 'inherit',
                      fontSize: 13,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      px: '34px',
                      py: '15px',
                      border: '1px solid var(--color-text)',
                      bgcolor: 'transparent',
                      color: 'inherit',
                      transition: 'background 350ms, color 350ms',
                      '&:hover': { bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)' },
                    }}
                  >
                    Cargar más ({cards.length - shown})
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ py: 12, textAlign: 'center', color: 'var(--color-neutral-500)' }}>
              No hay resultados con estos filtros.
              {chips.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={clearAll}
                    sx={{ cursor: 'pointer', font: 'inherit', fontSize: 13, px: '30px', py: '14px', border: 0, bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}
                  >
                    Limpiar filtros
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
