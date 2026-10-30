'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

// ----------------------------------------------------------------------
// Medición de /links con Vercel Analytics (montado en app/layout.jsx).
// La visita en sí ya la cuenta Vercel como pageview; aquí se manda además
// `visit` (visita_links) y un evento por cada [data-track] que se toca, ambos
// con ?src= (ticket, tarjeta, etiqueta...) para saber de dónde llega la gente.
// El src no cambia el contenido.
// ----------------------------------------------------------------------

export function LinksTrack({ visit }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // ?origen= era el nombre anterior; se sigue leyendo por si ya hay algo impreso
    const src = params.get('src') || params.get('origen') || 'directo';
    track(visit, { src });

    const onClick = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-track]') : null;
      if (el) track(el.dataset.track, { src });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [visit]);

  return null;
}
