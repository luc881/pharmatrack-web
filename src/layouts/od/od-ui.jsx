'use client';

import { useRef } from 'react';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';

import { BrandSeal, HeadingMark } from './od-ornaments';

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
          // Sin foto: el favicon claro de la marca en grande, para que el hueco
          // no se vea vacío; el nombre queda para lectores de pantalla.
          <Box
            role="img"
            aria-label={label || alt || 'Sin foto'}
            sx={{ width: 1, height: 1, display: 'grid', placeItems: 'center', bgcolor: 'var(--od-crema-hueso)' }}
          >
            <Box
              component="img"
              src="/brand/assets/favicon/favicon-claro.svg"
              alt=""
              sx={{ width: '42%', maxWidth: 220, height: 'auto', opacity: 0.9 }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Hover (ver .od-btn en global.css): se deja jalar por el cursor y un círculo
// de color nace donde entra el ratón; el texto rueda hacia arriba.
const PILL_VARIANTS = {
  dark: { bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', '--od-btn-fill': 'var(--od-tuna)', '--od-btn-ink': '#fff' },
  light: { bgcolor: 'rgba(246,244,241,0.95)', color: 'var(--color-neutral-900)', '--od-btn-fill': 'var(--od-tuna)', '--od-btn-ink': '#fff' },
  outline: {
    color: '#eae7e7',
    border: '1px solid rgba(234,231,231,0.5)',
    '--od-btn-fill': '#f6f4f1',
    '--od-btn-ink': 'var(--color-neutral-900)',
    '&:hover': { borderColor: '#f6f4f1' },
  },
};

// Contenido de un .od-btn: el texto normal y, encima, una copia en el color
// de hover (--od-btn-ink) recortada por el MISMO círculo que el relleno. Así
// el texto cambia de color exactamente donde pasa el relleno: no hay un
// instante de texto claro sobre relleno claro (se veía gris, como glitch).
export function BtnInk({ children, roll = true }) {
  const content = roll ? <RollText>{children}</RollText> : children;
  return (
    <>
      {content}
      <span className="od-btn-ink" aria-hidden>
        {content}
      </span>
    </>
  );
}

// Lista de filas [data-row] con UN bloque oscuro que se desliza a la fila bajo
// el cursor (antes cada fila se rellenaba por su cuenta y, al bajar, se veían
// animaciones sueltas). Al entrar a la lista el bloque se abre en su lugar; al
// salir se cierra. Solo con ratón: en táctil no hay hover.
export function OdRowGroup({ children, sx }) {
  const ref = useRef(null);
  const hlRef = useRef(null);
  const activeRef = useRef(null);

  const activate = (row) => {
    const hl = hlRef.current;
    if (!hl || row === activeRef.current) return;
    activeRef.current?.removeAttribute('data-active');
    const box = ref.current.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const hidden = hl.dataset.on !== '1';
    // primera fila: se coloca sin viajar y solo se abre
    if (hidden) hl.style.transition = 'none';
    hl.style.transform = `translateY(${r.top - box.top}px)`;
    hl.style.height = `${r.height}px`;
    if (hidden) {
      hl.getBoundingClientRect(); // fuerza el layout antes de restaurar la transición
      hl.style.transition = '';
    }
    hl.dataset.on = '1';
    row.setAttribute('data-active', '');
    activeRef.current = row;
  };

  const release = () => {
    activeRef.current?.removeAttribute('data-active');
    activeRef.current = null;
    if (hlRef.current) hlRef.current.dataset.on = '0';
  };

  return (
    <Box
      ref={ref}
      onPointerOver={(e) => {
        if (e.pointerType !== 'mouse') return;
        const row = e.target.closest?.('[data-row]');
        if (row && ref.current.contains(row)) activate(row);
      }}
      onPointerLeave={release}
      sx={[{ position: 'relative', isolation: 'isolate' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        ref={hlRef}
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: -1,
          pointerEvents: 'none',
          bgcolor: 'var(--color-neutral-900)',
          clipPath: 'inset(50% 0 50% 0)',
          transition: 'transform 550ms var(--od-ease), height 550ms var(--od-ease), clip-path 500ms var(--od-ease)',
          '&[data-on="1"]': { clipPath: 'inset(0 0 0 0)' },
        }}
      />
      {children}
    </Box>
  );
}

// Texto duplicado para el efecto de rodar (la copia no se lee en voz alta)
export function RollText({ children }) {
  return (
    <span className="od-roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

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
      data-fx
      className="od-btn"
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
        },
        PILL_VARIANTS[variant],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* sin rodar: la capa de texto de hover debe quedar exactamente encima
          de la normal; si ruedan, se ve un fantasma claro (texto "opaco") */}
      <BtnInk roll={false}>{children}</BtnInk>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Flecha circular de carrusel. `solid` la pinta oscura sólida (avance/retroceso
// enfatizado); si no, contorno. Mismo hover que la píldora (.od-btn).
export function ArrowButton({ onClick, label, size = 46, solid = false, children, sx }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={label}
      data-fx
      className="od-btn"
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
        },
        solid
          ? {
              border: '1px solid var(--color-neutral-900)',
              bgcolor: 'var(--color-neutral-900)',
              color: 'var(--color-neutral-100)',
              '--od-btn-fill': 'var(--od-tuna)',
              '--od-btn-ink': '#fff',
              '&:hover': { borderColor: 'var(--od-tuna)' },
            }
          : {
              border: '1px solid var(--color-divider)',
              bgcolor: 'transparent',
              color: 'inherit',
              '--od-btn-fill': 'var(--color-neutral-900)',
              '--od-btn-ink': 'var(--color-neutral-100)',
              '&:hover': { borderColor: 'var(--color-neutral-900)' },
            },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <BtnInk roll={false}>{children}</BtnInk>
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
      {/* Sello oficial a la derecha del título */}
      <BrandSeal size={132} sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: { md: 40 }, right: 'var(--od-gutter)' }} />
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
