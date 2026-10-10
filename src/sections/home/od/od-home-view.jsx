'use client';

import { Fragment } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OdScene } from 'src/layouts/od/od-scene';
import { OdPanel } from 'src/layouts/od/od-panel';
import { OdMasthead } from 'src/layouts/od/od-masthead';
import { OdGutterNote } from 'src/layouts/od/od-gutter-note';
import { OdReveal, OdCountUp } from 'src/layouts/od/od-motion';
import { useNavCategories } from 'src/layouts/nav-categories-context';
import { Star, Pill, Kicker, OdImage, Display } from 'src/layouts/od/od-ui';
import { StarRule, HeadingMark, LeafDivider, SectionHead } from 'src/layouts/od/od-ornaments';

import { OdCatalogCard } from 'src/sections/catalog/od/od-catalog-card';
import { animalToCard, productToCard } from 'src/sections/catalog/od/od-catalog-view';

import { OdFaq } from './od-faq';
import { OdNovedades } from './od-novedades';
import { OdDivulgacion } from './od-divulgacion';
import { OdTrustBar, OdHowToBuy, OdProductRail, OdCategoryIndex } from './od-home-blocks';

// ----------------------------------------------------------------------
// Home del rediseño editorial, reordenado (2026-10) según pautas de UX de
// e-commerce: propuesta + dos CTA en el hero, confianza justo debajo, lo que
// hay en existencia antes que la historia de marca, y nada que avance solo.
// Orden: hero, confianza, disponibles, categorías, el criadero, el frasco,
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
function Ingredient({ item, align = 'right' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: align === 'right' ? 'row-reverse' : 'row' },
        alignItems: 'flex-start',
        gap: { xs: 1.75, md: 2.25 },
        py: { xs: 2, md: 3.25 },
        borderTop: '1px solid rgba(240,235,224,0.14)',
      }}
    >
      <Box
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
        <Box sx={{ mb: 0.5, fontSize: 11, letterSpacing: '0.2em', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
          {item.n}
        </Box>
        <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: { xs: 18, md: 21 }, color: 'var(--color-neutral-100)' }}>
          {item.title}
        </Box>
        <Box sx={{ mt: 0.75, fontSize: { xs: 13, md: 14 }, lineHeight: 1.55, color: 'var(--color-neutral-400)' }}>{item.body}</Box>
      </Box>
    </Box>
  );
}

const firstLine = (text) => (text ?? '').split('\n').filter(Boolean)[0] ?? '';

