'use client';

import { createPortal } from 'react-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { cdnImage } from 'src/lib/cdn-image';

// ----------------------------------------------------------------------
// Vista previa flotante del índice /fichas (idea de PhasmaMX, más pulida):
// al pasar el cursor por una fila aparece una tarjeta con la foto que sigue
// al cursor con suavidad (lerp), se inclina un poco con la velocidad y se
// voltea al otro lado si no cabe. Al cambiar de fila solo cambia la foto.
// Todo el movimiento se escribe directo al DOM en rAF: cero renders por frame.
// Solo con mouse (pointer fino); con movimiento reducido se queda quieta
// donde entró el cursor.
//
// Uso: const api = useRef(null); <SheetHoverPreview apiRef={api} />
//      fila: onMouseEnter={(e) => api.current?.show(sheet, e)}, onMouseLeave={() => api.current?.hide()}
// ----------------------------------------------------------------------

const W = 240;
const H = 300 + 58; // foto 4:5 + pie
const OFFSET = 28;
const MARGIN = 12;
const LERP = 0.16;
const TILT = 5; // grados máximos

export function SheetHoverPreview({ apiRef }) {
  const elRef = useRef(null);
  const [item, setItem] = useState(null);
  const [visible, setVisible] = useState(false);
  // va en <body>: dentro de <main> (isolation) quedaba bajo el divisor del pie
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0, r: 0 };
    let raf = 0;
    let placed = false;
    let hideTimer = 0;

    const place = (x, y) => {
      let px = x + OFFSET;
      let py = y - H / 2;
      if (px + W + MARGIN > window.innerWidth) px = x - OFFSET - W;
      py = Math.min(Math.max(py, MARGIN), window.innerHeight - H - MARGIN);
      return { x: px, y: py };
    };
    const write = () => {
      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) rotate(${cur.r}deg)`;
      }
    };
    const tick = () => {
      const dx = (target.x - cur.x) * LERP;
      cur.x += dx;
      cur.y += (target.y - cur.y) * LERP;
      // inclinación según la velocidad horizontal, suavizada
      cur.r += (Math.max(-TILT, Math.min(TILT, dx * 0.35)) - cur.r) * 0.2;
      write();
      raf = requestAnimationFrame(tick);
    };
    const move = (e) => Object.assign(target, place(e.clientX, e.clientY));

    apiRef.current = {
      show(sheet, e) {
        if (!fine) return;
        window.clearTimeout(hideTimer);
        setItem(sheet);
        setVisible(true);
        if (e) {
          Object.assign(target, place(e.clientX, e.clientY));
          // solo salta al cursor la primera vez; entre filas la lleva el lerp
          if (!placed) Object.assign(cur, target, { r: 0 });
        }
        placed = true;
        if (reduced) {
          write();
          return;
        }
        if (!raf) raf = requestAnimationFrame(tick);
        window.addEventListener('pointermove', move, { passive: true });
      },
      hide() {
        if (!fine) return;
        setVisible(false);
        window.removeEventListener('pointermove', move);
        cancelAnimationFrame(raf);
        raf = 0;
        hideTimer = window.setTimeout(() => {
          setItem(null);
          placed = false;
        }, 300);
      },
    };

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      window.clearTimeout(hideTimer);

      apiRef.current = null;
    };
  }, [apiRef]);

  if (!mounted) return null;

  return createPortal(
    <Box
      ref={elRef}
      aria-hidden
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 80,
        width: W,
        pointerEvents: 'none',
        willChange: 'transform',
        // el contenido escala/entra; el contenedor solo se mueve
        '& > .od-hp-card': {
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'scale(0.92)',
          transition: 'opacity 280ms ease, transform 420ms var(--od-ease)',
        },
      }}
    >
      <Box
        className="od-hp-card"
        sx={{
          overflow: 'hidden',
          bgcolor: 'var(--od-papel)',
          border: '1px solid var(--od-linea)',
          borderRadius: 'var(--od-radius-md)',
          boxShadow: '6px 6px 0 rgba(51, 36, 20, 0.10)',
          transformOrigin: 'left center',
        }}
      >
        <Box sx={{ position: 'relative', aspectRatio: '4 / 5', bgcolor: 'var(--od-crema-hueso)' }}>
          {item?.cover ? (
            <Box
              key={item.cover}
              component="img"
              src={cdnImage(item.cover, W * 2)}
              alt=""
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
                display: 'block',
                animation: 'odFade 0.35s ease both',
              }}
            />
          ) : (
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <Box
                component="img"
                src="/brand/assets/favicon/favicon-claro.svg"
                alt=""
                sx={{ width: '38%', opacity: 0.85 }}
              />
            </Box>
          )}
        </Box>
        {item && (
          <Box key={item.slug} sx={{ px: 1.75, py: 1.25, animation: 'odFade 0.35s ease both' }}>
            <Box
              sx={{
                fontSize: 10,
                letterSpacing: 'var(--od-tracking-label)',
                textTransform: 'uppercase',
                color: 'var(--od-text-muted)',
              }}
            >
              {item.group?.name}
            </Box>
            <Box
              sx={{
                mt: 0.25,
                fontFamily: 'var(--od-font-display)',
                fontSize: 15,
                lineHeight: 1.25,
                color: 'var(--od-text)',
              }}
            >
              <em>{item.scientific_name}</em>
              {item.locality && ` “${item.locality}”`}
            </Box>
          </Box>
        )}
      </Box>
    </Box>,
    document.body
  );
}
