'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';
import { OdImage } from 'src/layouts/od/od-ui';
import { SectionHead } from 'src/layouts/od/od-ornaments';
import { gsap, ScrollTrigger, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// «Todo para tu terrario» (insumos). Tres propuestas a prueba; se eligen con
// ?insumos=1|2|3 (el selector flotante solo aparece con ese parámetro).
//   1 Desfile: la sección se fija y las tarjetas pasan de lado al bajar.
//   2 Vitrina: lista de nombres; la foto grande cambia con una cortina.
//   3 Mosaico: cuadrícula que se destapa al llegar, con hover que acerca.
// ponytail: al elegir una, se borran las otras dos y el selector.
// ----------------------------------------------------------------------

const ALL = paths.catalogCategory('sustratos-y-accesorios');
const sans = { fontFamily: 'var(--od-font-body)', fontWeight: 600, letterSpacing: '-0.03em' };
const eyebrow = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-600)',
};
const desktop = () => window.matchMedia('(min-width: 900px)').matches;

function Foto({ item, width = 700, sx, ...other }) {
  return item.image ? (
    <Box
      component="img"
      src={cdnImage(item.image, width)}
      alt={item.title}
      loading="lazy"
      sx={[{ display: 'block', width: 1, height: 1, objectFit: 'cover' }, sx]}
      {...other}
    />
  ) : (
    <OdImage
      label={item.title}
      radius={0}
      sx={[{ width: 1, height: 1, aspectRatio: 'auto' }, sx]}
      {...other}
    />
  );
}

function Cabeza() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 3,
        flexWrap: 'wrap',
        mb: { xs: 3, md: 5 },
      }}
    >
      <SectionHead mask title="Todo para tu terrario" size="clamp(28px, 3.4vw, 48px)" />
      <Link
        component={RouterLink}
        href={ALL}
        sx={{ fontSize: 15, color: 'inherit', textDecoration: 'none' }}
      >
        Ver todos los insumos →
      </Link>
    </Box>
  );
}

const Precio = ({ item }) => (item.soldOut ? 'Agotado' : item.price);

// ---------------------------------------------------------------------- 1
// Desfile: en escritorio la sección se queda fija y la tira corre de lado con
// el scroll (scrub); cada foto se desliza un poco dentro de su marco. En
// celular es una tira con scroll nativo.

function Desfile({ items }) {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !desktop()) return undefined;
    const ctx = gsap.context(() => {
      // se fija el <section> de adentro: GSAP lo envuelve en un pin-spacer y
      // React necesita que el nodo que él quita (este div) siga siendo suyo
      const pinned = root.current.firstElementChild;
      const track = pinned.querySelector('[data-track]');
      const dist = () => track.scrollWidth - pinned.clientWidth;
      const move = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinned,
          pin: true,
          scrub: 1,
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray('[data-par]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: move,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <Box
        component="section"
        aria-label="Insumos para tu terrario"
        sx={{
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: { md: '100svh' },
          py: { xs: '64px', md: 0 },
        }}
      >
        <Box
          data-track
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: { xs: 2, md: 4 },
            px: { xs: '18px', md: 'var(--od-gutter)' },
            overflowX: { xs: 'auto', md: 'visible' },
            scrollSnapType: { xs: 'x mandatory', md: 'none' },
            scrollbarWidth: 'none',
            willChange: 'transform',
          }}
        >
          <Box
            sx={{
              flex: { xs: '0 0 70vw', md: '0 0 clamp(300px, 30vw, 520px)' },
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pr: { md: 4 },
            }}
          >
            <Box
              component="h2"
              sx={{
                m: 0,
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                fontSize: 'clamp(40px, 5.6vw, 96px)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
              }}
            >
              Todo para tu terrario
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  maxWidth: '30ch',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Sustratos, hojarasca y accesorios que usamos en el criadero.
              </Box>
              <Link
                component={RouterLink}
                href={ALL}
                sx={{ display: 'inline-block', mt: 2, fontSize: 15, color: 'inherit' }}
              >
                Ver todos los insumos →
              </Link>
            </Box>
          </Box>
          {items.map((item) => (
            <Link
              key={item.key}
              component={RouterLink}
              href={item.href}
              underline="none"
              sx={{
                flex: { xs: '0 0 64vw', md: '0 0 clamp(260px, 21vw, 380px)' },
                scrollSnapAlign: 'start',
                color: 'inherit',
                '&:hover img': { transform: 'scale(1.06)' },
              }}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  aspectRatio: '4 / 5',
                  bgcolor: 'var(--color-neutral-200)',
                }}
              >
                <Box data-par sx={{ width: '116%', height: 1, ml: '-8%' }}>
                  <Foto item={item} sx={{ transition: 'transform 900ms var(--od-ease)' }} />
                </Box>
              </Box>
              <Box sx={{ ...eyebrow, mt: 2 }}>{item.category}</Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 0.75 }}>
                <Box sx={{ ...sans, fontSize: 'clamp(18px, 1.4vw, 22px)', lineHeight: 1.2 }}>
                  {item.title}
                </Box>
                <Box
                  sx={{
                    ...sans,
                    fontSize: 'clamp(18px, 1.4vw, 22px)',
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <Precio item={item} />
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </div>
  );
}

