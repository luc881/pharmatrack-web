import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

import { slugify } from './utils';
import { offerPct } from './species-card';
import { CatalogCard } from './catalog-card';
import { TaxonomyBadge } from './scientific';
import { QuickAddButton } from './quick-add-button';

// ----------------------------------------------------------------------
// Tarjeta de producto/insumo: misma base (y animaciones) que la de especies.
// ----------------------------------------------------------------------

export function productSlug(product) {
  return `${slugify(product.title)}-${product.id}`;
}

// Granel = el precio es por unidad de MEDIDA (se pesa/mide al vender).
// No usar is_unit_sale: en el modelo de farmacia significa otra cosa
// (venta por pieza suelta de un empaque).
export function isBulkWeight(product) {
  return ['g', 'kg', 'ml', 'l'].includes((product.unit_name ?? '').toLowerCase());
}

export function ProductCard({ product }) {
  const href = paths.product(productSlug(product));
  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  const pct = offerPct(product.price_retail, product.compare_at_price);
  const perWeight = isBulkWeight(product);
  // sufijo de precio para cualquier unidad distinta de pieza (caja, bolsa, g…)
  const unitSuffix = product.unit_name && product.unit_name !== 'pieza' ? product.unit_name : null;

  const cartItem = {
    key: `pr-${product.id}`,
    title: product.title,
    detail: product.category ?? null,
    price: product.price_retail,
    // granel: la cantidad son gramos (arranca en 100)
    qty: perWeight ? 100 : 1,
    unit: perWeight ? product.unit_name : null,
    image: product.image ?? null,
  };

  return (
    <CatalogCard
      href={href}
      alt={product.title}
      photo={product.image}
      topRight={
        !soldOut && (
          <QuickAddButton
            item={cartItem}
            sx={{ top: 16, right: 16, zIndex: 9, position: 'absolute' }}
          />
        )
      }
      topLeft={
        (soldOut || pct) && (
          <Stack spacing={0.5} sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute', alignItems: 'flex-start' }}>
            {pct && !soldOut && (
              <Label variant="filled" color="error">
                -{pct}%
              </Label>
            )}
            {soldOut && (
              <Label variant="filled" color="default">
                Agotado
              </Label>
            )}
          </Stack>
        )
      }
    >
      <Stack spacing={0.5} sx={{ p: 3, pt: 2, textAlign: 'center', alignItems: 'center' }}>
        {product.category && <TaxonomyBadge>{product.category}</TaxonomyBadge>}

        <Link
          component={RouterLink}
          href={href}
          color="inherit"
          variant="subtitle2"
          noWrap
          sx={{ maxWidth: 1 }}
        >
          {product.title}
        </Link>

        <Box component="span" sx={{ pt: 1, typography: 'subtitle1' }}>
          {product.compare_at_price > product.price_retail && (
            <Box
              component="span"
              sx={{ mr: 0.75, typography: 'body2', color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {fCurrency(product.compare_at_price)}
            </Box>
          )}
          {fCurrency(product.price_retail)}
          {unitSuffix && (
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              {' '}
              / {unitSuffix}
            </Box>
          )}
        </Box>

        {perWeight && (
          <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
            Venta a granel — se pesa en tienda
          </Box>
        )}
      </Stack>
    </CatalogCard>
  );
}
