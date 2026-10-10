'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Sección oscura del home con un campo de puntos interactivo de fondo
// (patrón "magnetic dot grid"): una retícula en canvas que se aparta del
// cursor con física de resorte, se entinta de tuna cerca del puntero y, al
// hacer clic, lanza una onda que empuja los puntos hacia afuera.
// El ciclo de animación solo corre mientras hay energía (cursor encima o
// puntos regresando a su lugar); en reposo no consume nada.
// Táctil o movimiento reducido: retícula estática, sin animación.
// ----------------------------------------------------------------------

const GAP = 26; // separación de la retícula (px)
const RADIUS = 170; // alcance del cursor (px)
const PUSH = 26; // desplazamiento máximo (px)
const SPRING = 0.08;
const DAMP = 0.82;
const TUNA = [168, 69, 92];
const PAPER = [240, 235, 224];

function OdDotField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;
    const ctx = canvas.getContext('2d');
    const interactive =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dots = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let pointer = null; // {x, y} relativo al panel
    let cx = 0;
    let cy = 0;
    const waves = []; // {x, y, r}

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        // cercanía al cursor (0 lejos → 1 encima) para tamaño y color
        let near = 0;
        if (pointer) {
          const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
          near = Math.max(0, 1 - dist / (RADIUS * 1.15));
        }
        const moved = Math.min(1, Math.hypot(d.x - d.ox, d.y - d.oy) / PUSH);
        const t = Math.max(near, moved * 0.8);
        const size = 1.1 + t * 2.1;
        const c = PAPER.map((p, k) => Math.round(p + (TUNA[k] - p) * t));
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.11 + t * 0.75})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      let energy = 0;
      for (let i = waves.length - 1; i >= 0; i -= 1) {
        waves[i].r += 9;
        if (waves[i].r > Math.max(w, h)) waves.splice(i, 1);
      }
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        let ax = (d.ox - d.x) * SPRING;
        let ay = (d.oy - d.y) * SPRING;
        if (pointer) {
          const dx = d.ox - pointer.x;
          const dy = d.oy - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < RADIUS) {
            const f = (1 - dist / RADIUS) ** 2 * PUSH * SPRING;
            ax += (dx / dist) * f * 1.6;
            ay += (dy / dist) * f * 1.6;
          }
        }
        for (let k = 0; k < waves.length; k += 1) {
          const wv = waves[k];
          const dx = d.ox - wv.x;
          const dy = d.oy - wv.y;
          const dist = Math.hypot(dx, dy) || 1;
          const band = 1 - Math.abs(dist - wv.r) / 40;
          if (band > 0) {
            const fade = 1 - wv.r / Math.max(w, h);
            ax += (dx / dist) * band * 3.2 * fade;
            ay += (dy / dist) * band * 3.2 * fade;
          }
        }
        d.vx = (d.vx + ax) * DAMP;
        d.vy = (d.vy + ay) * DAMP;
        d.x += d.vx;
        d.y += d.vy;
        energy += Math.abs(d.vx) + Math.abs(d.vy);
      }
      draw();
      raf = pointer || waves.length || energy > 0.5 ? requestAnimationFrame(step) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    // posición en pantalla guardada: con scroll sin mover el ratón se recalcula
    const aim = () => {
      const r = host.getBoundingClientRect();
      pointer = { x: cx - r.left, y: cy - r.top };
      wake();
    };
    const move = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      aim();
    };
    const leave = () => {
      pointer = null;
      window.removeEventListener('scroll', aim);
      wake();
    };
    const enter = (e) => {
      move(e);
      window.addEventListener('scroll', aim, { passive: true });
    };
    const click = (e) => {
      const r = host.getBoundingClientRect();
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 });
      wake();
    };

    build();
    draw();
    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(host);

    if (interactive) {
      host.addEventListener('pointerenter', enter);
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      host.addEventListener('pointerdown', click);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', aim);
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerdown', click);
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={ref}
      aria-hidden
      sx={{ position: 'absolute', inset: 0, zIndex: -1, width: 1, height: 1, pointerEvents: 'none' }}
    />
  );
}

export function OdPanel({ children, sx, ...other }) {
  return (
    <Box
      component="section"
      data-dark="1"
      {...other}
      sx={[
        {
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          bgcolor: 'var(--color-accent-900)',
          color: 'var(--color-neutral-200)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
      {/* después de los hijos: con el mismo z-index queda sobre la capa
          oscura de un fondo fotográfico (Cómo comprar) */}
      <OdDotField />
    </Box>
  );
}
