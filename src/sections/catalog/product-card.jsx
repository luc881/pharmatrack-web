import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------
// Tarjeta de producto/insumo del catálogo público. Informativa: los
// insumos se compran en tienda o se apartan por WhatsApp junto con el
// animal — no hay carrito.
// ----------------------------------------------------------------------

export function ProductCard({ product }) {
  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  // venta libre por peso: el precio es por unidad de medida (p. ej. gramo)
  const perUnit = !product.is_unit_sale && product.unit_name;

  return (
    <Card sx={{ height: 1, '&:hover .prd-img img': { transform: 'scale(1.05)' } }}>
      <Box sx={{ p: 1 }}>
        <Box sx={{ borderRadius: 1.5, overflow: 'hidden', position: 'relative' }}>
          {soldOut && (
            <Label
              variant="filled"
              color="default"
              sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
            >
              Agotado
            </Label>
          )}
          {product.image ? (
            <Image
              alt={product.title}
              src={product.image}
              ratio="1/1"
              className="prd-img"
              sx={{ '& img': { transition: 'transform 2s cubic-bezier(0.33, 0, 0.2, 1)' } }}
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
        </Box>
      </Box>

      <Stack spacing={0.5} sx={{ p: 3, pt: 2, textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap sx={{ maxWidth: 1 }}>
          {product.title}
        </Typography>

        {product.description && (
          <Typography
            variant="caption"
            sx={{
              maxWidth: 1,
              color: 'text.secondary',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Typography>
        )}

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
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Venta a granel — se pesa en tienda
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
