'use client';

import Box from '@mui/material/Box';

import { OdReveal } from 'src/layouts/od/od-motion';
import { OdImage, Display } from 'src/layouts/od/od-ui';

import { OdArticleCard } from './od-article-card';
import { fArticleDate, parseArticleBody } from '../utils';

// ----------------------------------------------------------------------
// Detalle de artículo editorial: encabezado centrado, portada 16/9, índice
// pegajoso a partir de los subtítulos, cuerpo con medida de lectura y cierre
// con "Sigue leyendo". Reutiliza parseArticleBody del dashboard.
// ----------------------------------------------------------------------

const pad2 = (n) => String(n).padStart(2, '0');

const paraSx = { m: 0, mb: '18px', fontSize: 17, lineHeight: 1.8 };

function BodySection({ section, id }) {
  if (section.type === 'subheading') {
    return (
      <Box
        component="h2"
        id={id}
        sx={{ m: '46px 0 16px', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 30, scrollMarginTop: '130px' }}
      >
        {section.content}
      </Box>
    );
  }
  if (section.type === 'quote') {
    return (
      <Box
        component="blockquote"
        sx={{
          m: '34px 0',
          pl: '26px',
          borderLeft: '1px solid var(--color-accent)',
          fontFamily: 'var(--font-heading)',
          fontSize: 25,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}
      >
        {section.content}
      </Box>
    );
  }
  if (section.type === 'image') {
    return (
      <Box component="figure" sx={{ m: '30px 0' }}>
        <OdImage src={section.src} alt={section.caption || ''} label={section.caption || ''} ratio="16 / 9" />
        {section.caption && (
          <Box component="figcaption" sx={{ mt: 1, fontSize: 12, fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>
            {section.caption}
          </Box>
        )}
      </Box>
    );
  }
  return <Box component="p" sx={paraSx}>{section.content}</Box>;
}

export function OdArticleDetailView({ article, related = [] }) {
  const sections = parseArticleBody(article.body);

  // Índice a partir de los subtítulos (## en el cuerpo)
  const toc = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type === 'subheading');

  const metaBits = ['Opuntia Den', fArticleDate(article.published_at), article.reading_minutes != null ? `${article.reading_minutes} min` : null].filter(Boolean);

  return (
    <article>
      {/* Encabezado centrado */}
      <Box component="section" className="od-rise" sx={{ maxWidth: 900, mx: 'auto', px: { xs: '18px', md: '40px' }, pt: { xs: 5, md: 8 }, pb: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2.5, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-accent-700)', fontVariantNumeric: 'tabular-nums' }}>
          ART-{String(article.id).padStart(3, '0')}
          {article.category ? ` · ${article.category}` : ''}
        </Box>
        <Display component="h1" size="clamp(36px, 5vw, 68px)" sx={{ lineHeight: 1.04 }}>
          {article.title}
        </Display>
        {article.excerpt && (
          <Box sx={{ mt: '26px', mx: 'auto', maxWidth: '54ch', fontSize: 17, lineHeight: 1.7, opacity: 0.78 }}>
            {article.excerpt}
          </Box>
        )}
        <Box sx={{ mt: '28px', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>
          {metaBits.join(' · ')}
        </Box>
      </Box>

      {/* Portada */}
      {article.cover_image && (
        <Box sx={{ px: { xs: '18px', md: '40px' } }}>
          <OdReveal sx={{ maxWidth: 1180, mx: 'auto' }}>
            <OdImage src={article.cover_image} alt={article.title} ratio="16 / 9" />
          </OdReveal>
        </Box>
      )}

      {/* Índice + cuerpo */}
      <Box
        component="section"
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: '18px', md: '40px' },
          pt: { xs: 6, md: '66px' },
          pb: 4,
          display: 'grid',
          gap: { xs: 4, md: '56px' },
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: '200px minmax(0, 1fr)' },
        }}
      >
        {toc.length > 1 && (
          <Box
            component="aside"
            sx={{
              position: { md: 'sticky' },
              top: { md: 130 },
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-600)',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Box sx={{ mb: 1.75, color: 'var(--color-text)' }}>Contenido</Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {toc.map(({ section, index }, i) => (
                <Box
                  key={index}
                  component="a"
                  href={`#sec-${index}`}
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}
                >
                  {pad2(i + 1)} {section.content}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <OdReveal sx={{ maxWidth: '68ch' }}>
          {sections.map((section, index) => (
            <BodySection key={index} section={section} id={section.type === 'subheading' ? `sec-${index}` : undefined} />
          ))}

          {(article.tags ?? []).length > 0 && (
            <Box sx={{ mt: '40px', pt: '24px', borderTop: '1px solid var(--color-divider)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {article.tags.map((tag) => (
                <Box key={tag} sx={{ px: '14px', py: '5px', borderRadius: '999px', fontSize: 13, bgcolor: 'var(--color-neutral-200)' }}>
                  {tag}
                </Box>
              ))}
            </Box>
          )}
        </OdReveal>
      </Box>

      {/* Sigue leyendo */}
      {related.length > 0 && (
        <Box
          component="section"
          sx={{ maxWidth: 1180, mx: 'auto', mt: { xs: 4, md: 5 }, px: { xs: '18px', md: '40px' }, pt: { xs: 7, md: '70px' }, pb: { xs: 8, md: 12 }, borderTop: '1px solid var(--color-divider)' }}
        >
          <Display size="clamp(26px, 3vw, 40px)" weight={400} sx={{ pb: '22px', borderBottom: '1px solid var(--color-divider)' }}>
            Sigue leyendo
          </Display>
          <Box sx={{ pt: '34px', display: 'grid', gap: '28px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {related.map((item, i) => (
              <OdReveal key={item.id} delay={i * 0.08}>
                <OdArticleCard article={item} />
              </OdReveal>
            ))}
          </Box>
        </Box>
      )}
    </article>
  );
}
