'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { Pill } from 'src/layouts/od/od-ui';
import { OdTicker } from 'src/layouts/od/od-ticker';
import { gsap, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// Cierre del home (2026-11-01, claro y sin degradado). «Desfile» como en
// Aldena: la pregunta partida en dos con el video del musgo en un cuadro al
// centro; al bajar, las dos mitades se juntan del todo encima del cuadro, que
// crece. En celular se apila (cuadro arriba, dos líneas) y no se mueve.
// ----------------------------------------------------------------------

const WA_TEXT = 'Hola, tengo una duda antes de comprar.';

// blanco en «difference»: casi negro sobre el fondo hueso y claro donde monta
// sobre el video (como el texto blanco sobre la foto de la referencia)
const wordSx = { position: 'relative', zIndex: 3, color: '#fff', mixBlendMode: 'difference' };

const outlineInk = {
  color: 'var(--od-tinta)',
  border: '1px solid rgba(28,35,32,0.45)',
  '--od-fxbtn-fill': 'var(--od-tinta)',
  '--od-fxbtn-ink': 'var(--od-papel)',
  '&:hover': { borderColor: 'var(--od-tinta)' },
};

export function OdCierre({ ticker, media }) {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(min-width: 900px)').matches) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-desfile]', start: 'top 95%', end: 'center 45%', scrub: 1, invalidateOnRefresh: true } });
      // de separadas a juntas del todo: cada mitad recorre la mitad del hueco
      // (cuadro + los dos gaps) menos un espacio normal entre «antes» y «de»
      const join = () => {
        const h2 = root.current.querySelector('[data-desfile]');
        const gap = parseFloat(getComputedStyle(h2).columnGap) || 0;
        const space = parseFloat(getComputedStyle(h2).fontSize) * 0.26;
        return (root.current.querySelector('[data-cuadro]').offsetWidth + 2 * gap - space) / 2;
      };
      tl.fromTo('[data-izq]', { x: '-14vw' }, { x: () => join(), ease: 'none' }, 0)
        .fromTo('[data-der]', { x: '14vw' }, { x: () => -join(), ease: 'none' }, 0)
        .fromTo('[data-cuadro]', { scale: 0.72 }, { scale: 1, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <OdTicker items={ticker} />
      <Box ref={root} component="section" aria-label="¿Dudas antes de comprar?" sx={{ position: 'relative', isolation: 'isolate', bgcolor: 'background.default', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '80px', md: '150px' }, overflow: 'clip', textAlign: 'center' }}>
        <Box
          component="h2"
          data-desfile
          sx={{
            m: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2.5, md: '28px' },
            fontFamily: 'var(--font-heading)',
            fontWeight: 400,
            fontSize: { xs: 'clamp(36px, 10vw, 48px)', md: 'clamp(48px, 5.6vw, 104px)' },
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: { md: 'nowrap' },
          }}
        >
          <Box component="span" data-izq sx={wordSx}>
            ¿Dudas antes
          </Box>
          <Box
            data-cuadro
            aria-hidden
            className="od-grain"
            sx={{ order: { xs: -1, md: 0 }, flex: 'none', position: 'relative', overflow: 'hidden', width: { xs: 140, md: 'clamp(200px, 17vw, 320px)' }, aspectRatio: '1 / 1', bgcolor: 'var(--od-noche)' }}
          >
            <Box component="video" autoPlay muted loop playsInline poster={media?.hero_poster} sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', filter: 'brightness(0.5)' }}>
              <source src={media?.hero_video_webm} type="video/webm" />
              <source src={media?.hero_video_mp4} type="video/mp4" />
            </Box>
          </Box>
          <Box component="span" data-der sx={wordSx}>
            de comprar?
          </Box>
        </Box>

        <Box component="p" sx={{ mt: { xs: 3, md: 5 }, mb: 0, mx: 'auto', maxWidth: '44ch', fontSize: { xs: 16, md: 19 }, lineHeight: 1.6 }}>
          Escríbenos por WhatsApp: te ayudamos a elegir tu primera colonia y a armar su terrario.
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Pill href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(WA_TEXT)}`} target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </Pill>
          <Pill variant="outline" href={paths.catalog} sx={outlineInk}>
            Ver catálogo
          </Pill>
        </Box>
      </Box>
    </>
  );
}
