'use client';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------
// Devuelve `true` cuando una sección marcada `data-dark` cruza la banda donde
// vive la barra flotante; el header usa ese estado para invertir sus colores
// (crema sobre secciones oscuras, oscura sobre contenido claro). Escucha
// scroll/resize con rAF para no disparar en cada frame.
// ponytail: banda aproximada (58–104px); ajustar si cambia el alto del header.
// ----------------------------------------------------------------------

const BAND_TOP = 58;
const BAND_BOTTOM = 104;

export function useNavTheme() {
  // el home abre sobre el hero oscuro → arranca en modo "sobre oscuro" (crema)
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      let dark = false;
      document.querySelectorAll('[data-dark]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < BAND_BOTTOM && r.bottom > BAND_TOP) dark = true;
      });
      setOnDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return onDark;
}
