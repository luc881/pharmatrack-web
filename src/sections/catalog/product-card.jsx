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

export function ProductCard({ product }) {
  const href = paths.product(productSlug(product));
  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  // venta libre por peso: el precio es por unidad de medida (p. ej. gramo)
  const perUnit = !product.is_unit_sale && product.unit_name;

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
        <Box sx={{ borderRadius: 1.5, overflow: 'hidden', position: 'relative' }}>
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
          {perUnit && (
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              {' '}
              / {product.unit_name}
            </Box>
          )}
        </Box>

        {perUnit && (
          <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
            Venta a granel — se pesa en tienda
          </Box>
        )}
      </Stack>
    </Card>
  );
}
