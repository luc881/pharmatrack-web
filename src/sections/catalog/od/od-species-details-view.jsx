'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { OdImage, Display } from 'src/layouts/od/od-ui';

import { useCart } from '../use-cart';
import { shopInfoFor } from '../shop-info';
import { useFavorites } from '../use-favorites';
import { scientificName, saleFormatLabel } from '../utils';
import { OdProductCard } from '../../home/od/od-product-card';

// ----------------------------------------------------------------------
// Ficha de producto editorial. Reutiliza la lógica de carrito (cart.add, misma
// llave con escala de precio), favoritos y WhatsApp; solo cambia la piel.
// ----------------------------------------------------------------------

// Campos de la ficha de cuidados (los mismos que existen en el backend)
const CARE_FIELDS = [
  { key: 'origin', label: 'Origen' },
  { key: 'temperature', label: 'Temperatura' },
  { key: 'humidity', label: 'Humedad' },
  { key: 'adult_size', label: 'Tamaño' },
  { key: 'difficulty', label: 'Dificultad' },
  { key: 'rarity', label: 'Rareza' },
];

const kickerSx = {
  m: 0,
  mb: '20px',
  pb: '14px',
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-accent-700)',
  borderBottom: '1px solid var(--color-divider)',
};

const paraSx = { m: 0, mb: '20px', fontSize: 16, lineHeight: 1.85 };

