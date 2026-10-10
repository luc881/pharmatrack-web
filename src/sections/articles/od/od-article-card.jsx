'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Kicker, OdImage } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

import { articleSlug } from '../utils';

// ----------------------------------------------------------------------
// Tarjeta editorial de artículo (lista y "sigue leyendo"). Portada 4/5, código
// + categoría, título serif y minutos de lectura. `featured` la pone en dos
// columnas (portada 16/10 + texto con extracto) para abrir la lista.
// Hover: la portada se inclina con brillo y el título se subraya.
// ----------------------------------------------------------------------

export function OdArticleCard({ article, featured = false, ratio = '4 / 5' }) {
  return (
    <Box
      component={RouterLink}
      href={paths.article(articleSlug(article))}
      data-fx
      sx={{
        color: 'inherit',
        textDecoration: 'none',
        display: featured ? 'grid' : 'block',
        gap: featured ? { xs: 3, md: '56px' } : 0,
        alignItems: 'center',
        gridTemplateColumns: featured ? { xs: '1fr', md: 'minmax(0, 1.35fr) minmax(0, 1fr)' } : undefined,
        // título: subrayado que se dibuja de izquierda a derecha
        '& .od-art-title span': {
          backgroundImage: 'linear-gradient(currentColor, currentColor)',
          backgroundSize: '0% 1px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 100%',
          transition: 'background-size 600ms var(--od-ease)',
        },
        '&:hover .od-art-title span': { backgroundSize: '100% 1px' },
        '&:hover .od-art-more': { color: 'var(--od-tuna)' },
        '&:hover .od-art-more svg': { transform: 'translateX(6px)' },
      }}
    >
      {/* portada: se inclina hacia el cursor con un brillo encima */}
      <Box className="od-tilt-lg od-glare" data-fx sx={{ position: 'relative', overflow: 'hidden' }}>
        <OdImage src={article.cover_image} alt={article.title} label={article.title} ratio={featured ? '16 / 10' : ratio} radius={0} />
      </Box>

      <Box>
        <Kicker sx={{ mt: featured ? 0 : '16px', mb: featured ? '14px' : '6px', fontSize: 11, letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums' }}>
          {featured ? 'Lo más reciente · ' : ''}ART-{String(article.id).padStart(3, '0')}
          {article.category ? ` · ${article.category}` : ''}
        </Kicker>

        <Box
          component="h3"
          className="od-art-title"
          sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: featured ? 400 : 500, fontSize: featured ? 'clamp(30px, 3vw, 46px)' : 21, lineHeight: featured ? 1.12 : 1.24, maxWidth: featured ? '20ch' : '24ch' }}
        >
          <span>{article.title}</span>
        </Box>

        {featured && article.excerpt && (
          <Box sx={{ mt: 2.5, fontSize: 16, lineHeight: 1.75, maxWidth: '46ch', color: 'var(--color-neutral-700)' }}>{article.excerpt}</Box>
        )}

        <Box sx={{ mt: featured ? 3 : '8px', display: 'flex', alignItems: 'center', gap: 2, fontSize: 13, color: 'var(--color-neutral-600)' }}>
          {article.reading_minutes != null && <span>{article.reading_minutes} min de lectura</span>}
          <Box component="span" className="od-art-more" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-neutral-900)', transition: 'color 300ms', '& svg': { transition: 'transform 400ms var(--od-ease)' } }}>
            Leer
            <Iconify icon="eva:arrow-forward-fill" width={14} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
