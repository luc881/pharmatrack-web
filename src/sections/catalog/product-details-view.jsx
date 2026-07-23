'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useCart } from './use-cart';
import { shopInfoFor } from './shop-info';
import { TaxonomyBadge } from './scientific';
import { productSlug , ProductCard, isBulkWeight } from './product-card';


// ----------------------------------------------------------------------


export function ProductDetailsView({ product, related = [], shippingEnabled = true }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  const perWeight = isBulkWeight(product);
  const unitSuffix = product.unit_name && product.unit_name !== 'pieza' ? product.unit_name : null;

  const whatsappText = `Hola, me interesa el producto ${product.title}`;
  const paragraphs = (product.description ?? '').split('\n').filter(Boolean);

  return (
    <Container sx={{ mb: 10 }}>
      <Breadcrumbs sx={{ mb: 5, mt: { xs: 1, md: 3 } }}>
        <Link component={RouterLink} href={paths.root} color="inherit" variant="body2">
          Inicio
        </Link>
        <Link component={RouterLink} href={paths.catalog} color="inherit" variant="body2">
          Catálogo
        </Link>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            {soldOut && (
              <Label
                variant="filled"
                color="default"
                sx={{ top: 16, left: 16, zIndex: 9, position: 'absolute' }}
              >
                Agotado
              </Label>
            )}
            {product.image ? (
              <Image alt={product.title} src={product.image} ratio="1/1" />
            ) : (
              <Box
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.neutral',
                  color: 'text.disabled',
                }}
              >
                Sin foto
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Stack spacing={2}>
            <Box>
              {product.category && <TaxonomyBadge sx={{ mb: 1 }}>{product.category}</TaxonomyBadge>}
              <Typography variant="h4" component="h1">
                {product.title}
              </Typography>
            </Box>

            {paragraphs[0] && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {paragraphs[0]}
              </Typography>
            )}

            <Box>
              <Typography variant="h3">
                {product.compare_at_price > product.price_retail && (
                  <Box
                    component="span"
                    sx={{ mr: 1.5, typography: 'h5', fontWeight: 400, color: 'text.disabled', textDecoration: 'line-through' }}
                  >
                    {fCurrency(product.compare_at_price)}
                  </Box>
                )}
                {fCurrency(product.price_retail)}
                {unitSuffix && (
                  <Box component="span" sx={{ typography: 'h6', color: 'text.secondary', fontWeight: 400 }}>
                    {' '}
                    / {unitSuffix}
                  </Box>
                )}
              </Typography>
              {perWeight ? (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Venta a granel: eliges la pieza, se pesa en tienda y se cobra por{' '}
                  {product.unit_name}.
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  sx={{ color: soldOut ? 'text.disabled' : 'success.main', fontWeight: 600 }}
                >
                  {soldOut
                    ? 'Agotado por el momento'
                    : product.tracks_batches
                      ? `${product.stock} disponibles`
                      : 'Disponible'}
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {!soldOut && (
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:cart-plus-bold" width={22} />}
                onClick={() => {
                  cart.add({
                    key: `pr-${product.id}`,
                    title: product.title,
                    detail: product.category ?? null,
                    price: product.price_retail,
                    // granel: la cantidad son gramos (arranca en 100)
                    qty: perWeight ? 100 : 1,
                    unit: perWeight ? product.unit_name : null,
                    image: product.image ?? null,
                    url: paths.product(productSlug(product)),
                  });
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
              >
                {added ? 'Agregado ✓' : 'Agregar a cotización'}
              </Button>
            )}

            {!shippingEnabled && (
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                📍 Solo entrega en persona en CDMX — por ahora no hacemos envíos.
              </Typography>
            )}

            {CONFIG.whatsapp && !soldOut && (
              <Button
                fullWidth
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener"
                size="large"
                variant="outlined"
                color="success"
                startIcon={<Iconify icon="solar:chat-round-dots-bold" width={22} />}
              >
                Preguntar por WhatsApp
              </Button>
            )}

            {/* Info de compra/envío — editable en shop-info.js */}
            <Stack spacing={2}>
              {shopInfoFor(shippingEnabled).map((info) => (
                <Box key={info.title} sx={{ gap: 1.5, display: 'flex' }}>
                  <Iconify icon={info.icon} width={24} sx={{ color: info.color, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: info.color }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {info.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {(product.components ?? []).length > 0 && (
        <Box component="section" sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Este paquete incluye
          </Typography>
          <Stack
            divider={<Divider sx={{ borderStyle: 'dashed' }} />}
            sx={(theme) => ({ maxWidth: 560, borderRadius: 2, border: `solid 1px ${theme.vars.palette.divider}` })}
          >
            {product.components.map((component) => (
              <Box key={component.product_id} sx={{ p: 2, gap: 2, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'background.neutral',
                  }}
                >
                  {component.image && <Image alt={component.title} src={component.image} ratio="1/1" />}
                </Box>
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  {component.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  × {component.quantity}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {paragraphs.length > 1 && (
        <Box component="section" sx={{ mt: { xs: 6, md: 10 }, mx: 'auto', maxWidth: 720 }}>
          <Stack spacing={2}>
            {paragraphs.slice(1).map((paragraph, index) => (
              <Typography key={index} variant="body1" sx={{ color: 'text.secondary' }}>
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      {related.length > 0 && (
        <Box component="section" sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            También te puede servir
          </Typography>
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            }}
          >
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
