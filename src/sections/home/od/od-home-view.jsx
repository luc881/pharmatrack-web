'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Pill, Kicker, OdImage, Display, ArrowButton } from 'src/layouts/od/od-ui';

import { articleSlug } from 'src/sections/articles/utils';

import { OdProductCard } from './od-product-card';

// ----------------------------------------------------------------------
// Home del rediseño editorial. Estructura fiel al handoff (hero, composición
// en L, marca, póster, selección, divisor de pago, divulgación). Los huecos de
// imagen grandes son placeholders: el cliente sube su fotografía después.
// ----------------------------------------------------------------------

const HERO_L = [
  {
    kicker: 'Camada de julio — disponible',
    title: 'Una colonia de isópodos criada con parámetros medidos.',
  },
  {
    kicker: 'Bioactivo — sustratos y hojarasca',
    title: 'Todo lo que el terrario necesita para sostenerse solo.',
  },
];

const pad2 = (n) => String(n).padStart(2, '0');

// Imágenes de naturaleza (musgo, hojarasca, terrario, isópodos) de marcador de
// posición — CC de Wikimedia en public/assets/redesign. Se reemplazan por
// fotografía propia antes de publicar (ver Assets del handoff).
const IMG = {
  mossTall: '/assets/redesign/moss-forest-1.jpg',
  leafLitter: '/assets/redesign/leaf-litter.jpg',
  isopodZebra: '/assets/redesign/isopod-zebra.jpg',
  terrarium: '/assets/redesign/terrarium.jpg',
  isopodCubaris: '/assets/redesign/isopod-cubaris.jpg',
  mossWide: '/assets/redesign/moss-forest-2.jpg',
};

