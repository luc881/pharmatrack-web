'use client';

import { useId, useState } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { cdnImage } from 'src/lib/cdn-image';
import { Pill, OdImage, Display } from 'src/layouts/od/od-ui';

import { articleSlug } from 'src/sections/articles/utils';

// ----------------------------------------------------------------------
// Divulgación como filas que se abren (estilo Reelio). Cerrada, cada nota
// muestra su categoría, su título y una tira delgada de la portada; con un
// clic se abre: la portada completa, la fecha, el resumen, sus etiquetas y
// «Leer nota →». La primera viene abierta para que se entienda el gesto. La
// nota entera vive en su página (enlace propio para compartir y buscadores);
// aquí solo se asoma.
// ----------------------------------------------------------------------

const TITLE = 'Divulgación';

const titleSx = {
  '& .od-letter': { display: 'inline-block' },
  '@supports (animation-timeline: view())': {
    '& .od-letter': { animation: 'odRise linear both', animationTimeline: 'view()' },
  },
};

const sans = { fontFamily: 'var(--od-font-body)', fontWeight: 600, letterSpacing: '-0.03em' };
const label = { fontSize: 13, color: 'var(--color-neutral-600)' };

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '') : '';

// el API manda las etiquetas como lista o como texto "['a', 'b']"
const etiquetas = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') return [...tags.matchAll(/'([^']+)'|"([^"]+)"/g)].map((m) => m[1] ?? m[2]);
  return [];
};

function Nota({ article, open, onToggle }) {
  const id = useId();
  const href = paths.article(articleSlug(article));
  const tags = etiquetas(article.tags);

  return (
    <Box
      component="article"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1.25fr 1fr' },
        columnGap: { md: '48px' },
        rowGap: 2,
        py: { xs: 3, md: 4.5 },
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      {/* izquierda: categoría y título (abren y cierran); etiquetas abajo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          component="button"
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          sx={{ p: 0, border: 0, bgcolor: 'transparent', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
        >
          <Box sx={label}>{article.category || 'Nota de cría'}</Box>
          <Box component="h3" sx={{ ...sans, m: 0, mt: 0.75, fontSize: 'clamp(26px, 2.6vw, 40px)', lineHeight: 1.08, textWrap: 'balance' }}>
            {article.title}
          </Box>
        </Box>
        {tags.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 3, display: { xs: 'none', md: open ? 'flex' : 'none' }, flexWrap: 'wrap', gap: 1 }}>
            {tags.map((t) => (
              <Box key={t} component="span" sx={{ px: 1.25, py: 0.5, fontSize: 13, borderRadius: '2px', bgcolor: 'var(--color-neutral-200)' }}>
                {t}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* centro: la portada; cerrada es una tira delgada */}
      <Box
        onClick={onToggle}
        className="od-grain"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          cursor: 'pointer',
          bgcolor: 'var(--color-neutral-200)',
          height: open ? { xs: 'auto', md: 'clamp(280px, 26vw, 460px)' } : { xs: 72, md: 88 },
          aspectRatio: open ? { xs: '16 / 10', md: 'auto' } : 'auto',
          transition: 'height 650ms var(--od-ease)',
        }}
      >
        {article.cover_image ? (
          <Box component="img" src={cdnImage(article.cover_image, 1200)} alt={article.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} />
        ) : (
          <OdImage label={article.title} radius={0} sx={{ position: 'absolute', inset: 0, aspectRatio: 'auto' }} />
        )}
      </Box>

      {/* derecha: fecha y abrir/cerrar; al abrir, el resumen y el enlace */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Box sx={label}>Publicada</Box>
            <Box sx={{ ...sans, mt: 0.75, fontSize: 'clamp(22px, 2vw, 32px)', lineHeight: 1.1 }}>{fecha(article.published_at)}</Box>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={id}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, p: 0, border: 0, bgcolor: 'transparent', color: 'inherit', font: 'inherit', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {open ? 'Cerrar' : 'Abrir'}
            <Box component="span" aria-hidden sx={{ fontSize: 18, lineHeight: 1 }}>
              {open ? '−' : '+'}
            </Box>
          </Box>
        </Box>

        {/* se abre a su alto real animando grid-template-rows (0fr → 1fr) */}
        <Box id={id} sx={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 650ms var(--od-ease)' }}>
          <Box sx={{ overflow: 'hidden' }} inert={!open}>
            {article.excerpt && (
              <Box component="p" sx={{ m: 0, mt: 3, fontSize: 16, lineHeight: 1.65, maxWidth: '46ch', color: 'var(--color-neutral-700)' }}>
                {article.excerpt}
              </Box>
            )}
            <Box sx={{ mt: 1.5, ...label }}>
              {article.reading_minutes != null && `${article.reading_minutes} min de lectura`}
              {article.author_name && ` · ${article.author_name}`}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Pill href={href}>Leer nota →</Pill>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function OdDivulgacion({ articles = [] }) {
  const rows = articles.slice(0, 5);
  const [open, setOpen] = useState(rows[0]?.id ?? null);

  if (!rows.length) return null;

  return (
    <Box component="section" id="divulgacion" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: '40px', md: '60px' }, pb: { xs: '80px', md: '120px' } }}>
      <Display size="clamp(34px, 11.4vw, 176px)" weight={400} sx={{ lineHeight: 1, letterSpacing: '-0.015em', textTransform: 'uppercase', mb: 1.5, ...titleSx }}>
        <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {TITLE}
        </Box>
        <Box component="span" aria-hidden>
          {[...TITLE].map((ch, i) => (
            <Box key={i} component="span" className="od-letter" sx={{ animationRange: `entry ${i * 3}% entry ${45 + i * 3}%` }}>
              {ch}
            </Box>
          ))}
        </Box>
      </Display>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3.75, flexWrap: 'wrap', mb: { xs: 4, md: 6 } }}>
        <Box sx={{ fontSize: 15, lineHeight: 1.75, maxWidth: '52ch', color: 'var(--color-neutral-700)' }}>
          Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
          manteniendo colonias, escrito para que no repitas nuestros errores.
        </Box>
        <Pill href={paths.articles}>Ver todas las notas</Pill>
      </Box>

      <Box sx={{ borderBottom: '1px solid var(--color-divider)' }}>
        {rows.map((article) => (
          <Nota key={article.id} article={article} open={open === article.id} onToggle={() => setOpen((cur) => (cur === article.id ? null : article.id))} />
        ))}
      </Box>
    </Box>
  );
}
