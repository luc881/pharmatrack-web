import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { Pill, Star, SciName } from 'src/layouts/od/od-ui';

import { LinksTrack } from './links-track';

// ----------------------------------------------------------------------
// Página tipo "linktree" propia, compartida por /gracias (QR del sticker, ya
// compró) y /links (bio de Instagram, todavía no compra). Cada ruta pasa su
// configuración: encabezado, orden de secciones, botones, evento y pie.
// Página estática, sin el layout del sitio (barra, pestañas, sello flotante):
// ligera y pensada para el celular.
//
// Eventos de analítica: clic_<prefix><key> y clic_<prefix>guia_<grupo>
// (prefix '' en /gracias, 'links_' en /links).
// ----------------------------------------------------------------------

export const WA = `https://wa.me/${CONFIG.whatsapp}`;
const waGuide = (name) => `${WA}?text=${encodeURIComponent(`Hola, quiero la guía de cuidados de ${name}.`)}`;

// Artículo real del sitio que cubre isópodos y colémbolos
const ISO_COLE = '/articulos/isopodos-y-colembolos-el-equipo-de-limpieza-del-terrario-2';

// href: página real del sitio. Sin página → `todo` y el botón pide la guía por
// WhatsApp (no se inventa contenido de cuidados).
const GUIDES = [
  {
    key: 'fasmidos',
    name: 'Fásmidos',
    // TODO(guias): no hay guía ni especie publicada de fásmidos; enlazar aquí cuando exista.
    todo: true,
    species: [
      {
        key: 'fasmidos',
        sci: 'Phyllium gardabagusi "Argopuro"',
        // TODO(guias): enlazar la ficha /catalogo/... de P. gardabagusi "Argopuro" cuando se publique.
        todo: true,
      },
    ],
  },
  { key: 'isopodos', name: 'Isópodos', href: ISO_COLE },
  { key: 'colembolos', name: 'Colémbolos', href: ISO_COLE },
  // TODO(guias): no hay guía de cucarachas; enlazar aquí cuando exista.
  { key: 'cucarachas', name: 'Cucarachas', todo: true },
];

// Botones disponibles; cada página elige cuáles, en qué orden y con qué texto.
export const LINK = {
  catalogo: { key: 'catalogo', label: 'Ver catálogo', href: '/catalogo', primary: true },
  instagram: { key: 'instagram', label: `Instagram · ${CONFIG.instagramHandle}`, href: CONFIG.instagram, external: true },
  whatsapp: { key: 'whatsapp', label: `WhatsApp · ${CONFIG.phoneLabel}`, href: WA, external: true },
  sitio: { key: 'sitio', label: 'Sitio web', href: '/' },
};

// Hoy en CDMX como 'YYYY-MM-DD' (en-CA ya da ese formato) para comparar con
// las fechas del evento sin líos de zona horaria.
const todayMx = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

const focusSx = { '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' } };

const cardSx = {
  ...focusSx,
  minHeight: 56,
  px: 2.5,
  py: 1.5,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  bgcolor: 'var(--od-papel)',
  border: '1px solid var(--od-linea)',
  borderRadius: 'var(--od-radius-md)',
  boxShadow: 'var(--od-shadow-flat)',
  color: 'var(--od-tinta)',
  textDecoration: 'none',
  transition: 'transform 200ms ease, box-shadow 200ms ease',
  '@media (hover: hover)': {
    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: '5px 5px 0 rgba(51, 36, 20, 0.12)' },
  },
};

const guideLink = (g) =>
  g.todo
    ? { href: waGuide(g.sci ?? g.name), target: '_blank', rel: 'noopener' }
    : { href: g.href };

function GuideCard({ g, sub, prefix }) {
  return (
    <Box component="a" {...guideLink(g)} data-track={`clic_${prefix}guia_${g.key}`} sx={[cardSx, sub && { ml: 3, minHeight: 48 }]}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ fontFamily: 'var(--od-font-display)', fontSize: sub ? 17 : 21, lineHeight: 1.2 }}>
          {g.sci ? <SciName>{g.sci}</SciName> : g.name}
        </Box>
        {g.todo && <Box sx={{ mt: 0.5, fontSize: 12, color: 'var(--od-text-muted)' }}>Pídela por WhatsApp</Box>}
      </Box>
      <Box component="span" aria-hidden sx={{ fontSize: 18 }}>
        {g.todo ? '↗' : '→'}
      </Box>
    </Box>
  );
}

// Píldoras a lo ancho sobre crema. Pill trae el relleno de hover (.od-fxbtn).
const pillSx = (primary) => [
  focusSx,
  {
    width: 1,
    minHeight: 52,
    fontSize: 15,
    fontFamily: 'var(--od-font-body)',
    fontWeight: 500,
    border: '1px solid var(--od-tinta)',
    bgcolor: primary ? 'var(--od-tinta)' : 'transparent',
    color: primary ? 'var(--od-papel)' : 'var(--od-tinta)',
    '--od-fxbtn-fill': primary ? 'var(--od-tuna)' : 'var(--od-tinta)',
    '--od-fxbtn-ink': 'var(--od-papel)',
  },
];

