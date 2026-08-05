'use client';

import Box from '@mui/material/Box';

import { OdImage } from './od-ui';
import { SCENES } from './three-scenes';
import { useThreeScene } from './use-three-scene';

// ----------------------------------------------------------------------
// Contenedor de una escena three.js con degradación elegante: mientras la
// escena no monta (móvil, motion reducido o cargando) se muestra la imagen de
// respaldo; al montar, el canvas la cubre. El contenedor define el tamaño.
// `scene` es una clave ('jar' | 'log') — así puede usarse desde páginas server
// component sin pasar funciones a través del límite RSC.
// ----------------------------------------------------------------------

export function OdScene({ scene, fallbackSrc, fallbackLabel = '', ratio = '3 / 4', sx }) {
  const { build, opts } = SCENES[scene];
  const { ref, mounted } = useThreeScene(build, opts);

  return (
    <Box sx={[{ position: 'relative', width: 1, aspectRatio: ratio }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {!mounted && (
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <OdImage src={fallbackSrc} label={fallbackLabel} ratio={ratio} radius={0} sx={{ width: 1, height: 1 }} />
        </Box>
      )}
      <Box ref={ref} sx={{ position: 'absolute', inset: 0 }} />
    </Box>
  );
}
