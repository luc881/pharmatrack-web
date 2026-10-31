'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Pill, Kicker, OdImage, Display } from 'src/layouts/od/od-ui';

import { articleSlug } from 'src/sections/articles/utils';

// ----------------------------------------------------------------------
// Divulgación editorial en filas (Nota · 0N), en grupos de 3 que se cambian
// con los puntos; cada grupo entra con odWipe en cascada. Ya no rota sola: el
// contenido que avanza por su cuenta se pierde a media lectura.
//
// Escritorio: el titular entra letra por letra con el scroll y hace una ola al
// pasar el cursor; en las filas, la nota bajo el cursor se queda al frente (las
// demás se atenúan), una línea tuna se dibuja arriba, el título se corre y
// aparece «Leer nota →», y la foto se recorta hacia adentro con un acercamiento.
// ----------------------------------------------------------------------

const TITLE = 'Divulgación';

const titleSx = {
  '& .od-letter': {
    display: 'inline-block',
    transition: 'transform 700ms var(--od-ease), color 400ms ease',
  },
  '@supports (animation-timeline: view())': {
    '& .od-letter': { animation: 'odRise linear both', animationTimeline: 'view()' },
  },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover .od-letter': { transform: 'translateY(-0.07em)', color: 'var(--od-tuna)' },
  },
};

const rowSx = {
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1,
    height: '1px',
    bgcolor: 'var(--od-tuna)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 700ms var(--od-ease)',
  },
  '& .od-note-num, & .od-note-title, & .od-note-cta': {
    transition: 'transform 600ms var(--od-ease), opacity 400ms ease, color 300ms ease',
  },
  '& .od-note-cta': { opacity: 0, transform: 'translateX(-10px)' },
  '& .od-note-media': {
    overflow: 'hidden',
    clipPath: 'inset(0 0 0 0 round 0px)',
    transition: 'clip-path 800ms var(--od-ease)',
  },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover::before': { transform: 'scaleX(1)' },
    '&:hover .od-note-num': { color: 'var(--od-tuna)' },
    '&:hover .od-note-title': { transform: 'translateX(12px)' },
    '&:hover .od-note-cta': { opacity: 1, transform: 'none' },
    '&:hover .od-note-media': { clipPath: 'inset(3% 3% 3% 3% round 14px)' },
    '&:hover .od-note-media .od-img-zoom': { transform: 'scale(1.12)' },
  },
};

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function OdDivulgacion({ articles = [] }) {
  const rows = articles.slice(0, 6);
  const pages = chunk(rows, 3);
  const [page, setPage] = useState(0);

  if (!rows.length) return null;

  const current = pages[page] ?? [];

  return (
    <Box component="section" id="divulgacion" sx={{ position: 'relative', bgcolor: 'var(--od-crema-lino)', px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: '40px', md: '60px' }, pb: { xs: '80px', md: '120px' } }}>
      <Display size="clamp(34px, 11.4vw, 176px)" weight={400} sx={{ lineHeight: 1, letterSpacing: '-0.015em', textTransform: 'uppercase', mb: 1.5, ...titleSx }}>
        <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {TITLE}
        </Box>
        <Box component="span" aria-hidden>
          {[...TITLE].map((ch, i) => (
            <Box
              key={i}
              component="span"
              className="od-letter"
              sx={{
                transitionDelay: `${i * 35}ms`,
                animationRange: `entry ${i * 3}% entry ${45 + i * 3}%`,
              }}
            >
              {ch}
            </Box>
          ))}
        </Box>
      </Display>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3.75, flexWrap: 'wrap', mb: { xs: 5, md: 7 } }}>
        <Box sx={{ fontSize: 15, lineHeight: 1.75, maxWidth: '52ch', color: 'var(--color-neutral-700)' }}>
          Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
          manteniendo colonias, escrito para que no repitas nuestros errores.
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {pages.length > 1 && (
            <Box sx={{ display: 'flex', gap: { xs: 0, md: 1 } }}>
              {pages.map((_, i) => (
                // El punto sigue midiendo 9px, pero el boton que lo contiene
                // llega a 44x44 en movil: con el dedo, un blanco de 9px se
                // falla casi siempre. Nada de margenes negativos para
                // recuperar el espacio: encimarian las areas tactiles y el
                // toque se lo llevaria el punto de al lado.
                <Box
                  key={i}
                  component="button"
                  type="button"
                  aria-label={`Grupo ${i + 1}`}
                  onClick={() => setPage(i)}
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: { xs: 44, md: 9 },
                    height: { xs: 44, md: 9 },
                    p: 0,
                    border: 0,
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    '&::before': {
                      content: '""',
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      border: '1px solid var(--color-neutral-500)',
                      bgcolor: i === page ? 'var(--color-accent)' : 'transparent',
                      transition: 'background 300ms',
                    },
                  }}
                />
              ))}
            </Box>
          )}
          <Pill href={paths.articles}>Ver todos</Pill>
        </Box>
      </Box>

      <Box
        key={page}
        sx={{
          borderBottom: '1px solid var(--color-divider)',
          // la nota bajo el cursor se queda al frente
          '@media (hover: hover) and (pointer: fine)': {
            // en el enlace y no en .od-note: el odWipe (fill both) fija la opacidad de .od-note
            '& .od-note > a': { transition: 'opacity 450ms ease' },
            '&:has(.od-note:hover) .od-note:not(:hover) > a': { opacity: 0.45 },
          },
        }}
      >
        {current.map((article, i) => (
          <Box key={article.id} className="od-wipe od-note" sx={{ animation: `odWipe 1000ms var(--od-ease) ${i * 0.38}s both` }}>
            <Link
              component={RouterLink}
              href={paths.article(articleSlug(article))}
              underline="none"
              sx={{
                display: 'grid',
                gap: { xs: 2, md: '40px' },
                alignItems: 'start',
                pt: '34px',
                borderTop: '1px solid var(--color-divider)',
                color: 'inherit',
                textDecoration: 'none',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 1.5fr) minmax(280px, 2fr)' },
                ...rowSx,
              }}
            >
              <Box sx={{ pb: { md: '34px' } }}>
                <Kicker sx={{ mb: 1.5 }}>
                  {article.category || 'Nota de cría'}
                </Kicker>
                <Box component="h3" className="od-note-title" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(22px, 2.1vw, 30px)', lineHeight: 1.2, maxWidth: '22ch', textWrap: 'pretty' }}>
                  {article.title}
                </Box>
                {article.excerpt && (
                  <Box sx={{ mt: 2, fontSize: 15, lineHeight: 1.75, maxWidth: '38ch', color: 'var(--color-neutral-700)' }}>
                    {article.excerpt}
                  </Box>
                )}
                <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 2.5, fontSize: 13 }}>
                  {article.reading_minutes != null && (
                    <Box component="span" sx={{ color: 'var(--color-neutral-600)' }}>{article.reading_minutes} min de lectura</Box>
                  )}
                  <Box component="span" aria-hidden className="od-note-cta" sx={{ display: { xs: 'none', md: 'inline' }, fontSize: 13, color: 'var(--od-tuna)' }}>
                    Leer nota →
                  </Box>
                </Box>
              </Box>
              <Box className="od-note-media" sx={{ mb: { md: '34px' } }}>
                <OdImage src={article.cover_image} alt={article.title} label={article.title} ratio="16 / 10" radius={0} />
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
