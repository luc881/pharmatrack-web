'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { Star } from './od-ui';

// ----------------------------------------------------------------------
// Notas al margen para pantallas anchas (2K/4K). El contenido se queda en
// --od-max y los costados quedaban vacíos; aquí van como en un libro impreso:
// a la izquierda el número y nombre de la sección, a la derecha el folio de la
// marca. Ambos quedan pegados (sticky) mientras la sección está en pantalla.
// Solo aparecen cuando el margen mide más de ~120px (≥ 1680px de ancho).
// La sección que lo use necesita `position: relative`. `width` y `minScreen`
// sirven para páginas con su propio ancho de contenido (el catálogo). `start` baja la nota
// cuando la sección abre con algo a todo lo ancho (marquesina, titular gigante).
//
// Se ajusta al alto de la sección: si el texto vertical no cabe (páginas con
// pocas entradas) queda solo el número/destello con su línea, y si ni eso
// cabe no se muestra. Antes el texto se salía por debajo de la sección.
// ----------------------------------------------------------------------

const vertical = {
  writingMode: 'vertical-rl',
  fontSize: 12,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const BOTTOM = 80; // aire bajo la nota
const GAP = 16;

// 'full' | 'compact' | 'none' según el alto disponible
function fitFor(avail, head, text) {
  if (avail >= head.offsetHeight + GAP + text.scrollHeight) return 'full';
  if (avail >= head.offsetHeight) return 'compact';
  return 'none';
}

function Side({ pos, sideSx, stickySx, head, text, textSx, mode, headRef, textRef }) {
  return (
    <Box aria-hidden sx={[sideSx(pos), mode === 'none' && { visibility: 'hidden' }]}>
      <Box sx={stickySx}>
        <Box
          ref={headRef}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
        >
          {head}
        </Box>
        {/* en compacto el texto se pliega (sigue en el DOM para medirlo) */}
        <Box
          ref={textRef}
          sx={[
            textSx,
            { mt: `${GAP}px`, overflow: 'hidden', transition: 'opacity 300ms' },
            mode !== 'full' && { maxHeight: 0, mt: 0, opacity: 0 },
          ]}
        >
          {text}
        </Box>
      </Box>
    </Box>
  );
}

export function OdGutterNote({
  n,
  label,
  dark = false,
  start = 80,
  width = 'var(--od-gutter)',
  minScreen = 1680,
  folio = 'Opuntia Den — Criadero en CDMX',
}) {
  const tone = dark ? 'var(--color-neutral-500)' : 'var(--color-neutral-600)';
  const line = dark ? 'rgba(240,235,224,0.22)' : 'var(--color-divider)';

  const refs = { lh: useRef(null), lt: useRef(null), rh: useRef(null), rt: useRef(null) };
  const [fit, setFit] = useState({ left: 'full', right: 'full' });

  useEffect(() => {
    const host = refs.lh.current?.closest('[aria-hidden]')?.parentElement;
    if (!host) return undefined;
    const measure = () => {
      const avail = host.clientHeight - start - BOTTOM;
      setFit({
        left: fitFor(avail, refs.lh.current, refs.lt.current),
        right: fitFor(avail, refs.rh.current, refs.rt.current),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  const sideSx = (pos) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [pos]: 0,
    width,
    display: 'none',
    justifyContent: 'center',
    pointerEvents: 'none',
    [`@media (min-width: ${minScreen}px)`]: { display: 'flex' },
  });

  const stickySx = {
    position: 'sticky',
    top: '28vh',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mt: `${start}px`,
    mb: `${BOTTOM}px`,
    color: tone,
  };

  const rule = (grow) => (
    <Box
      sx={{
        width: '1px',
        height: 110,
        bgcolor: line,
        ...(grow && {
          transformOrigin: 'top',
          animation: 'odGrowY linear both',
          animationTimeline: 'view()',
          animationRange: 'entry 10% cover 40%',
        }),
      }}
    />
  );

  return (
    <>
      <Side
        pos="left"
        sideSx={sideSx}
        stickySx={stickySx}
        mode={fit.left}
        headRef={refs.lh}
        textRef={refs.lt}
        head={
          <>
            <Box
              sx={{
                fontFamily: 'var(--font-heading)',
                fontSize: 46,
                lineHeight: 1,
                color: dark ? 'var(--color-neutral-300)' : 'var(--color-text)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {n}
            </Box>
            {rule(true)}
          </>
        }
        textSx={{ ...vertical, transform: 'rotate(180deg)' }}
        text={label}
      />
      <Side
        pos="right"
        sideSx={sideSx}
        stickySx={stickySx}
        mode={fit.right}
        headRef={refs.rh}
        textRef={refs.rt}
        head={
          <>
            <Star sx={{ width: 12, height: 12 }} />
            {rule(false)}
          </>
        }
        textSx={vertical}
        text={folio}
      />
    </>
  );
}
