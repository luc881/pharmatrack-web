import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';

import { slugify } from './utils';
import { TaxonomyBadge } from './scientific';

// ----------------------------------------------------------------------
// Tarjeta de producto/insumo — espejo de la de especies: zoom que se
// asienta al hover y barra "Ver detalle" recortada dentro de la foto.
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
  const perWeight = isBulkWeight(product);
  // sufijo de precio para cualquier unidad distinta de pieza (caja, bolsa, g…)
  const unitSuffix = product.unit_name && product.unit_name !== 'pieza' ? product.unit_name : null;

  return (
    <Card
      sx={{
        height: 1,
        '&:hover .img-main img': { transform: 'scale(1.08)' },
        '&:hover .quick-cta': { transform: 'translateY(0)' },
      }}
    >
      {soldOut && (
        <Label
          variant="filled"
          color="default"
          sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute' }}
        >
          Agotado
        </Label>
      )}

      <Box sx={{ p: 1 }}>
        {/* isolation: sin ella el transform de la barra deja artefactos de
            pintado (líneas negras) al recortarse con las esquinas redondeadas */}
        <Box sx={{ borderRadius: 1.5, overflow: 'hidden', position: 'relative', isolation: 'isolate' }}>
          <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
            {product.image ? (
              <Image
                alt={product.title}
                src={product.image}
                ratio="1/1"
                className="img-main"
                sx={{ '& img': { transition: 'transform 0.6s ease' } }}
              />
            ) : (
              <Box
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.neutral',
                  color: 'text.disabled',
                  typography: 'caption',
                }}
              >
                Sin foto
              </Box>
            )}
          </Link>

          <Button
            className="quick-cta"
            component={RouterLink}
            href={href}
            fullWidth
            disableElevation
            variant="contained"
            color="inherit"
            sx={{
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9,
              height: 42,
              position: 'absolute',
              borderRadius: 0,
              boxShadow: 'none',
              willChange: 'transform',
              transform: 'translateY(100%)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            Ver detalle
          </Button>
        </Box>
      </Box>

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
    </Card>
  );
}
