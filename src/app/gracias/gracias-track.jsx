'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

// ----------------------------------------------------------------------
// Medición de /gracias con Vercel Analytics (ya montado en app/layout.jsx).
// La visita en sí ya la cuenta Vercel como pageview; aquí se manda además
// `visita_gracias` y un evento por cada [data-track] que se toca, ambos con
// el ?origen= opcional (sticker, tarjeta...). El origen no cambia el contenido.
// ----------------------------------------------------------------------

export function GraciasTrack() {
  useEffect(() => {
    const origen = new URLSearchParams(window.location.search).get('origen') || 'directo';
    track('visita_gracias', { origen });

    const onClick = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-track]') : null;
      if (el) track(el.dataset.track, { origen });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
