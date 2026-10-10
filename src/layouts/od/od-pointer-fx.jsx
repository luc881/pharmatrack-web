'use client';

import { useEffect } from 'react';

// ----------------------------------------------------------------------
// Un solo listener para todos los hovers que siguen al cursor del sitio.
// Escribe en el elemento [data-fx] bajo el puntero:
//   --px / --py  posición 0→1 dentro del elemento, continua (brillo, foco)
//   --mx / --my  desplazamiento -0.5→0.5 desde el centro (imán, inclinación);
//                vuelve a 0 al salir
//   --ex / --ey  punto de ENTRADA (fijo mientras se está encima) y, al salir,
//                punto de SALIDA. El relleno de los botones nace ahí y no
//                persigue al cursor: si lo persiguiera, el círculo salta de
//                lugar a media animación y la entrada se ve como un glitch.
// Las clases de global.css (.od-btn, .od-tilt, .od-glare, .od-glow,
// .od-magnet) leen esas variables. Solo con puntero fino.
// ----------------------------------------------------------------------

const pos = (el, e) => {
  const r = el.getBoundingClientRect();
  return [
    Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
    Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
  ];
};

export function OdPointerFx() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let current = null;
    const release = (el, e) => {
      if (e) {
        const [x, y] = pos(el, e);
        el.style.setProperty('--ex', x.toFixed(3));
        el.style.setProperty('--ey', y.toFixed(3));
      }
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };

    const track = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-fx]') : null;
      if (el !== current) {
        if (current) release(current, e);
        current = el;
        if (el) {
          const [x, y] = pos(el, e);
          el.style.setProperty('--ex', x.toFixed(3));
          el.style.setProperty('--ey', y.toFixed(3));
        }
      }
      if (!el) return;
      const [px, py] = pos(el, e);
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
      el.style.setProperty('--mx', (px - 0.5).toFixed(3));
      el.style.setProperty('--my', (py - 0.5).toFixed(3));
    };
    const out = (e) => {
      if (current) release(current, e);
      current = null;
    };

    // pointerover llega en el mismo instante en que empieza el :hover, antes
    // del primer pointermove: así el punto de entrada ya está puesto cuando
    // arranca la transición del relleno.
    document.addEventListener('pointerover', track, { passive: true });
    document.addEventListener('pointermove', track, { passive: true });
    document.documentElement.addEventListener('pointerleave', out);
    return () => {
      document.removeEventListener('pointerover', track);
      document.removeEventListener('pointermove', track);
      document.documentElement.removeEventListener('pointerleave', out);
    };
  }, []);

  return null;
}
