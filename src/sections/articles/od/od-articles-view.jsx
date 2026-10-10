'use client';

import Box from '@mui/material/Box';

import { OdReveal } from 'src/layouts/od/od-motion';
import { Kicker, Display } from 'src/layouts/od/od-ui';
import { OdGutterNote } from 'src/layouts/od/od-gutter-note';
import { BrandSeal, HeadingMark } from 'src/layouts/od/od-ornaments';

import { OdArticleCard } from './od-article-card';

// ----------------------------------------------------------------------
// Lista de divulgación editorial: cabecera + rejilla de tarjetas de artículo.
// ----------------------------------------------------------------------

export function OdArticlesView({ articles = [] }) {
  return (
    <Box component="section" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <OdGutterNote n={String(articles.length).padStart(2, '0')} label="Notas publicadas" start={320} />
      <BrandSeal size={132} sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: { md: 40 }, right: 'var(--od-gutter)' }} />
      <Box className="od-rise" sx={{ position: 'relative' }}>
        <Kicker sx={{ mb: 2.5 }}>Notas de cría</Kicker>
        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02 }}>
          Divulgación
        </Display>
        <HeadingMark sx={{ mt: '22px' }} />
        <Box sx={{ mt: 2.5, mb: { xs: 5, md: 7 }, maxWidth: '52ch', fontSize: 15, lineHeight: 1.6, opacity: 0.8 }}>
          Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
          manteniendo colonias, escrito para que no repitas nuestros errores.
        </Box>
      </Box>

      {articles.length === 0 ? (
        <Box sx={{ py: 12, textAlign: 'center', color: 'var(--color-neutral-500)' }}>
          Aún no hay artículos publicados.
        </Box>
      ) : (
        <>
          {/* El más reciente abre en grande: con pocas notas la rejilla de
              columnas fijas dejaba media pantalla vacía. */}
          <OdReveal>
            <OdArticleCard article={articles[0]} featured />
          </OdReveal>
          {articles.length > 1 && (
            <Box
              sx={{
                mt: { xs: 7, md: 10 },
                pt: { xs: 5, md: 7 },
                borderTop: '1px solid var(--color-divider)',
                display: 'grid',
                gap: '44px 28px',
                // auto-fit (no auto-fill): las tarjetas que haya se estiran a
                // todo el ancho en vez de dejar columnas vacías
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(260px, 1fr))' },
                '@media (min-width: 900px)': { gridTemplateColumns: `repeat(${Math.min(Math.max(articles.length - 1, 2), 4)}, minmax(0, 1fr))` },
              }}
            >
              {articles.slice(1).map((article, i) => (
                <OdReveal key={article.id} delay={Math.min(i, 8) * 0.06}>
                  {/* con 2-3 columnas anchas una portada 4/5 mide casi una
                      pantalla de alto; ahí se usa horizontal */}
                  <OdArticleCard article={article} ratio={articles.length - 1 <= 3 ? '3 / 2' : '4 / 5'} />
                </OdReveal>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
