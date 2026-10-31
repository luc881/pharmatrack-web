'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import GRADIENTS from './gradients.json';

// ----------------------------------------------------------------------
// Vista de prueba: las mismas secciones del inicio con cada paleta, más seis
// formas de degradado por paleta y los estados (desactivado, agotado, vacío,
// error) en una paleta neutra común. Los degradados los dibuja Feral Gradient
// Builder: gradients.json guarda el código `g` de cada uno (se generó con su
// conector) y aquí solo se arma la URL de la imagen o del estudio.
// `heroInk` es el color del texto sobre la parte alta del degradado.
// `verdict` resume lo que diría la skill de diseño (taste-skill) de la paleta.
// ----------------------------------------------------------------------

const feralImg = (g, size) => `https://feralui.dev/api/gradient.jpg?g=${encodeURIComponent(g)}&size=${size}`;
const feralStudio = (g) => `https://feralui.dev/gradients?g=${encodeURIComponent(g)}`;

const STYLE_NAMES = { prism: 'Prisma', columns: 'Columnas', waves: 'Ondas', sunrise: 'Amanecer', still: 'Fluido', forms: 'Formas' };

const PALETTES = [
  {
    id: 'citron',
    name: 'Citrón / Nopal',
    liked: true,
    verdict: ['Recomendada', 'Tinta verde sobre crema: el patrón de los sitios mejor calificados, y los colores salen del propio criadero (nopal, musgo).'],
    bg: '#ECE8DC', surface: '#F4F1E8', ink: '#2B3324', muted: '#5E6452', accent: '#5C6B3A', accentInk: '#F4F1E8', field: '#2E3B2A', fieldInk: '#E9EBC4', heroInk: '#F1F0DC',
    colors: ['#2E3B2A', '#5C6B3A', '#8FA35A', '#E9EBC4'],
  },
  {
    id: 'atardecer',
    name: 'Atardecer de tuna',
    liked: true,
    verdict: ['Con cuidado', 'Crema con durazno se acerca a «crema con terracota», que la skill marca como look de IA. Funciona si el durazno vive en los degradados y no en los botones.'],
    bg: '#F2E9DE', surface: '#F8F2EA', ink: '#3B2530', muted: '#6E5A5F', accent: '#7A4A5E', accentInk: '#F8F2EA', field: '#4E2A3A', fieldInk: '#F5DCC4', heroInk: '#F8E6D4',
    colors: ['#4E2A3A', '#A65A5A', '#D9826B', '#F2C38B', '#F5DCC4'],
  },
  {
    id: 'verdant',
    name: 'Verdant pastel',
    liked: true,
    verdict: ['Recomendada', 'Verdes de la naturaleza, tranquila. Lo débil: el texto oscuro sobre verde medio de la portada pierde fuerza.'],
    bg: '#F2F0E6', surface: '#F8F7F0', ink: '#23352A', muted: '#56655A', accent: '#3F6B4A', accentInk: '#F8F7F0', field: '#2F5A3C', fieldInk: '#ECEEDF', heroInk: '#1E2E22',
    colors: ['#ECEEDF', '#C9D6B4', '#94B07E', '#5E8A5E', '#2F5A3C'],
  },
  {
    id: 'musgo',
    name: 'Musgo',
    verdict: ['La que la skill elegiría', 'Verde profundo de musgo sobre crema verdoso: sale literalmente del sustrato, y el verde intenso de los degradados se ve vivo sin caer en moda.'],
    bg: '#EFF0E2', surface: '#F7F7EE', ink: '#173E36', muted: '#4E6660', accent: '#247465', accentInk: '#F7F7EE', field: '#173E36', fieldInk: '#E5F1CD', heroInk: '#E5F1CD',
    colors: ['#173E36', '#247465', '#55B895', '#ACDDB5', '#E5F1CD'],
  },
  {
    id: 'lapis',
    name: 'Lapislázuli',
    verdict: ['Buena', 'Azul verdoso de agua y humedad con tinta profunda. Menos «criadero» que las verdes, pero limpia y distinta.'],
    bg: '#EEF0E4', surface: '#F6F7EE', ink: '#123E49', muted: '#4F6A6E', accent: '#207681', accentInk: '#F6F7EE', field: '#123E49', fieldInk: '#EDF4D9', heroInk: '#EDF4D9',
    colors: ['#123E49', '#207681', '#53ADAE', '#ADDBCC', '#EDF4D9'],
  },
  {
    id: 'hanada',
    name: 'Hanada',
    verdict: ['Con cuidado', 'Índigo: la skill lo marca como color de páginas generadas. El crema durazno del final la suaviza.'],
    bg: '#F4EDE4', surface: '#FAF6F0', ink: '#192D68', muted: '#56607A', accent: '#3F63A8', accentInk: '#FAF6F0', field: '#192D68', fieldInk: '#F4E9DD', heroInk: '#F4E9DD',
    colors: ['#192D68', '#3F63A8', '#8DAAD3', '#CFDDEA', '#F4E9DD'],
  },
  {
    id: 'ciruela',
    name: 'Ciruela',
    verdict: ['Con cuidado', 'Ciruela y rosa quedan cerca de la familia violeta que la skill evita. Bonita en degradado, arriesgada como color de marca.'],
    bg: '#F4ECE6', surface: '#FAF4F0', ink: '#491D36', muted: '#7A5A68', accent: '#893C64', accentInk: '#FAF4F0', field: '#491D36', fieldInk: '#F4D4CE', heroInk: '#F4D4CE',
    colors: ['#491D36', '#893C64', '#C3758F', '#E1A4AF', '#F4D4CE'],
  },
  {
    id: 'berenjena',
    name: 'Berenjena',
    verdict: ['No recomendada', 'Violeta y lavanda: justo la familia que la skill marca como «hecho por IA».'],
    bg: '#F4ECE8', surface: '#FAF5F2', ink: '#4B355D', muted: '#6F6278', accent: '#8D567D', accentInk: '#FAF5F2', field: '#4B355D', fieldInk: '#F0DFDA', heroInk: '#F0DFDA',
    colors: ['#4B355D', '#8D567D', '#C080A1', '#E0B5BE', '#F0DFDA'],
  },
  {
    id: 'fuji',
    name: 'Fuji',
    verdict: ['No recomendada', 'Índigo con lavanda sobre crema: la combinación más «genérica» para la skill.'],
    bg: '#F5EEE7', surface: '#FAF6F1', ink: '#34325A', muted: '#66617A', accent: '#69628B', accentInk: '#FAF6F1', field: '#34325A', fieldInk: '#F5DCC6', heroInk: '#F5DCC6',
    colors: ['#34325A', '#69628B', '#B09DBB', '#E3BFC8', '#F5DCC6'],
  },
  {
    id: 'caqui',
    name: 'Caqui',
    verdict: ['No recomendada', 'Es la más roja de todas: vuelve al rojo que querías quitar, y carmesí con crema es lo que la skill más evita.'],
    bg: '#F6ECE2', surface: '#FBF5EE', ink: '#521A37', muted: '#7C5A62', accent: '#9C204C', accentInk: '#FBF5EE', field: '#521A37', fieldInk: '#F7D0B5', heroInk: '#F7D0B5',
    colors: ['#521A37', '#9C204C', '#E24762', '#F8968E', '#F7D0B5'],
  },
];

