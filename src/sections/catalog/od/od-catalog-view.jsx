'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Slider from '@mui/material/Slider';
import Drawer from '@mui/material/Drawer';

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

const SORT_OPTIONS = [
  { v: 'rel', label: 'Recién llegados' },
  { v: 'asc', label: 'Precio: menor a mayor' },
  { v: 'desc', label: 'Precio: mayor a menor' },
  { v: 'stock', label: 'Disponibilidad' },
];

// ----------------------------------------------------------------------
// Catálogo editorial: cabecera con miga de pan + título display, barra lateral
// (control segmentado de categoría + rango de precio) y rejilla. Datos reales;
// el filtro de categoría alterna entre listados de animales y productos.
// ----------------------------------------------------------------------

const pad2 = (n) => String(n).padStart(2, '0');

// Paginación por scroll infinito: 8 iniciales, +6 al acercarse al final.
const PAGE = 8;
const STEP = 6;

// prefijo tipo SKU a partir del nombre de la categoría (Isópodos → ISO)
const skuPrefix = (name) =>
  (name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 3)
    .toUpperCase() || 'OD';

export const animalToCard = (i, isNew = false) => {
  const pct = offerPct(i.minPrice, i.compareAt);
  const category = i.species?.genus?.group?.name ?? 'Isópodos';
  const soldOut = i.count === 0;
  // El badge es texto de presentación con prioridad ("Nuevo" gana sobre
  // "Agotado"), así que ya no puede llevar el estado de disponibilidad: la
  // banda roja se encarga de avisar "Agotado" y lee `card.soldOut` directo.
  const badge = isNew
    ? 'Nuevo'
    : i.count > 0 && i.count <= 6
      ? `Últimos ${i.count}`
      : pct
        ? `-${pct}%`
        : null;
  return {
    key: i.key,
    href: paths.catalogSpecies(i.slug),
    image: i.photos?.[0] ?? i.taxonPhoto,
    image2: i.photos?.[1] ?? i.photos?.[0] ?? i.taxonPhoto,
    codePrefix: skuPrefix(category),
    category,
    scientific: scientificName(i.species),
    saleFormat: saleFormatLabel(i.species),
    title: i.title,
    // "Nominal" distingue la forma base de sus variantes. Va como campo aparte
    // y NO dentro de title: listingSlug deriva del titulo, asi que meterlo ahi
    // cambiaria la URL de todas las especies y romperia los enlaces existentes.
    taxonLabel: i.morph ? null : 'Nominal',
    soldOut,
    badge,
    badgeVariant: isNew || pct ? 'accent' : 'neutral',
    addLabel: soldOut ? 'Avísame' : 'Añadir · 12–15 individuos',
    price:
      i.minPrice == null
        ? 'Consultar'
        : i.minPrice !== i.maxPrice
          ? `Desde ${fCurrency(i.minPrice)}`
          : `${fCurrency(i.minPrice)} MXN`,
    favKey: i.key,
    // campos numéricos ocultos para ordenar (no se pintan)
    _price: i.minPrice,
    _new: i.latestId,
    _avail: soldOut ? 0 : 1,
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
    image2: p.image,
    codePrefix: null,
    category: p.category ?? 'Producto',
    title: p.title,
    soldOut,
    // El chip ya no lleva "Agotado": la banda roja avisa la disponibilidad
    // (mismo criterio que animalToCard). El badge se queda solo con el
    // descuento, para que un producto agotado con descuento muestre ambos.
    badge: pct ? `-${pct}%` : null,
    badgeVariant: 'accent',
    addLabel: soldOut ? 'Avísame' : 'Añadir al carrito',
    price: `${fCurrency(p.price_retail)}${unit} MXN`,
    favKey: null,
    _price: p.price_retail,
    _new: p.id,
    _avail: soldOut ? 0 : 1,
  };
};

// Nivel y Precio: se pintan tal cual en la columna lateral (md) y en la hoja
// inferior de filtros (xs). Viven aparte para no duplicar el JSX ni el estado
// — ambos lugares reciben/escriben las mismas props de OdCatalogView.
function LevelFilter({ levels, level, setLevel }) {
  if (!levels.length) return null;
  return (
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
  );
}

