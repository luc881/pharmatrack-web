'use client';

import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { SpeciesCard } from './species-card';
import { ProductCard } from './product-card';
import { CatalogSort } from './catalog-sort';
import { CatalogFilters, SexFilterControl, PriceFilterControl } from './catalog-filters';

// ----------------------------------------------------------------------

const VIEW_MODES = [
  { value: 'list', icon: 'ic:round-view-list', label: 'Lista' },
  { value: 'grid2', icon: 'mingcute:grid-fill', label: '2 columnas' },
  { value: 'grid3', icon: 'mingcute:dot-grid-fill', label: '3 columnas' },
];

const GRID_COLUMNS = {
  list: { xs: '1fr' },
  grid2: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  grid3: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
};

// ponytail: el catálogo llega completo del servidor (page_size=100) y los
// filtros son en memoria; filtrar en servidor cuando pase de 100 animales.
// items = especies agrupadas (buildSpeciesList) — el público no ve folios.
export function CatalogView({ items, categories, category = null, products = [] }) {
  const openFilters = useBoolean();

  // Pestañas Animales/Productos solo en la raíz del catálogo y si hay productos
  const showTabs = !category && products.length > 0;
  const [tab, setTab] = useState('animals');

  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid3');

  const maxPrice = useMemo(() => Math.max(...items.map((i) => i.maxPrice), 0), [items]);

  const defaults = useMemo(() => ({ sex: [], priceRange: [0, maxPrice] }), [maxPrice]);

  const [state, setState] = useState(defaults);

  const filters = {
    state,
    setState: (patch) => setState((prev) => ({ ...prev, ...patch })),
    resetState: () => setState(defaults),
  };

  const canReset =
    state.sex.length > 0 || state.priceRange[0] !== 0 || state.priceRange[1] !== maxPrice;

  const filtered = applyFilter({ items, state, sortBy });

  // ── Pestaña Productos: su propio menú de categorías y filtro de precio ──
  const productCategories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );
  const [productCategory, setProductCategory] = useState(null);
  const productMaxPrice = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price_retail), 0)),
    [products]
  );
  const [productPrice, setProductPrice] = useState(null); // null = sin filtrar
  const productFilters = {
    state: { priceRange: productPrice ?? [0, productMaxPrice] },
    setState: (patch) => setProductPrice(patch.priceRange),
    resetState: () => setProductPrice(null),
  };
  const filteredProducts = products.filter(
    (p) =>
      (!productCategory || p.category === productCategory) &&
      (!productPrice || (p.price_retail >= productPrice[0] && p.price_retail <= productPrice[1]))
  );

  const renderSidebar = () => (
    <Stack
      component="aside"
      spacing={3}
      sx={{ width: 220, flexShrink: 0, display: { xs: 'none', md: 'flex' } }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Menú
        </Typography>
        <Stack spacing={1.5}>
          <Link
            component={RouterLink}
            href={paths.catalog}
            variant="body2"
            sx={{ color: category ? 'text.secondary' : 'primary.main', fontWeight: category ? 400 : 600 }}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              component={RouterLink}
              href={paths.catalogCategory(c.slug)}
              variant="body2"
              sx={{
                color: category?.id === c.id ? 'primary.main' : 'text.secondary',
                fontWeight: category?.id === c.id ? 600 : 400,
              }}
            >
              {c.name}
            </Link>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <SexFilterControl filters={filters} />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <PriceFilterControl filters={filters} maxPrice={maxPrice} />
    </Stack>
  );

  const renderToolbar = () => (
    <Stack spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
      {/* Categorías en móvil (en desktop van en el sidebar) */}
      {categories.length > 1 && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, display: { md: 'none' } }}>
          <Chip
            clickable
            component={RouterLink}
            href={paths.catalog}
            label="Todos"
            size="small"
            variant={category ? 'outlined' : 'filled'}
            color={category ? 'default' : 'primary'}
          />
          {categories.map((c) => (
            <Chip
              key={c.id}
              clickable
              component={RouterLink}
              href={paths.catalogCategory(c.slug)}
              label={c.name}
              size="small"
              variant={category?.id === c.id ? 'filled' : 'outlined'}
              color={category?.id === c.id ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="overline" sx={{ mr: 1, color: 'text.disabled', display: { xs: 'none', sm: 'block' } }}>
          Ver como
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={viewMode}
          onChange={(_, value) => value && setViewMode(value)}
        >
          {VIEW_MODES.map((mode) => (
            <ToggleButton key={mode.value} value={mode.value} aria-label={mode.label}>
              <Iconify width={18} icon={mode.icon} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { md: 'none' } }}>
          <CatalogFilters
            filters={filters}
            canReset={canReset}
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            options={{ maxPrice }}
          />
        </Box>

        <CatalogSort sort={sortBy} onSort={setSortBy} />
      </Box>

      {canReset && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>{filtered.length}</strong> resultado{filtered.length === 1 ? '' : 's'}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h3" component="h1" sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 1, md: 3 } }}>
        {category ? category.name : 'Catálogo'}
      </Typography>

      {showTabs && (
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: { xs: 3, md: 4 } }}>
          <Tab value="animals" label="Animales vivos" />
          <Tab value="products" label="Productos e insumos" />
        </Tabs>
      )}

      {showTabs && tab === 'products' ? (
        <Box sx={{ gap: 5, display: 'flex', alignItems: 'flex-start' }}>
          {/* Sidebar espejo de la de animales: menú de categorías + precio */}
          <Stack
            component="aside"
            spacing={3}
            sx={{ width: 220, flexShrink: 0, display: { xs: 'none', md: 'flex' } }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Menú
              </Typography>
              <Stack spacing={1.5}>
                <Link
                  component="button"
                  type="button"
                  onClick={() => setProductCategory(null)}
                  variant="body2"
                  underline="none"
                  sx={{
                    textAlign: 'left',
                    color: productCategory ? 'text.secondary' : 'primary.main',
                    fontWeight: productCategory ? 400 : 600,
                  }}
                >
                  Todos
                </Link>
                {productCategories.map((name) => (
                  <Link
                    key={name}
                    component="button"
                    type="button"
                    onClick={() => setProductCategory(name)}
                    variant="body2"
                    underline="none"
                    sx={{
                      textAlign: 'left',
                      color: productCategory === name ? 'primary.main' : 'text.secondary',
                      fontWeight: productCategory === name ? 600 : 400,
                    }}
                  >
                    {name}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <PriceFilterControl filters={productFilters} maxPrice={productMaxPrice} />
          </Stack>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Categorías en móvil */}
            {productCategories.length > 1 && (
              <Stack direction="row" sx={{ mb: 3, flexWrap: 'wrap', gap: 1, display: { md: 'none' } }}>
                <Chip
                  clickable
                  label="Todos"
                  size="small"
                  onClick={() => setProductCategory(null)}
                  variant={productCategory ? 'outlined' : 'filled'}
                  color={productCategory ? 'default' : 'primary'}
                />
                {productCategories.map((name) => (
                  <Chip
                    key={name}
                    clickable
                    label={name}
                    size="small"
                    onClick={() => setProductCategory(name)}
                    variant={productCategory === name ? 'filled' : 'outlined'}
                    color={productCategory === name ? 'primary' : 'default'}
                  />
                ))}
              </Stack>
            )}

            {filteredProducts.length ? (
              <Box
                sx={{
                  gap: 3,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Box>
            ) : (
              <EmptyContent filled title="Sin resultados" sx={{ py: 10 }} />
            )}
          </Box>
        </Box>
      ) : (
      <Box sx={{ gap: 5, display: 'flex', alignItems: 'flex-start' }}>
        {renderSidebar()}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {renderToolbar()}

          {filtered.length ? (
            <Box sx={{ gap: 3, display: 'grid', gridTemplateColumns: GRID_COLUMNS[viewMode] }}>
              {filtered.map((item) => (
                <SpeciesCard key={item.key} item={item} horizontal={viewMode === 'list'} />
              ))}
            </Box>
          ) : (
            <EmptyContent
              filled
              title={canReset ? 'Sin resultados' : 'No hay animales disponibles por el momento'}
              sx={{ py: 10 }}
            />
          )}
        </Box>
      </Box>
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ items, state, sortBy }) {
  let data = items.filter(
    (i) =>
      (!state.sex.length || i.sexes.some((s) => state.sex.includes(s))) &&
      i.minPrice >= state.priceRange[0] &&
      i.minPrice <= state.priceRange[1]
  );

  // ponytail: sin created_at en la respuesta pública, el id ordena por llegada
  if (sortBy === 'newest') data = [...data].sort((a, b) => b.latestId - a.latestId);
  if (sortBy === 'priceAsc') data = [...data].sort((a, b) => a.minPrice - b.minPrice);
  if (sortBy === 'priceDesc') data = [...data].sort((a, b) => b.minPrice - a.minPrice);
  if (sortBy === 'nameAsc')
    data = [...data].sort((a, b) => (a.title ?? a.species.name).localeCompare(b.title ?? b.species.name));

  return data;
}
