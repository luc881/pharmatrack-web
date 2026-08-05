'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Pill, Kicker, OdImage, Display } from 'src/layouts/od/od-ui';

import { articleSlug } from 'src/sections/articles/utils';

// ----------------------------------------------------------------------
// Divulgación editorial en filas (Nota · 0N). Rota automáticamente entre grupos
// de 3 cada 8 s (pausa al pasar el cursor); cada grupo entra con odWipe en
// cascada. Respeta prefers-reduced-motion.
// ----------------------------------------------------------------------

const PAGE_MS = 8000;

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function OdDivulgacion({ articles = [] }) {
  const rows = articles.slice(0, 6);
  const pages = chunk(rows, 3);
  const [page, setPage] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (pages.length < 2 || hold) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), PAGE_MS);
    return () => clearInterval(id);
  }, [pages.length, hold]);

  if (!rows.length) return null;

  const current = pages[page] ?? [];
  const base = page * 3;

  return (
    <Box component="section" id="divulgacion" sx={{ px: { xs: '18px', md: '32px' }, pt: { xs: '40px', md: '60px' }, pb: { xs: '80px', md: '120px' } }}>
      <Display size="clamp(48px, 11.4vw, 176px)" weight={400} sx={{ lineHeight: 1, letterSpacing: '-0.015em', textTransform: 'uppercase', mb: 1.5 }}>
        Divulgación
      </Display>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3.75, flexWrap: 'wrap', mb: { xs: 5, md: 7 } }}>
        <Box sx={{ fontSize: 15, lineHeight: 1.75, maxWidth: '52ch', color: 'var(--color-neutral-700)' }}>
          Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
          manteniendo colonias, escrito para que no repitas nuestros errores.
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {pages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {pages.map((_, i) => (
                <Box
                  key={i}
                  component="button"
                  type="button"
                  aria-label={`Grupo ${i + 1}`}
                  onClick={() => setPage(i)}
                  sx={{ width: 9, height: 9, p: 0, borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--color-neutral-500)', bgcolor: i === page ? 'var(--color-accent)' : 'transparent', transition: 'background 300ms' }}
                />
              ))}
            </Box>
          )}
          <Pill href={paths.articles}>Ver todos</Pill>
        </Box>
      </Box>

      <Box
        key={page}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        sx={{ borderBottom: '1px solid var(--color-divider)' }}
      >
        {current.map((article, i) => (
          <Box key={article.id} className="od-wipe" sx={{ animation: `odWipe 1000ms var(--od-ease) ${i * 0.38}s both` }}>
            <Link
              component={RouterLink}
              href={paths.article(articleSlug(article))}
              sx={{
                display: 'grid',
                gap: { xs: 2, md: '40px' },
                alignItems: 'start',
                pt: '34px',
                borderTop: '1px solid var(--color-divider)',
                color: 'inherit',
                textDecoration: 'none',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(90px, 0.5fr) minmax(240px, 1.5fr) minmax(280px, 2fr)' },
                transition: 'color 300ms',
                '&:hover': { color: 'var(--color-accent-700)' },
                '&:hover .od-img-zoom': { transform: 'scale(1.06)' },
              }}
            >
              <Box sx={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-600)', fontVariantNumeric: 'tabular-nums' }}>
                Nota · {String(base + i + 1).padStart(2, '0')}
              </Box>
              <Box sx={{ pb: { md: '34px' } }}>
                <Kicker sx={{ mb: 1.5, fontSize: 11, letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums' }}>
                  ART-{String(article.id).padStart(3, '0')}
                  {article.category ? ` · ${article.category}` : ''}
                </Kicker>
                <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(22px, 2.1vw, 30px)', lineHeight: 1.2, maxWidth: '22ch', textWrap: 'pretty' }}>
                  {article.title}
                </Box>
                {article.excerpt && (
                  <Box sx={{ mt: 2, fontSize: 15, lineHeight: 1.75, maxWidth: '38ch', color: 'var(--color-neutral-700)' }}>
                    {article.excerpt}
                  </Box>
                )}
                {article.reading_minutes != null && (
                  <Box sx={{ mt: 2.5, fontSize: 13, color: 'var(--color-neutral-600)' }}>{article.reading_minutes} min de lectura</Box>
                )}
              </Box>
              <Box sx={{ mb: { md: '34px' } }}>
                <OdImage src={article.cover_image} alt={article.title} label={article.title} ratio="16 / 10" radius={0} />
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