function PriceFilter({ range, setRange, maxPrice }) {
  return (
    <>
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
    </>
  );
}

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

  // Hoja inferior de filtros (solo xs) — botón "Filtros" de la barra pegajosa.
  const sheet = useBoolean();

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

  // La paginación se reinicia al cambiar cualquier filtro/orden
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
        .map((i) => animalToCard(i))
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

  // Sentinela que reemplaza al botón "Cargar más": solo se observa mientras
  // queden tarjetas por mostrar, para no dejar un observer disparando
  // setShown indefinidamente sobre una lista ya completa.
  //
  // Ref de callback en vez de useRef+useEffect: la sentinela se renderiza
  // condicionalmente, así que un useEffect corriendo antes del montaje vería
  // sentinelRef.current === null y nunca observaría nada. El callback ref
  // dispara re-render con el nodo real en cuanto React lo monta.
  //
  // El efecto depende también de `shown`: IntersectionObserver solo notifica
  // *cambios* de intersección, así que si la sentinela sigue visible tras
  // cargar una tanda (siguiente `shown` con el mismo nodo en el viewport) un
  // observer que no se recrea no vuelve a disparar. Al recrearlo en cada
  // cambio de `shown`, el nuevo observer evalúa la intersección actual de
  // inmediato (garantía del spec) y sigue encadenando tandas mientras la
  // sentinela siga a la vista.
  const hasMore = cards.length > shown;
  const [sentinelNode, setSentinelNode] = useState(null);
  useEffect(() => {
    if (!hasMore || !sentinelNode) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown((n) => n + STEP),
      { rootMargin: '200px 0px' }
    );
    observer.observe(sentinelNode);
    return () => observer.disconnect();
  }, [hasMore, shown, sentinelNode]);

  // Chips activos: cada uno limpia su propio filtro
  const priceFull = range[0] === 0 && range[1] === maxPrice;
  const chips = [
    seg !== 'all' && { label: segments.find((s) => s.key === seg)?.label, clear: () => setSeg('all') },
    level !== 'all' && { label: level, clear: () => setLevel('all') },
    !priceFull && { label: `${fCurrency(range[0])} – ${fCurrency(range[1])}`, clear: () => setRange([0, maxPrice]) },
  ].filter(Boolean);
  // Cuenta para el botón "Filtros" de la barra móvil: la categoría ya tiene
  // su propia fila de chips, así que no se cuenta aquí.
  const extraFilterCount = (level !== 'all' ? 1 : 0) + (!priceFull ? 1 : 0);
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
        data-dark="1"
        sx={{
          px: { xs: '18px', md: '40px' },
          pt: { xs: 5, md: 8 },
          pb: { xs: 4, md: 5 },
          // Banda oscura, el mismo tratamiento que el pie y las preguntas.
          // data-dark hace que la barra de navegacion se aclare mientras esta
          // seccion cruza por debajo (use-nav-theme.js).
          bgcolor: 'var(--color-accent-900)',
          color: 'var(--color-neutral-200)',
        }}
      >
        <Box sx={{ mb: 2, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-400)' }}>
          <Link component={RouterLink} href={paths.root} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-300)' } }}>
            Inicio
          </Link>
          {' / '}
          {category ? (
            <>
              <Link component={RouterLink} href={paths.catalog} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-300)' } }}>
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

      {/* Barra de filtros pegajosa (solo xs): sustituye a la columna lateral,
          que no cabe arriba del pliegue en móvil. Chips de categoría con
          scroll horizontal + botón "Filtros" fijo que abre la hoja inferior.
          top:130 reutiliza el mismo despeje que ya usa el <aside> sticky de
          escritorio (más abajo) para la píldora flotante del header — esa
          píldora es fixed/zIndex:70 y aparece pasados 320px de scroll, así
          que 130 dejaba margen de sobra ahí y sirve igual aquí. zIndex:40 la
          mantiene por debajo de esa píldora y de la barra de pestañas móvil
          (ambas fixed/zIndex:70, no deben taparse) pero por encima de la
          rejilla de tarjetas que scrollea debajo. */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          gap: 1,
          position: 'sticky',
          top: 130,
          zIndex: 40,
          px: '18px',
          py: '10px',
          bgcolor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            flex: 1,
            minWidth: 0,
            overflowX: 'auto',
            // sin barra de scroll visible, pero el gesto de scroll sigue activo
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {segments.map((s) => {
            const active = seg === s.key;
            return (
              <Box
                key={s.key}
                component="button"
                type="button"
                onClick={() => setSeg(s.key)}
                sx={{
                  flexShrink: 0,
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  minHeight: 44,
                  px: '14px',
                  border: '1px solid var(--color-divider)',
                  borderRadius: '999px',
                  transition: 'background 250ms, color 250ms',
                  ...(active
                    ? { bgcolor: 'var(--color-accent-600)', color: '#fff', borderColor: 'var(--color-accent-600)' }
                    : { bgcolor: 'transparent', color: 'inherit' }),
                }}
              >
                {s.label}
              </Box>
            );
          })}
        </Box>

        <Box
          component="button"
          type="button"
          onClick={sheet.onTrue}
          sx={{
            flexShrink: 0,
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            minHeight: 44,
            px: '16px',
            border: '1px solid var(--color-divider)',
            borderRadius: '999px',
            bgcolor: 'var(--color-neutral-900)',
            color: 'var(--color-neutral-100)',
          }}
        >
          Filtros{extraFilterCount > 0 ? ` · ${extraFilterCount}` : ''}
        </Box>
      </Box>

      {/* Hoja inferior de filtros (solo xs, se abre desde el botón de arriba):
          Nivel, Precio y Orden sobre el mismo estado que la columna lateral.
          MUI la monta con su zIndex de modal (1300 por defecto), muy por
          encima de las barras fixed (70) de header/pestañas, así que no hace
          falta fijarlo a mano; el propio Drawer se encarga de no bloquear el
          scroll del body al cerrarse. */}
      <Drawer
        anchor="bottom"
        open={sheet.value}
        onClose={sheet.onFalse}
        slotProps={{
          paper: {
            sx: {
              display: { xs: 'block', md: 'none' },
              borderRadius: '18px 18px 0 0',
              maxHeight: '85vh',
              px: '18px',
              pt: 3,
              pb: 'calc(18px + env(safe-area-inset-bottom))',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filtros</Box>
          <Box
            component="button"
            type="button"
            onClick={sheet.onFalse}
            aria-label="Cerrar filtros"
            sx={{ minWidth: 44, minHeight: 44, display: 'grid', placeItems: 'center', border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'inherit' }}
          >
            <Iconify icon="mingcute:close-line" width={20} />
          </Box>
        </Box>

        <LevelFilter levels={levels} level={level} setLevel={setLevel} />
        <PriceFilter range={range} setRange={setRange} maxPrice={maxPrice} />

        <Box sx={{ mt: 4.5, mb: 1.5, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
          Orden
        </Box>
        <Box
          component="select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Ordenar"
          sx={{
            display: 'block',
            width: '100%',
            minHeight: 44,
            font: 'inherit',
            fontSize: 13,
            color: 'inherit',
            bgcolor: 'transparent',
            border: '1px solid var(--color-divider)',
            borderRadius: '10px',
            px: 1.5,
            cursor: 'pointer',
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 4, pt: 3, borderTop: '1px solid var(--color-divider)' }}>
          <Box
            component="button"
            type="button"
            onClick={clearAll}
            sx={{ minHeight: 44, px: 1, border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}
          >
            Limpiar todo
          </Box>
          <Box
            component="button"
            type="button"
            onClick={sheet.onFalse}
            sx={{ flex: 1, minHeight: 44, cursor: 'pointer', font: 'inherit', fontSize: 13, border: 0, borderRadius: '999px', bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)' }}
          >
            Ver {cards.length} resultado{cards.length === 1 ? '' : 's'}
          </Box>
        </Box>
      </Drawer>

      {/* Cuerpo: barra lateral fija + rejilla */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '232px minmax(0, 1fr)' } }}>
        {/* El color va en la celda de la rejilla, no en el <aside>: el aside es
            sticky y solo mide lo que ocupan sus filtros, asi que pintarlo a el
            dejaria el panel cortado a media pagina. */}
        <Box
          sx={{
            // La columna lateral se sustituye por la barra pegajosa + hoja
            // inferior en xs (no cabe: ver comentario de esa barra más abajo).
            display: { xs: 'none', md: 'block' },
            bgcolor: 'var(--color-surface)',
            borderRight: { md: '1px solid var(--color-divider)' },
            borderBottom: { xs: '1px solid var(--color-divider)', md: 'none' },
          }}
        >
          <Box
            component="aside"
            sx={{
              px: { xs: '18px', md: '32px' },
              py: { xs: 4, md: 5 },
              // se queda fija mientras la rejilla de productos hace scroll
              position: { md: 'sticky' },
              top: { md: 130 },
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

          <LevelFilter levels={levels} level={level} setLevel={setLevel} />
          <PriceFilter range={range} setRange={setRange} maxPrice={maxPrice} />
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
              {/* Orden: en xs vive en la hoja inferior de filtros (evita
                  duplicar el control en la barra de resultados, que ya
                  aprieta en móvil) */}
              <Box
                component="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Ordenar"
                sx={{
                  display: { xs: 'none', md: 'inline-block' },
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
                {SORT_OPTIONS.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.label}
                  </option>
                ))}
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
                  <OdReveal key={card.key} delay={Math.min(i, 8) * 0.05} sx={{ minWidth: 0 }}>
                    <OdCatalogCard card={card} index={i} horizontal={view === 'list'} />
                  </OdReveal>
                ))}
              </Box>

              {hasMore && (
                <Box
                  ref={setSentinelNode}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: { xs: 6, md: 8 },
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-neutral-500)',
                  }}
                >
                  Cargando más…
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
