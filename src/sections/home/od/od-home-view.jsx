'use client';

import { useRef, Fragment } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { FOTOS } from 'src/lib/fotos-ambiente';
import { OdScene } from 'src/layouts/od/od-scene';
import { OdPanel } from 'src/layouts/od/od-panel';
import { Star, Pill } from 'src/layouts/od/od-ui';
import { OdInkText } from 'src/layouts/od/od-ink-text';
import { OdMasthead } from 'src/layouts/od/od-masthead';
import { OdReveal, OdCountUp } from 'src/layouts/od/od-motion';
import { OdSmoothScroll } from 'src/layouts/od/od-smooth-scroll';
import { useNavCategories } from 'src/layouts/nav-categories-context';
import { LeafDivider, SectionHead } from 'src/layouts/od/od-ornaments';

import { OdCatalogCard } from 'src/sections/catalog/od/od-catalog-card';
import { animalToCard, productToCard } from 'src/sections/catalog/od/od-catalog-view';

import { OdFaq } from './od-faq';
import { OdCierre } from './od-cierre';
import { useHeroIntro } from './use-hero-intro';
import { OdDivulgacion } from './od-divulgacion';
import { usePhotoMotion } from './use-photo-motion';
import { OdSpeciesScene } from './od-species-scene';
import { OdFondoTerrario } from './od-fondo-terrario';
import { OdTrustBar, OdHowToBuy, OdProductRail, OdCategoryIndex } from './od-home-blocks';

// ----------------------------------------------------------------------
// Home del rediseño editorial, reordenado (2026-10) según pautas de UX de
// e-commerce: propuesta + dos CTA en el hero, confianza justo debajo, lo que
// hay en existencia antes que la historia de marca, y nada que avance solo.
// Orden (2026-11): hero, confianza, el criadero, banda de cifras, disponibles
// (cuadrícula), todo para tu terrario (encabezado + tira de insumos),
// categorías, cómo comprar, fichas de cuidados (escena), divulgación,
// preguntas y cierre.
// ----------------------------------------------------------------------

// Las seis imagenes decorativas ya no son archivos del repo: llegan del blob
// de ajustes (Dashboard -> Sitio web -> Media).
const buildImg = (media) => ({
  mossTall: media.moss_tall,
  leafLitter: media.leaf_litter,
  isopodZebra: media.isopod_zebra,
  terrarium: media.terrarium,
  isopodCubaris: media.isopod_cubaris,
  mossWide: media.moss_wide,
});

// Nombres que corren en la marquesina de la banda de marca.
// Marquesinas separadas por el destello tuna de la marca ("Isópodos ✦ Colémbolos").
const MARQUEE_NAMES = ['Isópodos', 'Colémbolos', 'Cubaris', 'Porcellio', 'Armadillidium'];

function StarRun({ words, times = 5 }) {
  const run = Array.from({ length: times }, () => words).flat();
  return (
    <Box component="span">
      {run.map((word, i) => (
        <Fragment key={i}>
          {word}
          <Star spin sx={{ width: '0.32em', height: '0.32em', mx: '0.45em', verticalAlign: '0.32em' }} />
        </Fragment>
      ))}
    </Box>
  );
}

const STATS = [
  { n: '14', label: 'Especies en cultivo activo, todas nacidas en casa.' },
  { n: '6', label: 'Años criando y documentando cada camada.' },
  { n: 'Mismo día', label: 'Entrega en persona dentro de la CDMX.' },
  { n: 'Ficha propia', label: 'Cada ejemplar sale con sus parámetros de origen.' },
];

const firstLine = (text) => (text ?? '').split('\n').filter(Boolean)[0] ?? '';