export function OdHomeView({ species = [], products = [], articles = [], media }) {
  const categories = useNavCategories();
  const IMG = buildImg(media);

  // Los 6 elementos del bloque oscuro "Seis cosas dentro del frasco".
  const INGREDIENTS = [
    { n: '01', title: 'Sustrato húmedo', body: 'Coco, tierra y carbón: sostienen el gradiente de humedad sin encharcarse.', img: IMG.mossTall },
    { n: '02', title: 'Hojarasca curada', body: 'Roble y magnolia secos: alimento base y refugio donde mudan tranquilos.', img: IMG.leafLitter },
    { n: '03', title: 'Madera blanda', body: 'Piezas en descomposición que aportan celulosa y estructura al montaje.', img: IMG.terrarium },
    { n: '04', title: 'Calcio', body: 'Sepia molida o cáscara: sin ella la muda falla y la colonia deja de crecer.', img: IMG.isopodCubaris },
    { n: '05', title: 'Proteína', body: 'Una pizca cada dos semanas. Más que eso y aparecen ácaros.', img: IMG.isopodZebra },
    { n: '06', title: 'Colémbolos', body: 'El copiloto invisible: consumen el moho antes de que llegue a la camada.', img: IMG.mossWide },
  ];

  const CAT_IMAGES = [IMG.isopodCubaris, IMG.mossTall, IMG.leafLitter, IMG.terrarium, IMG.isopodZebra, IMG.mossWide];

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

  return (
    <>
      {/* Masthead editorial (solo en el home; la barra flotante aparece al bajar) */}
      <OdMasthead />

      {/* Hero (video de musgo en bucle) */}
      <Box component="section" data-dark="1" sx={{ position: 'relative', height: 'clamp(520px, 76vh, 900px)', overflow: 'hidden' }}>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          poster={media.hero_poster}
          sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', bgcolor: 'var(--color-neutral-800)' }}
        >
          <source src={media.hero_video_webm} type="video/webm" />
          <source src={media.hero_video_mp4} type="video/mp4" />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(32,31,29,0.44), rgba(32,31,29,0.16) 42%, rgba(32,31,29,0.52))',
          }}
        />
        <Box
          className="od-rise"
          sx={{
            position: 'absolute',
            inset: 0,
            px: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '26px',
            textAlign: 'center',
          }}
        >
          <Kicker color="rgba(246,244,241,0.85)" size={12} sx={{ letterSpacing: '0.3em' }}>
            Opuntia Den — Ciudad de México
          </Kicker>
          <Display
            component="h1"
            size="clamp(48px, 7.4vw, 122px)"
            sx={{ lineHeight: 1, letterSpacing: '-0.01em', color: '#f6f4f1', maxWidth: '14ch' }}
          >
            Vida en miniatura
          </Display>
          <Box sx={{ maxWidth: '46ch', fontSize: { xs: 15, md: 18 }, lineHeight: 1.6, color: 'rgba(246,244,241,0.9)' }}>
            Isópodos y colémbolos criados en casa, con su ficha de cuidados. Entrega en persona en la CDMX.
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pill variant="light" href={paths.catalog}>
              Ver catálogo
            </Pill>
            <Pill variant="outline" href="#como-comprar">
              Cómo comprar
            </Pill>
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.25,
            fontSize: 11,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(246,244,241,0.85)',
            textDecoration: 'none',
            '&:hover': { color: '#fff' },
          }}
        >
          Disponibles
          <Box component="span" sx={{ position: 'relative', width: '1px', height: 34, overflow: 'hidden', bgcolor: 'rgba(246,244,241,0.25)' }}>
            <Box component="span" sx={{ position: 'absolute', inset: 0, bgcolor: '#f6f4f1', animation: 'odCue 1.8s var(--od-ease) infinite' }} />
          </Box>
        </Box>
      </Box>

      <OdTrustBar />

      {/* Disponibles ahora (lo primero que se busca: qué hay en existencia) */}
      {selection.length > 0 && (
        <Box component="section" id="disponibles" sx={{ position: 'relative', scrollMarginTop: 80, px: { xs: '18px', md: 'var(--od-gutter)' }, pt: { xs: '56px', md: '90px' }, pb: { xs: '48px', md: '80px' } }}>
          <OdGutterNote n="01" label="Disponibles" />
          <OdReveal>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { md: '28px' }, mb: '64px' }}>
              <StarRule sx={{ display: { xs: 'none', md: 'flex' } }} />
              <Box sx={{ textAlign: 'center' }}>
                <Kicker sx={{ mb: '14px' }}>Del criadero</Kicker>
                <Display size="clamp(34px, 4.4vw, 66px)" sx={{ maxWidth: '16ch', mx: 'auto' }}>
                  {inStock.length ? 'Disponibles ahora' : 'Nuestra selección'}
                </Display>
                <HeadingMark sx={{ mt: '22px', justifyContent: 'center' }} />
              </Box>
              <StarRule flip sx={{ display: { xs: 'none', md: 'flex' } }} />
            </Box>
          </OdReveal>
          {/* flex centrado con ancho fijo: una sola tarjeta queda al centro sin
              estirarse; con varias se acomodan centradas y envuelven en filas */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '28px 18px', justifyContent: 'center' }}>
            {selection.map((item, i) => (
              <OdReveal key={item.key} delay={i * 0.08} sx={{ width: { xs: 'calc(50% - 9px)', md: 'clamp(240px, 21vw, 330px)' }, maxWidth: '100%' }}>
                <OdCatalogCard card={animalToCard(item, newestIds.has(item.key))} index={i} />
              </OdReveal>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '46px' }}>
            <Pill href={paths.catalog}>Ver todo el catálogo</Pill>
          </Box>
        </Box>
      )}

      {/* Banda "El criadero": marquesina de nombres + cifras (fondo terracota) */}
      <OdPanel sx={{ color: 'var(--color-neutral-100)', py: { xs: '56px', md: '88px' } }}>
        <Kicker color="var(--color-neutral-500)" sx={{ textAlign: 'center', mb: 3.5 }}>
          (El criadero)
        </Kicker>
        <Box sx={{ mx: 'auto', maxWidth: '30ch', px: 2, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 3.1vw, 46px)', lineHeight: 1.24 }}>
          Un criadero pequeño con registro largo: cada colonia se documenta y viaja con sus parámetros.
        </Box>

        <Box sx={{ my: { xs: '44px', md: '60px' }, overflow: 'hidden' }}>
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
              textTransform: 'uppercase',
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
            <Box key={s.label}>
              <Box sx={{ mb: 1.5, fontFamily: 'var(--font-heading)', fontSize: { xs: 28, md: 40 }, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
                {/^\d+$/.test(s.n) ? <OdCountUp value={Number(s.n)} /> : s.n}
              </Box>
              <Box sx={{ fontSize: { xs: 13, md: 15 }, lineHeight: 1.55, color: 'var(--color-neutral-400)' }}>{s.label}</Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '40px', md: '56px' } }}>
          <Pill variant="light" href={paths.breeding}>
            Conoce el criadero
          </Pill>
        </Box>
      </OdPanel>

      {/* Explora por categoría: índice con vista previa al hover */}
      {catItems.length > 0 && (
        <Box component="section" sx={{ position: 'relative', px: { xs: '18px', md: 'var(--od-gutter)' }, py: { xs: '64px', md: '110px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', pb: 3.75 }}>
            <SectionHead kicker="Explora" title="Compra por categoría" size="clamp(28px, 3.4vw, 48px)" />
            <Link component={RouterLink} href={paths.catalog} className="od-link" sx={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Ver todo el catálogo →
            </Link>
          </Box>
          <OdCategoryIndex items={catItems} />
        </Box>
      )}

      {/* Bloque oscuro del frasco: "Seis cosas dentro del frasco" +
          6 ingredientes con el frasco 3D al centro (placeholder por ahora) */}
      <OdPanel sx={{ py: { xs: '64px', md: '96px' } }}>
        <OdGutterNote dark n="02" label="El frasco" start={160} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: { xs: '18px', md: 'var(--od-gutter)' }, pb: 2.75, borderBottom: '1px solid rgba(240,235,224,0.18)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          <Box component="span">(Qué necesita una colonia)</Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontVariantNumeric: 'tabular-nums' }}>06 elementos</Box>
        </Box>
        <Box component="h2" sx={{ mx: 'auto', mt: { xs: '44px', md: '62px' }, maxWidth: '20ch', px: 2, textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(30px, 3.8vw, 54px)', lineHeight: 1.12, color: 'var(--color-neutral-100)' }}>
          Seis cosas dentro del frasco. Nada más.
        </Box>
        <LeafDivider sx={{ mx: 'auto', mt: '28px', maxWidth: 360, px: 2, color: 'var(--od-arena-texto)' }} />

        <Box sx={{ mt: { xs: '32px', md: '56px' }, px: { xs: '18px', md: 'var(--od-gutter)' }, display: 'grid', gap: { xs: 2.5, md: '46px' }, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 1fr) minmax(280px, 1.05fr) minmax(240px, 1fr)' } }}>
          <Box>
            {INGREDIENTS.slice(0, 3).map((item) => (
              <Ingredient key={item.n} item={item} align="right" />
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
            <Box sx={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
              Cultivo Opuntia Den · 1 L
            </Box>
          </Box>
          <Box>
            {INGREDIENTS.slice(3, 6).map((item) => (
              <Ingredient key={item.n} item={item} align="left" />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '32px', md: '56px' } }}>
          <Pill variant="light" href={paths.catalogCategory('sustratos-y-accesorios')}>
            Comprar un cultivo ↗
          </Pill>
        </Box>
      </OdPanel>

      {/* Todo para tu terrario (banda que avanza sola; se pausa al pasar el cursor) */}
      {terrario.length > 0 && (
        <Box component="section" sx={{ position: 'relative', py: { xs: '64px', md: '110px' }, overflow: 'hidden', '&:hover .od-band': { animationPlayState: 'paused' } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', px: { xs: '18px', md: 'var(--od-gutter)' }, pb: 2.75, mb: 3.75, borderBottom: '1px solid var(--color-divider)' }}>
            <SectionHead kicker="Insumos" title="Todo para tu terrario" size="clamp(26px, 3vw, 40px)" />
            <Link component={RouterLink} href={paths.catalogCategory('sustratos-y-accesorios')} className="od-link" sx={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Ver todos los insumos →
            </Link>
          </Box>

          <OdProductRail items={terrario} />
        </Box>
      )}

      {/* Cómo comprar (tres pasos sobre foto a sangre) */}
      <OdHowToBuy bg={IMG.mossWide} />

      {/* Divulgación (editorial en filas) */}
      <OdDivulgacion articles={articles} />

      {/* Preguntas frecuentes (ancla #preguntas del masthead) */}
      <OdFaq mossTall={IMG.mossTall} />

      {/* Novedades / suscripción */}
      <OdNovedades mossWide={IMG.mossWide} />
    </>
  );
}