const linkPill = (l, prefix) => (
  <Pill key={l.key} href={l.href} data-track={`clic_${prefix}${l.key}`} {...(l.external && { target: '_blank', rel: 'noopener' })} sx={pillSx(l.primary)}>
    {l.label}
  </Pill>
);

function Kicker({ id, n, children }) {
  return (
    <Box id={id} component="h2" className="od-label" sx={{ m: 0, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box component="span" sx={{ color: 'var(--od-tuna)' }}>{n}</Box>
      <Box component="span" aria-hidden sx={{ width: 32, height: '1px', bgcolor: 'currentColor' }} />
      {children}
    </Box>
  );
}

const SECTIONS = {
  guides: ({ prefix }) => (
    <Box component="section" aria-labelledby="guias" sx={{ mt: 6 }}>
      <Kicker id="guias" n="01">
        Guías de cuidado
      </Kicker>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {GUIDES.map((g) => (
          <Box key={g.name} sx={{ display: 'grid', gap: 1.5 }}>
            <GuideCard g={g} prefix={prefix} />
            {g.species?.map((s) => <GuideCard key={s.sci} g={s} prefix={prefix} sub />)}
          </Box>
        ))}
      </Box>
    </Box>
  ),

  links: ({ links, prefix }) => (
    <Box component="nav" aria-label="Enlaces" sx={{ mt: 6, display: 'grid', gap: 1.5 }}>
      {links.map((l) => linkPill(l, prefix))}
    </Box>
  ),

  // Se oculta solo al día siguiente de `ends` (hora de CDMX). La ruta que lo
  // use necesita `revalidate` para que la página se vuelva a generar.
  event: ({ event, prefix }) =>
    event && todayMx() <= event.ends ? (
      <Box component="section" aria-labelledby="evento" className="od-card" sx={{ mt: 6, overflow: 'hidden' }}>
        <Box className="od-ticks" aria-hidden />
        <Box sx={{ p: 2.5 }}>
          <Box id="evento" className="od-label" sx={{ color: 'var(--od-tuna)' }}>
            Próximo evento
          </Box>
          <Box component="p" sx={{ m: 0, mt: 1, fontFamily: 'var(--od-font-display)', fontSize: 26, lineHeight: 1.15 }}>
            {event.title}
          </Box>
          {event.href && (
            <Box sx={{ mt: 2 }}>{linkPill({ key: 'evento', label: 'Más información', href: event.href, external: !event.href.startsWith('/') }, prefix)}</Box>
          )}
        </Box>
      </Box>
    ) : null,
};

export function OdLinksPage({ visit, prefix = '', label, title, lead, sections, links, event, footer }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        bgcolor: 'var(--od-crema)',
        color: 'var(--od-tinta)',
        fontFamily: 'var(--od-font-body)',
        px: '20px',
        py: { xs: 6, sm: 8 },
      }}
    >
      <LinksTrack visit={visit} />

      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        {/* Encabezado */}
        <Box component="header" sx={{ textAlign: 'center' }}>
          <Box component="img" src="/brand/assets/logo/sello-claro.svg" alt="Sello de Opuntia Den" width={112} height={112} sx={{ display: 'block', mx: 'auto', mb: 3 }} />
          <Box className="od-label">{label}</Box>
          <Box component="h1" sx={{ m: 0, mt: 1.5, fontFamily: 'var(--od-font-display)', fontWeight: 400, fontSize: { xs: 38, sm: 46 }, lineHeight: 1.1, textWrap: 'balance' }}>
            {title}
          </Box>
          <Box component="p" sx={{ m: 0, mt: 2, mx: 'auto', maxWidth: '40ch', fontSize: 16, lineHeight: 1.55, color: 'var(--od-text-muted)' }}>
            {lead}
          </Box>
        </Box>

        {sections.map((s) => {
          const Section = SECTIONS[s];
          return <Section key={s} links={links} event={event} prefix={prefix} />;
        })}

        {/* Pie */}
        <Box component="footer" sx={{ mt: 7, textAlign: 'center', fontSize: 13, color: 'var(--od-text-muted)' }}>
          <Box component="img" src="/brand/ornaments/divisor-hojas.svg" alt="" width={96} height={24} sx={{ display: 'block', mx: 'auto', mb: 2.5, color: 'var(--od-tinta)' }} />
          {footer}
          <Box sx={{ mt: 2.5 }}>
            <Star sx={{ width: 12, height: 12 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Enlace de teléfono del pie, con el mismo foco que el resto
export function PhoneLink() {
  return (
    <Box component="a" href={`tel:+${CONFIG.whatsapp}`} sx={[focusSx, { color: 'inherit' }]}>
      {CONFIG.phone}
    </Box>
  );
}
