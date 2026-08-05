'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OdReveal } from 'src/layouts/od/od-motion';
import { useNavCategories } from 'src/layouts/nav-categories-context';
import { Pill, Kicker, OdImage, Display } from 'src/layouts/od/od-ui';

import { articleSlug } from 'src/sections/articles/utils';
import { OdArticleCard } from 'src/sections/articles/od/od-article-card';

import { OdProductCard } from './od-product-card';

// ----------------------------------------------------------------------
// Home del rediseño editorial. Estructura del handoff nuevo: hero, banda "El
// criadero", compra por categoría, selección, bloque oscuro del frasco (con el
// 3D como placeholder — llega en la fase de three.js), "todo para tu terrario",
// divisor de pago y divulgación. Los huecos de imagen grandes son placeholders:
// el cliente sube su fotografía después (ver Assets del handoff).
// ----------------------------------------------------------------------

// Imágenes de naturaleza (musgo, hojarasca, terrario, isópodos) de marcador de
// posición — CC de Wikimedia en public/assets/redesign.
const IMG = {
  mossTall: '/assets/redesign/moss-forest-1.jpg',
  leafLitter: '/assets/redesign/leaf-litter.jpg',
  isopodZebra: '/assets/redesign/isopod-zebra.jpg',
  terrarium: '/assets/redesign/terrarium.jpg',
  isopodCubaris: '/assets/redesign/isopod-cubaris.jpg',
  mossWide: '/assets/redesign/moss-forest-2.jpg',
};

// Nombres que corren en la marquesina de la banda de marca.
const NAME_MARQUEE = 'Isópodos · Colémbolos · Cubaris · Porcellio · Armadillidium · ';

const STATS = [
  { n: '14', label: 'Especies en cultivo activo, todas nacidas en casa.' },
  { n: '6', label: 'Años criando y documentando cada camada.' },
  { n: 'Mismo día', label: 'Entrega en persona dentro de la CDMX.' },
  { n: 'Ficha propia', label: 'Cada ejemplar sale con sus parámetros de origen.' },
];

// Los 6 elementos del bloque oscuro "Seis cosas dentro del frasco".
const INGREDIENTS = [
  { n: '01', title: 'Sustrato húmedo', body: 'Coco, tierra y carbón: sostienen el gradiente de humedad sin encharcarse.', img: IMG.mossTall },
  { n: '02', title: 'Hojarasca curada', body: 'Roble y magnolia secos: alimento base y refugio donde mudan tranquilos.', img: IMG.leafLitter },
  { n: '03', title: 'Madera blanda', body: 'Piezas en descomposición que aportan celulosa y estructura al montaje.', img: IMG.terrarium },
  { n: '04', title: 'Calcio', body: 'Sepia molida o cáscara: sin ella la muda falla y la colonia deja de crecer.', img: IMG.isopodCubaris },
  { n: '05', title: 'Proteína', body: 'Una pizca cada dos semanas. Más que eso y aparecen ácaros.', img: IMG.isopodZebra },
  { n: '06', title: 'Colémbolos', body: 'El copiloto invisible: consumen el moho antes de que llegue a la camada.', img: IMG.mossWide },
];

// Insumos para la banda "Todo para tu terrario" (fotografía ilustrativa; sin
// precio, llevan a la categoría de sustratos y accesorios).
const SUPPLIES = [
  { label: 'Roble seco', img: IMG.leafLitter },
  { label: 'Sustrato de coco', img: IMG.terrarium },
  { label: 'Musgo vivo', img: IMG.mossTall },
  { label: 'Corcho', img: IMG.isopodCubaris },
  { label: 'Calcio', img: IMG.mossWide },
  { label: 'Colémbolos', img: IMG.isopodZebra },
];

const CAT_IMAGES = [IMG.isopodCubaris, IMG.mossTall, IMG.leafLitter, IMG.terrarium, IMG.isopodZebra, IMG.mossWide];

