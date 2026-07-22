'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';

import { Logo } from '../logo';

// ----------------------------------------------------------------------
// Portada de carga del sitio público.
//
// Un sitio público no es una app: aquí el contenido ya viene renderizado del
// servidor, así que esta capa TAPA algo que ya está listo. Por eso está
// pensada para quitarse de en medio cuanto antes:
//
//  - se va en cuanto la página termina de cargar, y como tarde a los 2.2 s
//    aunque queden imágenes por bajar — nunca deja a nadie esperando;
//  - una sola vez por sesión: al navegar dentro del sitio no reaparece;
//  - la animación CSS la desvanece sola. Es el respaldo de verdad: el HTML
//    llega renderizado del servidor, así que si el JS no llega a ejecutarse
//    esta capa se quedaría encima del contenido para siempre.
// ----------------------------------------------------------------------

const KEY = 'splash-shown';
const MIN_MS = 1500; // en escritorio carga tan rápido que el splash ni se veía
const MAX_MS = 4500; // techo de seguridad: nunca deja a nadie esperando de más

// Imagen dominante de la primera pantalla. La pinta un componente cliente DESPUÉS
// de hidratar, así que no está en el HTML inicial y `window.load` no la espera:
// por eso el splash se iba y el fondo del hero aparecía de golpe justo después.
const HERO_IMG = '/video/hero-moss.jpg';

const fadeOut = keyframes`
  0%, 70% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
`;

export function SiteSplash() {
  // En el servidor se rinde visible a propósito: si arrancara oculto se vería
  // el contenido antes de taparlo, que es justo el parpadeo que se quiere evitar.
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) {
      setSkip(true);
      return undefined;
    }
    sessionStorage.setItem(KEY, '1');

    // Se retira cuando la primera pantalla está lista (página cargada + imagen
    // del hero decodificada) y ya pasó el mínimo. Lo que sigue es contenido
    // debajo del pliegue, que carga perezoso al hacer scroll: no cuenta.
    const start = Date.now();
    let floor;
    const reveal = () => {
      const left = MIN_MS - (Date.now() - start);
      if (left > 0) floor = setTimeout(() => setDone(true), left);
      else setDone(true);
    };

    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((res) => window.addEventListener('load', res, { once: true }));

    const heroReady = new Promise((res) => {
      const img = new Image();
      img.onload = res;
      img.onerror = res; // si falla, no bloqueamos el splash
      img.src = HERO_IMG;
    });

    Promise.all([pageLoaded, heroReady]).then(reveal);
    const cap = setTimeout(() => setDone(true), MAX_MS);
    return () => {
      clearTimeout(cap);
      clearTimeout(floor);
    };
  }, []);

  if (skip) return null;

  return (
    <Box
      aria-hidden
      sx={{
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        animation: `${fadeOut} ${MAX_MS + 600}ms ease forwards`,
        ...(done && {
          opacity: 0,
          visibility: 'hidden',
          animation: 'none',
          // fade largo y suave: el contenido asoma detrás en vez de aparecer
          // de golpe. `visibility` va con delay para no cortar el fade.
          transition:
            'opacity 800ms ease-out, visibility 0s linear 800ms',
        }),
      }}
    >
      <Logo
        variant="icon"
        disabled
        sx={{
          width: 104,
          height: 104,
          animation: `${pulse} 1.4s ease-in-out infinite`,
        }}
      />
    </Box>
  );
}
