'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OdScene } from 'src/layouts/od/od-scene';
import { Pill, OdImage } from 'src/layouts/od/od-ui';
import { libroState } from 'src/layouts/od/three-scenes';
import { gsap, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// Fichas de cuidados (sección del inicio, ancla #fichas). Sobre un fondo
// oscuro de isolíneas que se mueven solas, un arco deja ver una escena 3D: el
// buró visto desde abajo, con su lámpara, un florero y un cuadro, y el libro
// «Fichas de cuidados» flotando al frente. Al bajar, el arco llena la
// pantalla, la cámara se corre al librero de al lado, del libro salen hojas
// sueltas y queda la lista de fichas en renglones CON FOTO (mucha gente no
// conoce las especies por nombre).
// Sin 3D (celular, movimiento reducido): en su lugar va un render fijo de la
// misma escena (public/3d/fichas-escena.webp), que se oscurece al abrir.
// ----------------------------------------------------------------------

const heading = { m: 0, fontFamily: 'var(--font-heading)', fontWeight: 300 };
const sci = { ...heading, fontStyle: 'italic', lineHeight: 1.1 };
const gutter = { xs: '18px', md: 'var(--od-gutter)' };
const fill = { position: 'absolute', inset: 0 };
// lo que solo existe antes de abrir: fuera con movimiento reducido
const extra = { '@media (prefers-reduced-motion: reduce)': { display: 'none' } };
// a los lados del arco, sin encimarse con él (ARCH_W de ancho, centrado)
const sideText = { ...extra, position: 'absolute', top: '55%', transform: 'translateY(-50%)', maxWidth: '24%', display: { xs: 'none', md: 'block' } };
const sideGap = 'calc(50% + 16.5svh + 40px)';

// Arco cerrado: alto y angosto en cualquier pantalla (ancho = 0.6 de su
// alto), aunque recorte el buró. Se calcula en px: GSAP no interpola calc().
const ARCH_W = 0.33; // fracción del alto de la sección
const archClosed = (el) => {
  const w = el.clientWidth;
  const h = el.clientHeight;
  const side = Math.max(0, (w - ARCH_W * h) / 2);
  const r = Math.min(ARCH_W * h, w) / 2;
  return `inset(${0.28 * h}px ${side}px ${0.17 * h}px ${side}px round ${r}px ${r}px 0px 0px)`;
};
const OPEN = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';
// render fijo de la escena cerrada (mismo encuadre que la cámara 3D) y cuánto
// se oscurece al abrir (lo mismo que el velo de la escena 3D)
const STILL = '/3d/fichas-escena.webp';
const VEIL = 0.62;
// Libro: cerrado, al centro del arco (que va de 28% a 83% del alto), justo
// delante del buró, sobre la cubierta y a su escala;
// abierto, arriba a la izquierda, sobre el texto.
// x/y son fracción de media pantalla.
const BOOK_CLOSED = { open: 0, x: 0, y: -0.11, scale: 0.3 };
const BOOK_OPEN = { open: 1, x: -0.5, y: 0.36, scale: 0.6 };

// ----------------------------------------------------------------------
// Isolíneas: curvas cerradas como las de un mapa topográfico, que se deforman
// despacio todo el tiempo. Son las líneas de nivel (marching squares) de un
// campo suave hecho con ondas que se desplazan. Solo corre en pantalla.

const CELL = 16; // resolución de la retícula (px)
const LEVELS = Array.from({ length: 11 }, (_, i) => -3 + i * 0.6);
// por caso (qué esquinas quedan arriba del nivel), los pares de lados que une
// la línea: 0 arriba, 1 derecha, 2 abajo, 3 izquierda
const SEGS = { 1: [3, 2], 2: [2, 1], 3: [3, 1], 4: [0, 1], 5: [0, 3, 2, 1], 6: [0, 2], 7: [0, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1, 3, 2], 11: [0, 1], 12: [3, 1], 13: [2, 1], 14: [3, 2] };

function Isolineas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let raf = 0;
    let visible = false;
    let t = 40;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      field = new Float32Array(cols * rows);
    };

    const draw = () => {
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const x = i * CELL;
          const y = j * CELL;
          field[j * cols + i] =
            Math.sin(x * 0.0042 + t * 0.21) +
            Math.sin(y * 0.0051 - t * 0.17) +
            Math.sin((x + y) * 0.0031 + t * 0.13) +
            Math.sin(Math.hypot(x - w * 0.5, y - h * 0.55) * 0.006 - t * 0.25);
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j += 1) {
        for (let i = 0; i < cols - 1; i += 1) {
          const a = field[j * cols + i];
          const b = field[j * cols + i + 1];
          const c = field[(j + 1) * cols + i + 1];
          const d = field[(j + 1) * cols + i];
          const x = i * CELL;
          const y = j * CELL;
          for (let k = 0; k < LEVELS.length; k += 1) {
            const l = LEVELS[k];
            const seg = SEGS[(a > l ? 8 : 0) + (b > l ? 4 : 0) + (c > l ? 2 : 0) + (d > l ? 1 : 0)];
            if (seg) {
              // punto donde el nivel cruza cada lado de la celda
              const px = [x + ((l - a) / (b - a)) * CELL, x + CELL, x + ((l - d) / (c - d)) * CELL, x];
              const py = [y, y + ((l - b) / (c - b)) * CELL, y + CELL, y + ((l - a) / (d - a)) * CELL];
              for (let s = 0; s < seg.length; s += 2) {
                ctx.moveTo(px[seg[s]], py[seg[s]]);
                ctx.lineTo(px[seg[s + 1]], py[seg[s + 1]]);
              }
            }
          }
        }
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(238,236,230,0.17)';
      ctx.stroke();
    };

    const frame = () => {
      t += 0.02;
      draw();
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    build();
    draw();
    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !reduced;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <Box component="canvas" ref={ref} aria-hidden sx={{ ...fill, width: 1, height: 1 }} />;
}

