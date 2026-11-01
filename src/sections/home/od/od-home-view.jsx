'use client';

import { useRef, Fragment } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { FOTOS } from 'src/lib/fotos-ambiente';
import { OdScene } from 'src/layouts/od/od-scene';
import { OdPanel } from 'src/layouts/od/od-panel';
import { OdCountUp } from 'src/layouts/od/od-motion';
import { OdInkText } from 'src/layouts/od/od-ink-text';
import { OdMasthead } from 'src/layouts/od/od-masthead';
import { Star, Pill, OdImage } from 'src/layouts/od/od-ui';
import { OdSmoothScroll } from 'src/layouts/od/od-smooth-scroll';
import { useNavCategories } from 'src/layouts/nav-categories-context';
import { LeafDivider, SectionHead } from 'src/layouts/od/od-ornaments';

import { animalToCard, productToCard } from 'src/sections/catalog/od/od-catalog-view';

import { OdFaq } from './od-faq';
import { OdCierre } from './od-cierre';
import { useHeroIntro } from './use-hero-intro';
import { OdDivulgacion } from './od-divulgacion';
import { usePhotoMotion } from './use-photo-motion';
import { OdSpeciesScene } from './od-species-scene';
import { OdTrustBar, OdHowToBuy, OdProductRail, OdCategoryIndex } from './od-home-blocks';

// ----------------------------------------------------------------------
// Home del rediseño editorial, reordenado (2026-10) según pautas de UX de
// e-commerce: propuesta + dos CTA en el hero, confianza justo debajo, lo que
// hay en existencia antes que la historia de marca, y nada que avance solo.
// Orden: hero, confianza, el criadero, disponibles, categorías, el frasco,
// insumos, cómo comprar, divulgación, preguntas y novedades.
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

// Ingrediente del frasco: número, título, glosa y miniatura.
//
// En escritorio las tres primeras fichas van a la izquierda del frasco, con
// texto alineado a la derecha y miniatura pegada al centro; las otras tres al
// revés. En móvil no hay dos costados: todo cae en una columna, así que las
// seis se ven igual (miniatura a la izquierda, texto a la izquierda) y más
// compactas. El orden lo invierte flexDirection, no dos ramas de JSX.
//
// Hover (escritorio): la línea de arriba se dibuja en tuna desde el frasco, la
// miniatura crece y se deja jalar por el cursor, el título se acerca al frasco
// y los otros cinco ingredientes se atenúan (regla en la rejilla de abajo).
function Ingredient({ item, align = 'right' }) {
  const towardJar = align === 'right' ? 1 : -1;
  return (
    <Box
      className="od-ingredient"
      data-fx
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'row', md: align === 'right' ? 'row-reverse' : 'row' },
        alignItems: 'flex-start',
        gap: { xs: 1.75, md: 2.25 },
        py: { xs: 2, md: 3.25 },
        borderTop: '1px solid rgba(238,236,230,0.14)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: -1,
          height: '1px',
          bgcolor: 'var(--od-tuna)',
          transform: 'scaleX(0)',
          transformOrigin: align === 'right' ? 'right' : 'left',
          transition: 'transform 700ms var(--od-ease)',
        },
        '& .od-ing-thumb': { transition: 'transform 500ms var(--od-ease), box-shadow 400ms ease, scale 600ms var(--od-ease)' },
        '& .od-ing-title, & .od-ing-body': { transition: 'transform 600ms var(--od-ease), color 400ms ease' },
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover::before': { transform: 'scaleX(1)' },
          '&:hover .od-ing-thumb': { scale: '1.12', boxShadow: '0 0 0 2px var(--od-tuna)' },
          '&:hover .od-ing-title': { transform: `translateX(${towardJar * 8}px)`, color: '#fff' },
          '&:hover .od-ing-body': { color: 'var(--color-neutral-300)' },
          '&:hover .od-ing-n': { color: 'var(--od-tuna)' },
        },
      }}
    >
      <Box
        className="od-ing-thumb od-magnet"
        sx={{
          flex: 'none',
          width: { xs: 52, md: 68 },
          height: { xs: 52, md: 68 },
          borderRadius: '12px',
          overflow: 'hidden',
          bgcolor: 'var(--color-neutral-800)',
        }}
      >
        <OdImage src={item.img} alt={item.title} ratio="1 / 1" radius={12} sx={{ width: 1, height: 1 }} />
      </Box>

      <Box sx={{ minWidth: 0, textAlign: { xs: 'left', md: align } }}>
        <Box component="h3" className="od-ing-title" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: { xs: 18, md: 21 }, color: 'var(--color-neutral-100)' }}>
          {item.title}
        </Box>
        <Box className="od-ing-body" sx={{ mt: 0.75, fontSize: { xs: 13, md: 14 }, lineHeight: 1.55, color: 'var(--color-neutral-400)' }}>{item.body}</Box>
      </Box>
    </Box>
  );
}

