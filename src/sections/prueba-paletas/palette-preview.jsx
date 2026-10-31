'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Vista de prueba: las mismas secciones del inicio con cada paleta. Los
// degradados son imágenes hechas en Feral Gradient Builder (public/
// prueba-paletas/*.jpg); `feral` abre cada uno en el estudio para ajustarlo.
// Cada paleta: fondo crema, tinta, acento (botones) y un campo oscuro.
// `heroInk` es el color del texto sobre la parte alta del degradado.
// ----------------------------------------------------------------------

const FERAL = 'https://feralui.dev/gradients?g=2.';

const PALETTES = [
  {
    id: 'citron',
    name: 'Citrón / Nopal',
    note: 'Musgo y nopal con luz desde abajo, como el frasco iluminado.',
    bg: '#ECE8DC',
    surface: '#F4F1E8',
    ink: '#2B3324',
    muted: '#5E6452',
    accent: '#5C6B3A',
    accentInk: '#F4F1E8',
    field: '#2E3B2A',
    fieldInk: '#E9EBC4',
    heroInk: '#F1F0DC',
    gradient: ['#2E3B2A', '#5C6B3A', '#8FA35A', '#E9EBC4'],
    feral: `${FERAL}HcpBCoJAAEDRq8h3O6sxo2ang4FQJtZOXAiZSKUyDkSIp-goHcGLhe4enz9So0YG2_UDKseVkRfKAIHr623ordodAs9fFe2jUG8oBPbTVyjSLL6cJIIHCgQGhY6v2fxNnOScBkcEy6cba-Zf67RdXz4R3E35Wvq7uVUIalM2LUrKSWBReTH9AQ`,
  },
  {
    id: 'glaciar',
    name: 'Glaciar / Rocío',
    note: 'Agua y humedad: pizarra, azul verdoso y rocío pálido.',
    bg: '#EEEAE2',
    surface: '#F6F3EE',
    ink: '#1E3440',
    muted: '#55666E',
    accent: '#2F6F7E',
    accentInk: '#F6F3EE',
    field: '#1C3A4E',
    fieldInk: '#DCEBE6',
    heroInk: '#EAF3F0',
    gradient: ['#1C3A4E', '#2F6F7E', '#5FA3B0', '#DCEBE6'],
    feral: `${FERAL}HcpNCoJAGIfxq8jf7buosQze3TipCIVhS3ExmMnQhzIORIhH6CidwouF7X7wPCNa8IjBdf0ALuGvVSA3MQi-SMJk99c2kUG0WrRXcRSHqAju3TdgnIrsfBQg3MAAwYKRHqTKZOEVuZo_OQjLmN51bbT1bFfP3w6Eq9WPJbzMpQGhtdo8wUJMBAcuq-kH`,
  },
  {
    id: 'atardecer',
    name: 'Atardecer de tuna',
    note: 'El guiño a la tuna sin rojo: berenjena, durazno y crema.',
    bg: '#F2E9DE',
    surface: '#F8F2EA',
    ink: '#3B2530',
    muted: '#6E5A5F',
    accent: '#7A4A5E',
    accentInk: '#F8F2EA',
    field: '#4E2A3A',
    fieldInk: '#F5DCC4',
    heroInk: '#F8E6D4',
    gradient: ['#4E2A3A', '#A65A5A', '#D9826B', '#F2C38B', '#F5DCC4'],
    feral: `${FERAL}Jcy9CsIwGIXhWwmn6zelP9RsMYmTKNQ6lQ7BpqWItaQRkdJ7l-j2wHs4KwaIFUt4zgtEgyQzXKYShEQWucx_0ruSF_uoA1dp-VeulcrQEsJndhBQ5-MFhDsEQPAQkLWstFGmYtqw-nqKX3Epg_WduznPOsfCa7Ig9N4-YnuPnQNh8HacIDjfCAGiabcv`,
  },
  {
    id: 'verdant',
    name: 'Verdant pastel',
    note: 'Verdes suaves y lechosos, el más tranquilo de los cinco.',
    bg: '#F2F0E6',
    surface: '#F8F7F0',
    ink: '#23352A',
    muted: '#56655A',
    accent: '#3F6B4A',
    accentInk: '#F8F7F0',
    field: '#2F5A3C',
    fieldInk: '#ECEEDF',
    heroInk: '#1E2E22',
    gradient: ['#ECEEDF', '#C9D6B4', '#94B07E', '#5E8A5E', '#2F5A3C'],
    feral: `${FERAL}HcrBCoJAFEbhV5Hf7V2EaeXsRr3SoiJS3IiLASeRymRmIEJ895h2H5yzYIBYYN17thAtQs6ZixKEME-LXRZ7pXG22bNXwgeZ_BWVidzm6AjuO2sIVGeujiA8IACCgUDDt0Je6uAqq5pPIPiv0aZXkwtmZZ1-gnA36uXDZ-w1CINR4wQRRSvBQbTd-gM`,
  },
  {
    id: 'marea',
    name: 'Marea',
    note: 'Rosa y lavanda en ondas, el más moderno (y el más «de moda»).',
    bg: '#F4EFEA',
    surface: '#FAF6F2',
    ink: '#3A3344',
    muted: '#6B6375',
    accent: '#6E5A8A',
    accentInk: '#FAF6F2',
    field: '#4A3F5C',
    fieldInk: '#F7EFEA',
    heroInk: '#3A3344',
    gradient: ['#F7EFEA', '#F2CFC9', '#E7B9C0', '#B990AE', '#6E5A8A'],
    feral: `${FERAL}HcyxCsIwGEXhdzldM5SA1vxbWpKti4MOpUPAWIqoJQ2IlL67xO27HLgbE7Kx5veyIgOVb5x3FkXldec7U-Sa1nR1UWtMbV3R0R3syTIq8neJCFd7KeGBgCIh9Pb8fyq1DykGFPcUnmV_5ltEMaUwvxCtd0VGhnH_AQ`,
  },
];

