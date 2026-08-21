'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Kicker, OdImage } from 'src/layouts/od/od-ui';

import { articleSlug } from '../utils';

// ----------------------------------------------------------------------
// Tarjeta editorial de artículo (lista y "sigue leyendo"). Portada 4/5, código
// + categoría en terracota, título serif y minutos de lectura.
// ----------------------------------------------------------------------

export function OdArticleCard({ article }) {
  return (
    <Box
      component={RouterLink}
      href={paths.article(articleSlug(article))}
      sx={{ color: 'inherit', textDecoration: 'none', display: 'block', '&:hover .od-img-zoom': { transform: 'scale(1.06)' } }}
    >
      <OdImage src={article.cover_image} alt={article.title} label={article.title} ratio="4 / 5" />

      <Kicker sx={{ mt: '16px', mb: '6px', fontSize: 11, letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums' }}>
        ART-{String(article.id).padStart(3, '0')}
        {article.category ? ` · ${article.category}` : ''}
      </Kicker>

      <Box
        component="h3"
        sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 21, lineHeight: 1.24, maxWidth: '24ch' }}
      >
        {article.title}
      </Box>

      {article.reading_minutes != null && (
        <Box sx={{ mt: '8px', fontSize: 13, color: 'var(--color-neutral-600)' }}>
          {article.reading_minutes} min
        </Box>
      )}
    </Box>
  );
}
