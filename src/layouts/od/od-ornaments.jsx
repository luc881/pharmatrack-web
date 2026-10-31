import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Adornos de la marca (mismo lenguaje que el tríptico de cuidados y el
// sello): kicker numerado, marca de título, divisor de hojas, nota
// "¿Sabías que…?", sello oficial y filete con destello. Todo en SVG en línea con currentColor
// para heredar la tinta del contexto (BRAND.md §6). Con moderación: uno o
// dos por sección.
// ----------------------------------------------------------------------

const asArray = (sx) => (Array.isArray(sx) ? sx : [sx]);

const LABEL = {
  fontSize: 13,
};

// Rótulo corto de una sección de la ficha (en tipo oración, sin número: la
// numeración decorativa salió con el rediseño Musgo).
export function NumberedKicker({ children, sx }) {
  return <Box sx={[{ ...LABEL, color: 'var(--od-text-muted)' }, ...asArray(sx)]}>{children}</Box>;
}

// Título de sección (sin rótulo encima ni marca debajo: rediseño Musgo).
export function SectionHead({ title, size = 'clamp(30px, 3.4vw, 46px)', sx }) {
  return (
    <Box component="h2" sx={[{ m: 0, fontFamily: 'var(--od-font-display)', fontWeight: 400, fontSize: size, lineHeight: 1.08, textWrap: 'balance' }, ...asArray(sx)]}>
      {title}
    </Box>
  );
}

// Divisor: línea fina con puntos en los extremos y dos hojas al centro.
// Con el cursor encima (o sobre un contenedor .od-orn-host) las hojas se abren,
// las líneas se encienden en tuna y los puntos crecen (global.css).
export function LeafDivider({ sx }) {
  return (
    <Box aria-hidden className="od-leafdiv" sx={[{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--od-tinta)' }, ...asArray(sx)]}>
      <Box className="od-mark-dot" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.55 }} />
      <Box className="od-div-line-l" sx={{ flex: 1, height: '1px', bgcolor: 'currentColor', opacity: 0.35 }} />
      <Box component="svg" className="od-div-leaf" viewBox="0 0 64 16" sx={{ width: 64, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
        {/* pathLength=1: el trazo se entinta desde el centro (global.css, .od-ink) */}
        <g className="od-leaf-l">
          <path className="od-ink" pathLength="1" d="M30 8 C26 3, 18 3, 12 8 C18 13, 26 13, 30 8 Z" fill="var(--od-crema-lino)" />
          <path className="od-ink" pathLength="1" d="M30 8 H12" strokeWidth=".6" />
        </g>
        <g className="od-leaf-r">
          <path className="od-ink" pathLength="1" d="M34 8 C38 3, 46 3, 52 8 C46 13, 38 13, 34 8 Z" fill="var(--od-crema-lino)" />
          <path className="od-ink" pathLength="1" d="M34 8 H52" strokeWidth=".6" />
        </g>
        <circle className="od-leaf-seed" cx="32" cy="8" r="1.6" fill="currentColor" stroke="none" />
      </Box>
      <Box className="od-div-line-r" sx={{ flex: 1, height: '1px', bgcolor: 'currentColor', opacity: 0.35 }} />
      <Box className="od-mark-dot" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.55 }} />
    </Box>
  );
}

// Iconos a línea para las notas. Trazo de 1.4, igual que el nopal del sello.
const NOTE_ICONS = {
  leaf: (
    <path d="M5 19 C5 10 10 5 19 5 C19 14 14 19 5 19 Z M5 19 L13 11" />
  ),
  drop: <path d="M12 4 C12 4 6 11 6 15 a6 6 0 0 0 12 0 C18 11 12 4 12 4 Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6l1.4 1.4 M17 17l1.4 1.4 M5.6 18.4 7 17 M17 7l1.4-1.4" />
    </>
  ),
  up: <path d="M12 19 V5 M6 11 L12 5 L18 11" />,
};

// Nota "¿Sabías que…?": icono en círculo + etiqueta + texto en itálica.
export function NoteBox({ icon = 'leaf', label = '¿Sabías que…?', compact = false, children, sx }) {
  return (
    <Box
      sx={[
        {
          display: 'grid',
          gridTemplateColumns: compact ? '40px 1fr' : '56px 1fr',
          gap: compact ? '14px' : '20px',
          alignItems: 'start',
          p: compact ? '20px 22px' : { xs: '20px', md: '24px 28px' },
          borderRadius: '18px',
          bgcolor: 'var(--od-crema-lino)',
        },
        ...asArray(sx),
      ]}
    >
      <Box sx={{ width: compact ? 40 : 56, height: compact ? 40 : 56, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1.4px solid var(--od-tinta)', color: 'var(--od-tinta)' }}>
        <Box component="svg" viewBox="0 0 24 24" sx={{ width: compact ? 18 : 24, height: compact ? 18 : 24 }} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {NOTE_ICONS[icon] ?? NOTE_ICONS.leaf}
        </Box>
      </Box>
      <Box>
        <Box sx={{ ...LABEL, letterSpacing: '0.08em', color: 'var(--od-text)' }}>{label}</Box>
        <Box sx={compact ? { mt: '6px', fontSize: 14, lineHeight: 1.7, color: 'var(--od-text)' } : { mt: '6px', fontFamily: 'var(--od-font-display)', fontStyle: 'italic', fontSize: { xs: 19, md: 22 }, lineHeight: 1.45 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Elementos de marca tomados tal cual del paquete (public/brand/).

// Sello oficial. `dark` usa el sello oscuro (para fondos noche o fotos).
// BRAND.md §5: mínimo 96 px, sin rotar, estirar ni recolorear.
export function BrandSeal({ dark = false, size = 140, sx }) {
  return (
    <Box
      component="img"
      src={`/brand/assets/logo/sello-${dark ? 'oscuro' : 'claro'}.svg`}
      alt=""
      aria-hidden
      sx={[{ display: 'block', width: size, height: size, pointerEvents: 'none' }, ...asArray(sx)]}
    />
  );
}

// Filete fino que remata en el destello tuna de la marca: "———— ✦".
// `flip` lo invierte para el lado derecho ("✦ ————").
export function StarRule({ flip = false, width = 140, sx }) {
  return (
    <Box
      aria-hidden
      className="od-starrule"
      sx={[
        { display: 'flex', alignItems: 'center', gap: '12px', width, flexDirection: flip ? 'row-reverse' : 'row', color: 'var(--od-tinta)' },
        ...asArray(sx),
      ]}
    >
      <Box className={flip ? 'od-div-line-r' : 'od-div-line-l'} sx={{ flex: 1, height: '1px', bgcolor: 'currentColor', opacity: 0.4 }} />
      <Box component="span" className="od-star od-mark-dot" sx={{ width: 12, height: 12, flexShrink: 0 }} />
    </Box>
  );
}