const STEPS = [
  ['Elige', 'Explora el catálogo y abre la ficha: precio, existencias y cuidados de cada especie.'],
  ['Paga o aparta', 'Con Mercado Pago en línea, o cierra por WhatsApp y aparta con el 50%.'],
  ['Recibe', 'Te llega la confirmación y coordinamos la entrega en persona en CDMX.'],
];

// si el API no responde (p. ej. en local) se ven nombres reales del catálogo
const SAMPLE = ['Isópodo Shiro Utsuri', 'Isópodo Esqueleto Lemonade', 'Isópodo Gestroi Jumbo', 'Isópodo Titán'].map((common_name, id) => ({ id, common_name }));

const DISPLAY = { fontFamily: 'var(--od-font-display)', fontWeight: 400, lineHeight: 1.05, m: 0, textWrap: 'balance' };
const WRAP = { px: { xs: '20px', md: '48px' }, maxWidth: 1360, mx: 'auto' };

function Button({ href, children, solid, p }) {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 48,
        px: 3.5,
        borderRadius: 999,
        fontSize: 15,
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'transform 200ms ease, background-color 200ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
        '&:focus-visible': { outline: `2px solid ${p.accent}`, outlineOffset: 3 },
        ...(solid
          ? { bgcolor: p.accent, color: p.accentInk }
          : { bgcolor: p.surface, color: p.ink }),
      }}
    >
      {children}
    </Box>
  );
}