// ----------------------------------------------------------------------

function Intro() {
  return (
    <Box data-rise>
      <Box component="h3" sx={{ ...heading, fontSize: 'clamp(30px, 3.8vw, 62px)', lineHeight: 1.05 }}>Cuidados por especie</Box>
      {/* en celular se omite: con la lista no cabe en pantallas bajas */}
      <Box component="p" sx={{ display: { xs: 'none', sm: 'block' }, m: 0, mt: 2, maxWidth: '38ch', fontSize: { xs: 16, md: 19 }, lineHeight: 1.55 }}>
        Parámetros, alimentación y manejo de cada especie que criamos, documentados en
        fichas técnicas.
      </Box>
      <Box sx={{ mt: 3 }}>
        <Pill variant="light" href={paths.careSheets}>Ver todas las fichas</Pill>
      </Box>
    </Box>
  );
}

// Al pasar el cursor (o enfocar con teclado) por un renglón: una franja clara
// lo llena desde la izquierda, la foto se acerca, el nombre se corre y entra
// una flecha; los demás renglones se atenúan para que el elegido destaque.
const EASE = 'var(--od-ease)';
const rowSx = {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: { xs: 2, md: 3 },
  py: { xs: 1, md: 1.5 },
  pr: { md: 1.5 },
  color: 'inherit',
  textDecoration: 'none',
  outline: 'none',
  transition: `opacity 400ms ${EASE}`,
  // franja que llena el renglón
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    bgcolor: 'rgba(238,236,230,0.07)',
    transform: 'scaleX(0)',
    transformOrigin: 'left center',
    transition: `transform 600ms ${EASE}`,
  },
  '& > *': { position: 'relative' },
  '& .od-img-zoom': { transition: `transform 700ms ${EASE}` },
  '& .od-row-names': { transition: `transform 500ms ${EASE}` },
  '& .od-row-arrow': { opacity: 0, transform: 'translateX(-10px)', transition: `opacity 350ms ${EASE}, transform 500ms ${EASE}` },
};
const rowActive = {
  '&::before': { transform: 'scaleX(1)' },
  '& .od-img-zoom': { transform: 'scale(1.1)' },
  '& .od-row-names': { transform: 'translateX(10px)' },
  '& .od-row-arrow': { opacity: 1, transform: 'none' },
};

