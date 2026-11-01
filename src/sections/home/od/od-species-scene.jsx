'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Pill } from 'src/layouts/od/od-ui';

// ----------------------------------------------------------------------
// Especies destacadas como escena (paso 5c del rediseño, inspirada en las
// fichas de proyecto de Aldena): cada especie ocupa una pantalla que se queda
// fija (position: sticky) y la siguiente la cubre al bajar. Detrás corre el
// nombre en Playfair gigante y tenue; al centro, la imagen; abajo, los datos.
//
// Fondo: la foto propia de la especie desenfocada si existe; si no, un
// degradado de Feral (public/brand/degradados/especie-*.jpg). Nunca una foto
// de banco: no se presenta como el animal que se vende.
// ----------------------------------------------------------------------

const BACKDROPS = ['musgo', 'olivo', 'salvia', 'hojarasca'].map((n) => `/brand/degradados/especie-${n}.jpg`);

function Panel({ card, index, isLast, heading }) {
  const backdrop = BACKDROPS[index % BACKDROPS.length];
  const photo = card.image;
  const loop = Array.from({ length: 6 }, () => card.title);

  return (
    <Box
      component="article"
      data-dark="1"
      className="od-grain"
      sx={{ position: 'sticky', top: 0, height: '100svh', minHeight: 620, overflow: 'hidden', color: 'var(--od-papel)', bgcolor: 'var(--od-noche)' }}
    >
      {/* fondo: foto propia desenfocada o degradado */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: photo ? '-6%' : 0,
          backgroundImage: `url(${photo || backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: photo ? 'blur(48px) brightness(0.55) saturate(1.1)' : 'none',
        }}
      />
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(22,27,25,0.25)' }} />

      {/* el nombre corriendo detrás */}
      <Box aria-hidden sx={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-58%)', overflow: 'hidden', pointerEvents: 'none' }}>
        <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', animation: 'odMarquee 60s linear infinite', fontFamily: 'var(--font-heading)', fontSize: 'clamp(96px, 13vw, 220px)', lineHeight: 1, opacity: 0.14 }}>
          {loop.map((t, i) => (
            <Box component="span" key={i} sx={{ px: '0.35em' }}>
              {t}
            </Box>
          ))}
        </Box>
      </Box>

      {/* encabezado de la sección, solo en el primer panel */}
      {heading && (
        <Box sx={{ position: 'absolute', top: { xs: 28, md: 88 }, left: 0, right: 0, px: { xs: '18px', md: 'var(--od-gutter)' }, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
          <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 44px)' }}>
            {heading}
          </Box>
          <Box component={RouterLink} href={paths.catalog} sx={{ color: 'inherit', fontSize: 15, textDecoration: 'none', opacity: 0.85, '&:hover': { opacity: 1 } }}>
            Ver todo el catálogo →
          </Box>
        </Box>
      )}

      {/* la especie */}
      <Box sx={{ position: 'relative', height: 1, display: 'grid', placeItems: 'center', px: '18px' }}>
        <Box component={RouterLink} href={card.href} sx={{ width: 'min(440px, 76vw)', color: 'inherit', textDecoration: 'none', '&:hover .od-sc-img': { transform: 'scale(1.03)' } }}>
          <Box sx={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '4px', bgcolor: 'rgba(22,27,25,0.4)' }}>
            {photo ? (
              <Box className="od-sc-img" component="img" src={photo} alt={card.title} loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', transition: 'transform 700ms var(--od-ease)', filter: card.soldOut ? 'grayscale(1)' : 'none' }} />
            ) : (
              // sin foto propia todavía: el mismo degradado, nítido, con el nombre científico
              <Box className="od-sc-img" sx={{ width: 1, height: 1, display: 'grid', placeItems: 'center', p: 3, textAlign: 'center', backgroundImage: `url(${backdrop})`, backgroundSize: 'auto 150%', backgroundPosition: '30% 70%', transition: 'transform 700ms var(--od-ease)' }}>
                <Box sx={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15 }}>{card.scientific || card.title}</Box>
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 28 }, lineHeight: 1.15 }}>{card.title}</Box>
            <Box sx={{ flexShrink: 0, fontSize: 15, opacity: card.soldOut ? 0.7 : 1 }}>{card.soldOut ? 'Agotado' : card.price}</Box>
          </Box>
          <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: 15, opacity: 0.8 }}>
            {/* sin foto, el nombre científico ya va en el recuadro */}
            <Box component="span" sx={{ fontStyle: 'italic' }}>{photo ? card.scientific : ''}</Box>
            <Box component="span">{card.category}</Box>
          </Box>
        </Box>
      </Box>

      {isLast && (
        <Box sx={{ position: 'absolute', bottom: { xs: 28, md: 40 }, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Pill variant="light" href={paths.catalog}>
            Ver todo el catálogo
          </Pill>
        </Box>
      )}
    </Box>
  );
}

export function OdSpeciesScene({ cards, heading }) {
  if (!cards.length) return null;
  return (
    <Box component="section" id="disponibles" aria-label={heading} sx={{ position: 'relative', scrollMarginTop: 80 }}>
      {cards.map((card, i) => (
        <Panel key={card.key} card={card} index={i} isLast={i === cards.length - 1} heading={i === 0 ? heading : null} />
      ))}
    </Box>
  );
}