// ---------------------------------------------------------------------- 2
// Vitrina: a la izquierda la foto grande (fija mientras pasa la lista); al
// pasar por un nombre, la foto nueva entra con una cortina de abajo arriba
// y las demás filas se atenúan.

function Vitrina({ items }) {
  const [active, setActive] = useState(0);
  const stage = useRef(null);
  const list = useRef(null);
  const top = useRef(1);

  useEffect(() => {
    const layer = stage.current?.querySelector(`[data-i="${active}"]`);
    if (layer && top.current > 1) gsap.set(layer, { zIndex: top.current });
    if (layer && top.current > 1 && !prefersReducedMotion()) {
      gsap.fromTo(
        layer,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', overwrite: true }
      );
      gsap.fromTo(
        layer.firstElementChild,
        { scale: 1.25 },
        { scale: 1, duration: 1.3, ease: 'expo.out', overwrite: true }
      );
    }
    top.current += 1;
    const rows = list.current?.querySelectorAll('[data-row] > a') ?? [];
    gsap.to(rows, {
      opacity: (i) => (i === active ? 1 : 0.38),
      x: (i) => (i === active && desktop() ? 14 : 0),
      duration: 0.6,
      ease: 'power3.out',
    });
  }, [active]);

  const item = items[active];

  return (
    <Box
      component="section"
      aria-label="Insumos para tu terrario"
      sx={{ px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' } }}
    >
      <Cabeza />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 0, md: 8 },
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 96 }}>
          <Box
            ref={stage}
            className="od-grain"
            sx={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              bgcolor: 'var(--color-neutral-200)',
            }}
          >
            {items.map((it, i) => (
              <Box
                key={it.key}
                data-i={i}
                sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: i === 0 ? 1 : 0 }}
              >
                <Foto item={it} width={900} />
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              mt: 2,
              fontSize: 15,
              lineHeight: 1.6,
              color: 'var(--color-neutral-700)',
              minHeight: '3.2em',
            }}
          >
            {item.description}
          </Box>
        </Box>

        <Box
          ref={list}
          component="ul"
          sx={{ listStyle: 'none', m: 0, p: 0, borderBottom: '1px solid var(--color-divider)' }}
        >
          {items.map((it, i) => (
            <Box
              component="li"
              key={it.key}
              data-row
              sx={{ borderTop: '1px solid var(--color-divider)' }}
            >
              <Link
                component={RouterLink}
                href={it.href}
                underline="none"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '64px 1fr auto', md: '1fr auto' },
                  alignItems: 'center',
                  gap: { xs: 2, md: 3 },
                  py: { xs: 2, md: 2.75 },
                  color: 'inherit',
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    width: 64,
                    aspectRatio: '1 / 1',
                    overflow: 'hidden',
                  }}
                >
                  <Foto item={it} width={200} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={eyebrow}>{it.category}</Box>
                  <Box
                    sx={{
                      mt: 0.5,
                      fontFamily: 'var(--font-heading)',
                      fontSize: { xs: 22, md: 'clamp(28px, 2.8vw, 44px)' },
                      lineHeight: 1.08,
                    }}
                  >
                    {it.title}
                  </Box>
                </Box>
                <Box
                  sx={{
                    ...sans,
                    fontSize: { xs: 15, md: 20 },
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <Precio item={it} />
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------- 3
// Mosaico: la primera pieza grande y ocho chicas. Al llegar, cada foto se
// destapa de abajo arriba (escalonado); al pasar el cursor la foto se acerca
// y sube una barra con el precio.

function Mosaico({ items }) {
  const root = useRef(null);
  const tiles = items.slice(0, 9);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.set('[data-tile]', { clipPath: 'inset(100% 0% 0% 0%)' });
      ScrollTrigger.batch('[data-tile]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => {
          gsap.to(els, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.09,
          });
          gsap.fromTo(
            els.map((el) => el.querySelector('img')),
            { scale: 1.3 },
            { scale: 1, duration: 1.5, ease: 'expo.out', stagger: 0.09 }
          );
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const hover = (e, on) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    gsap.to(el.querySelector('img'), { scale: on ? 1.07 : 1, duration: 0.9, ease: 'expo.out' });
    gsap.to(el.querySelector('[data-bar]'), {
      yPercent: on ? 0 : 100,
      duration: 0.6,
      ease: 'expo.out',
    });
  };

  return (
    <Box
      ref={root}
      component="section"
      aria-label="Insumos para tu terrario"
      sx={{ px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' } }}
    >
      <Cabeza />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        {tiles.map((it, i) => (
          <Link
            key={it.key}
            data-tile
            component={RouterLink}
            href={it.href}
            underline="none"
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              color: '#f6f4f1',
              bgcolor: 'var(--od-noche)',
              aspectRatio: i === 0 ? { xs: '2 / 1', md: 'auto' } : '1 / 1',
              gridColumn: i === 0 ? 'span 2' : 'auto',
              gridRow: { md: i === 0 ? 'span 2' : 'auto' },
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0 }}>
              <Foto item={it} width={i === 0 ? 1100 : 600} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(22,27,25,0) 45%, rgba(22,27,25,0.7) 100%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 12, md: 18 },
                right: { xs: 12, md: 18 },
                bottom: { xs: 12, md: 16 },
              }}
            >
              <Box sx={{ ...eyebrow, color: 'rgba(246,244,241,0.75)' }}>{it.category}</Box>
              <Box
                sx={{
                  ...sans,
                  mt: 0.5,
                  fontSize:
                    i === 0
                      ? 'clamp(22px, 2.2vw, 36px)'
                      : { xs: 15, md: 'clamp(16px, 1.2vw, 20px)' },
                  lineHeight: 1.15,
                }}
              >
                {it.title}
              </Box>
            </Box>
            {/* barra con precio: sube al pasar el cursor (en táctil no hay hover, se ve el precio en la ficha) */}
            <Box
              data-bar
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'space-between',
                px: 2.25,
                py: 1.5,
                bgcolor: 'var(--od-papel)',
                color: 'var(--od-tinta)',
                fontSize: 14,
                transform: 'translateY(-100%)',
              }}
            >
              <Box component="span" sx={{ ...sans, fontVariantNumeric: 'tabular-nums' }}>
                <Precio item={it} />
              </Box>
              <span>Ver producto →</span>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const VARIANTS = [
  { n: '1', label: 'Desfile', View: Desfile },
  { n: '2', label: 'Vitrina', View: Vitrina },
  { n: '3', label: 'Mosaico', View: Mosaico },
];

export function OdInsumos({ items }) {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('insumos');
    if (v) setVariant(VARIANTS.find((x) => x.n === v)?.n ?? '1');
  }, []);

  // cambiar de propuesta fija o suelta secciones: recalcular los ScrollTrigger de abajo
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [variant]);

  const pick = (n) => {
    setVariant(n);
    const url = new URL(window.location.href);
    url.searchParams.set('insumos', n);
    window.history.replaceState(null, '', url);
  };

  const { View } = VARIANTS.find((x) => x.n === variant) ?? VARIANTS[0];

  return (
    <>
      <View key={variant} items={items} />
      {variant && (
        <Box
          sx={{
            position: 'fixed',
            zIndex: 1300,
            left: '50%',
            bottom: 20,
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            p: 0.5,
            bgcolor: 'var(--od-tinta)',
            color: 'var(--od-papel)',
            fontSize: 13,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <Box component="span" sx={{ px: 1.25, alignSelf: 'center', opacity: 0.6 }}>
            Insumos
          </Box>
          {VARIANTS.map((v) => (
            <Box
              key={v.n}
              component="button"
              type="button"
              onClick={() => pick(v.n)}
              sx={{
                px: 1.5,
                py: 0.75,
                border: 0,
                font: 'inherit',
                cursor: 'pointer',
                bgcolor: v.n === variant ? 'var(--od-papel)' : 'transparent',
                color: v.n === variant ? 'var(--od-tinta)' : 'inherit',
              }}
            >
              {v.n} · {v.label}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