export function OdHomeView({ species = [], articles = [] }) {
  const [heroC, setHeroC] = useState(0);
  const [art, setArt] = useState(0);

  const selection = species.slice(0, 4);
  // los ejemplares de id más alto son los recién llegados → badge "Nuevo"
  const newestIds = new Set(
    [...species].sort((a, b) => b.latestId - a.latestId).slice(0, 2).map((s) => s.key)
  );

  // artículos en páginas de 2 para el carrusel de divulgación
  const artPages = [];
  for (let i = 0; i < articles.length; i += 2) artPages.push(articles.slice(i, i + 2));
  const artPage = artPages[art] ?? [];

  // autoavance del carrusel de divulgación (5.2s), respetando reduce-motion
  const artLen = artPages.length;
  const artRef = useRef(art);
  artRef.current = art;
  useEffect(() => {
    if (artLen <= 1) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setArt((artRef.current + 1) % artLen), 5200);
    return () => clearInterval(id);
  }, [artLen]);

  const heroSlide = HERO_L[heroC];

  return (
    <>
      {/* 2 · Hero a pantalla completa (video de musgo en bucle) */}
      <Box component="section" sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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

      {/* 3 · Composición en L */}
      <Box component="section" sx={{ px: '18px', pt: '90px' }}>
        <Box
          sx={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.02fr) minmax(0, 1fr)' },
            gridTemplateRows: { md: 'auto auto' },
          }}
        >
          <OdImage
            src={IMG.mossTall}
            alt="Musgo en el suelo del bosque"
            label="Ambiente principal"
            ratio="3 / 4"
            sx={{ gridRow: { md: '1 / span 2' } }}
          />

          <Box
            sx={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: { xs: '24px 4px', md: '40px 24px 32px 44px' },
            }}
          >
            <Box key={heroC} sx={{ animation: 'odFade 0.5s ease both' }}>
              <Kicker sx={{ mb: '26px' }}>{heroSlide.kicker}</Kicker>
              <Display size="clamp(38px, 3.9vw, 66px)" sx={{ lineHeight: 1.12, maxWidth: '16ch' }}>
                {heroSlide.title}
              </Display>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', mt: '48px' }}>
              <Pill href={paths.catalog}>Descubrir</Pill>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box component="span" sx={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--color-neutral-600)', fontVariantNumeric: 'tabular-nums' }}>
                  {pad2(heroC + 1)} / {pad2(HERO_L.length)}
                </Box>
                <ArrowButton label="Anterior" onClick={() => setHeroC((heroC + HERO_L.length - 1) % HERO_L.length)}>
                  ←
                </ArrowButton>
                <ArrowButton label="Siguiente" onClick={() => setHeroC((heroC + 1) % HERO_L.length)}>
                  →
                </ArrowButton>
              </Box>
            </Box>
          </Box>

          <OdImage src={IMG.leafLitter} alt="Hojarasca de bosque" label="Detalle del terrario" ratio="16 / 10" />
        </Box>
      </Box>

      {/* 4 · Sección de marca */}
      <Box
        component="section"
        sx={{
          px: '18px',
          py: { xs: '70px', md: '110px' },
          display: 'grid',
          gap: '40px',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
        }}
      >
        <Box sx={{ minWidth: 0, pl: { md: '26px' } }}>
          <Display size="clamp(32px, 3.6vw, 58px)" sx={{ lineHeight: 1.14, maxWidth: '15ch' }}>
            Criamos invertebrados en la Ciudad de México, para terrarios domésticos y de colección.
          </Display>
          <Box sx={{ mt: '42px' }}>
            <Pill href={paths.catalog}>Ver el catálogo</Pill>
          </Box>
          <OdImage src={IMG.isopodZebra} alt="Isópodo cebra" label="Ejemplar en detalle" ratio="1 / 1" sx={{ mt: '90px', ml: '22%', width: '62%' }} />
        </Box>

        <Box sx={{ minWidth: 0, position: 'relative', mt: { md: '60px' } }}>
          <OdImage src={IMG.terrarium} alt="Terrario bioactivo" label="Ambiente de cría" ratio="4 / 5" />
          <Box
            sx={{
              position: 'absolute',
              left: 20,
              bottom: 20,
              width: 150,
              height: 150,
              p: '10px',
              bgcolor: 'var(--color-neutral-100)',
              boxShadow: 'var(--shadow-sm)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <OdImage src={IMG.isopodCubaris} alt="Cubaris murina" ratio="1 / 1" radius={0} sx={{ width: 1, height: 1 }} />
          </Box>
        </Box>
      </Box>

      {/* 5 · Póster a sangre */}
      <Box
        component="section"
        sx={{ bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-200)', px: '32px', py: { xs: '90px', md: '130px' }, textAlign: 'center' }}
      >
        <Display size="clamp(38px, 5.4vw, 84px)" sx={{ lineHeight: 1.08, maxWidth: '20ch', mx: 'auto', color: '#eae7e7' }}>
          Un ecosistema pequeño, vivo y hecho a tu medida
        </Display>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', mt: '54px' }}>
          <Pill variant="light" href={paths.catalogCategory('sustratos-y-accesorios')}>
            Sustratos y accesorios
          </Pill>
          <Pill variant="outline" href={paths.catalog}>
            Arma el tuyo
          </Pill>
        </Box>
      </Box>

      {/* 6 · Selección de isópodos */}
      {selection.length > 0 && (
        <Box component="section" id="catalogo" sx={{ px: '18px', py: { xs: '70px', md: '110px' } }}>
          <Display
            size="clamp(34px, 4.4vw, 66px)"
            sx={{ textAlign: 'center', maxWidth: '16ch', mx: 'auto', mb: '64px' }}
          >
            Nuestra selección de isópodos
          </Display>
          <Box
            sx={{
              display: 'grid',
              gap: '18px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            }}
          >
            {selection.map((item) => (
              <OdProductCard key={item.key} item={item} isNew={newestIds.has(item.key)} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '46px' }}>
            <Pill href={paths.catalog}>Ver más</Pill>
          </Box>
        </Box>
      )}

      {/* 7 · Divisor de pago (a sangre) */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: '66vh',
          display: 'grid',
          placeItems: 'center',
          isolation: 'isolate',
          textAlign: 'center',
          mb: '20px',
        }}
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
        <Box sx={{ px: '32px', py: '100px', maxWidth: 640, color: '#f6f4f1' }}>
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
        </Box>
      </Box>

      {/* 8 · Carrusel de divulgación */}
      {artPage.length > 0 && (
        <Box
          component="section"
          id="divulgacion"
          sx={{
            px: '18px',
            pt: '20px',
            pb: { xs: '80px', md: '120px' },
            display: 'grid',
            gap: '40px',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.85fr) minmax(0, 1.15fr)' },
          }}
        >
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pl: { md: '26px' } }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '22px' }}>
                <Display size="clamp(32px, 3.8vw, 58px)" sx={{ lineHeight: 1.05 }}>
                  Divulgación
                </Display>
                <Box component="span" sx={{ fontSize: 13, color: 'var(--color-neutral-600)', fontVariantNumeric: 'tabular-nums' }}>
                  {pad2(art + 1)} / {pad2(artLen)}
                </Box>
              </Box>
              <Box sx={{ my: '32px', fontSize: 15, lineHeight: 1.75, maxWidth: '46ch', opacity: 0.85 }}>
                Notas de cría, montaje de terrarios bioactivos y fichas de especie. Lo que aprendimos
                manteniendo colonias, escrito para que no repitas nuestros errores.
              </Box>
              <Pill href={paths.articles}>Ver todos</Pill>
            </Box>
            {artLen > 1 && (
              <Box sx={{ display: 'flex', gap: '12px', mt: '60px' }}>
                <ArrowButton size={52} solid label="Anterior" onClick={() => setArt((art + artLen - 1) % artLen)}>
                  ←
                </ArrowButton>
                <ArrowButton size={52} label="Siguiente" onClick={() => setArt((art + 1) % artLen)}>
                  →
                </ArrowButton>
              </Box>
            )}
          </Box>

          <Box
            key={art}
            className="od-slide"
            sx={{
              minWidth: 0,
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              animation: 'odSlide 0.6s var(--od-ease) both',
            }}
          >
            {artPage.map((article) => (
              <Link
                key={article.id}
                component={RouterLink}
                href={paths.article(articleSlug(article))}
                sx={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
              >
                <OdImage src={article.cover_image} alt={article.title} label={article.title} ratio="4 / 5" />
                <Kicker sx={{ mt: '16px', mb: '6px', fontSize: 11, letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums' }}>
                  ART-{pad2(article.id)}
                  {article.category ? ` · ${article.category}` : ''}
                </Kicker>
                <Box
                  component="h3"
                  sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 21, lineHeight: 1.24, maxWidth: '24ch' }}
                >
                  {article.title}
                </Box>
                {article.reading_minutes != null && (
                  <Box sx={{ mt: '8px', fontSize: 13, color: 'var(--color-neutral-600)' }}>
                    {article.reading_minutes} min
                  </Box>
                )}
              </Link>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
