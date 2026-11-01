'use client';

import { useId, useRef, useState, useEffect, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { cdnImage } from 'src/lib/cdn-image';
import { Pill, OdImage, Display } from 'src/layouts/od/od-ui';
import { gsap, SplitText, prefersReducedMotion } from 'src/layouts/od/od-gsap';

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

// Animación de abrir/cerrar con GSAP. Variantes (en prueba con ?anim-divulgacion):
//  reelio:   la portada crece primero y después el texto aparece en fade, escalonado
//  insumos:  como el hover de la tira de insumos: la foto llega chica sobre un
//            fondo desenfocado de sí misma y se expande hasta llenar
//  mascara:  la portada se abre como cortina desde el centro y el resumen sube
//            por renglones desde su máscara (SplitText)
const VARIANTES = [
  { id: 'reelio', nombre: 'Portada primero, texto en fade (Reelio)' },
  { id: 'insumos', nombre: 'Foto que se expande (como insumos)' },
  { id: 'mascara', nombre: 'Cortina y renglones con máscara' },
];
const VARIANTE_ELEGIDA = 'reelio';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useNotaMotion(open, variant, refs) {
  const first = useRef(true);
  // la variante va por ref: cambiarla no debe disparar una animación
  const v = useRef(variant);
  v.current = variant;
  const openH = useRef(0);

  useIsoLayoutEffect(() => {
    const media = refs.media.current;
    const panel = refs.panel.current;
    const root = refs.root.current;
    if (!media || !panel || !root) return undefined;
    // React ya pintó el estado nuevo (alturas por sx); GSAP anima desde el anterior
    if (open) openH.current = media.offsetHeight;
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (prefersReducedMotion()) return undefined;

    const closedH = window.matchMedia('(min-width: 900px)').matches ? 88 : 72;
    const reveals = root.querySelectorAll('[data-reveal]');
    const img = media.querySelector('[data-cover]');
    const blur = media.querySelector('[data-cover-blur]');
    let split;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
          gsap.set([media, panel, img, blur, ...reveals], { clearProps: 'all' });
          split?.revert();
        },
      });

      if (open) {
        tl.fromTo(media, { height: closedH }, { height: openH.current, duration: 0.9 }, 0);
        tl.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'power3.out' }, 0.35);

        if (v.current === 'insumos' && img) {
          tl.fromTo(blur, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.45);
          tl.fromTo(img, { scale: 0.62, boxShadow: '0 22px 44px rgba(0,0,0,0.4)' }, { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 1.1, ease: 'expo.out' }, 0.3);
        }
        if (v.current === 'mascara') {
          tl.fromTo(media, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0);
          const p = root.querySelector('[data-split]');
          if (p) {
            split = SplitText.create(p, { type: 'lines', mask: 'lines' });
            tl.from(split.lines, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.55);
          }
        }
        tl.fromTo(
          v.current === 'mascara' ? [...reveals].filter((el) => !el.hasAttribute('data-split')) : reveals,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
          0.6
        );
      } else {
        tl.fromTo(reveals, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, 0);
        tl.fromTo(panel, { height: panel.scrollHeight }, { height: 0, duration: 0.45, ease: 'power3.inOut' }, 0.1);
        tl.fromTo(media, { height: openH.current }, { height: closedH, duration: 0.7 }, 0.1);
      }
    }, root);

    return () => ctx.revert();
  }, [open]);
}

function Nota({ article, open, onToggle, variant }) {
  const id = useId();
  const refs = { root: useRef(null), media: useRef(null), panel: useRef(null) };
  useNotaMotion(open, variant, refs);
  const href = paths.article(articleSlug(article));
  const tags = etiquetas(article.tags);

  return (
    <Box
      ref={refs.root}
      component="article"
      // cerrada, toda la fila abre (no solo el texto del título: eso obligaba a un segundo clic)
      onClick={(e) => {
        if (!open && !e.target.closest('a, button')) onToggle();
      }}
      sx={{
        cursor: open ? 'auto' : 'pointer',
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
          <Box data-reveal sx={{ mt: 'auto', pt: 3, display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1, opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden' }}>
            {tags.map((t) => (
              <Box key={t} component="span" sx={{ px: 1.25, py: 0.5, fontSize: 13, borderRadius: '2px', bgcolor: 'var(--color-neutral-200)' }}>
                {t}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* centro: la portada; cerrada es una tira delgada, abierta lleva al post */}
      <Box
        ref={refs.media}
        component={open ? RouterLink : 'div'}
        href={open ? href : undefined}
        tabIndex={open ? -1 : undefined}
        aria-hidden={open ? true : undefined}
        className="od-grain"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          cursor: 'pointer',
          bgcolor: 'var(--color-neutral-200)',
          height: open ? { xs: 'auto', md: 'clamp(280px, 26vw, 460px)' } : { xs: 72, md: 88 },
          aspectRatio: open ? { xs: '16 / 10', md: 'auto' } : 'auto',
        }}
      >
        {article.cover_image ? (
          <>
            <Box data-cover-blur component="img" src={cdnImage(article.cover_image, 300)} alt="" aria-hidden loading="lazy" sx={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(22px) brightness(0.5)', opacity: 0 }} />
            <Box data-cover component="img" src={cdnImage(article.cover_image, 1200)} alt={article.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} />
          </>
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

        {/* el alto lo anima GSAP (useNotaMotion); el estado final lo fija sx */}
        <Box ref={refs.panel} id={id} inert={!open} sx={{ height: open ? 'auto' : 0, overflow: 'hidden' }}>
          <Box>
            {article.excerpt && (
              <Box component="p" data-reveal data-split sx={{ m: 0, mt: 3, fontSize: 16, lineHeight: 1.65, maxWidth: '46ch', color: 'var(--color-neutral-700)' }}>
                {article.excerpt}
              </Box>
            )}
            <Box data-reveal sx={{ mt: 1.5, ...label }}>
              {article.reading_minutes != null && `${article.reading_minutes} min de lectura`}
              {article.author_name && ` · ${article.author_name}`}
            </Box>
            <Box data-reveal sx={{ mt: 3 }}>
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
  const [vi, setVi] = useState(() => VARIANTES.findIndex((x) => x.id === VARIANTE_ELEGIDA));
  const [probando, setProbando] = useState(false);
  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('anim-divulgacion'));
  }, []);

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
          <Nota key={article.id} article={article} variant={VARIANTES[vi].id} open={open === article.id} onToggle={() => setOpen((cur) => (cur === article.id ? null : article.id))} />
        ))}
      </Box>

      {probando && (
        <Box
          component="button"
          type="button"
          onClick={() => setVi((n) => (n + 1) % VARIANTES.length)}
          sx={{ position: 'fixed', left: 20, bottom: 20, zIndex: 1500, px: 2.5, py: 1.5, border: 0, borderRadius: '999px', font: 'inherit', fontSize: 14, cursor: 'pointer', bgcolor: 'var(--od-tinta)', color: 'var(--od-papel)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
        >
          Animación: {VARIANTES[vi].nombre} ({vi + 1}/{VARIANTES.length}) · Siguiente →
        </Box>
      )}
    </Box>
  );
}
