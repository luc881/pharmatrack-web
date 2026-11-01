import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Cinta de novedades que corre (antes del pie y en la suscripción). Las frases
// se editan en el dashboard (Sitio → ajustes, `ticker` de /settings/site);
// sin frases no se muestra.
// ----------------------------------------------------------------------

export function OdTicker({ items, reverse = false }) {
  if (!items?.length) return null;
  // repetida para que el bucle no deje hueco en pantallas anchas
  const loop = [...items, ...items, ...items, ...items];
  return (
    <Box data-dark="1" sx={{ bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-200)', py: '11px', overflow: 'hidden' }}>
      <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontSize: 14, animation: `${reverse ? 'odMarqueeR' : 'odMarquee'} 52s linear infinite` }}>
        {loop.map((t, i) => (
          <Box component="span" key={i} sx={{ px: '40px' }}>
            {t}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
