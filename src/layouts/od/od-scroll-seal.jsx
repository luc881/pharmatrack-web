'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { useNavTheme } from './use-nav-theme';

// ----------------------------------------------------------------------
// Sello fijo en la esquina inferior derecha:
//  - aparece al bajar más de media pantalla (arriba no sirve de nada);
//  - un anillo de rayitas (como el del loader) se llena con el avance de la
//    página;
//  - en contraste con la sección de abajo: sello oscuro sobre fondo claro y
//    claro sobre fondo oscuro
//    (misma detección data-dark que la barra flotante);
//  - al pasar el cursor el sello gira y se desvanece y aparece una flecha;
//    clic → sube al inicio.
// En móvil queda por encima de la barra de pestañas.
// ----------------------------------------------------------------------

// 2πr con r = 46 (viewBox de 100), 120 rayitas sin costura
const C = 2 * Math.PI * 46;
const STEP = C / 120;
const TICKS = `${(STEP * 0.3).toFixed(3)} ${(STEP * 0.7).toFixed(3)}`;

// franja del viewport donde vive el botón (para saber si hay fondo oscuro)
const band = () => [window.innerHeight - 270, window.innerHeight - 30];

export function OdScrollSeal() {
  const onDark = useNavTheme(band);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ringRef.current?.style.setProperty('stroke-dashoffset', String(C * (1 - p)));
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const ink = onDark ? 'var(--od-papel)' : 'var(--od-tinta)';

  return (
    <Box
      component="button"
      type="button"
      onClick={toTop}
      aria-label="Volver arriba"
      tabIndex={visible ? 0 : -1}
      sx={{
        position: 'fixed',
        right: { xs: 14, md: 28 },
        // en móvil, encima de la barra de pestañas (66px)
        bottom: { xs: 80, md: 28 },
        zIndex: 70,
        // grande a propósito: es de los pocos lugares donde el sello se ve completo
        // escala con la pantalla: en laptops (900-1535px) 240px tapaba contenido
        width: { xs: 84, md: 130, lg: 170, xl: 240 },
        height: { xs: 84, md: 130, lg: 170, xl: 240 },
        p: 0,
        border: 0,
        borderRadius: '50%',
        bgcolor: 'transparent',
        cursor: 'pointer',
        color: ink,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(16px) scale(0.9)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 400ms ease, transform 500ms var(--od-ease), color 400ms ease',
        '& .od-seal': { transition: 'opacity 450ms ease, transform 650ms var(--od-ease)' },
        '& .od-seal-arrow': { opacity: 0, transform: 'translateY(10px)', transition: 'opacity 350ms ease 120ms, transform 550ms var(--od-ease) 80ms' },
        '& .od-seal-disc': { transform: 'scale(0)', transition: 'transform 550ms var(--od-ease)' },
        '@media (hover: hover)': {
          '&:hover .od-seal, &:focus-visible .od-seal': { opacity: 0, transform: 'rotate(-120deg) scale(0.6)' },
          '&:hover .od-seal-arrow, &:focus-visible .od-seal-arrow': { opacity: 1, transform: 'none' },
          '&:hover .od-seal-disc, &:focus-visible .od-seal-disc': { transform: 'scale(1)' },
        },
      }}
    >
      {/* anillo de avance de la página */}
      <Box component="svg" viewBox="0 0 100 100" aria-hidden sx={{ position: 'absolute', inset: 0, width: 1, height: 1, transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3" strokeDasharray={TICKS} />
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="var(--od-tuna)"
          strokeWidth="3"
          strokeDasharray={`${C}`}
          strokeDashoffset={C}
          style={{ transition: 'stroke-dashoffset 120ms linear' }}
          mask="url(#od-seal-ticks)"
        />
        <defs>
          <mask id="od-seal-ticks">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={TICKS} />
          </mask>
        </defs>
      </Box>

      {/* fondo de papel bajo el sello claro (va sobre secciones oscuras y sus
          trazos son de tinta); el sello oscuro ya trae su propio disco */}
      <Box
        sx={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          bgcolor: 'rgba(246,244,241,0.92)',
          backdropFilter: 'blur(4px)',
          opacity: onDark ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}
      />

      {/* disco que aparece detrás de la flecha */}
      <Box className="od-seal-disc" sx={{ position: 'absolute', inset: '14%', borderRadius: '50%', bgcolor: 'var(--od-tuna)' }} />

      {/* sello en contraste (pedido del usuario): oscuro sobre fondo claro,
          claro sobre secciones oscuras */}
      <Box
        className="od-seal"
        component="img"
        src={onDark ? '/brand/assets/logo/sello-claro.svg' : '/brand/assets/logo/sello-oscuro.svg'}
        alt=""
        sx={{ position: 'absolute', inset: '8%', width: '84%', height: '84%' }}
      />

      <Box className="od-seal-arrow" sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff' }}>
        <Iconify icon="eva:arrow-upward-fill" sx={{ width: { xs: 30, md: 38, lg: 46, xl: 56 }, height: { xs: 30, md: 38, lg: 46, xl: 56 } }} />
      </Box>
    </Box>
  );
}
