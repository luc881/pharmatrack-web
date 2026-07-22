'use client';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { MONO_FONT, TAXON_COLOR, TaxonomyBadge } from 'src/sections/catalog/scientific';

import { ArticleCard } from './article-card';
import { fArticleDate, parseArticleBody } from './utils';

// ----------------------------------------------------------------------
// Detalle de artículo con la estructura de phasmaMX adaptada al tema claro:
// hero con portada + categoría mono, cuerpo por secciones, tags y sidebar
// pegajoso con autor, metadatos y relacionados.
// ----------------------------------------------------------------------

const mono = {
  fontFamily: MONO_FONT,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
};

function Panel({ title, children }) {
  return (
    <Box sx={(theme) => ({ borderRadius: 2, border: `solid 1px ${theme.vars.palette.divider}` })}>
      <Box component="span" sx={{ ...mono, px: 2.5, pt: 2, display: 'block', color: 'text.disabled' }}>
        {title}
      </Box>
      {children}
    </Box>
  );
}

function BodySection({ section }) {
  if (section.type === 'subheading') {
    return (
      <Typography
        variant="h4"
        sx={{ pt: 3, pb: 1.5, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
      >
        {section.content}
      </Typography>
    );
  }
  if (section.type === 'quote') {
    return (
      <Typography
        variant="h5"
        component="blockquote"
        sx={{
          my: 2,
          py: 1,
          pl: 3,
          fontStyle: 'italic',
          fontWeight: 400,
          borderLeft: (theme) => `solid 2px ${theme.vars.palette.primary.dark}`,
        }}
      >
        {section.content}
      </Typography>
    );
  }
  if (section.type === 'image') {
    return (
      <Box component="figure" sx={{ my: 2, mx: 0 }}>
        <Image alt={section.caption || ''} src={section.src} ratio="16/9" sx={{ borderRadius: 2 }} />
        {section.caption && (
          <Typography
            component="figcaption"
            sx={{ ...mono, mt: 1, fontWeight: 400, fontStyle: 'italic', color: 'text.disabled' }}
          >
            {section.caption}
          </Typography>
        )}
      </Box>
    );
  }
  return (
    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.8 }}>
      {section.content}
    </Typography>
  );
}

export function ArticleDetailView({ article, related = [] }) {
  const sections = parseArticleBody(article.body);
  const initials = (article.author_name ?? '')
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* ── Hero con portada ── */}
      <Box
        component="section"
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 320, md: 480 },
          bgcolor: theme.vars.palette.grey[900],
          color: 'common.white',
        })}
      >
        {article.cover_image && (
          <Image
            alt={article.title}
            src={article.cover_image}
            sx={{ position: 'absolute', inset: 0, width: 1, height: 1 }}
          />
        )}
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to top, ${theme.vars.palette.grey[900]} 0%, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.5)} 55%, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.15)} 100%)`,
          })}
        />

        <Container sx={{ position: 'relative', zIndex: 1, pt: { xs: 12, md: 16 }, pb: { xs: 4, md: 6 } }}>
          <Link
            component={RouterLink}
            href={paths.articles}
            sx={{ ...mono, gap: 1, mb: 3, display: 'inline-flex', alignItems: 'center', color: 'common.white', opacity: 0.72, '&:hover': { opacity: 1 } }}
            underline="none"
          >
            <Iconify icon="eva:arrow-ios-back-fill" width={14} />
            Artículos
          </Link>

          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
            {article.category && (
              <Box component="span" sx={{ ...mono, color: 'primary.light' }}>
                {article.category}
              </Box>
            )}
            <Box component="span" sx={{ ...mono, fontWeight: 400, opacity: 0.64 }}>
              {article.reading_minutes} min de lectura
            </Box>
          </Box>

          <Typography variant="h2" component="h1" sx={{ maxWidth: 720 }}>
            {article.title}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* ── Cuerpo ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            {article.excerpt && (
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400, color: 'text.primary' }}>
                {article.excerpt}
              </Typography>
            )}

            <Stack spacing={2.5}>
              {sections.map((section, index) => (
                <BodySection key={index} section={section} />
              ))}
            </Stack>

            {(article.tags ?? []).length > 0 && (
              <>
                <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
                <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Iconify icon="solar:tag-bold" width={16} sx={{ color: 'text.disabled' }} />
                  {article.tags.map((tag) => (
                    <TaxonomyBadge key={tag}>{tag}</TaxonomyBadge>
                  ))}
                </Box>
              </>
            )}
          </Grid>

          {/* ── Sidebar ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
              {article.author_name && (
                <Panel title="Autor">
                  <Box sx={{ px: 2.5, py: 2, gap: 2, display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={(theme) => ({
                        width: 44,
                        height: 44,
                        display: 'flex',
                        flexShrink: 0,
                        borderRadius: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: MONO_FONT,
                        fontWeight: 700,
                        color: theme.vars.palette.primary.contrastText,
                        bgcolor: theme.vars.palette.primary.dark,
                      })}
                    >
                      {initials}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">{article.author_name}</Typography>
                      {article.author_role && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {article.author_role}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Panel>
              )}

              <Panel title="Ficha">
                <Stack divider={<Divider />} sx={{ pt: 1, pb: 0.5 }}>
                  {article.category && (
                    <Box sx={{ px: 2.5, py: 1.25, display: 'flex', justifyContent: 'space-between' }}>
                      <Box component="span" sx={{ ...mono, fontWeight: 400, color: 'text.disabled' }}>
                        Categoría
                      </Box>
                      <Typography component="span" variant="subtitle2" sx={{ color: TAXON_COLOR }}>
                        {article.category}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ px: 2.5, py: 1.25, display: 'flex', justifyContent: 'space-between' }}>
                    <Box component="span" sx={{ ...mono, fontWeight: 400, color: 'text.disabled' }}>
                      Publicado
                    </Box>
                    <Typography component="span" variant="subtitle2">
                      {fArticleDate(article.published_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 2.5, py: 1.25, display: 'flex', justifyContent: 'space-between' }}>
                    <Box component="span" sx={{ ...mono, fontWeight: 400, color: 'text.disabled' }}>
                      Lectura
                    </Box>
                    <Typography component="span" variant="subtitle2">
                      {article.reading_minutes} min
                    </Typography>
                  </Box>
                </Stack>
              </Panel>
            </Stack>
          </Grid>
        </Grid>

        {/* ── Relacionados ── */}
        {related.length > 0 && (
          <Box component="section" sx={{ mt: { xs: 6, md: 10 } }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Sigue leyendo
            </Typography>
            <Box
              sx={{
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              }}
            >
              {related.map((item, index) => (
                <ArticleCard key={item.id} article={item} index={index} />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
