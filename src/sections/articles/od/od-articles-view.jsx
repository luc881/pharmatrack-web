'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { OdReveal } from 'src/layouts/od/od-motion';
import { Kicker, Display } from 'src/layouts/od/od-ui';
import { OdGutterNote } from 'src/layouts/od/od-gutter-note';
import { BrandSeal, HeadingMark } from 'src/layouts/od/od-ornaments';

import { OdArticleCard } from './od-article-card';

// ----------------------------------------------------------------------
// Lista de divulgación editorial: cabecera, acceso a las fichas de cuidados,
// buscador + categorías, y rejilla de tarjetas de artículo.
// ----------------------------------------------------------------------

const LABEL = {
  fontWeight: 500,
  fontSize: 'var(--od-text-xs)',
  letterSpacing: 'var(--od-tracking-label)',
  textTransform: 'uppercase',
};

const focusSx = {
  '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' },
};

const fold = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

function Chip({ active, onClick, children }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={active}
      sx={{
        ...focusSx,
        ...LABEL,
        cursor: 'pointer',
        px: 1.75,
        py: 1,
        border: '1px solid',
        borderColor: active ? 'var(--od-tinta)' : 'var(--od-linea)',
        borderRadius: 'var(--od-radius-sm)',
        bgcolor: active ? 'var(--od-tinta)' : 'transparent',
        color: active ? 'var(--od-papel)' : 'var(--od-text)',
      }}
    >
      {children}
    </Box>
  );
}

function Grid({ items, ratio }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: '44px 28px',
        // auto-fit (no auto-fill): las tarjetas que haya se estiran a
        // todo el ancho en vez de dejar columnas vacías
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(260px, 1fr))' },
        '@media (min-width: 900px)': {
          gridTemplateColumns: `repeat(${Math.min(Math.max(items.length, 2), 4)}, minmax(0, 1fr))`,
        },
      }}
    >
      {items.map((article, i) => (
        <OdReveal key={article.id} delay={Math.min(i, 8) * 0.06}>
          <OdArticleCard article={article} ratio={ratio} />
        </OdReveal>
      ))}
    </Box>
  );
}

export function OdArticlesView({ articles = [] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(null);
  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'es')
  );
  const needle = fold(q.trim());
  const filtering = Boolean(needle || cat);
  const shown = articles.filter(
    (a) =>
      (!cat || a.category === cat) &&
      (!needle ||
        fold([a.title, a.excerpt, a.category, ...(a.tags ?? [])].join(' ')).includes(needle))
  );

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        px: { xs: '18px', md: 'var(--od-gutter)' },
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <OdGutterNote
        n={String(articles.length).padStart(2, '0')}
        label="Notas publicadas"
        start={320}
      />
      <BrandSeal
        size={132}
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: { md: 40 },
          right: 'var(--od-gutter)',
        }}
      />
      <Box className="od-rise" sx={{ position: 'relative' }}>
        <Kicker sx={{ mb: 2.5 }}>Notas de cría</Kicker>
        <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02 }}>
          Divulgación
        </Display>
        <HeadingMark sx={{ mt: '22px' }} />
        <Box
          sx={{
            mt: 2.5,
            mb: { xs: 5, md: 7 },
            maxWidth: '52ch',
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.8,
          }}
        >
          Notas de cría y montaje de terrarios bioactivos. Lo que aprendimos manteniendo colonias,
          escrito para que no repitas nuestros errores.
        </Box>
      </Box>

      {/* Las fichas por especie viven aparte (/fichas) */}
      <Box
        component={RouterLink}
        href="/fichas/"
        className="od-card"
        sx={{
          ...focusSx,
          mb: { xs: 4, md: 5 },
          px: { xs: 2.5, md: 3.5 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: 'var(--od-text)',
          textDecoration: 'none',
          transition: 'transform 200ms ease',
          '@media (hover: hover)': { '&:hover': { transform: 'translate(-2px, -2px)' } },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ ...LABEL, color: 'var(--od-text-muted)' }}>¿Buscas una especie?</Box>
          <Box sx={{ mt: 0.5, fontFamily: 'var(--od-font-display)', fontSize: { xs: 22, md: 26 } }}>
            Fichas de cuidados por especie
          </Box>
        </Box>
        <Box component="span" aria-hidden sx={{ fontSize: 22 }}>
          →
        </Box>
      </Box>

      {articles.length > 0 && (
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Box
            component="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar en los artículos…"
            aria-label="Buscar artículos"
            sx={{
              ...focusSx,
              flex: '1 1 240px',
              minHeight: 44,
              px: 2,
              font: 'inherit',
              fontSize: 16,
              color: 'var(--od-text)',
              bgcolor: 'var(--od-papel)',
              border: '1px solid var(--od-linea)',
              borderRadius: 'var(--od-radius-sm)',
              '&::placeholder': { color: 'var(--od-text-muted)', opacity: 1 },
            }}
          />
          {categories.length > 1 && (
            <Box
              role="group"
              aria-label="Categoría"
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
            >
              <Chip active={!cat} onClick={() => setCat(null)}>
                Todas
              </Chip>
              {categories.map((c) => (
                <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                  {c}
                </Chip>
              ))}
            </Box>
          )}
        </Box>
      )}

      {articles.length === 0 ? (
        <Box sx={{ py: 12, textAlign: 'center', color: 'var(--color-neutral-500)' }}>
          Aún no hay artículos publicados.
        </Box>
      ) : filtering ? (
        // con búsqueda o categoría: rejilla simple con lo que coincide
        shown.length ? (
          <Grid items={shown} ratio="3 / 2" />
        ) : (
          <Box sx={{ py: 8, color: 'var(--od-text-muted)' }}>
            No hay artículos con esa búsqueda.
          </Box>
        )
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
                '@media (min-width: 900px)': {
                  gridTemplateColumns: `repeat(${Math.min(Math.max(articles.length - 1, 2), 4)}, minmax(0, 1fr))`,
                },
              }}
            >
              {articles.slice(1).map((article, i) => (
                <OdReveal key={article.id} delay={Math.min(i, 8) * 0.06}>
                  {/* con 2-3 columnas anchas una portada 4/5 mide casi una
                      pantalla de alto; ahí se usa horizontal */}
                  <OdArticleCard
                    article={article}
                    ratio={articles.length - 1 <= 3 ? '3 / 2' : '4 / 5'}
                  />
                </OdReveal>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
