'use client';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------
// Primitivas del rediseño editorial (Opuntia Den). Comparten tokens de
// global.css (var(--color-*), var(--shadow-*), var(--od-ease)) para que las
// cuatro pantallas se vean del mismo sistema sin repetir estilos.
// ----------------------------------------------------------------------

// Hueco de imagen: caja con relación de aspecto + zoom al hover recortado por
// overflow. Con `src` pinta la foto real; sin ella, un placeholder rotulado
// (el cliente sube su fotografía después — ver Assets del handoff).
export function OdImage({ src, alt = '', label = '', ratio = '1 / 1', radius = 16, sx }) {
  return (
    <Box
      sx={[
        {
          overflow: 'hidden',
          aspectRatio: ratio,
          borderRadius: `${radius}px`,
          bgcolor: 'var(--color-neutral-200)',
          '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        className="od-img-zoom"
        sx={{ width: 1, height: 1, transition: 'transform 1100ms var(--od-ease)' }}
      >
        {src ? (
          <Box
            component="img"
            src={src}
            alt={alt}
            loading="lazy"
            sx={{ width: 1, height: 1, display: 'block', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: 1,
              height: 1,
              px: 2,
              display: 'grid',
              textAlign: 'center',
              placeItems: 'center',
              color: 'var(--color-neutral-500)',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const PILL_VARIANTS = {
  dark: {
    bgcolor: 'var(--color-neutral-900)',
    color: 'var(--color-neutral-100)',
    '&:hover': { bgcolor: 'var(--color-accent-700)', transform: 'translateY(-3px)', color: 'var(--color-neutral-100)' },
  },
  light: {
    bgcolor: 'rgba(246,244,241,0.95)',
    color: 'var(--color-neutral-900)',
    '&:hover': { bgcolor: '#ffffff', transform: 'translateY(-3px)', color: 'var(--color-neutral-900)' },
  },
  outline: {
    color: '#eae7e7',
    border: '1px solid rgba(234,231,231,0.5)',
    '&:hover': { bgcolor: 'rgba(234,231,231,0.12)', color: '#eae7e7' },
  },
};

// Píldora (link o botón). El link interno usa RouterLink; externo o acción usa
// <a>/<button> según se pase href u onClick.
export function Pill({ variant = 'dark', href, onClick, children, sx, ...other }) {
  const linkProps = href
    ? href.startsWith('/')
      ? { component: RouterLink, href }
      : { component: 'a', href }
    : { component: 'button', type: 'button', onClick };

  return (
    <Box
      {...linkProps}
      {...other}
      sx={[
        {
          border: 0,
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 14,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: '32px',
          py: '15px',
          borderRadius: '999px',
          textDecoration: 'none',
          transition: 'background 400ms, color 400ms, transform 400ms var(--od-ease)',
        },
        PILL_VARIANTS[variant],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

// Flecha circular de carrusel. `solid` la pinta oscura sólida (avance/retroceso
// enfatizado); si no, contorno con hover en acento.
export function ArrowButton({ onClick, label, size = 46, solid = false, children, sx }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={label}
      sx={[
        {
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: '999px',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 16,
          display: 'grid',
          placeItems: 'center',
          transition: 'border-color 350ms, color 350ms, background 350ms, transform 350ms',
        },
        solid
          ? {
              border: '1px solid var(--color-neutral-900)',
              bgcolor: 'var(--color-neutral-900)',
              color: 'var(--color-neutral-100)',
              '&:hover': { bgcolor: 'var(--color-neutral-800)' },
            }
          : {
              border: '1px solid var(--color-divider)',
              bgcolor: 'transparent',
              color: 'inherit',
              '&:hover': {
                borderColor: 'var(--color-accent)',
                color: 'var(--color-accent-700)',
                bgcolor: 'var(--color-accent-100)',
                transform: 'scale(1.08)',
              },
            },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

// Kicker: rótulo en mayúsculas con tracking amplio (eyebrow editorial).
export function Kicker({ children, color = 'var(--color-accent-700)', size = 13, sx }) {
  return (
    <Box
      component="p"
      sx={[
        {
          m: 0,
          color,
          fontSize: size,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// Cabecera de página interior: kicker + H1 display + bajada. Reúne el patrón que
// comparten las páginas de contenido (criadero, envíos, asesoría, contacto). El
// header entra con la animación de carga `od-rise` (definida en global.css).
export function OdPageHead({ kicker, title, intro, introWidth = '62ch' }) {
  return (
    <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 4, md: 6 } }}>
      <Box className="od-rise" sx={{ maxWidth: 1180 }}>
        <Kicker sx={{ mb: 1.75 }}>{kicker}</Kicker>
        <Display component="h1" size="clamp(34px, 4.6vw, 68px)" sx={{ lineHeight: 1.05 }}>
          {title}
        </Display>
        {intro && (
          <Box
            sx={{
              mt: 3,
              maxWidth: introWidth,
              fontSize: 16,
              lineHeight: 1.8,
              color: 'var(--color-neutral-700)',
              textWrap: 'pretty',
            }}
          >
            {intro}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Título serif display del rediseño (Playfair). `size` es un clamp() completo.
export function Display({ children, component = 'h2', size, weight = 300, sx }) {
  return (
    <Box
      component={component}
      sx={[
        {
          m: 0,
          fontFamily: 'var(--font-heading)',
          fontWeight: weight,
          lineHeight: 1.1,
          fontSize: size,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