// nombre común primero (es el que la gente reconoce); el científico, debajo
function Rows({ items }) {
  return (
    <Box sx={{ ...fill, display: 'grid', alignItems: 'end', gap: { xs: 3, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' }, px: gutter, pt: { xs: '72px', md: '96px' }, pb: { xs: 'calc(66px + 3svh)', md: '7svh' } }}>
      <Intro />
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          listStyle: 'none',
          // los demás se atenúan mientras uno está activo
          '@media (hover: hover)': { '&:hover a:not(:hover)': { opacity: 0.45 } },
        }}
      >
        {items.slice(0, 5).map((c, i) => (
          // en celular caben cuatro
          <Box component="li" key={c.key} data-rise sx={{ display: { xs: i > 3 ? 'none' : 'block', md: 'block' }, borderTop: '1px solid rgba(238,236,230,0.2)' }}>
            <Box
              component={RouterLink}
              href={c.href}
              sx={{
                ...rowSx,
                '&:focus-visible': { ...rowActive, boxShadow: 'inset 0 0 0 2px currentColor' },
                '@media (hover: hover)': { '&:hover': rowActive },
              }}
            >
              <OdImage src={c.image} alt="" label={c.title} ratio="1 / 1" radius={4} width={240} sx={{ width: { xs: 56, md: 'clamp(72px, 9svh, 104px)' } }} />
              <Box className="od-row-names" sx={{ minWidth: 0 }}>
                <Box sx={{ ...heading, fontSize: 'clamp(20px, 2vw, 32px)', lineHeight: 1.15 }}>{c.title}</Box>
                <Box sx={{ ...sci, mt: 0.5, fontSize: { xs: 15, md: 17 }, opacity: 0.8 }}>{c.scientific}</Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: { xs: 14, md: 16 } }}>
                {c.difficulty}
                <Box component="span" className="od-row-arrow" aria-hidden sx={{ display: { xs: 'none', md: 'inline' }, fontSize: 20 }}>
                  →
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Ventana({ items }) {
  const root = useRef(null);

  useEffect(() => {
    Object.assign(libroState, BOOK_CLOSED);
    // sin animación de scroll, el libro queda abierto en su sitio final
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.6, invalidateOnRefresh: true } })
        .fromTo('[data-win]', { clipPath: () => archClosed(root.current) }, { clipPath: OPEN, duration: 0.55, ease: 'power2.inOut' }, 0)
        .fromTo(libroState, BOOK_CLOSED, { ...BOOK_OPEN, duration: 0.6, ease: 'power2.inOut' }, 0.05)
        .to('[data-word="0"]', { xPercent: -70, autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.05)
        .to('[data-word="1"]', { xPercent: 70, autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.05)
        .to('[data-side="l"]', { xPercent: -40, autoAlpha: 0, duration: 0.3 }, 0.02)
        .to('[data-side="r"]', { xPercent: 40, autoAlpha: 0, duration: 0.3 }, 0.02)
        .fromTo('[data-veil]', { opacity: 0 }, { opacity: VEIL, duration: 0.3 }, 0.4)
        .fromTo('[data-rise]', { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.22, stagger: 0.03 }, 0.6);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <Box ref={root} component="section" id="fichas" aria-label="Fichas de cuidados" data-dark="1" sx={{ position: 'relative', height: '100svh', overflow: 'hidden', bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-100)' }}>
      <Isolineas />

      <Box data-side="l" sx={{ ...sideText, right: sideGap, textAlign: 'right' }}>
        <Box sx={{ ...heading, fontSize: 'clamp(26px, 3vw, 50px)', lineHeight: 1.05 }}>
          {items.length} {items.length === 1 ? 'especie' : 'especies'}
        </Box>
        <Box sx={{ mt: 1.5, fontSize: 18 }}>con ficha publicada</Box>
      </Box>
      <Box data-side="r" sx={{ ...sideText, left: sideGap }}>
        <Box sx={{ ...heading, fontSize: 'clamp(26px, 3vw, 50px)', lineHeight: 1.05 }}>Paso a paso</Box>
        <Box sx={{ mt: 1.5, fontSize: 18 }}>escritas desde el criadero</Box>
      </Box>

      {/* --- Lo que se abre: la escena 3D (ella misma se oscurece al abrir) y, encima, la lista --- */}
      <Box
        data-win
        sx={{
          ...fill,
          bgcolor: '#0b0e0d',
          // sin 3D (no hay canvas): el render fijo se oscurece con un velo propio
          '&:not(:has(canvas)) [data-veil]': { display: 'block' },
        }}
      >
        <OdScene scene="libro" fallbackSrc={STILL} fallbackLabel="" sx={{ ...fill, aspectRatio: 'auto', height: 1, pointerEvents: 'none' }} />
        <Box data-veil aria-hidden sx={{ ...fill, display: 'none', bgcolor: '#0b0e0d', opacity: VEIL }} />
        <Rows items={items} />
      </Box>

      <Box component="h2" sx={{ ...heading, position: 'absolute', top: '9svh', left: 0, right: 0, textAlign: 'center', fontSize: { xs: 'clamp(30px, 9vw, 44px)', sm: 'clamp(40px, 8.4vw, 138px)' }, lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
        <Box component="span" data-word="0" sx={{ display: 'inline-block' }}>Fichas&nbsp;</Box>
        <Box component="span" data-word="1" sx={{ display: 'inline-block' }}>de cuidados</Box>
      </Box>
    </Box>
  );
}

export function OdFichas({ items }) {
  return <Ventana items={items} />;
}