function Panel({ title, children }) {
  return (
    <Box sx={{ border: '1px solid var(--color-divider)', borderRadius: '16px', p: '22px 24px' }}>
      <Box sx={{ mb: 2, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
        {title}
      </Box>
      {children}
    </Box>
  );
}

export function OdSpeciesDetailsView({ item, categoryPath = [], related = [], shippingEnabled = true }) {
  const { species, key, slug, photos, morphs, minPrice, maxPrice, compareAt = null } = item;

  const rootGroup = categoryPath[0] ?? null;
  const leafGroup = categoryPath[categoryPath.length - 1] ?? null;

  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(key);
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const sci = scientificName(species);
  const title = item.title ?? species.common_name ?? sci;
  const formatLabel = saleFormatLabel(species);

  const tiers = species.price_tiers ?? [];
  const [tierIndex, setTierIndex] = useState(0);
  const selectedTier = tiers[tierIndex];

  const [qty, setQty] = useState(1);
  const [gal, setGal] = useState(0);
  const gallery = photos.length ? photos : [null];
  const galIndex = Math.min(gal, gallery.length - 1);

  const whatsappText = `Hola, me interesa ${title} (${sci})${selectedTier ? ` — paquete de ${selectedTier.quantity}` : ''}`;

  const excerpt = (item.description ?? '').split('\n').filter(Boolean)[0];
  const price = selectedTier ? selectedTier.price : minPrice;

  const careColumns = CARE_FIELDS.filter((f) => species[f.key]);

  // Secciones descriptivas (solo las que tienen texto)
  const sections = [
    { title: 'Descripción general', text: item.description ?? species.description },
    { title: 'Hábitat y comportamiento', text: species.habitat },
    { title: 'Alimentación', text: species.diet },
    { title: 'Notas de esta especie', text: species.notes },
  ].filter((s) => s.text);

  const subgroup = species.genus?.group?.name;
  const taxonomy = [
    { label: 'Grupo', value: rootGroup?.name },
    { label: 'Subgrupo', value: subgroup && subgroup !== rootGroup?.name ? subgroup : null },
    { label: 'Género', value: species.genus?.name, italic: true },
    { label: 'Especie', value: species.name, italic: true },
    { label: 'Nombre común', value: species.common_name },
  ].filter((r) => r.value);

  const tags = [formatLabel, species.difficulty, species.rarity, ...morphs.map((m) => m.name)].filter(Boolean);

  const handleAdd = () => {
    cart.add({
      key: `${key}-${selectedTier?.quantity ?? 'u'}`,
      title,
      detail: selectedTier ? `Paquete de ${selectedTier.quantity}` : sci,
      price,
      qty,
      image: photos[0] ?? null,
      url: paths.catalogSpecies(slug),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Miga de pan */}
      <Box
        component="nav"
        sx={{
          px: { xs: '18px', md: '40px' },
          pt: { xs: 3, md: 4 },
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-neutral-600)',
        }}
      >
        <Link component={RouterLink} href={paths.root} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
          Inicio
        </Link>
        <span>/</span>
        <Link component={RouterLink} href={paths.catalog} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
          Catálogo
        </Link>
        {categoryPath.map((g) => (
          <Box key={g.id} component="span" sx={{ display: 'inline-flex', gap: '10px' }}>
            <span>/</span>
            <Link component={RouterLink} href={paths.catalogCategory(g.slug)} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              {g.name}
            </Link>
          </Box>
        ))}
        <span>/</span>
        <Box component="span" sx={{ color: 'var(--color-text)' }}>{title}</Box>
      </Box>

      {/* Galería + panel de compra */}
      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: { xs: 4, md: '48px' },
          alignItems: 'start',
          px: { xs: '18px', md: '40px' },
          pt: { xs: 3, md: 4 },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.08fr) minmax(0, 1fr)' },
        }}
      >
        {/* Galería */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <OdImage src={gallery[galIndex]} alt={title} label="Ejemplar adulto" ratio="4 / 5" />
            {gallery.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 16,
                  bottom: 16,
                  px: '14px',
                  py: '6px',
                  borderRadius: '999px',
                  bgcolor: 'rgba(51,45,39,0.72)',
                  color: 'var(--color-neutral-100)',
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {galIndex + 1} / {gallery.length}
              </Box>
            )}
          </Box>

          {gallery.length > 1 && (
            <Box sx={{ mt: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {gallery.slice(0, 6).map((photo, i) => (
                <Box
                  key={i}
                  component="button"
                  type="button"
                  onClick={() => setGal(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  sx={{
                    p: 0,
                    cursor: 'pointer',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                    border: i === galIndex ? '1px solid var(--color-accent)' : '1px solid var(--color-divider)',
                    transition: 'border-color 300ms',
                    '&:hover': { borderColor: 'var(--color-accent)' },
                  }}
                >
                  <OdImage src={photo} alt="" ratio="1 / 1" radius={0} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Panel de compra (pegajoso en escritorio) */}
        <Box sx={{ minWidth: 0, position: { md: 'sticky' }, top: { md: 130 }, pb: { md: 5 } }}>
          {leafGroup && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                px: '14px',
                py: '5px',
                borderRadius: '999px',
                border: '1px solid var(--color-divider)',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-700)',
              }}
            >
              {leafGroup.name}
            </Box>
          )}

          <Display component="h1" size="clamp(36px, 4.4vw, 62px)" sx={{ mt: '20px', lineHeight: 1.04 }}>
            {title}
          </Display>

          <Box sx={{ mt: '10px', fontSize: 17, fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>
            {sci}
          </Box>

          {excerpt && (
            <Box sx={{ mt: '26px', fontSize: 15, lineHeight: 1.8, maxWidth: '48ch' }}>{excerpt}</Box>
          )}

          <Box
            component="dl"
            sx={{
              m: 0,
              mt: '30px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px 20px',
              fontSize: 14,
            }}
          >
            {leafGroup && (
              <>
                <Box component="dt" sx={{ color: 'var(--color-neutral-600)' }}>Grupo</Box>
                <Box component="dd" sx={{ m: 0 }}>{leafGroup.name}</Box>
              </>
            )}
            <Box component="dt" sx={{ color: 'var(--color-neutral-600)' }}>Disponibilidad</Box>
            <Box component="dd" sx={{ m: 0, color: 'var(--color-accent-700)' }}>Disponible</Box>
            <Box component="dt" sx={{ color: 'var(--color-neutral-600)' }}>Formato</Box>
            <Box component="dd" sx={{ m: 0 }}>
              {formatLabel
                ? species.sale_format === 'package'
                  ? `Paquete de ${species.package_size} ejemplares`
                  : 'Cepa (colonia establecida)'
                : 'Ejemplar individual'}
            </Box>
          </Box>

          {tiers.length > 0 && (
            <Box sx={{ mt: '26px' }}>
              <Box sx={{ mb: 1.5, fontSize: 13, color: 'var(--color-neutral-600)' }}>Cantidad por paquete</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {tiers.map((tier, index) => (
                  <Box
                    key={tier.quantity}
                    component="button"
                    type="button"
                    onClick={() => setTierIndex(index)}
                    sx={{
                      px: '20px',
                      py: '10px',
                      cursor: 'pointer',
                      font: 'inherit',
                      fontSize: 14,
                      borderRadius: '999px',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'background 300ms, color 300ms, border-color 300ms',
                      ...(index === tierIndex
                        ? { bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', border: '1px solid var(--color-neutral-900)' }
                        : { bgcolor: 'transparent', color: 'inherit', border: '1px solid var(--color-divider)', '&:hover': { borderColor: 'var(--color-accent)' } }),
                    }}
                  >
                    {tier.quantity}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: '30px', fontFamily: 'var(--font-heading)', fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>
            {!selectedTier && minPrice !== maxPrice && (
              <Box component="span" sx={{ fontSize: 17, color: 'var(--color-neutral-600)', mr: 1 }}>Desde</Box>
            )}
            {!selectedTier && compareAt > minPrice && (
              <Box component="span" sx={{ mr: 1.5, fontSize: 22, color: 'var(--color-neutral-500)', textDecoration: 'line-through' }}>
                {fCurrency(compareAt)}
              </Box>
            )}
            {fCurrency(price)} <Box component="span" sx={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--color-neutral-600)' }}>MXN</Box>
          </Box>

          {/* Cantidad + agregar */}
          <Box sx={{ mt: '26px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-divider)', borderRadius: '999px' }}>
              <Box
                component="button"
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Quitar uno"
                sx={{ width: 44, height: 52, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 18, color: 'inherit', borderRadius: '999px 0 0 999px', '&:hover': { bgcolor: 'var(--color-neutral-200)' } }}
              >
                –
              </Box>
              <Box component="span" sx={{ minWidth: 30, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{qty}</Box>
              <Box
                component="button"
                type="button"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Agregar uno"
                sx={{ width: 44, height: 52, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 18, color: 'inherit', borderRadius: '0 999px 999px 0', '&:hover': { bgcolor: 'var(--color-neutral-200)' } }}
              >
                +
              </Box>
            </Box>

            <Box
              component="button"
              type="button"
              onClick={handleAdd}
              sx={{
                flex: 1,
                minWidth: 220,
                height: 52,
                px: '32px',
                border: 0,
                borderRadius: '999px',
                cursor: 'pointer',
                font: 'inherit',
                fontSize: 14,
                bgcolor: 'var(--color-neutral-900)',
                color: 'var(--color-neutral-100)',
                transition: 'background 350ms, transform 350ms',
                '&:hover': { bgcolor: 'var(--color-accent-700)', transform: 'translateY(-2px)' },
              }}
            >
              {added ? 'Agregado ✓' : 'Agregar a cotización'}
            </Box>
          </Box>

          {!shippingEnabled && (
            <Box sx={{ mt: '14px', fontSize: 13, color: 'var(--color-neutral-600)' }}>
              Solo entrega en persona en CDMX — por ahora no hacemos envíos.
            </Box>
          )}

          <Box sx={{ mt: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {CONFIG.whatsapp && (
              <Link
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 50,
                  px: '28px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-divider)',
                  color: 'inherit',
                  fontSize: 14,
                  textDecoration: 'none',
                  transition: 'border-color 350ms, background 350ms',
                  '&:hover': { borderColor: 'var(--color-accent)', bgcolor: 'var(--color-accent-100)' },
                }}
              >
                Preguntar por WhatsApp
              </Link>
            )}
            <Box
              component="button"
              type="button"
              onClick={() => toggle(key)}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 50,
                height: 50,
                borderRadius: '999px',
                cursor: 'pointer',
                bgcolor: 'transparent',
                fontSize: 17,
                border: '1px solid var(--color-divider)',
                color: isFavorite ? 'var(--color-accent-700)' : 'inherit',
                transition: 'border-color 350ms, color 350ms',
                '&:hover': { borderColor: 'var(--color-accent)', color: 'var(--color-accent-700)' },
              }}
            >
              {isFavorite ? '♥' : '♡'}
            </Box>
          </Box>

          {/* Bloques de confianza (texto editable en shop-info.js) */}
          <Box sx={{ mt: '34px' }}>
            {shopInfoFor(shippingEnabled).map((info, i, arr) => (
              <Box
                key={info.title}
                sx={{
                  py: '20px',
                  borderTop: '1px solid var(--color-divider)',
                  borderBottom: i === arr.length - 1 ? '1px solid var(--color-divider)' : 'none',
                }}
              >
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 19 }}>{info.title}</Box>
                <Box sx={{ mt: '6px', fontSize: 14, color: 'var(--color-neutral-700)' }}>{info.description}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Ficha de cuidados */}
      {careColumns.length > 0 && (
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 7, md: '100px' } }}>
          <Display size="clamp(28px, 3.2vw, 44px)" weight={400} sx={{ mb: '30px' }}>
            Ficha de cuidados
          </Display>
          <Box
            sx={{
              display: 'grid',
              border: '1px solid var(--color-divider)',
              borderRadius: '18px',
              overflow: 'hidden',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: `repeat(${careColumns.length}, 1fr)` },
            }}
          >
            {careColumns.map((field, i) => (
              <Box
                key={field.key}
                sx={{
                  p: '26px 20px',
                  borderRight: '1px solid var(--color-divider)',
                  bgcolor: i % 2 === 0 ? 'var(--color-neutral-200)' : 'var(--color-accent-100)',
                }}
              >
                <Box sx={{ mb: '14px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
                  {field.label}
                </Box>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 22, lineHeight: 1.15 }}>
                  {species[field.key]}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Descripción + taxonomía */}
      {(sections.length > 0 || taxonomy.length > 0) && (
        <Box
          component="section"
          sx={{
            px: { xs: '18px', md: '40px' },
            pt: { xs: 7, md: '70px' },
            pb: { xs: 2, md: 4 },
            display: 'grid',
            gap: { xs: 5, md: '60px' },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(280px, 0.75fr)' },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {sections.length > 0 ? (
              sections.map((section) => (
                <Box key={section.title} sx={{ mb: '48px', '&:last-of-type': { mb: 0 } }}>
                  <Box component="p" sx={kickerSx}>{section.title}</Box>
                  {section.text.split('\n').filter(Boolean).map((p, idx) => (
                    <Box component="p" key={idx} sx={paraSx}>{p}</Box>
                  ))}
                </Box>
              ))
            ) : (
              <>
                <Box component="p" sx={kickerSx}>Descripción general</Box>
                <Box sx={{ fontSize: 15, color: 'var(--color-neutral-600)' }}>
                  Pronto agregaremos la descripción de esta especie. Pregúntanos por WhatsApp cualquier
                  duda sobre su cuidado.
                </Box>
              </>
            )}
          </Box>

          <Box component="aside" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {taxonomy.length > 0 && (
              <Panel title="Taxonomía">
                {taxonomy.map((row) => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: '10px', borderTop: '1px solid var(--color-divider)' }}>
                    <Box component="span" sx={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
                      {row.label}
                    </Box>
                    <Box component="span" sx={{ textAlign: 'right', fontSize: 14, fontStyle: row.italic ? 'italic' : 'normal' }}>
                      {row.value}
                    </Box>
                  </Box>
                ))}
              </Panel>
            )}

            {species.origin && (
              <Panel title="Distribución / origen">
                <Box sx={{ fontSize: 15 }}>{species.origin}</Box>
              </Panel>
            )}

            {tags.length > 0 && (
              <Panel title="Etiquetas">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tags.map((tag) => (
                    <Box key={tag} sx={{ px: '14px', py: '5px', borderRadius: '999px', fontSize: 13, bgcolor: 'var(--color-neutral-200)' }}>
                      {tag}
                    </Box>
                  ))}
                </Box>
              </Panel>
            )}
          </Box>
        </Box>
      )}

      {/* Suele ir con */}
      {related.length > 0 && (
        <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 5, md: 6 }, pb: { xs: 8, md: 12 } }}>
          <Display size="clamp(26px, 3vw, 40px)" weight={400} sx={{ pb: '22px', borderBottom: '1px solid var(--color-divider)' }}>
            Suele ir con
          </Display>
          <Box sx={{ pt: '34px', display: 'grid', gap: '22px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {related.slice(0, 4).map((rel) => (
              <OdProductCard key={rel.key} item={rel} />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
