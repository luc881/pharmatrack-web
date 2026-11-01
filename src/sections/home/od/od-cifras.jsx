'use client';

import { useRef, Fragment, useEffect } from 'react';

import Box from '@mui/material/Box';

import { Star } from 'src/layouts/od/od-ui';
import { OdPanel } from 'src/layouts/od/od-panel';
import { gsap, ScrollTrigger, prefersReducedMotion } from 'src/layouts/od/od-gsap';

// ----------------------------------------------------------------------
// Banda de cifras (2026-11-01, sin degradado): oscuro liso con grano.
// - La marquesina de nombres responde al scroll: acelera con la velocidad y
//   cambia de sentido cuando subes.
// - Las cifras ruedan como contador mecánico (cada dígito pasa por 0-9) y
//   las palabras suben letra por letra, escalonadas por columna.
// Sin JS o con movimiento reducido se ve el estado final.
// ----------------------------------------------------------------------

const NAMES = ['Isópodos', 'Colémbolos', 'Cubaris', 'Porcellio', 'Armadillidium'];

const STATS = [
  { n: '14', label: 'Especies en cultivo activo, todas nacidas en casa.' },
  { n: '6', label: 'Años criando y documentando cada camada.' },
  { n: 'Mismo día', label: 'Entrega en persona dentro de la CDMX.' },
  { n: 'Ficha propia', label: 'Cada ejemplar sale con sus parámetros de origen.' },
];

const DIGITS = [...'01234567890123456789'];
const H = '1.15em'; // alto de cada dígito: deja aire a los rasgos de la serif

function Run() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
      {Array.from({ length: 4 }, () => NAMES)
        .flat()
        .map((word, i) => (
          <Fragment key={i}>
            {word}
            <Star spin sx={{ width: '0.32em', height: '0.32em', mx: '0.45em' }} />
          </Fragment>
        ))}
    </Box>
  );
}

// Cifra: cada dígito es una columna 0-9 0-9 que se recorre hasta el suyo
// (la segunda vuelta, para que ruede entera). Texto: letras en máscara.
function Cifra({ value }) {
  if (/^\d+$/.test(value)) {
    return (
      <Box component="span" aria-label={value} sx={{ display: 'inline-flex' }}>
        {[...value].map((d, i) => (
          // el dígito final, invisible, da el ancho; el carrete corre encima
          <Box key={i} component="span" aria-hidden sx={{ position: 'relative', display: 'inline-block', height: H, lineHeight: H, overflow: 'hidden' }}>
            <Box component="span" sx={{ visibility: 'hidden' }}>{d}</Box>
            <Box component="span" data-reel style={{ transform: `translateY(-${(10 + Number(d)) * 1.15}em)` }} sx={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center' }}>
              {DIGITS.map((x, j) => (
                <Box key={j} component="span" sx={{ display: 'block', height: H }}>
                  {x}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  return (
    // una máscara por palabra (letras sin partirse entre renglones)
    <Box component="span" aria-label={value}>
      {value.split(' ').map((word, w) => (
        <Box key={w} component="span" aria-hidden sx={{ display: 'inline-block', overflow: 'hidden', pb: '0.08em', whiteSpace: 'nowrap', mr: '0.25em' }}>
          {[...word].map((ch, i) => (
            <Box key={i} component="span" data-ch sx={{ display: 'inline-block' }}>
              {ch}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export function OdCifras() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let dir = 1;
    let boost = 0;
    const ctx = gsap.context(() => {
      // marquesina: bucle de -50% (dos copias) con timeScale según el scroll
      const loop = gsap.to('[data-track]', { xPercent: -50, ease: 'none', duration: 70, repeat: -1 });
      loop.totalTime(70 * 50); // margen para poder correr hacia atrás
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 220, 10);
        },
      });
      const tick = () => {
        boost *= 0.93;
        loop.timeScale(dir * (1 + boost));
      };
      gsap.ticker.add(tick);

      // cifras: entran por columna
      gsap.utils.toArray('[data-stat]').forEach((col, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current.querySelector('[data-stats]'), start: 'top 82%', once: true }, delay: i * 0.12 });
        const reels = col.querySelectorAll('[data-reel]');
        if (reels.length) tl.from(reels, { y: 0, duration: 2.4, ease: 'power3.inOut', stagger: 0.15 }, 0);
        const chars = col.querySelectorAll('[data-ch]');
        if (chars.length) tl.from(chars, { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.035 }, 0);
        tl.from(col.querySelector('[data-label]'), { autoAlpha: 0, y: 18, duration: 0.9, ease: 'power3.out' }, 0.35);
      });

      return () => gsap.ticker.remove(tick);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <OdPanel ref={root} className="od-grain" aria-label="El criadero en cifras" sx={{ color: 'var(--color-neutral-100)', py: { xs: '64px', md: '112px' } }}>
      <Box aria-hidden sx={{ mb: { xs: '48px', md: '88px' }, overflow: 'hidden' }}>
        <Box
          data-track
          sx={{
            display: 'flex',
            width: 'max-content',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-heading)',
            fontSize: { xs: 'clamp(28px, 8vw, 44px)', md: 'clamp(56px, 8.6vw, 150px)' },
            lineHeight: 1.06,
            letterSpacing: '-0.01em',
          }}
        >
          <Run />
          <Run />
        </Box>
      </Box>

      <Box
        data-stats
        sx={{
          px: { xs: '18px', md: 'var(--od-gutter)' },
          display: 'grid',
          gap: { xs: '40px 20px', md: '48px' },
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        {STATS.map((s) => (
          <Box key={s.label} data-stat>
            <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: 'clamp(26px, 7.6vw, 34px)', md: 'clamp(44px, 4.4vw, 80px)' }, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'lining-nums', whiteSpace: { md: 'nowrap' } }}>
              <Cifra value={s.n} />
            </Box>
            <Box component="p" data-label sx={{ m: 0, mt: { xs: 1.5, md: 2.5 }, maxWidth: '26ch', fontSize: { xs: 15, md: 17 }, lineHeight: 1.5, color: 'var(--color-neutral-300)' }}>
              {s.label}
            </Box>
          </Box>
        ))}
      </Box>
    </OdPanel>
  );
}
