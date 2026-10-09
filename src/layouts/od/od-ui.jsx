'use client';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';

import { LeafBranch, HeadingMark } from './od-ornaments';

// ----------------------------------------------------------------------
// Primitivas del rediseño editorial (Opuntia Den). Comparten tokens de
// global.css (var(--color-*), var(--shadow-*), var(--od-ease)) para que las
// cuatro pantallas se vean del mismo sistema sin repetir estilos.
// ----------------------------------------------------------------------

// Hueco de imagen: caja con relación de aspecto + zoom al hover recortado por
// overflow. Con `src` pinta la foto real; sin ella, un placeholder rotulado
// (el cliente sube su fotografía después — ver Assets del handoff).
export function OdImage({ src, alt = '', label = '', ratio = '1 / 1', radius = 16, width = 800, sx }) {
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
            src={cdnImage(src, width)}
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
  // Hover: se levanta y deja una sombra plana (BRAND.md: sin blur); la del
  // botón oscuro es tuna, como un sello. Al presionar se hunde.
  dark: {
    bgcolor: 'var(--color-neutral-900)',
    color: 'var(--color-neutral-100)',
    '&:hover': { bgcolor: 'var(--od-noche)', transform: 'translate(-2px, -2px)', boxShadow: '4px 4px 0 var(--od-tuna)', color: 'var(--color-neutral-100)' },
    '&:active': { transform: 'translate(0, 0)', boxShadow: '1px 1px 0 var(--od-tuna)' },
  },
  light: {
    bgcolor: 'rgba(246,244,241,0.95)',
    color: 'var(--color-neutral-900)',
    '&:hover': { bgcolor: 'var(--od-papel)', transform: 'translate(-2px, -2px)', boxShadow: '4px 4px 0 var(--od-tuna)', color: 'var(--color-neutral-900)' },
    '&:active': { transform: 'translate(0, 0)', boxShadow: '1px 1px 0 var(--od-tuna)' },
  },
  outline: {
    color: '#eae7e7',
    border: '1px solid rgba(234,231,231,0.5)',
    '&:hover': { bgcolor: 'rgba(234,231,231,0.12)', borderColor: '#eae7e7', transform: 'translateY(-2px)', color: '#eae7e7' },
    '&:active': { transform: 'none' },
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
          transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease, transform 250ms var(--od-ease), box-shadow 250ms var(--od-ease)',
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
export function Kicker({ children, color = 'var(--od-text-muted)', size = 13, sx }) {
  return (
    <Box
      component="p"
      sx={[
        {
          m: 0,
          color,
          fontSize: size,
          letterSpacing: 'var(--od-tracking-label)',
          textTransform: 'uppercase',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

// Destello de 4 puntas en tuna (clase .od-star de brand/tokens.css). Separador
// de metadatos y viñeta; hereda el tamaño de la letra.
export function Star({ spin = false, sx }) {
  return <Box component="span" className={spin ? 'od-star od-star-spin' : 'od-star'} aria-hidden sx={sx} />;
}

// Nombre científico según BRAND.md: el binomio en itálica y la localidad o
// variedad entre comillas, sin itálica. 'Nesodillo arcangelii "Shiro Utsuri"'.
export function SciName({ children, sx }) {
  const text = String(children ?? '');
  const cut = text.search(/["“]/);
  const binomial = cut === -1 ? text : text.slice(0, cut).trimEnd();
  const rest = cut === -1 ? '' : text.slice(cut).replace(/^"([^"]*)"/, '“$1”');
  return (
    <Box component="span" sx={[{ fontFamily: 'var(--od-font-display)' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component="em" sx={{ fontStyle: 'italic' }}>{binomial}</Box>
      {rest && ` ${rest}`}
    </Box>
  );
}

// Cabecera de página interior: kicker + H1 display + bajada. Reúne el patrón que
// comparten las páginas de contenido (criadero, envíos, asesoría, contacto). El
// header entra con la animación de carga `od-rise` (definida en global.css).
export function OdPageHead({ kicker, title, intro, introWidth = '62ch' }) {
  return (
    <Box component="section" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: 4, md: 6 } }}>
      {/* Rama a línea a la derecha, como en las láminas del tríptico */}
      <LeafBranch sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 24, right: 'var(--od-gutter)', width: 260, opacity: 0.5 }} />
      <Box className="od-rise" sx={{ position: 'relative', maxWidth: 1180 }}>
        <Kicker sx={{ mb: 1.75 }}>{kicker}</Kicker>
        <Display component="h1" size="clamp(34px, 4.6vw, 68px)" sx={{ lineHeight: 1.05, maxWidth: '18ch' }}>
          {title}
        </Display>
        <HeadingMark sx={{ mt: '22px' }} />
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
