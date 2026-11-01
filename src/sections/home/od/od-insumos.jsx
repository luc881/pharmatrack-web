'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';
import { OdImage } from 'src/layouts/od/od-ui';
import { OdPanel } from 'src/layouts/od/od-panel';
import { SectionHead } from 'src/layouts/od/od-ornaments';
import { gsap, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// «Todo para tu terrario» (insumos), en «Vitrina» y sobre oscuro (elegida
// entre tres pruebas, 2026-11-01): a la izquierda la foto grande, fija
// mientras pasa la lista; al pasar por un nombre, su foto entra con una
// cortina de abajo arriba y las demás filas se atenúan.
// ----------------------------------------------------------------------

const ALL = paths.catalogCategory('sustratos-y-accesorios');
const LINE = '1px solid rgba(238,236,230,0.18)';
const sans = { fontFamily: 'var(--od-font-body)', fontWeight: 600, letterSpacing: '-0.03em' };
const eyebrow = { fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' };

function Foto({ item, width = 700 }) {
  return item.image ? (
    <Box component="img" src={cdnImage(item.image, width)} alt={item.title} loading="lazy" sx={{ display: 'block', width: 1, height: 1, objectFit: 'cover' }} />
  ) : (
    <OdImage label={item.title} radius={0} sx={{ width: 1, height: 1, aspectRatio: 'auto' }} />
  );
}

export function OdInsumos({ items }) {
  const [active, setActive] = useState(0);
  const stage = useRef(null);
  const list = useRef(null);
  const top = useRef(1);

  useEffect(() => {
    const layer = stage.current?.querySelector(`[data-i="${active}"]`);
    if (layer && top.current > 1) gsap.set(layer, { zIndex: top.current });
    if (layer && top.current > 1 && !prefersReducedMotion()) {
      gsap.fromTo(layer, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', overwrite: true });
      gsap.fromTo(layer.firstElementChild, { scale: 1.25 }, { scale: 1, duration: 1.3, ease: 'expo.out', overwrite: true });
    }
    top.current += 1;
    const rows = list.current?.querySelectorAll('[data-row] > a') ?? [];
    const wide = window.matchMedia('(min-width: 900px)').matches;
    gsap.to(rows, { opacity: (i) => (i === active ? 1 : 0.38), x: (i) => (i === active && wide ? 14 : 0), duration: 0.6, ease: 'power3.out' });
  }, [active]);

  const item = items[active];

  return (
    <OdPanel aria-label="Insumos para tu terrario" sx={{ color: 'var(--color-neutral-100)', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: { xs: 3, md: 5 } }}>
        <SectionHead mask title="Todo para tu terrario" size="clamp(28px, 3.4vw, 48px)" />
        <Link component={RouterLink} href={ALL} sx={{ fontSize: 15, color: 'var(--color-neutral-400)', textDecoration: 'none', '&:hover': { color: 'var(--color-neutral-100)' } }}>
          Ver todos los insumos →
        </Link>
      </Box>

      <Box sx={{ display: 'grid', gap: { xs: 0, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 96 }}>
          <Box ref={stage} className="od-grain" sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 5', bgcolor: 'var(--od-noche)' }}>
            {items.map((it, i) => (
              <Box key={it.key} data-i={i} sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: i === 0 ? 1 : 0 }}>
                <Foto item={it} width={900} />
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, fontSize: 15, lineHeight: 1.6, color: 'var(--color-neutral-400)', minHeight: '3.2em' }}>{item.description}</Box>
        </Box>

        <Box ref={list} component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderBottom: LINE }}>
          {items.map((it, i) => (
            <Box component="li" key={it.key} data-row sx={{ borderTop: LINE }}>
              <Link
                component={RouterLink}
                href={it.href}
                underline="none"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                sx={{ display: 'grid', gridTemplateColumns: { xs: '64px 1fr auto', md: '1fr auto' }, alignItems: 'center', gap: { xs: 2, md: 3 }, py: { xs: 2, md: 2.75 }, color: 'inherit' }}
              >
                <Box sx={{ display: { xs: 'block', md: 'none' }, width: 64, aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <Foto item={it} width={200} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={eyebrow}>{it.category}</Box>
                  <Box sx={{ mt: 0.5, fontFamily: 'var(--font-heading)', fontSize: { xs: 22, md: 'clamp(28px, 2.8vw, 44px)' }, lineHeight: 1.08 }}>{it.title}</Box>
                </Box>
                <Box sx={{ ...sans, fontSize: { xs: 15, md: 20 }, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', color: it.soldOut ? 'var(--od-neutro-700)' : 'inherit' }}>
                  {it.soldOut ? 'Agotado' : it.price}
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </OdPanel>
  );
}