// Paleta neutra común a todas para lo que no está disponible: desactivado,
// agotado, vacío y error. No compite con el color de la marca.
const N = { ink: '#303840', muted: '#67767C', stone: '#A6B6B7', ash: '#D4DDDA', paper: '#F1F0EA' };

// si el API no responde (p. ej. en local) se ven nombres reales del catálogo
const SAMPLE = ['Isópodo Shiro Utsuri', 'Isópodo Esqueleto Lemonade', 'Isópodo Gestroi Jumbo', 'Isópodo Titán'].map((common_name, id) => ({ id, common_name }));

const STEPS = [
  ['Elige', 'Explora el catálogo y abre la ficha: precio, existencias y cuidados de cada especie.'],
  ['Paga o aparta', 'Con Mercado Pago en línea, o cierra por WhatsApp y aparta con el 50%.'],
  ['Recibe', 'Te llega la confirmación y coordinamos la entrega en persona en CDMX.'],
];

const DISPLAY = { fontFamily: 'var(--od-font-display)', fontWeight: 400, lineHeight: 1.05, m: 0, textWrap: 'balance' };
const WRAP = { px: { xs: '20px', md: '48px' }, maxWidth: 1360, mx: 'auto' };
const H2 = { ...DISPLAY, fontSize: 'clamp(32px, 4vw, 56px)' };
const PILL = { display: 'inline-flex', alignItems: 'center', minHeight: 48, px: 3.5, borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: 'none', border: 0, font: 'inherit' };

