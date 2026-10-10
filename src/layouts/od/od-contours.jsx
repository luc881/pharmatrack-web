'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Curvas de nivel: líneas finas apiladas, como un mapa topográfico, que
// ondean muy despacio. El cursor las aparta con suavidad (un bulto que se
// desvanece) y las cercanas se entintan de tuna. Pensado como fondo tranquilo
// para leer: sin partículas ni saltos, todo con movimiento lento.
// Solo anima mientras está en pantalla; con movimiento reducido queda quieto.
// ----------------------------------------------------------------------

const GAP = 16; // separación entre líneas (px)
const STEP = 6; // resolución horizontal (px)
const BUMP = 34; // cuánto aparta el cursor (px)
const SIGMA = 70; // radio del bulto (px)
const INK = '46,41,36';
const TUNA = '168,69,92';

export function OdContours({ sx }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    // las columnas solo se muestran desde 1920px: debajo ni se arranca
    if (!canvas || !window.matchMedia('(min-width: 1920px)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let t = 0;
    let target = null; // puntero en pantalla
    // cursor suavizado (lerp) en coordenadas del lienzo + intensidad 0→1
    const cur = { x: 0, y: 0, k: 0 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const p = target ? { x: target.x - rect.left, y: target.y - rect.top } : null;
      const inside = p && p.x > -SIGMA && p.x < w + SIGMA && p.y > -SIGMA && p.y < h + SIGMA;
      if (inside) {
        if (cur.k === 0) {
          cur.x = p.x;
          cur.y = p.y;
        }
        cur.x += (p.x - cur.x) * 0.08;
        cur.y += (p.y - cur.y) * 0.08;
      }
      cur.k += ((inside ? 1 : 0) - cur.k) * 0.05;
      if (cur.k < 0.001) cur.k = 0;

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.8;
      for (let base = -GAP; base < h + GAP; base += GAP) {
        const row = base / GAP;
        let near = 0;
        ctx.beginPath();
        for (let x = 0; x <= w + STEP; x += STEP) {
          let y =
            base +
            Math.sin(x * 0.018 + t * 0.6 + row * 0.35) * 5 +
            Math.sin(x * 0.007 - t * 0.35 + row * 0.12) * 7;
          if (cur.k) {
            const dx = x - cur.x;
            const dy = y - cur.y;
            const f = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA)) * cur.k;
            // tanh en vez de signo: la línea que pasa justo por el cursor se
            // abre suave en lugar de quebrarse
            y += Math.tanh(dy / 14) * f * BUMP;
            near = Math.max(near, f);
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = near > 0.05 ? `rgba(${TUNA},${0.16 + near * 0.5})` : `rgba(${INK},0.14)`;
        ctx.stroke();
      }
    };

    const frame = () => {
      t += 0.012;
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

    const move = (e) => {
      target = { x: e.clientX, y: e.clientY };
    };
    const leave = () => {
      target = null;
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <Box component="canvas" ref={ref} aria-hidden sx={[{ display: 'block', width: 1, height: 1 }, ...(Array.isArray(sx) ? sx : [sx])]} />;
}

// ----------------------------------------------------------------------
// Columnas laterales con curvas de nivel para pantallas muy anchas (≥1920px):
// ocupan lo que sobra a los lados de un contenido de `contentWidth` px. Van
// detrás del contenido (z-index -1 dentro de <main>, que aísla), así que las
// bandas oscuras a todo lo ancho las tapan y solo se ven sobre fondo claro.
// Se quedan pegadas a la pantalla mientras se hace scroll.

function SideColumn({ side, contentWidth }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: 'none',
        '@media (min-width: 1920px)': { display: 'block' },
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        zIndex: -1,
        width: `calc((100% - ${contentWidth}px) / 2 - 24px)`,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 96,
          height: 'calc(100vh - 128px)',
          [side === 'left' ? 'borderRight' : 'borderLeft']: '1px solid var(--color-divider)',
          // se desvanece arriba y abajo para no cortar las líneas en seco
          maskImage: 'linear-gradient(transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <OdContours />
      </Box>
    </Box>
  );
}

export function OdSideArt({ contentWidth = 1440 }) {
  return (
    <>
      <SideColumn side="left" contentWidth={contentWidth} />
      <SideColumn side="right" contentWidth={contentWidth} />
    </>
  );
}