export function OdHomeView({ species = [], products = [], articles = [], careSheets = [], media, ticker }) {
  const categories = useNavCategories();
  const IMG = buildImg(media);


  // fotos de ambiente provisionales (ver src/lib/fotos-ambiente.js)
  const CAT_IMAGES = [FOTOS.isopodoAmarillo.src, FOTOS.terrario.src, FOTOS.isopodoMusgo.src, FOTOS.isopodoBlanco.src, FOTOS.fichas.src, FOTOS.divulgacion.src];

  // buildListings siembra el Map con `taxa` (orden alfabético del backend),
  // ya no con `animals` (Animal.id desc): sin reordenar, la home abriría con
  // la primera especie del alfabeto en vez de lo más nuevo con existencias.
  const sorted = [...species].sort((a, b) => b.count - a.count || b.latestId - a.latestId);
  // "Disponibles ahora": solo lo que tiene existencias. Si no hay nada en
  // existencia se cae a la selección de siempre para no dejar la sección vacía.
  const inStock = sorted.filter((s) => s.count > 0);
  const selection = (inStock.length ? inStock : sorted).slice(0, 8);

  // insumos para "Todo para tu terrario": productos reales + sus categorías
  const terrario = products.slice(0, 10).map((p) => ({ ...productToCard(p), description: firstLine(p.description) }));
  // los ejemplares de id más alto son los recién llegados → badge "Nuevo"
  const newestIds = new Set(
    [...species].sort((a, b) => b.latestId - a.latestId).slice(0, 2).map((s) => s.key)
  );

  // Índice de categorías: grupos del menú + insumos. Foto y conteo salen de
  // los propios listados del grupo cuando los hay.
  const catItems = [
    ...(categories ?? []).map((c, i) => {
      const inGroup = species.filter((s) => s.species?.genus?.group?.name === c.title);
      const available = inGroup.filter((s) => s.count > 0).length;
      const photo = inGroup.map((s) => s.photos?.[0] ?? s.taxonPhoto).find(Boolean);
      return {
        title: c.title,
        href: paths.catalogCategory(c.slug),
        img: photo ?? CAT_IMAGES[i % CAT_IMAGES.length],
        meta: available ? `${available} disponibles` : 'Ver especies',
      };
    }),
    ...(products.length
      ? [{
          title: 'Sustratos y accesorios',
          href: paths.catalogCategory('sustratos-y-accesorios'),
          img: products.map((p) => p.image).find(Boolean) ?? IMG.terrarium,
          meta: `${products.length} productos`,
        }]
      : []),
  ];

  const heroRef = useRef(null);
  useHeroIntro(heroRef);
  usePhotoMotion();

  return (
    <>
      <OdSmoothScroll />

      {/* Portada estilo Aldena: el video a sangre ocupa la primera pantalla, la
          barra de enlaces y el nombre gigante van encima, y abajo el lema con
          los botones. Grano y velo para que el texto se lea sobre el video. */}
      <Box ref={heroRef} component="section" data-dark="1" className="od-grain" sx={{ position: 'relative', height: { xs: '92svh', md: '100svh' }, minHeight: 600, overflow: 'hidden', color: 'var(--od-papel)' }}>
        <Box
          component="video"
          data-hero-video
          autoPlay
          muted
          loop
          playsInline
          poster={media.hero_poster}
          sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', bgcolor: 'var(--od-noche)' }}
        >
          <source src={media.hero_video_webm} type="video/webm" />
          <source src={media.hero_video_mp4} type="video/mp4" />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(22,27,25,0.62) 0%, rgba(22,27,25,0.12) 38%, rgba(22,27,25,0.18) 58%, rgba(22,27,25,0.72) 100%)',
          }}
        />

        <OdMasthead />

        {/* Nombre gigante: el título de la página */}
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: { xs: 92, md: 84 }, px: { xs: '14px', md: '24px' }, textAlign: 'center' }}>
          <Box data-hero-kicker sx={{ mb: { xs: 0.5, md: 1 }, fontSize: 'clamp(13px, 1.2vw, 18px)', letterSpacing: '0.42em', textIndent: '0.42em', textTransform: 'uppercase', opacity: 0.85 }}>
            Criadero
          </Box>
          <Box
            component="h1"
            data-hero-word
            aria-label="Opuntia Den, criadero de invertebrados en Ciudad de México"
            sx={{
              m: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
              // la palabra mide ~4.16em: llena el ancho sin cortarse, con tope en 4K
              fontSize: 'min(calc((100vw - 56px) / 4.3), 440px)',
              lineHeight: 0.86,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            Opuntia
          </Box>
        </Box>

        {/* Abajo: lema, frase y botones a la izquierda; datos a la derecha */}
        <Box
          data-hero-bottom
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: { xs: 28, md: 44 },
            px: { xs: '18px', md: 'var(--od-gutter)' },
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Box component="p" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 4.2vw, 64px)', lineHeight: 1.02 }}>
              Historia natural
            </Box>
            <Box component="p" sx={{ mt: 1.75, mb: 0, maxWidth: '42ch', fontSize: { xs: 15, md: 17 }, lineHeight: 1.6, opacity: 0.9 }}>
              Isópodos y colémbolos criados en casa, con su ficha de cuidados. Entrega en persona en la CDMX.
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Pill variant="light" href={paths.catalog}>
                Ver catálogo
              </Pill>
              <Pill variant="outline" href="#como-comprar">
                Cómo comprar
              </Pill>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', fontSize: 15, lineHeight: 1.5, opacity: 0.85 }}>
            Isópodos, colémbolos,
            <br />
            sustratos y bioactivo
            <br />
            <br />
            Entrega en persona,
            <br />
            Ciudad de México
          </Box>
        </Box>
        {/* Pista de scroll: lleva a lo disponible, con una línea que "cae" */}
        <Box
          component="a"
          href="#disponibles"
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 22,
            transform: 'translateX(-50%)',
            // en móvil se encimaba con los botones de la portada
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.25,
            fontSize: 13,
            color: 'rgba(246,245,241,0.85)',
            textDecoration: 'none',
            '&:hover': { color: '#fff' },
          }}
        >
          Disponibles
          <Box component="span" sx={{ position: 'relative', width: '1px', height: 34, overflow: 'hidden', bgcolor: 'rgba(246,245,241,0.25)' }}>
            <Box component="span" sx={{ position: 'absolute', inset: 0, bgcolor: '#f6f4f1', animation: 'odCue 1.8s var(--od-ease) infinite' }} />
          </Box>
        </Box>
      </Box>

      <OdTrustBar />

      {/* El criadero debajo de la barra de confianza, compacto y al estilo Aldena: foto
          cuadrada chica con el título encima y el botón abajo a la izquierda;
          a la derecha la declaración en sans (Inter) que se entinta al bajar. */}
      {/* claro (antes oscuro): así no se funde con la banda de cifras, que va justo después */}
      <Box component="section" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' }, color: 'var(--od-musgo-900)' }}>
        <Box sx={{ position: 'relative', mx: 'auto', maxWidth: 1180, display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, alignItems: 'start' }}>
          <Box>
            {/* el cactus 3D, sin fondo y girando (en celular, la foto de respaldo) */}
            <OdScene scene="cactus" fallbackSrc={FOTOS.criadero.src} fallbackLabel="Terrarios con musgo bajo una lámpara" ratio="3 / 5" sx={{ width: { xs: 220, md: 'clamp(300px, 24vw, 440px)' } }} />
            <Box component="h2" sx={{ m: 0, mt: { xs: 2, md: 2.5 }, fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 400, fontSize: { xs: 24, md: 28 } }}>
              El criadero
            </Box>
            <Box sx={{ mt: { xs: 3, md: 4 } }}>
              <Pill href={paths.breeding}>Conoce el criadero</Pill>
            </Box>
          </Box>
          <Box sx={{ fontFamily: 'var(--od-font-body)', fontWeight: 600, fontSize: 'clamp(28px, 3vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            <OdInkText>
              {[
                'Un criadero pequeño con registro largo: cada colonia se documenta y viaja con sus parámetros.',
                'Las catorce especies en cultivo nacen en casa, y cada ejemplar sale con su ficha de origen y se entrega en persona en la Ciudad de México.',
              ]}
            </OdInkText>
          </Box>
        </Box>
      </Box>


      {/* Banda "El criadero": marquesina de nombres + cifras */}
      {/* El degradado (Feral, paleta de adorno) es el momento de color de la
          página: el resto va en neutros */}
      <OdPanel className="od-grain" sx={{ color: 'var(--color-neutral-100)', py: { xs: '56px', md: '88px' }, backgroundImage: 'url(/brand/degradados/aurora-musgo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Box sx={{ mb: { xs: '44px', md: '60px' }, overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading)',
              // El piso de 48px era para escritorio: en un telefono solo cabian
              // dos palabras y se leia como texto cortado, no como marquesina.
              fontSize: { xs: 'clamp(24px, 7vw, 40px)', md: 'clamp(48px, 9.4vw, 148px)' },
              lineHeight: 1.06,
              letterSpacing: '-0.01em',
              animation: 'odMarquee 110s linear infinite',
            }}
          >
            <StarRun words={MARQUEE_NAMES} times={4} />
            <StarRun words={MARQUEE_NAMES} times={4} />
          </Box>
        </Box>

        {/* En movil minmax(220px) no cabia dos veces en 360px, asi que las
            cuatro cifras se apilaban y ocupaban pantalla y media. */}
        <Box
          sx={{
            px: { xs: '18px', md: 'var(--od-gutter)' },
            display: 'grid',
            gap: { xs: '28px 18px', md: '40px' },
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(auto-fit, minmax(220px, 1fr))' },
          }}
        >
          {STATS.map((s) => (
            <Box
              key={s.label}
              sx={{
                position: 'relative',
                pt: 2,
                // filete tuna corto que se extiende al pasar el cursor
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: '1px',
                  bgcolor: 'var(--od-tuna)',
                  transform: 'scaleX(0.12)',
                  transformOrigin: 'left',
                  transition: 'transform 700ms var(--od-ease)',
                },
                '& .od-stat-n': { transition: 'transform 600ms var(--od-ease), color 400ms ease' },
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover::before': { transform: 'scaleX(1)' },
                  '&:hover .od-stat-n': { transform: 'translateY(-4px)', color: '#fff' },
                },
              }}
            >
              <Box className="od-stat-n" sx={{ mb: 1.5, fontFamily: 'var(--font-heading)', fontSize: { xs: 28, md: 40 }, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
                {/^\d+$/.test(s.n) ? <OdCountUp value={Number(s.n)} /> : s.n}
              </Box>
              <Box sx={{ fontSize: { xs: 13, md: 15 }, lineHeight: 1.55, color: 'var(--color-neutral-400)' }}>{s.label}</Box>
            </Box>
          ))}
        </Box>
      </OdPanel>

      {/* Disponibles ahora: cuadrícula de la tienda (taste: surtido en
          cuadrícula pareja, 4 por fila y 2 en celular, nombre y precio bajo la
          foto). Misma tarjeta que el catálogo. */}
      {selection.length > 0 && (
        <Box component="section" id="disponibles" sx={{ px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' }, scrollMarginTop: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: { xs: 3, md: 5 } }}>
            <SectionHead mask title={inStock.length ? 'Disponibles ahora' : 'Nuestra selección'} size="clamp(28px, 3.4vw, 48px)" />
            <Link component={RouterLink} href={paths.catalog} sx={{ fontSize: 15, color: 'inherit', textDecoration: 'none' }}>
              Ver todo el catálogo →
            </Link>
          </Box>
          <Box sx={{ display: 'grid', gap: { xs: '32px 14px', md: '44px 28px' }, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
            {selection.slice(0, 8).map((item, i) => (
              <OdReveal key={item.key} delay={Math.min(i, 8) * 0.05} sx={{ minWidth: 0 }}>
                <OdCatalogCard card={animalToCard(item, newestIds.has(item.key))} />
              </OdReveal>
            ))}
          </Box>
        </Box>
      )}

      {/* «Todo para tu terrario»: encabezado oscuro; los productos van justo
          debajo, en la tira sobre el flow claro */}
      <OdPanel sx={{ pt: { xs: '56px', md: '80px' }, pb: { xs: '40px', md: '64px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: { xs: '18px', md: 'var(--od-gutter)' }, pb: 2.75, borderBottom: '1px solid rgba(238,236,230,0.18)', fontSize: 13, color: 'var(--color-neutral-500)' }}>
          <Box component="span">(Qué necesita una colonia)</Box>
          <Link component={RouterLink} href={paths.catalogCategory('sustratos-y-accesorios')} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-neutral-100)' } }}>
            Ver todos los insumos →
          </Link>
        </Box>
        <Box className="od-orn-host" sx={{ width: 'fit-content', maxWidth: 1, mx: 'auto', pb: 1 }}>
          <Box component="h2" sx={{ mx: 'auto', mt: { xs: '44px', md: '62px' }, maxWidth: '20ch', px: 2, textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(30px, 3.8vw, 54px)', lineHeight: 1.12, color: 'var(--color-neutral-100)' }}>
            Todo para tu terrario
          </Box>
          <LeafDivider sx={{ mx: 'auto', mt: '28px', maxWidth: 360, px: 2, color: 'var(--od-arena-texto)' }} />
        </Box>

      </OdPanel>

      {/* Insumos: tira de tarjetas chicas sobre el flow claro con grano, sin
          texto (el título lo pone el bloque del frasco, justo arriba) */}
      {terrario.length > 0 && (
        <Box component="section" aria-label="Insumos para tu terrario" className="od-grain" sx={{ position: 'relative', py: { xs: '56px', md: '88px' }, overflow: 'clip', bgcolor: 'var(--od-musgo-900)' }}>
          <OdFondoTerrario />
          <OdProductRail items={terrario} />
        </Box>
      )}

      {/* Explora por categoría: índice con vista previa al hover */}
      {catItems.length > 0 && (
        <Box component="section" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', pb: 3.75 }}>
            <SectionHead mask title="Compra por categoría" size="clamp(28px, 3.4vw, 48px)" />
            <Link component={RouterLink} href={paths.catalog} className="od-link" sx={{ fontSize: 13, color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Ver todo el catálogo →
            </Link>
          </Box>
          <OdCategoryIndex items={catItems} />
        </Box>
      )}

      {/* Cómo comprar */}
      <OdHowToBuy />


      {/* Fichas de cuidados como escena: una pantalla fija por ficha, con el
          nombre corriendo detrás (antes era «Disponibles ahora») */}
      <OdSpeciesScene
        id="fichas"
        heading="Fichas de cuidados"
        link={{ href: paths.careSheets, label: 'Ver todas las fichas' }}
        cards={careSheets.slice(0, 4).map((f) => ({
          key: f.slug,
          title: f.common_name || f.scientific_name,
          scientific: f.locality ? `${f.scientific_name} «${f.locality}»` : f.scientific_name,
          image: f.cover,
          href: paths.careSheet(f.slug),
          price: f.difficulty ? `Dificultad: ${f.difficulty}` : 'Ver ficha',
          category: f.group?.name ?? '',
        }))}
      />

      {/* Divulgación (editorial en filas) */}
      <OdDivulgacion articles={articles} />

      {/* Preguntas frecuentes (ancla #preguntas del masthead) */}
      <OdFaq mossTall={IMG.mossTall} />
      {/* Cierre con el degradado prisma (reemplaza a la suscripción) */}
      <OdCierre ticker={ticker} />
    </>
  );
}
