'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { cdnImage } from 'src/lib/cdn-image';
import { videoPoster } from 'src/lib/care-sheets';

// ----------------------------------------------------------------------
// Fondo de la portada de una ficha: el video en bucle (mudo) si hay, si no
// la primera foto. Con «reducir movimiento» se queda el cuadro fijo del video.
// Entra con un acercamiento lento (odKen).
// ----------------------------------------------------------------------

const fill = {
  position: 'absolute',
  inset: 0,
  width: 1,
  height: 1,
  objectFit: 'cover',
  animation: 'odKen 2.6s var(--od-ease) both',
};

export function SheetHeroMedia({ video, photo }) {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (video && !still) {
    return (
      <Box
        component="video"
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={videoPoster(video.src)}
        sx={fill}
      >
        <source src={video.src} type="video/mp4" />
      </Box>
    );
  }
  const src = video ? videoPoster(video.src) : photo && cdnImage(photo.src, 1600);
  return src ? <Box component="img" src={src} alt="" aria-hidden sx={fill} /> : null;
}
