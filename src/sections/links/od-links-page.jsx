import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { getLinkPages } from 'src/lib/public-api';
import { Pill, Star } from 'src/layouts/od/od-ui';

import { slugify } from 'src/sections/catalog/utils';

import { OdGuides } from './od-guides';
import { LinksTrack } from './links-track';
import { OdCountdown } from './od-countdown';

// ----------------------------------------------------------------------
// Página tipo "linktree" propia, compartida por /gracias (QR del sticker, ya
// compró) y /links (bio de Instagram, todavía no compra). Textos, botones,
// guías y eventos se editan en el dashboard (Sitio → Links y eventos) y llegan
// por getLinkPages(); cada ruta solo elige su página y el orden de secciones.
// Página sin el layout del sitio (barra, pestañas, sello flotante): ligera y
// pensada para el celular.
//
// Eventos de analítica: clic_<prefix><botón> y clic_<prefix>guia_<guía>
// (prefix '' en /gracias, 'links_' en /links).
// ----------------------------------------------------------------------

const isExternal = (url) => !url.startsWith('/');

// Nombre estable para analítica: los botones de siempre conservan su nombre
// aunque cambie el texto; el resto usa el texto.
const buttonKey = ({ url, label }) => {
  if (url.includes('wa.me') || url.startsWith('tel:')) return 'whatsapp';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.startsWith('/catalogo')) return 'catalogo';
  if (url === '/') return 'sitio';
  return slugify(label).replace(/-/g, '_');
};

// Hoy en CDMX como 'YYYY-MM-DD' (en-CA ya da ese formato) para comparar con
// las fechas del evento sin líos de zona horaria.
const todayMx = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

// El evento sigue visible hasta su último día (ends, o date si dura uno).
const nextEvent = (events = []) =>
  events
    .filter((e) => (e.ends || e.date) >= todayMx())
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

// ponytail: CDMX es UTC-6 todo el año desde 2022 (sin horario de verano)
const eventStart = (e) => `${e.date}T${e.time || '00:00'}:00-06:00`;

const eventWhen = (e) => {
  const day = new Date(`${e.date}T12:00:00-06:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  });
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}${e.time ? ` · ${e.time} h` : ''}`;
};

const focusSx = { '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' } };

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

const linkPill = (b, track) => (
  <Pill key={`${b.label}${b.url}`} href={b.url} data-track={track} {...(isExternal(b.url) && { target: '_blank', rel: 'noopener' })} sx={pillSx(b.primary)}>
    {b.label}
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
  guides: ({ guides, prefix }) =>
    guides.length ? (
      <Box component="section" aria-labelledby="guias" sx={{ mt: 6 }}>
        <Kicker id="guias" n="01">
          Guías de cuidado
        </Kicker>
        <OdGuides guides={guides} prefix={prefix} />
      </Box>
    ) : null,

  links: ({ page, prefix }) => (
    <Box component="nav" aria-label="Enlaces" sx={{ mt: 6, display: 'grid', gap: 1.5 }}>
      {page.buttons.map((b) => linkPill(b, `clic_${prefix}${buttonKey(b)}`))}
    </Box>
  ),

  // El próximo evento que no haya pasado (hora de CDMX); sin eventos, nada.
  // getLinkPages revalida cada minuto, así que desaparece solo.
  event: ({ events, prefix }) => {
    const e = nextEvent(events);
    if (!e) return null;
    return (
      <Box component="section" aria-labelledby="evento" className="od-card" sx={{ mt: 6, overflow: 'hidden' }}>
        <Box className="od-ticks" aria-hidden />
        <Box sx={{ p: 2.5 }}>
          <Box className="od-label" sx={{ color: 'var(--od-tuna)' }}>
            Próximo evento
          </Box>
          <Box id="evento" component="p" sx={{ m: 0, mt: 1, fontFamily: 'var(--od-font-display)', fontSize: 26, lineHeight: 1.15, textWrap: 'balance' }}>
            {e.title}
          </Box>
          <Box sx={{ mt: 1.25, fontSize: 14, lineHeight: 1.5, color: 'var(--od-text-muted)' }}>
            {eventWhen(e)}
            {e.place && <Box>{e.place}</Box>}
          </Box>
          <OdCountdown target={eventStart(e)} />
          {e.url && <Box sx={{ mt: 2.5 }}>{linkPill({ label: e.url_label || 'Más información', url: e.url }, `clic_${prefix}evento`)}</Box>}
        </Box>
      </Box>
    );
  },
};

export async function OdLinksPage({ pageKey, visit, prefix = '', sections, phone = false }) {
  const data = await getLinkPages();
  const page = data.pages[pageKey];

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
          {page.label && <Box className="od-label">{page.label}</Box>}
          <Box component="h1" sx={{ m: 0, mt: 1.5, fontFamily: 'var(--od-font-display)', fontWeight: 400, fontSize: { xs: 38, sm: 46 }, lineHeight: 1.1, textWrap: 'balance' }}>
            {page.title}
          </Box>
          {page.lead && (
            <Box component="p" sx={{ m: 0, mt: 2, mx: 'auto', maxWidth: '40ch', fontSize: 16, lineHeight: 1.55, color: 'var(--od-text-muted)' }}>
              {page.lead}
            </Box>
          )}
        </Box>

        {sections.map((s) => {
          const Section = SECTIONS[s];
          return <Section key={s} page={page} guides={data.guides} events={data.events} prefix={prefix} />;
        })}

        {/* Pie */}
        <Box component="footer" sx={{ mt: 7, textAlign: 'center', fontSize: 13, color: 'var(--od-text-muted)' }}>
          <Box component="img" src="/brand/ornaments/divisor-hojas.svg" alt="" width={96} height={24} sx={{ display: 'block', mx: 'auto', mb: 2.5, color: 'var(--od-tinta)' }} />
          {/* frase de apoyo del lema (guía de marca): siempre como etiqueta */}
          <Box sx={{ mb: 1.5, fontSize: 11, letterSpacing: 'var(--od-tracking-label)', textTransform: 'uppercase' }}>
            Observar · criar · compartir
          </Box>
          {page.footer}
          {phone && (
            <>
              {page.footer && ' · '}
              <Box component="a" href={`tel:+${CONFIG.whatsapp}`} sx={[focusSx, { color: 'inherit' }]}>
                {CONFIG.phone}
              </Box>
            </>
          )}
          <Box sx={{ mt: 2.5 }}>
            <Star sx={{ width: 12, height: 12 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
