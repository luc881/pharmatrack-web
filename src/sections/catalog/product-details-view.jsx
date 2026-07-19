'use client';

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

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { SHOP_INFO } from './shop-info';
import { ProductCard } from './product-card';
import { TaxonomyBadge } from './scientific';

// ----------------------------------------------------------------------

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

export function ProductDetailsView({ product, related = [] }) {
  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  const perUnit = !product.is_unit_sale && product.unit_name;

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
                {fCurrency(product.price_retail)}
                {perUnit && (
                  <Box component="span" sx={{ typography: 'h6', color: 'text.secondary', fontWeight: 400 }}>
                    {' '}
                    / {product.unit_name}
                  </Box>
                )}
              </Typography>
              {perUnit ? (
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

            {WHATSAPP && !soldOut && (
              <Button
                fullWidth
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener"
                size="large"
                variant="contained"
                color="success"
                startIcon={<Iconify icon="solar:chat-round-dots-bold" width={22} />}
              >
                Preguntar por WhatsApp
              </Button>
            )}

            {/* Info de compra/envío — editable en shop-info.js */}
            <Stack spacing={2}>
              {SHOP_INFO.map((info) => (
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