export function PalettePreview({ media, species }) {
  const [id, setId] = useState('citron');
  const p = PALETTES.find((x) => x.id === id);
  const img = `/prueba-paletas/${p.id}.jpg`;
  const photos = [media.isopod_zebra, media.isopod_cubaris, media.leaf_litter, media.moss_tall];

  // #marea en la URL abre directo esa paleta (para compartirla)
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (PALETTES.some((x) => x.id === h)) setId(h);
  }, []);
  const pick = (next) => {
    setId(next);
    window.history.replaceState(null, '', `#${next}`);
  };

  return (
    <Box sx={{ bgcolor: p.bg, color: p.ink, minHeight: '100vh', transition: 'background-color 300ms ease, color 300ms ease' }}>
      {/* Selector de paleta */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: p.surface, borderBottom: `1px solid ${p.ink}1f` }}>
        <Box sx={{ ...WRAP, display: 'flex', alignItems: 'center', gap: 1, py: 1.25, overflowX: 'auto' }}>
          <Box sx={{ fontSize: 13, color: p.muted, mr: 1, whiteSpace: 'nowrap' }}>Prueba de paletas:</Box>
          {PALETTES.map((x) => (
            <Box
              key={x.id}
              component="button"
              type="button"
              aria-pressed={x.id === id}
              onClick={() => pick(x.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.75,
                minHeight: 40,
                borderRadius: 999,
                border: 0,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                font: 'inherit',
                fontSize: 14,
                bgcolor: x.id === id ? p.ink : 'transparent',
                color: x.id === id ? p.surface : p.ink,
                '&:hover': { bgcolor: x.id === id ? p.ink : `${p.ink}14` },
                '&:focus-visible': { outline: `2px solid ${p.accent}`, outlineOffset: 2 },
              }}
            >
              <Box component="span" aria-hidden sx={{ display: 'flex' }}>
                {[x.bg, x.accent, x.field].map((c) => (
                  <Box key={c} component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c, ml: '-3px', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.7)' }} />
                ))}
              </Box>
              {x.name}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Portada sobre el degradado */}
      <Box component="section" sx={{ position: 'relative', minHeight: { xs: '82svh', md: '88svh' }, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', color: p.heroInk, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...WRAP, width: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src={`/brand/assets/logo/isotipo-${p.heroInk === p.ink ? 'claro' : 'oscuro'}.svg`} alt="" sx={{ width: 40, height: 40 }} />
            <Box sx={{ fontFamily: 'var(--od-font-display)', fontSize: 20, letterSpacing: '0.12em' }}>OPUNTIA DEN</Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, fontSize: 15 }}>
            {['Catálogo', 'El criadero', 'Fichas de cuidados', 'Contacto'].map((l) => (
              <Box key={l} component="span">{l}</Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ ...WRAP, width: 1, pt: { xs: 6, md: 10 } }}>
          <Box component="h1" sx={{ ...DISPLAY, fontSize: 'clamp(56px, 10vw, 152px)', letterSpacing: '-0.02em' }}>
            Historia natural
          </Box>
          <Box component="p" sx={{ mt: 4, mb: 0, maxWidth: 520, fontSize: { xs: 17, md: 20 }, lineHeight: 1.5 }}>
            Isópodos, colémbolos y fásmidos criados en casa en Ciudad de México, con su ficha de cuidados.
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 4 }}>
            <Button href="#seleccion" solid p={p}>Ver catálogo</Button>
            <Button href="#pasos" p={p}>Cómo comprar</Button>
          </Box>
        </Box>
      </Box>

      {/* Nuestra selección: sin cintas rojas; agotado = foto en gris */}
      <Box id="seleccion" component="section" sx={{ ...WRAP, py: { xs: 10, md: 16 } }}>
        <Box component="h2" sx={{ ...DISPLAY, fontSize: 'clamp(32px, 4vw, 56px)', mb: { xs: 5, md: 7 } }}>
          Nuestra selección
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {(species.length ? species : SAMPLE).map((s, i) => {
            const soldOut = i === 3;
            return (
              <Box key={s.id} component="article">
                <Box sx={{ aspectRatio: '4 / 5', bgcolor: p.surface, overflow: 'hidden', borderRadius: '6px' }}>
                  <Box component="img" src={photos[i]} alt="" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', filter: soldOut ? 'grayscale(1) opacity(0.6)' : 'none', transition: 'transform 500ms ease', '&:hover': { transform: 'scale(1.04)' } }} />
                </Box>
                <Box sx={{ mt: 1.75, fontSize: 13, color: i === 1 ? p.accent : p.muted, fontWeight: i === 1 ? 600 : 400 }}>
                  {soldOut ? 'Agotado · Avísame' : i === 1 ? 'Nuevo' : s.genus?.group?.name || 'Isópodos'}
                </Box>
                <Box sx={{ ...DISPLAY, fontSize: { xs: 19, md: 22 }, mt: 0.5 }}>{s.common_name || s.name}</Box>
                <Box sx={{ fontFamily: 'var(--od-font-display)', fontStyle: 'italic', fontSize: 15, color: p.muted, mt: 0.25 }}>
                  {[s.genus?.name, s.name].filter(Boolean).join(' ')}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* El criadero: campo oscuro plano con foto */}
      <Box component="section" sx={{ bgcolor: p.field, color: p.fieldInk }}>
        <Box sx={{ ...WRAP, py: { xs: 10, md: 16 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 10 }, alignItems: 'center' }}>
          <Box>
            <Box component="h2" sx={{ ...DISPLAY, fontSize: 'clamp(32px, 4vw, 56px)' }}>Un criadero pequeño con registro</Box>
            <Box component="p" sx={{ mt: 3.5, mb: 0, fontSize: 18, lineHeight: 1.6, maxWidth: 520 }}>
              Cada colonia nace aquí, en sustrato propio, con temperatura y humedad medidas. Lo que vendemos es lo que criamos.
            </Box>
            <Box sx={{ mt: 4 }}>
              <Box component="a" href="#pasos" sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, px: 3.5, borderRadius: 999, bgcolor: p.fieldInk, color: p.field, textDecoration: 'none', fontWeight: 500 }}>
                Conoce el criadero
              </Box>
            </Box>
          </Box>
          <Box component="img" src={media.moss_wide} alt="Musgo del criadero" sx={{ width: 1, aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
        </Box>
      </Box>

      {/* Cómo comprar: palabras grandes en lugar de 01/02/03 */}
      <Box id="pasos" component="section" sx={{ ...WRAP, py: { xs: 10, md: 16 } }}>
        <Box component="h2" sx={{ ...DISPLAY, fontSize: 'clamp(32px, 4vw, 56px)', mb: { xs: 5, md: 8 } }}>Tres pasos, sin sorpresas</Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {STEPS.map(([t, d]) => (
            <Box key={t} sx={{ bgcolor: p.surface, borderRadius: '6px', p: { xs: 3, md: 4 } }}>
              <Box sx={{ ...DISPLAY, fontSize: { xs: 30, md: 38 }, color: p.accent }}>{t}</Box>
              <Box component="p" sx={{ mt: 2, mb: 0, fontSize: 16, lineHeight: 1.6 }}>{d}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Cierre: segundo momento con el mismo degradado, de cabeza */}
      <Box component="section" sx={{ position: 'relative', overflow: 'clip' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleY(-1)' }} />
        <Box sx={{ ...WRAP, position: 'relative', py: { xs: 12, md: 18 }, textAlign: 'center', color: p.id === 'marea' ? p.ink : p.heroInk }}>
          <Box component="h2" sx={{ ...DISPLAY, fontSize: 'clamp(36px, 5vw, 72px)' }}>¿Dudas antes de comprar?</Box>
          <Box component="p" sx={{ mt: 3, mb: 4, fontSize: 18 }}>Escríbenos y te ayudamos a elegir tu primera colonia.</Box>
          <Button href="https://wa.me/525562292037" p={p}>Escribir por WhatsApp</Button>
        </Box>
      </Box>

      {/* Ficha de la paleta */}
      <Box component="footer" sx={{ ...WRAP, py: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ maxWidth: 420 }}>
          <Box sx={{ ...DISPLAY, fontSize: 28 }}>{p.name}</Box>
          <Box component="p" sx={{ mt: 1, mb: 2, color: p.muted }}>{p.note}</Box>
          <Box component="a" href={p.feral} target="_blank" rel="noreferrer" sx={{ color: p.accent, fontWeight: 500 }}>
            Abrir el degradado en Gradient Builder
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[['Fondo', p.bg], ['Superficie', p.surface], ['Tinta', p.ink], ['Acento', p.accent], ['Campo', p.field], ...p.gradient.map((c, i) => [`Degradado ${i + 1}`, c])].map(([label, c]) => (
            <Box key={label} sx={{ width: 92, fontSize: 12 }}>
              <Box sx={{ height: 56, borderRadius: '6px', bgcolor: c, boxShadow: `inset 0 0 0 1px ${p.ink}1a` }} />
              <Box sx={{ mt: 0.75 }}>{label}</Box>
              <Box sx={{ color: p.muted, fontVariantNumeric: 'tabular-nums' }}>{c}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
