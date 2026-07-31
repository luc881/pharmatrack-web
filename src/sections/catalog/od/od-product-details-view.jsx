'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { OdReveal } from 'src/layouts/od/od-motion';
import { OdImage, Display } from 'src/layouts/od/od-ui';

import { useCart } from '../use-cart';
import { shopInfoFor } from '../shop-info';
import { OdCatalogCard } from './od-catalog-card';
import { productToCard } from './od-catalog-view';
import { productSlug, isBulkWeight } from '../utils';

// ----------------------------------------------------------------------
// Detalle de producto (insumos) editorial. Reutiliza cart.add (misma llave
// pr-{id}) y cierra con "Productos similares". Solo cambia la piel.
// ----------------------------------------------------------------------

export function OdProductDetailsView({ product, related = [], shippingEnabled = true }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const soldOut = product.tracks_batches && (product.stock ?? 0) <= 0;
  const perWeight = isBulkWeight(product);
  const unitSuffix = product.unit_name && product.unit_name !== 'pieza' ? product.unit_name : null;
  const whatsappText = `Hola, me interesa el producto ${product.title}`;
  const paragraphs = (product.description ?? '').split('\n').filter(Boolean);

  const handleAdd = () => {
    cart.add({
      key: `pr-${product.id}`,
      title: product.title,
      detail: product.category ?? null,
      price: product.price_retail,
      qty: perWeight ? 100 : qty,
      unit: perWeight ? product.unit_name : null,
      image: product.image ?? null,
      url: paths.product(productSlug(product)),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Miga de pan */}
      <Box
        component="nav"
        className="od-rise"
        sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 3, md: 4 }, display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}
      >
        <Link component={RouterLink} href={paths.root} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
          Inicio
        </Link>
        <span>/</span>
        <Link component={RouterLink} href={paths.catalog} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
          Catálogo
        </Link>
        <span>/</span>
        <Box component="span" sx={{ color: 'var(--color-text)' }}>{product.title}</Box>
      </Box>

      {/* Imagen + panel de compra */}
      <Box
        component="section"
        sx={{ display: 'grid', gap: { xs: 4, md: '48px' }, alignItems: 'start', px: { xs: '18px', md: '40px' }, pt: { xs: 3, md: 4 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.08fr) minmax(0, 1fr)' } }}
      >
        <OdReveal sx={{ minWidth: 0, position: 'relative' }}>
          <OdImage src={product.image} alt={product.title} label={product.title} ratio="1 / 1" />
          {soldOut && (
            <Box sx={{ position: 'absolute', top: 12, left: 12, px: '14px', py: '5px', fontSize: 12, borderRadius: '999px', bgcolor: 'rgba(243,242,242,0.92)', color: 'var(--color-neutral-900)' }}>
              Agotado
            </Box>
          )}
        </OdReveal>

        <Box sx={{ minWidth: 0, position: { md: 'sticky' }, top: { md: 130 }, pb: { md: 5 } }}>
          {product.category && (
            <Box component="span" sx={{ display: 'inline-block', px: '14px', py: '5px', borderRadius: '999px', border: '1px solid var(--color-divider)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
              {product.category}
            </Box>
          )}

          <Display component="h1" size="clamp(34px, 4.2vw, 58px)" sx={{ mt: '20px', lineHeight: 1.06 }}>
            {product.title}
          </Display>

          {paragraphs[0] && (
            <Box sx={{ mt: '22px', fontSize: 15, lineHeight: 1.8, maxWidth: '48ch' }}>{paragraphs[0]}</Box>
          )}

          <Box sx={{ mt: '28px', fontFamily: 'var(--font-heading)', fontSize: 38, fontVariantNumeric: 'tabular-nums' }}>
            {product.compare_at_price > product.price_retail && (
              <Box component="span" sx={{ mr: 1.5, fontSize: 22, color: 'var(--color-neutral-500)', textDecoration: 'line-through' }}>
                {fCurrency(product.compare_at_price)}
              </Box>
            )}
            {fCurrency(product.price_retail)}
            {unitSuffix && (
              <Box component="span" sx={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-neutral-600)' }}> / {unitSuffix}</Box>
            )}
          </Box>
          <Box sx={{ mt: 1, fontSize: 13, color: soldOut ? 'var(--color-neutral-500)' : 'var(--color-accent-700)' }}>
            {perWeight
              ? `Venta a granel: se pesa y se cobra por ${product.unit_name}.`
              : soldOut
                ? 'Agotado por el momento'
                : product.tracks_batches
                  ? `${product.stock} disponibles`
                  : 'Disponible'}
          </Box>

          {/* Cantidad (piezas) + agregar */}
          {!soldOut && (
            <Box sx={{ mt: '26px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {!perWeight && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-divider)', borderRadius: '999px' }}>
                  <Box component="button" type="button" aria-label="Quitar uno" onClick={() => setQty((q) => Math.max(1, q - 1))}
                    sx={{ width: 44, height: 52, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 18, color: 'inherit', borderRadius: '999px 0 0 999px', '&:hover': { bgcolor: 'var(--color-neutral-200)' } }}>–</Box>
                  <Box component="span" sx={{ minWidth: 30, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{qty}</Box>
                  <Box component="button" type="button" aria-label="Agregar uno" onClick={() => setQty((q) => Math.min(9, q + 1))}
                    sx={{ width: 44, height: 52, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 18, color: 'inherit', borderRadius: '0 999px 999px 0', '&:hover': { bgcolor: 'var(--color-neutral-200)' } }}>+</Box>
                </Box>
              )}
              <Box component="button" type="button" onClick={handleAdd}
                sx={{ flex: 1, minWidth: 220, height: 52, px: '32px', border: 0, borderRadius: '999px', cursor: 'pointer', font: 'inherit', fontSize: 14, bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', transition: 'background 350ms, transform 350ms', '&:hover': { bgcolor: 'var(--color-accent-700)', transform: 'translateY(-2px)' } }}>
                {added ? 'Agregado ✓' : 'Agregar a cotización'}
              </Box>
            </Box>
          )}

          {!shippingEnabled && (
            <Box sx={{ mt: '14px', fontSize: 13, color: 'var(--color-neutral-600)' }}>
              Solo entrega en persona en CDMX — por ahora no hacemos envíos.
            </Box>
          )}

          {CONFIG.whatsapp && (
            <Box sx={{ mt: '18px' }}>
              <Link href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener"
                sx={{ display: 'inline-flex', alignItems: 'center', height: 50, px: '28px', borderRadius: '999px', border: '1px solid var(--color-divider)', color: 'inherit', fontSize: 14, textDecoration: 'none', transition: 'border-color 350ms, background 350ms', '&:hover': { borderColor: 'var(--color-accent)', bgcolor: 'var(--color-accent-100)' } }}>
                Preguntar por WhatsApp
              </Link>
            </Box>
          )}

          <Box sx={{ mt: '34px' }}>
            {shopInfoFor(shippingEnabled).map((info, i, arr) => (
              <Box key={info.title} sx={{ py: '20px', borderTop: '1px solid var(--color-divider)', borderBottom: i === arr.length - 1 ? '1px solid var(--color-divider)' : 'none' }}>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 19 }}>{info.title}</Box>
                <Box sx={{ mt: '6px', fontSize: 14, color: 'var(--color-neutral-700)' }}>{info.description}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Este paquete incluye */}
      {(product.components ?? []).length > 0 && (
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 6, md: '70px' } }}>
          <Display size="clamp(24px, 3vw, 40px)" weight={400} sx={{ mb: '24px' }}>
            Este paquete incluye
          </Display>
          <Box sx={{ maxWidth: 560, border: '1px solid var(--color-divider)', borderRadius: '16px', overflow: 'hidden' }}>
            {product.components.map((c, i) => (
              <Box key={c.product_id} sx={{ p: 2, gap: 2, display: 'flex', alignItems: 'center', borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)' }}>
                <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: '10px', overflow: 'hidden', bgcolor: 'var(--color-neutral-200)' }}>
                  {c.image && <Box component="img" src={c.image} alt={c.title} sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }} />}
                </Box>
                <Box sx={{ flexGrow: 1, fontSize: 15 }}>{c.title}</Box>
                <Box sx={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>× {c.quantity}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Descripción extendida */}
      {paragraphs.length > 1 && (
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 6, md: '70px' } }}>
          <Box sx={{ maxWidth: '68ch' }}>
            {paragraphs.slice(1).map((p, i) => (
              <Box component="p" key={i} sx={{ m: 0, mb: '18px', fontSize: 16, lineHeight: 1.85 }}>{p}</Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Productos similares */}
      {related.length > 0 && (
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 7, md: '80px' }, pb: { xs: 8, md: 12 } }}>
          <Display size="clamp(26px, 3vw, 40px)" weight={400} sx={{ pb: '22px', borderBottom: '1px solid var(--color-divider)' }}>
            Productos similares
          </Display>
          <Box sx={{ pt: '34px', display: 'grid', gap: '44px 28px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {related.slice(0, 4).map((p, i) => (
              <OdReveal key={p.id} delay={i * 0.08}>
                <OdCatalogCard card={productToCard(p)} />
              </OdReveal>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
