'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// El cursor nativo no admite animaciones, así que sobre las superficies que
// cierran (fondo del lightbox y backdrops de modales) se oculta con
// `cursor: none` (global.css) y esta X lo reemplaza siguiendo al mouse,
// creciendo al aparecer y encogiéndose al salir.
const CLOSE_SURFACES = '.yarl__container, .MuiModal-backdrop';
const CONTENT = '.yarl__slide_image, .yarl__button, .yarl__thumbnails_container, button, a';

const isCloseTarget = (target) =>
  target instanceof Element && !!target.closest(CLOSE_SURFACES) && !target.closest(CONTENT);

export function CloseCursor() {
  const rootRef = useRef(null);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMove = (event) => {
      lastPoint.current = { x: event.clientX, y: event.clientY };
      const el = rootRef.current;
      if (el) {
        el.style.left = `${event.clientX}px`;
        el.style.top = `${event.clientY}px`;
      }
      setActive(isCloseTarget(event.target));
    };

    // al cerrar con clic, el backdrop desaparece sin que el mouse se mueva:
    // reevaluar qué hay bajo el cursor un instante después
    const handleClick = () => {
      setTimeout(() => {
        const { x, y } = lastPoint.current;
        setActive(isCloseTarget(document.elementFromPoint(x, y)));
      }, 60);
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <Box
      ref={rootRef}
      aria-hidden
      sx={{
        top: 0,
        left: 0,
        position: 'fixed',
        zIndex: 100000,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Box
        sx={(theme) => ({
          width: 44,
          height: 44,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'common.white',
          color: 'grey.800',
          boxShadow: theme.vars.customShadows?.z8,
          opacity: active ? 1 : 0,
          transform: active ? 'scale(1)' : 'scale(0)',
          // pequeño rebote al crecer, salida rápida al encoger
          transition: active
            ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease'
            : 'transform 0.25s ease, opacity 0.2s ease',
        })}
      >
        <Iconify icon="mingcute:close-line" width={20} />
      </Box>
    </Box>
  );
}
