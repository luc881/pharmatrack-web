'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Cursor de punto (pedido del usuario, como en Aldena): un punto que sigue al
// mouse con mezcla «diferencia» (oscuro sobre fondos claros, claro sobre
// oscuros) y crece sobre enlaces y botones. La skill desaconseja cursores
// propios, así que va con cuidado:
//  - solo con mouse; nunca en táctil ni con movimiento reducido;
//  - en campos de texto vuelve el cursor normal (y el punto se esconde);
//  - sobre los fondos que cierran (lightbox, modales) manda CloseCursor.
// ----------------------------------------------------------------------

const INTERACTIVE = 'a, button, [role="button"], summary, label, select, [data-cursor]';
const TEXT = 'input, textarea, [contenteditable="true"]';
const HIDE = '.yarl__container, .MuiModal-backdrop';

export function OdCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (!fine || reduce || !el) return undefined;

    const root = document.documentElement;
    root.classList.add('od-cursor-on');
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let scale = 1;
    let target = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      const hide = !t || !!t.closest(TEXT) || !!t.closest(HIDE);
      target = t?.closest(INTERACTIVE) ? 4 : 1;
      if (!shown) {
        x = tx;
        y = ty;
      }
      shown = !hide;
      el.style.opacity = shown ? '1' : '0';
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = '0';
    };
    const tick = () => {
      x += (tx - x) * 0.24;
      y += (ty - y) * 0.24;
      scale += (target - scale) * 0.18;
      // crece cambiando su tamaño real (no con scale): escalar un punto de
      // 14px lo estiraba como imagen y se veía pixeleado
      const size = (14 * scale).toFixed(1);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      root.classList.remove('od-cursor-on');
    };
  }, []);

  return (
    <Box
      ref={ref}
      aria-hidden
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        width: 14,
        height: 14,
        borderRadius: '50%',
        bgcolor: '#fff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 200ms ease',
      }}
    />
  );
}