// Ingrediente del frasco: número, título, glosa y miniatura de 68px.
function Ingredient({ item, align = 'right' }) {
  const thumb = (
    <Box sx={{ flex: 'none', width: 68, height: 68, borderRadius: '12px', overflow: 'hidden', bgcolor: 'var(--color-neutral-800)' }}>
      <OdImage src={item.img} alt={item.title} ratio="1 / 1" radius={12} sx={{ width: 1, height: 1 }} />
    </Box>
  );
  const text = (
    <Box sx={{ minWidth: 0, textAlign: align }}>
      <Box sx={{ mb: 0.75, fontSize: 11, letterSpacing: '0.2em', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
        {item.n}
      </Box>
      <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 21, color: 'var(--color-neutral-100)' }}>
        {item.title}
      </Box>
      <Box sx={{ mt: 1, fontSize: 14, lineHeight: 1.7, color: 'var(--color-neutral-400)' }}>{item.body}</Box>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.25, py: 3.25, borderTop: '1px solid rgba(240,235,224,0.14)' }}>
      {align === 'right' ? (
        <>
          {text}
          {thumb}
        </>
      ) : (
        <>
          {thumb}
          {text}
        </>
      )}
    </Box>
  );
}

export function OdHomeView({ species = [], articles = [] }) {
  const categories = useNavCategories();

  const selection = species.slice(0, 4);
  // los ejemplares de id más alto son los recién llegados → badge "Nuevo"
  const newestIds = new Set(
    [...species].sort((a, b) => b.latestId - a.latestId).slice(0, 2).map((s) => s.key)
  );

  // divulgación editorial: un artículo destacado (imagen grande) + los siguientes
  const featuredArticle = articles[0] ?? null;
  const moreArticles = articles.slice(1, 4);

  const catCards = (categories ?? []).map((c, i) => ({
    title: c.title,
    href: paths.catalogCategory(c.slug),
    img: CAT_IMAGES[i % CAT_IMAGES.length],
  }));

  return (
    <>
      {/* Hero (video de musgo en bucle) */}
      <Box component="section" sx={{ position: 'relative', height: '78vh', overflow: 'hidden' }}>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-moss.jpg"
          sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', bgcolor: 'var(--color-neutral-800)' }}
        >
          <source src="/video/hero-moss.webm" type="video/webm" />
          <source src="/video/hero-moss.mp4" type="video/mp4" />
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
            gap: '30px',
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
          <Pill variant="light" href={paths.catalog}>
            Ver catálogo
          </Pill>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 30,
            textAlign: 'center',
            fontSize: 11,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(246,244,241,0.8)',
          }}
        >
          Desliza
        </Box>
      </Box>

      {/* Banda "El criadero": marquesina de nombres + cifras (fondo terracota) */}
      <Box
        component="section"
        data-dark="1"
        sx={{ mt: '60px', bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-100)', py: { xs: '48px', md: '64px' }, overflow: 'hidden' }}
      >
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
              fontSize: 'clamp(48px, 9.4vw, 148px)',
              lineHeight: 1.06,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              animation: 'odMarquee 64s linear infinite',
            }}
          >
            <Box component="span">{NAME_MARQUEE.repeat(4)}</Box>
            <Box component="span">{NAME_MARQUEE.repeat(4)}</Box>
          </Box>
        </Box>

        <Box sx={{ px: '32px', display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {STATS.map((s) => (
            <Box key={s.label}>
              <Box sx={{ mb: 1.5, fontFamily: 'var(--font-heading)', fontSize: 40, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {s.n}
              </Box>
              <Box sx={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-neutral-400)' }}>{s.label}</Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '40px', md: '56px' } }}>
          <Pill variant="light" href={paths.breeding}>
            Conoce el criadero
          </Pill>
        </Box>
      </Box>

      {/* Compra por categoría */}
      {catCards.length > 0 && (
        <Box component="section" sx={{ px: '18px', pt: { xs: '56px', md: '84px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', px: 1, pb: 3.75, borderBottom: '1px solid var(--color-divider)' }}>
            <Display size="clamp(28px, 3.4vw, 48px)" weight={300} sx={{ lineHeight: 1.1 }}>
              Compra por categoría
            </Display>
            <Link component={RouterLink} href={paths.catalog} sx={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
              Ver todo el catálogo →
            </Link>
          </Box>
          {/* flex centrado con ancho fijo: si solo hay una categoría queda al
              centro sin estirarse; con varias se acomodan centradas y envuelven */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '18px', pt: '34px', px: 1, justifyContent: 'center' }}>
            {catCards.map((c, i) => (
              <OdReveal key={c.title} delay={Math.min(i, 6) * 0.06} sx={{ width: 220, maxWidth: '100%' }}>
                <Link component={RouterLink} href={c.href} sx={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                  <OdImage src={c.img} alt={c.title} ratio="1 / 1" radius={0} />
                  <Box sx={{ mt: 1.75, fontFamily: 'var(--font-heading)', fontSize: 20 }}>{c.title}</Box>
                </Link>
              </OdReveal>
            ))}
          </Box>
        </Box>
      )}

      {/* Selección de isópodos */}
      {selection.length > 0 && (
        <Box component="section" id="catalogo" sx={{ px: '18px', py: { xs: '70px', md: '110px' } }}>
          <OdReveal>
            <Display size="clamp(34px, 4.4vw, 66px)" sx={{ textAlign: 'center', maxWidth: '16ch', mx: 'auto', mb: '64px' }}>
              Nuestra selección de isópodos
            </Display>
          </OdReveal>
          {/* flex centrado con ancho fijo: una sola tarjeta queda al centro sin
              estirarse; con varias se acomodan centradas y envuelven en filas */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center' }}>
            {selection.map((item, i) => (
              <OdReveal key={item.key} delay={i * 0.08} sx={{ width: 290, maxWidth: '100%' }}>
                <OdProductCard item={item} isNew={newestIds.has(item.key)} />
              </OdReveal>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '46px' }}>
            <Pill href={paths.catalog}>Ver más</Pill>
          </Box>
        </Box>
      )}

      {/* Bloque oscuro del frasco: marquesina + "Seis cosas dentro del frasco" +
          6 ingredientes con el frasco 3D al centro (placeholder por ahora) */}
      <Box component="section" data-dark="1" sx={{ bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-200)', py: { xs: '64px', md: '96px' }, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: '40px', pb: 2.75, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          <Box component="span">(Qué necesita una colonia)</Box>
          <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>06 elementos</Box>
        </Box>
        <Box sx={{ py: 3, borderTop: '1px solid rgba(240,235,224,0.18)', borderBottom: '1px solid rgba(240,235,224,0.18)', overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(40px, 6.6vw, 104px)',
              lineHeight: 1.06,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-100)',
              animation: 'odMarquee 64s linear infinite',
            }}
          >
            <Box component="span">{'Dentro del frasco · '.repeat(5)}</Box>
            <Box component="span">{'Dentro del frasco · '.repeat(5)}</Box>
          </Box>
        </Box>

        <Box component="h2" sx={{ mx: 'auto', mt: '62px', maxWidth: '20ch', px: 2, textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(30px, 3.8vw, 54px)', lineHeight: 1.12, color: 'var(--color-neutral-100)' }}>
          Seis cosas dentro del frasco. Nada más.
        </Box>

        <Box sx={{ mt: '56px', px: '40px', display: 'grid', gap: { xs: 4, md: '46px' }, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 1fr) minmax(280px, 1.05fr) minmax(240px, 1fr)' } }}>
          <Box>
            {INGREDIENTS.slice(0, 3).map((item) => (
              <Ingredient key={item.n} item={item} align="right" />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.25 }}>
            {/* ponytail: placeholder del frasco 3D; se sustituye por la escena
                three.js en la fase de 3D (jar-scene del handoff) */}
            <Box sx={{ width: 1, maxWidth: 380 }}>
              <OdImage src={IMG.terrarium} alt="Frasco de cultivo Opuntia Den" ratio="3 / 4" radius={0} />
            </Box>
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

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '56px' }}>
          <Pill variant="light" href={paths.catalogCategory('sustratos-y-accesorios')}>
            Comprar un cultivo ↗
          </Pill>
        </Box>
      </Box>

      {/* Todo para tu terrario (banda de insumos con autoavance, pausa al hover) */}
      <Box component="section" sx={{ pt: { xs: '48px', md: '60px' }, overflow: 'hidden', '&:hover .od-band': { animationPlayState: 'paused' } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', px: '40px', pb: 2.75, mb: 3.75, borderBottom: '1px solid var(--color-divider)' }}>
          <Display size="clamp(26px, 3vw, 40px)" weight={300} sx={{ lineHeight: 1.1 }}>
            Todo para tu terrario
          </Display>
          <Link component={RouterLink} href={paths.catalogCategory('sustratos-y-accesorios')} sx={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--color-accent-700)' } }}>
            Ver todos los insumos →
          </Link>
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <Box className="od-band" sx={{ display: 'flex', gap: '18px', width: 'max-content', animation: 'odMarquee 70s linear infinite' }}>
            {[...SUPPLIES, ...SUPPLIES].map((s, i) => (
              <Link
                key={`${s.label}-${i}`}
                component={RouterLink}
                href={paths.catalogCategory('sustratos-y-accesorios')}
                sx={{ flex: '0 0 300px', maxWidth: '80vw', color: 'inherit', textDecoration: 'none' }}
              >
                <OdImage src={s.img} alt={s.label} ratio="1 / 1" radius={0} />
                <Box sx={{ mt: 1.5, fontFamily: 'var(--font-heading)', fontSize: 18 }}>{s.label}</Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Divisor de pago (a sangre) */}
      <Box
        component="section"
        data-dark="1"
        sx={{ position: 'relative', minHeight: '66vh', display: 'grid', placeItems: 'center', isolation: 'isolate', textAlign: 'center', mt: { xs: '48px', md: '60px' }, mb: '20px' }}
      >
        <OdImage
          src={IMG.mossWide}
          alt="Musgo del suelo del bosque"
          label="Foto ambiente del taller de cría"
          ratio="auto"
          radius={0}
          sx={{ position: 'absolute', inset: 0, zIndex: -2, aspectRatio: 'auto', borderRadius: 0 }}
        />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, bgcolor: 'rgba(32,31,29,0.5)' }} />
        <OdReveal sx={{ px: '32px', py: '100px', maxWidth: 640, color: '#f6f4f1' }}>
          <Display size="clamp(32px, 4.2vw, 58px)" sx={{ lineHeight: 1.08 }}>
            Pago con Mercado Pago o cierre por WhatsApp
          </Display>
          <Box sx={{ my: '28px', fontSize: 15, opacity: 0.88, lineHeight: 1.7 }}>
            Tú eliges cómo cerrar. En ambos casos recibes confirmación por correo y coordinamos la
            entrega en persona en CDMX.
          </Box>
          <Pill variant="light" href={paths.catalog}>
            Ver catálogo
          </Pill>
        </OdReveal>
      </Box>

      {/* Divulgación (feature editorial: texto + imagen destacada + 3 artículos) */}
      {featuredArticle && (
        <Box component="section" id="divulgacion" sx={{ px: '18px', pt: { xs: '40px', md: '60px' }, pb: { xs: '80px', md: '120px' } }}>
          <OdReveal>
            <Display size="clamp(48px, 11.4vw, 176px)" weight={400} sx={{ lineHeight: 1, letterSpacing: '-0.015em', textTransform: 'uppercase', mb: { xs: 4, md: 6 } }}>
              Divulgación
            </Display>
          </OdReveal>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 5, md: '56px' },
              alignItems: 'center',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
            }}
          >
            <OdReveal sx={{ minWidth: 0, pl: { md: '26px' } }}>
              <Box sx={{ mb: '28px', fontSize: 16, lineHeight: 1.8, maxWidth: '46ch', opacity: 0.85 }}>
                Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
                manteniendo colonias, escrito para que no repitas nuestros errores.
              </Box>
              <Pill href={paths.articles}>Ver divulgación</Pill>
            </OdReveal>

            <OdReveal delay={0.12} sx={{ minWidth: 0 }}>
              <Link
                component={RouterLink}
                href={paths.article(articleSlug(featuredArticle))}
                sx={{ display: 'block', color: 'inherit', textDecoration: 'none', '&:hover .od-img-zoom': { transform: 'scale(1.06)' } }}
              >
                <OdImage src={featuredArticle.cover_image} alt={featuredArticle.title} label={featuredArticle.title} ratio="4 / 5" />
                <Kicker sx={{ mt: '16px', mb: '6px', fontSize: 11, letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums' }}>
                  ART-{String(featuredArticle.id).padStart(3, '0')}
                  {featuredArticle.category ? ` · ${featuredArticle.category}` : ''}
                </Kicker>
                <Box component="h3" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 24, lineHeight: 1.2, maxWidth: '28ch' }}>
                  {featuredArticle.title}
                </Box>
              </Link>
            </OdReveal>
          </Box>

          {moreArticles.length > 0 && (
            <Box sx={{ mt: { xs: 6, md: 9 }, display: 'grid', gap: '28px', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
              {moreArticles.map((article, i) => (
                <OdReveal key={article.id} delay={i * 0.1}>
                  <OdArticleCard article={article} />
                </OdReveal>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