const firstLine = (text) => (text ?? '').split('\n').filter(Boolean)[0] ?? '';

export function OdHomeView({ species = [], products = [], articles = [], media, ticker }) {
  const categories = useNavCategories();
  const IMG = buildImg(media);

  // Los 6 elementos del bloque oscuro "Seis cosas dentro del frasco".
  const INGREDIENTS = [
    { title: 'Sustrato húmedo', body: 'Coco, tierra y carbón: sostienen el gradiente de humedad sin encharcarse.', img: IMG.mossTall },
    { title: 'Hojarasca curada', body: 'Roble y magnolia secos: alimento base y refugio donde mudan tranquilos.', img: IMG.leafLitter },
    { title: 'Madera blanda', body: 'Piezas en descomposición que aportan celulosa y estructura al montaje.', img: IMG.terrarium },
    { title: 'Calcio', body: 'Sepia molida o cáscara: sin ella la muda falla y la colonia deja de crecer.', img: IMG.isopodCubaris },
    { title: 'Proteína', body: 'Una pizca cada dos semanas. Más que eso y aparecen ácaros.', img: IMG.isopodZebra },
    { title: 'Colémbolos', body: 'El copiloto invisible: consumen el moho antes de que llegue a la camada.', img: IMG.mossWide },
  ];

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
      <Box component="section" data-dark="1" className="od-grain" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' }, color: 'var(--od-papel)', bgcolor: 'var(--od-noche)' }}>
        <Box sx={{ position: 'relative', mx: 'auto', maxWidth: 1180, display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, alignItems: 'start' }}>
          <Box>
            {/* Afuera el giro 3D con brillo de las tarjetas de producto; adentro
                el obturador y el grano (cada uno usa su propio ::after) */}
            <Box className="od-tilt-lg od-glare" data-fx sx={{ position: 'relative', width: { xs: 180, md: 'clamp(200px, 16vw, 260px)' }, aspectRatio: '1', overflow: 'clip', borderRadius: '4px' }}>
              <Box data-shutter className="od-grain" sx={{ width: 1, height: 1, bgcolor: 'var(--od-noche)', '&::after': { opacity: 0.28, mixBlendMode: 'screen' } }}>
                <Box component="img" src={FOTOS.criadero.src} alt="Terrarios con musgo bajo una lámpara" loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }} />
                <Box component="h2" sx={{ position: 'absolute', inset: 0, zIndex: 1, m: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 400, fontSize: { xs: 22, md: 26 }, color: '#f6f4f1', textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}>
                  El criadero
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: { xs: 3, md: 4 } }}>
              <Pill variant="light" href={paths.breeding}>Conoce el criadero</Pill>
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


      {/* Disponibles ahora como escena: una pantalla fija por especie (las 4
          primeras); el resto en el catálogo */}
      <OdSpeciesScene
        cards={selection.slice(0, 4).map((item) => animalToCard(item, newestIds.has(item.key)))}
        heading={inStock.length ? 'Disponibles ahora' : 'Nuestra selección'}
      />

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

      {/* Bloque oscuro del frasco: "Seis cosas dentro del frasco" +
          6 ingredientes con el frasco 3D al centro (placeholder por ahora) */}
      <OdPanel sx={{ py: { xs: '64px', md: '96px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: { xs: '18px', md: 'var(--od-gutter)' }, pb: 2.75, borderBottom: '1px solid rgba(238,236,230,0.18)', fontSize: 13, color: 'var(--color-neutral-500)' }}>
          <Box component="span">(Qué necesita una colonia)</Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontVariantNumeric: 'tabular-nums' }}>06 elementos</Box>
        </Box>
        <Box className="od-orn-host" sx={{ width: 'fit-content', maxWidth: 1, mx: 'auto', pb: 1 }}>
          <Box component="h2" sx={{ mx: 'auto', mt: { xs: '44px', md: '62px' }, maxWidth: '20ch', px: 2, textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(30px, 3.8vw, 54px)', lineHeight: 1.12, color: 'var(--color-neutral-100)' }}>
            Seis cosas dentro del frasco. Nada más.
          </Box>
          <LeafDivider sx={{ mx: 'auto', mt: '28px', maxWidth: 360, px: 2, color: 'var(--od-arena-texto)' }} />
        </Box>

        <Box
          sx={{
            mt: { xs: '32px', md: '56px' },
            px: { xs: '18px', md: 'var(--od-gutter)' },
            display: 'grid',
            gap: { xs: 2.5, md: '46px' },
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 1fr) minmax(280px, 1.05fr) minmax(240px, 1fr)' },
            // el ingrediente bajo el cursor se queda al frente
            '@media (hover: hover) and (pointer: fine)': {
              '& .od-ingredient': { transition: 'opacity 450ms ease' },
              '&:has(.od-ingredient:hover) .od-ingredient:not(:hover)': { opacity: 0.4 },
            },
          }}
        >
          <Box>
            {INGREDIENTS.slice(0, 3).map((item) => (
              <Ingredient key={item.title} item={item} align="right" />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.25 }}>
            {/* Escena 3D del frasco (jar-scene); en móvil/motion reducido cae a
                la imagen de respaldo */}
            <OdScene
              scene="jar"
              fallbackSrc={IMG.terrarium}
              fallbackLabel="Frasco de cultivo Opuntia Den"
              ratio="3 / 4"
              // 3/4 a ancho completo son ~460px de alto en un telefono, casi
              // media pantalla para una foto de apoyo.
              sx={{ maxWidth: { xs: 240, md: 380 } }}
            />
            <Box sx={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>
              Cultivo Opuntia Den · 1 L
            </Box>
          </Box>
          <Box>
            {INGREDIENTS.slice(3, 6).map((item) => (
              <Ingredient key={item.title} item={item} align="left" />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '32px', md: '56px' } }}>
          <Pill variant="light" href={paths.catalogCategory('sustratos-y-accesorios')}>
            Comprar un cultivo ↗
          </Pill>
        </Box>
      </OdPanel>

      {/* Cómo comprar (claro) entre el frasco y el carrusel (oscuros): así
          ninguna sección queda junto a otra del mismo tono */}
      <OdHowToBuy />

      {/* Todo para tu terrario: carrusel 3D de tarjetas anchas sobre el degradado Musgo */}
      {terrario.length > 0 && (
        <Box component="section" data-dark="1" className="od-grain" sx={{ position: 'relative', py: { xs: '96px', md: '170px' }, overflow: 'clip', color: 'var(--od-papel)', bgcolor: 'var(--od-musgo-900)' }}>
          {/* fondo: degradado Musgo que se mueve lento (.od-musgo-flow en global.css) */}
          <Box aria-hidden className="od-musgo-flow">
            <span />
            <span />
            <span />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', px: { xs: '18px', md: 'var(--od-gutter)' }, mb: { xs: 2, md: 3 } }}>
            <SectionHead mask title="Todo para tu terrario" size="clamp(28px, 3.4vw, 48px)" />
            <Link component={RouterLink} href={paths.catalogCategory('sustratos-y-accesorios')} sx={{ fontSize: 15, color: 'inherit', textDecoration: 'none', opacity: 0.85, '&:hover': { opacity: 1 } }}>
              Ver todos los insumos →
            </Link>
          </Box>

          <OdProductRail items={terrario} />
        </Box>
      )}

      {/* Divulgación (editorial en filas) */}
      <OdDivulgacion articles={articles} />

      {/* Preguntas frecuentes (ancla #preguntas del masthead) */}
      <OdFaq mossTall={IMG.mossTall} bg={FOTOS.preguntas.src} />
      {/* Cierre con el degradado prisma (reemplaza a la suscripción) */}
      <OdCierre ticker={ticker} />
    </>
  );
}
