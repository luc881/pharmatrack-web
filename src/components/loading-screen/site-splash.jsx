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
const MAX_MS = 2200;

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

    const finish = () => setDone(true);
    if (document.readyState === 'complete') {
      finish();
      return undefined;
    }
    window.addEventListener('load', finish);
    const cap = setTimeout(finish, MAX_MS);
    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(cap);
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
          transition: (theme) =>
            theme.transitions.create(['opacity', 'visibility'], { duration: 450 }),
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
