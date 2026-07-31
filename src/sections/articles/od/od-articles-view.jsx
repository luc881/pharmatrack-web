'use client';

import Box from '@mui/material/Box';

import { OdReveal } from 'src/layouts/od/od-motion';
import { Kicker, Display } from 'src/layouts/od/od-ui';

import { OdArticleCard } from './od-article-card';

// ----------------------------------------------------------------------
// Lista de divulgación editorial: cabecera + rejilla de tarjetas de artículo.
// ----------------------------------------------------------------------

export function OdArticlesView({ articles = [] }) {
  return (
    <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <Box className="od-rise">
        <Kicker sx={{ mb: 2.5 }}>Divulgación</Kicker>
        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02 }}>
          Divulgación
        </Display>
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
        <Box sx={{ display: 'grid', gap: '44px 28px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {articles.map((article, i) => (
            <OdReveal key={article.id} delay={Math.min(i, 8) * 0.06}>
              <OdArticleCard article={article} />
            </OdReveal>
          ))}
        </Box>
      )}
    </Box>
  );
}