function Button({ href, children, solid, p }) {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        ...PILL,
        transition: 'transform 200ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
        '&:focus-visible': { outline: `2px solid ${p.accent}`, outlineOffset: 3 },
        ...(solid ? { bgcolor: p.accent, color: p.accentInk } : { bgcolor: p.surface, color: p.ink }),
      }}
    >
      {children}
    </Box>
  );
}

export function PalettePreview({ media, species }) {
  const [id, setId] = useState('citron');
  const p = PALETTES.find((x) => x.id === id);
  const g = GRADIENTS[p.id];
  const hero = feralImg(g.styles[g.hero], 1920);
  // Feral dibuja cada imagen la primera vez que se pide: mientras llega, el
  // color de fondo del degradado mantiene legible el texto
  const heroBg = p.id === 'verdant' ? p.colors[2] : p.colors[0];
  const photos = [media.isopod_zebra, media.isopod_cubaris, media.leaf_litter, media.moss_tall];

  // #musgo en la URL abre directo esa paleta (para compartirla)
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
        <Box sx={{ ...WRAP, display: 'flex', alignItems: 'center', gap: 0.75, py: 1.25, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {PALETTES.map((x, i) => (
            <Box key={x.id} sx={{ display: 'contents' }}>
              {i === 3 && <Box aria-hidden sx={{ width: '1px', alignSelf: 'stretch', bgcolor: `${p.ink}26`, mx: 1, flexShrink: 0 }} />}
              <Box
                component="button"
                type="button"
                aria-pressed={x.id === id}
                onClick={() => pick(x.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  minHeight: 40,
                  borderRadius: 999,
                  border: 0,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  font: 'inherit',
                  fontSize: 14,
                  flexShrink: 0,
                  bgcolor: x.id === id ? p.ink : 'transparent',
                  color: x.id === id ? p.surface : p.ink,
                  '&:hover': { bgcolor: x.id === id ? p.ink : `${p.ink}14` },
                  '&:focus-visible': { outline: `2px solid ${p.accent}`, outlineOffset: 2 },
                }}
              >
                <Box component="span" aria-hidden sx={{ display: 'flex' }}>
                  {[x.colors[0], x.colors[2], x.colors[x.colors.length - 1]].map((c) => (
                    <Box key={c} component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c, ml: '-3px', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.75)' }} />
                  ))}
                </Box>
                {x.name}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Portada sobre el degradado */}
      <Box component="section" sx={{ position: 'relative', minHeight: { xs: '82svh', md: '88svh' }, bgcolor: heroBg, backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', color: p.heroInk, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...WRAP, width: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src={`/brand/assets/logo/isotipo-${p.heroInk === p.ink || p.id === 'verdant' ? 'claro' : 'oscuro'}.svg`} alt="" sx={{ width: 40, height: 40 }} />
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
            <Button href="#formas" p={p}>Ver los degradados</Button>
          </Box>
        </Box>
      </Box>

      {/* Lo que diría la skill */}
      <Box component="section" sx={{ ...WRAP, pt: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: { xs: 1.5, md: 6 }, alignItems: 'baseline', bgcolor: p.surface, borderRadius: '6px', p: { xs: 3, md: 4 } }}>
          <Box sx={{ ...DISPLAY, fontSize: { xs: 26, md: 30 } }}>{p.verdict[0]}</Box>
          <Box component="p" sx={{ m: 0, fontSize: 17, lineHeight: 1.6 }}>{p.verdict[1]}</Box>
        </Box>
      </Box>

      {/* Seis formas del mismo juego de colores */}
      <Box id="formas" component="section" sx={{ ...WRAP, py: { xs: 8, md: 12 } }}>
        <Box component="h2" sx={{ ...H2, mb: 1.5 }}>{p.name} en seis formas</Box>
        <Box component="p" sx={{ mt: 0, mb: { xs: 4, md: 6 }, color: p.muted, fontSize: 17 }}>
          Los mismos colores en cada estilo de Feral. Toca uno para abrirlo y ajustarlo en el estudio.
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {Object.entries(g.styles).map(([style, code]) => (
            <Box key={style} component="a" href={feralStudio(code)} target="_blank" rel="noreferrer" sx={{ color: 'inherit', textDecoration: 'none', '&:hover img': { transform: 'scale(1.03)' }, '&:focus-visible': { outline: `2px solid ${p.accent}`, outlineOffset: 3 } }}>
              <Box sx={{ aspectRatio: '16 / 10', overflow: 'hidden', borderRadius: '6px', bgcolor: p.surface }}>
                <Box component="img" src={feralImg(code, 960)} alt={`Degradado ${STYLE_NAMES[style]}`} loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', transition: 'transform 500ms ease' }} />
              </Box>
              <Box sx={{ mt: 1.25, fontSize: 15 }}>{STYLE_NAMES[style]}{style === g.hero ? ' · en la portada' : ''}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nuestra selección: sin cintas rojas; agotado = foto en gris neutro */}
      <Box id="seleccion" component="section" sx={{ ...WRAP, py: { xs: 8, md: 12 } }}>
        <Box component="h2" sx={{ ...H2, mb: { xs: 5, md: 7 } }}>Nuestra selección</Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {(species.length ? species : SAMPLE).map((s, i) => {
            const soldOut = i === 3;
            return (
              <Box key={s.id} component="article">
                <Box sx={{ aspectRatio: '4 / 5', bgcolor: soldOut ? N.ash : p.surface, overflow: 'hidden', borderRadius: '6px' }}>
                  <Box component="img" src={photos[i]} alt="" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', filter: soldOut ? 'grayscale(1) opacity(0.55)' : 'none', transition: 'transform 500ms ease', '&:hover': { transform: 'scale(1.04)' } }} />
                </Box>
                <Box sx={{ mt: 1.75, fontSize: 13, color: soldOut ? N.muted : i === 1 ? p.accent : p.muted, fontWeight: i === 1 ? 600 : 400 }}>
                  {soldOut ? 'Agotado · Avísame' : i === 1 ? 'Nuevo' : s.genus?.group?.name || 'Isópodos'}
                </Box>
                <Box sx={{ ...DISPLAY, fontSize: { xs: 19, md: 22 }, mt: 0.5, color: soldOut ? N.muted : 'inherit' }}>{s.common_name || s.name}</Box>
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
            <Box component="h2" sx={H2}>Un criadero pequeño con registro</Box>
            <Box component="p" sx={{ mt: 3.5, mb: 0, fontSize: 18, lineHeight: 1.6, maxWidth: 520 }}>
              Cada colonia nace aquí, en sustrato propio, con temperatura y humedad medidas. Lo que vendemos es lo que criamos.
            </Box>
            <Box sx={{ mt: 4 }}>
              <Box component="a" href="#pasos" sx={{ ...PILL, bgcolor: p.fieldInk, color: p.field }}>Conoce el criadero</Box>
            </Box>
          </Box>
          <Box component="img" src={media.moss_wide} alt="Musgo del criadero" sx={{ width: 1, aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
        </Box>
      </Box>

      {/* Cómo comprar: palabras grandes en lugar de 01/02/03 */}
      <Box id="pasos" component="section" sx={{ ...WRAP, py: { xs: 10, md: 16 } }}>
        <Box component="h2" sx={{ ...H2, mb: { xs: 5, md: 8 } }}>Tres pasos, sin sorpresas</Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {STEPS.map(([t, d]) => (
            <Box key={t} sx={{ bgcolor: p.surface, borderRadius: '6px', p: { xs: 3, md: 4 } }}>
              <Box sx={{ ...DISPLAY, fontSize: { xs: 30, md: 38 }, color: p.accent }}>{t}</Box>
              <Box component="p" sx={{ mt: 2, mb: 0, fontSize: 16, lineHeight: 1.6 }}>{d}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Estados en la paleta neutra (igual para todas las paletas) */}
      <Box component="section" sx={{ bgcolor: N.paper, color: N.ink }}>
        <Box sx={{ ...WRAP, py: { xs: 10, md: 14 } }}>
          <Box component="h2" sx={{ ...H2, mb: 1.5 }}>Lo que no está disponible, en neutro</Box>
          <Box component="p" sx={{ mt: 0, mb: { xs: 4, md: 6 }, color: N.muted, fontSize: 17, maxWidth: 640 }}>
            Desactivado, agotado, vacío y error usan siempre estos grises azulados, con cualquier paleta. Así el color de la marca queda solo para lo que sí se puede hacer.
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: '6px', p: 3.5 }}>
              <Box sx={{ ...DISPLAY, fontSize: 24, mb: 2.5 }}>Botones</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <Button href="#estados" solid p={p}>Agregar al carrito</Button>
                <Box component="button" type="button" disabled sx={{ ...PILL, bgcolor: N.ash, color: N.muted, cursor: 'not-allowed' }}>Sin existencias</Box>
              </Box>
              <Box sx={{ mt: 3, fontSize: 14, color: N.muted }}>Activo con el acento de la paleta; desactivado en gris.</Box>
            </Box>
            <Box sx={{ bgcolor: '#fff', borderRadius: '6px', p: 3.5 }}>
              <Box sx={{ ...DISPLAY, fontSize: 24, mb: 2.5 }}>Formulario con error</Box>
              <Box component="label" htmlFor="prueba-tel" sx={{ display: 'block', fontSize: 14, mb: 0.75 }}>WhatsApp</Box>
              <Box component="input" id="prueba-tel" defaultValue="55 62" aria-invalid="true" aria-describedby="prueba-tel-error" sx={{ width: 1, minHeight: 46, px: 1.75, borderRadius: '6px', border: `2px solid ${N.ink}`, bgcolor: N.paper, color: N.ink, font: 'inherit', fontSize: 16 }} />
              <Box id="prueba-tel-error" sx={{ mt: 1, fontSize: 14, fontWeight: 600 }}>Faltan dígitos: escribe los 10 del número.</Box>
              <Box sx={{ mt: 2, fontSize: 14, color: N.muted }}>El error se dice con palabras y un borde más grueso, no con rojo.</Box>
            </Box>
            <Box sx={{ bgcolor: '#fff', borderRadius: '6px', p: 3.5 }}>
              <Box sx={{ ...DISPLAY, fontSize: 24, mb: 2.5 }}>Lista vacía</Box>
              <Box sx={{ bgcolor: N.paper, borderRadius: '6px', p: 3, textAlign: 'center' }}>
                <Box component="img" src="/brand/assets/logo/isotipo-claro.svg" alt="" sx={{ width: 48, height: 48, opacity: 0.45, filter: 'grayscale(1)' }} />
                <Box sx={{ mt: 1.5 }}>No hay animales en esta categoría por ahora.</Box>
                <Box component="a" href="#seleccion" sx={{ display: 'inline-block', mt: 1, color: N.ink, fontWeight: 500 }}>Ver todo el catálogo</Box>
              </Box>
            </Box>
          </Box>

          {/* Página de error con el degradado neutro */}
          <Box id="estados" sx={{ mt: { xs: 2, md: 3 }, borderRadius: '6px', overflow: 'hidden', bgcolor: N.stone, backgroundImage: `url(${feralImg(GRADIENTS.neutro.styles.still, 1600)})`, backgroundSize: 'cover', backgroundPosition: 'center', color: N.ink, px: { xs: 3, md: 6 }, py: { xs: 7, md: 10 } }}>
            <Box sx={{ fontSize: 15, color: N.ink, opacity: 0.8 }}>Error 404</Box>
            <Box sx={{ ...DISPLAY, fontSize: 'clamp(36px, 5vw, 64px)', mt: 1 }}>Esta página no existe</Box>
            <Box component="p" sx={{ mt: 2, mb: 3.5, fontSize: 18, maxWidth: 520 }}>Quizá cambió de dirección. El catálogo y las fichas siguen aquí.</Box>
            <Box component="a" href="#seleccion" sx={{ ...PILL, bgcolor: N.ink, color: N.paper }}>Volver al inicio</Box>
          </Box>
        </Box>
      </Box>

      {/* Cierre: segundo momento con el degradado de la portada, de cabeza */}
      <Box component="section" sx={{ position: 'relative', overflow: 'clip' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, bgcolor: heroBg, backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleY(-1)' }} />
        <Box sx={{ ...WRAP, position: 'relative', py: { xs: 12, md: 18 }, textAlign: 'center', color: p.heroInk }}>
          <Box component="h2" sx={{ ...DISPLAY, fontSize: 'clamp(36px, 5vw, 72px)' }}>¿Dudas antes de comprar?</Box>
          <Box component="p" sx={{ mt: 3, mb: 4, fontSize: 18 }}>Escríbenos y te ayudamos a elegir tu primera colonia.</Box>
          <Button href="https://wa.me/525562292037" p={p}>Escribir por WhatsApp</Button>
        </Box>
      </Box>

      {/* Ficha de la paleta */}
      <Box component="footer" sx={{ ...WRAP, py: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ ...DISPLAY, fontSize: 28 }}>{p.name}</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[['Fondo', p.bg], ['Superficie', p.surface], ['Tinta', p.ink], ['Acento', p.accent], ['Campo', p.field], ...p.colors.map((c, i) => [`Degradado ${i + 1}`, c])].map(([label, c]) => (
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
