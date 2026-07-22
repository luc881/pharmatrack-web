'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------
// Fondo del hero. Es decorativo, así que se comporta como tal:
//
//  - en móvil sólo el póster: un video en bucle gasta datos y batería de
//    quien probablemente entra desde la calle;
//  - respeta "reducir movimiento" del sistema — para algunas personas un
//    bucle de fondo llega a marear de verdad;
//  - el póster se ve desde el primer instante y el video aparece encima
//    cuando ya puede reproducirse, así nunca hay un hueco negro;
//  - un velo encima mantiene legible el texto pase lo que pase en el video.
// ----------------------------------------------------------------------

const SRC = '/video/hero-moss';

export function HeroVideo({ overlay = 0.42 }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const playVideo = mdUp && !reduceMotion;

  useEffect(() => {
    // Si el navegador ignora autoPlay (algunos ahorradores de batería), el
    // póster se queda: no hay nada que hacer, pero tampoco se rompe.
    if (playVideo) videoRef.current?.play().catch(() => {});
  }, [playVideo]);

  return (
    <Box
      aria-hidden
      sx={{
        inset: 0,
        zIndex: 0,
        position: 'absolute',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="img"
        alt=""
        src={`${SRC}.jpg`}
        sx={{
          width: 1,
          height: 1,
          objectFit: 'cover',
          position: 'absolute',
          filter: 'saturate(1.25) contrast(1.08)',
        }}
      />

      {playVideo && (
        <Box
          ref={videoRef}
          component="video"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          poster={`${SRC}.jpg`}
          onCanPlay={() => setReady(true)}
          sx={{
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
            filter: 'saturate(1.25) contrast(1.08)',
            opacity: ready ? 1 : 0,
            transition: (theme) => theme.transitions.create(['opacity'], { duration: 700 }),
          }}
        >
          <source src={`${SRC}.webm`} type="video/webm" />
          <source src={`${SRC}.mp4`} type="video/mp4" />
        </Box>
      )}

      {/* Velo OSCURO, no claro: un velo crema lava el musgo hasta dejarlo
          verde pálido; oscurecer conserva los verdes y el texto claro encima
          se lee mejor.
          Son DOS degradados apilados, no uno: pasar de "oscuro translúcido" a
          "crema opaco" en un solo tramo cruza por un gris turbio que se ve
          como banda. Así el oscuro se desvanece por su lado y el crema entra
          por el suyo, con paradas intermedias que suavizan la curva. */}
      <Box
        sx={(theme) => {
          const cream = theme.vars.palette.background.defaultChannel;
          return {
            inset: 0,
            position: 'absolute',
            background: [
              `linear-gradient(180deg,
                ${varAlpha(cream, 0)} 74%,
                ${varAlpha(cream, 0.06)} 82%,
                ${varAlpha(cream, 0.2)} 88%,
                ${varAlpha(cream, 0.45)} 93%,
                ${varAlpha(cream, 0.75)} 97%,
                ${varAlpha(cream, 1)} 100%)`,
              `linear-gradient(180deg,
                rgba(18, 24, 16, ${overlay + 0.08}) 0%,
                rgba(18, 24, 16, ${overlay}) 55%,
                rgba(18, 24, 16, ${overlay * 0.9}) 80%,
                rgba(18, 24, 16, ${overlay * 0.45}) 92%,
                rgba(18, 24, 16, 0) 100%)`,
            ].join(','),
          };
        }}
      />
    </Box>
  );
}
