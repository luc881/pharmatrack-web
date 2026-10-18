import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { sheetSections } from 'src/lib/care-sheets';
import { Pill, Star, OdImage } from 'src/layouts/od/od-ui';

import { SheetLink } from './sheet-link';
import { renderInline, renderMarkdown } from './sheet-markdown';

// ----------------------------------------------------------------------
// Detalle de una ficha de cuidados (API /public/care-sheets). Columna de
// ~680 px sobre papel: la tuna sobre crema queda en 4.49:1 y no pasa AA en
// texto chico; sobre papel da 5:1.
// ----------------------------------------------------------------------

const LABEL = {
  fontFamily: 'var(--od-font-body)',
  fontWeight: 500,
  fontSize: 'var(--od-text-xs)',
  letterSpacing: 'var(--od-tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--od-text-muted)',
};

const focusSx = {
  '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' },
};

export const fDay = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

// Estilos del HTML del Markdown (párrafos, listas, tabla)
const proseSx = {
  fontSize: 'var(--od-text-base)',
  lineHeight: 'var(--od-leading-body)',
  color: 'var(--od-text)',
  '& p': { m: 0, mb: 2 },
  '& strong': { fontWeight: 600 },
  '& ul, & ol': { m: 0, mb: 2, pl: 3 },
  '& li': { mb: 1, pl: 0.5 },
  '& ul > li::marker': { color: 'var(--od-text-muted)' },
  '& ol > li::marker': {
    color: 'var(--od-tuna)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  '& > :last-child': { mb: 0 },
  '& .od-guide-table': {
    ...focusSx,
    overflowX: 'auto',
    mb: 2,
    border: 'var(--od-rule)',
    borderRadius: 'var(--od-radius-sm)',
  },
  '& table': { width: 1, minWidth: 520, borderCollapse: 'collapse', fontSize: 'var(--od-text-sm)' },
  '& th, & td': { p: 1.5, textAlign: 'left', verticalAlign: 'top', borderBottom: 'var(--od-rule)' },
  '& tbody tr:last-child > *': { borderBottom: 0 },
  '& thead th': LABEL,
  '& tbody th': { fontWeight: 600 },
};

function Tag({ children }) {
  return (
    <Box
      component="span"
      sx={{
        px: 1.25,
        py: 0.5,
        fontSize: 'var(--od-text-sm)',
        border: 'var(--od-rule)',
        borderRadius: 'var(--od-radius-pill)',
      }}
    >
      {children}
    </Box>
  );
}

// Cuadro del segundo 2 del video como póster (Cloudinary lo genera al vuelo)
const videoPoster = (src) =>
  src
    .replace('/video/upload/', '/video/upload/so_2,f_auto,q_auto,w_720/')
    .replace(/\.mp4$/, '.jpg');

const crumbSx = {
  ...focusSx,
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};

export function OdCareSheetDetailView({ guide, forSale = null }) {
  // «Actualizado»: fecha de la última edición de la ficha
  const updated = (guide.updated_at ?? '').slice(0, 10);
  const { intro, sections } = sheetSections(guide.body ?? '');
  const place = [guide.locality && `“${guide.locality}”`, guide.origin].filter(Boolean).join(' · ');

  return (
    // en celular el papel llena la pantalla; desde md es una hoja sobre crema
    // y a los lados quedan las curvas de nivel (OdLayout sideArt={760})
    <Box
      sx={{
        color: 'var(--od-text)',
        bgcolor: { xs: 'var(--od-papel)', md: 'transparent' },
        py: { md: 4 },
      }}
    >
      <Box
        component="article"
        sx={{
          maxWidth: 680,
          mx: 'auto',
          px: { xs: '18px', md: '40px' },
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 9 },
          bgcolor: 'var(--od-papel)',
          border: { md: 'var(--od-rule)' },
          borderRadius: { md: 'var(--od-radius-md)' },
          boxShadow: { md: 'var(--od-shadow-flat)' },
          boxSizing: 'content-box',
        }}
      >
        {/* Encabezado */}
        <Box
          component="nav"
          aria-label="Migas de pan"
          sx={{ fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}
        >
          <Box
            component="ol"
            sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 1 }}
          >
            <li>
              <SheetLink href="/fichas/" sx={crumbSx}>
                Fichas de cuidados
              </SheetLink>
            </li>
            <li aria-hidden>/</li>
            <li>
              <SheetLink href={`/fichas/?grupo=${guide.group?.id}`} sx={crumbSx}>
                {guide.group?.name}
              </SheetLink>
            </li>
          </Box>
        </Box>

        <Box component="p" sx={{ ...LABEL, m: 0, mt: 4, color: 'var(--od-tuna)' }}>
          {guide.group?.name}
        </Box>
        <Box
          component="h1"
          sx={{
            m: 0,
            mt: 1.5,
            fontFamily: 'var(--od-font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(2.25rem, 7vw, var(--od-text-3xl))',
            lineHeight: 'var(--od-leading-tight)',
            textWrap: 'balance',
          }}
        >
          {guide.scientific_name}
        </Box>
        {guide.authority && (
          <Box
            component="p"
            sx={{ m: 0, mt: 1, fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}
          >
            {guide.authority}
          </Box>
        )}
        {place && (
          <Box
            component="p"
            sx={{ m: 0, mt: 1.5, fontSize: 'var(--od-text-lg)', color: 'var(--od-text-muted)' }}
          >
            {place}
          </Box>
        )}
        {(guide.common_name || guide.difficulty) && (
          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {guide.common_name && <Tag>{guide.common_name}</Tag>}
            {guide.difficulty && <Tag>Dificultad: {guide.difficulty}</Tag>}
          </Box>
        )}
        <Box
          component="p"
          sx={{
            m: 0,
            mt: 3,
            fontSize: 'var(--od-text-lg)',
            lineHeight: 'var(--od-leading-body)',
            textWrap: 'pretty',
          }}
        >
          {guide.summary}
        </Box>

        {forSale && (
          <Box component="p" sx={{ m: 0, mt: 2.5, fontSize: 'var(--od-text-sm)' }}>
            {forSale.count} {forSale.count === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}{' '}
            ·{' '}
            <SheetLink
              href={`/catalogo/${forSale.slug}/`}
              sx={{ color: 'var(--od-text)', fontWeight: 600, ...focusSx }}
            >
              Ver en el catálogo →
            </SheetLink>
          </Box>
        )}

        {/* Datos rápidos */}
        {guide.facts.length > 0 && (
          <Box
            component="dl"
            sx={{
              m: 0,
              mt: 5,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              borderTop: 'var(--od-rule)',
              borderLeft: 'var(--od-rule)',
            }}
          >
            {guide.facts.map((d) => (
              <Box
                key={d.label}
                sx={{
                  p: 2,
                  borderRight: 'var(--od-rule)',
                  borderBottom: 'var(--od-rule)',
                  // en 2 columnas, el último dato suelto ocupa todo el renglón
                  '&:last-of-type:nth-of-type(odd)': { gridColumn: { xs: 'span 2', sm: 'auto' } },
                  // en 3 columnas, igual si queda uno solo en el último renglón
                  '&:last-of-type:nth-of-type(3n+1)': { gridColumn: { sm: 'span 3' } },
                }}
              >
                <Box component="dt" sx={LABEL}>
                  {d.label}
                </Box>
                <Box
                  component="dd"
                  sx={{
                    m: 0,
                    mt: 0.75,
                    fontFamily: 'var(--od-font-display)',
                    fontSize: 'var(--od-text-lg)',
                    lineHeight: 1.25,
                  }}
                >
                  {d.value}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Ficha técnica */}
        {guide.taxonomy.length > 0 && (
          <Box component="section" aria-labelledby="ficha-tecnica" sx={{ mt: 5 }}>
            <Box component="h2" id="ficha-tecnica" sx={{ ...LABEL, m: 0, mb: 1.5, fontSize: 12 }}>
              Ficha técnica
            </Box>
            <Box component="dl" sx={{ m: 0, borderTop: 'var(--od-rule)' }}>
              {guide.taxonomy.map((t) => (
                <Box
                  key={t.rank}
                  sx={{
                    py: 1.25,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                    gap: { xs: 0.25, sm: 2 },
                    borderBottom: 'var(--od-rule)',
                  }}
                >
                  <Box component="dt" sx={LABEL}>
                    {t.rank}
                  </Box>
                  <Box
                    component="dd"
                    sx={{
                      m: 0,
                      fontFamily: 'var(--od-font-display)',
                      fontSize: 'var(--od-text-lg)',
                      lineHeight: 1.3,
                      fontStyle: t.italic ? 'italic' : 'normal',
                    }}
                  >
                    {t.name}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Lo básico */}
        {guide.basics.length > 0 && (
          <Box
            component="section"
            aria-labelledby="lo-basico"
            className="od-card"
            sx={{ mt: 5, overflow: 'hidden' }}
          >
            <div className="od-ticks" />
            <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Box
                component="h2"
                id="lo-basico"
                sx={{
                  m: 0,
                  fontFamily: 'var(--od-font-display)',
                  fontWeight: 400,
                  fontSize: 'var(--od-text-xl)',
                }}
              >
                Lo básico
              </Box>
              <Box
                component="ul"
                sx={{ m: 0, mt: 2, p: 0, listStyle: 'none', display: 'grid', gap: 1.5 }}
              >
                {guide.basics.map((item) => (
                  <Box
                    component="li"
                    key={item}
                    sx={{ display: 'flex', gap: 1.5, lineHeight: 'var(--od-leading-body)' }}
                  >
                    <Star sx={{ mt: '0.45em', flexShrink: 0 }} />
                    <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Fotos y video */}
        {(guide.photos.length > 0 || guide.video) && (
          <Box component="section" aria-labelledby="fotos" sx={{ mt: 5 }}>
            <Box component="h2" id="fotos" sx={{ ...LABEL, m: 0, mb: 1.5, fontSize: 12 }}>
              Fotos y video
            </Box>
            {guide.photos.length > 0 && (
              <Box
                sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}
              >
                {guide.photos.map((f) => (
                  <OdImage
                    key={f.src}
                    src={f.src}
                    alt={f.alt}
                    ratio="3 / 4"
                    radius={10}
                    width={640}
                  />
                ))}
              </Box>
            )}
            {guide.video && (
              <Box
                component="video"
                controls
                playsInline
                preload="metadata"
                poster={videoPoster(guide.video.src)}
                aria-label={guide.video.alt}
                sx={{
                  display: 'block',
                  width: 1,
                  maxWidth: 360,
                  mx: 'auto',
                  mt: 1.5,
                  aspectRatio: '9 / 16',
                  objectFit: 'cover',
                  bgcolor: 'var(--od-noche)',
                  borderRadius: 'var(--od-radius-md)',
                }}
              >
                <source src={guide.video.src} type="video/mp4" />
              </Box>
            )}
          </Box>
        )}

        {/* Cuerpo */}
        {intro && (
          <Box
            sx={[proseSx, { mt: 5 }]}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(intro) }}
          />
        )}
        {sections.map((s, i) => (
          <Box component="section" key={s.title} aria-labelledby={`sec-${i + 1}`}>
            <Box
              component="img"
              src="/brand/ornaments/divisor-hojas.svg"
              alt=""
              width={96}
              height={24}
              sx={{ display: 'block', mx: 'auto', my: { xs: 5, md: 6 } }}
            />
            {/* "01 —— LO ESENCIAL", el número en tuna (como NumberedKicker,
                pero el h2 solo admite contenido en línea) */}
            <Box
              component="h2"
              id={`sec-${i + 1}`}
              sx={{
                ...LABEL,
                m: 0,
                mb: 2.5,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Box
                component="span"
                sx={{ color: 'var(--od-tuna)', fontVariantNumeric: 'tabular-nums' }}
              >
                {String(i + 1).padStart(2, '0')}
              </Box>
              <Box
                component="span"
                aria-hidden
                sx={{ width: 36, height: '1px', bgcolor: 'currentColor', opacity: 0.6 }}
              />
              <span>{s.title}</span>
            </Box>
            <Box sx={proseSx} dangerouslySetInnerHTML={{ __html: renderMarkdown(s.markdown) }} />
          </Box>
        ))}

        {/* Referencias */}
        {guide.references.length > 0 && (
          <Box component="section" aria-labelledby="referencias" sx={{ mt: { xs: 6, md: 8 } }}>
            <Box component="h2" id="referencias" sx={{ ...LABEL, m: 0, mb: 1.5, fontSize: 12 }}>
              Referencias
            </Box>
            <Box
              component="ol"
              sx={{
                m: 0,
                pl: 2.5,
                display: 'grid',
                gap: 1,
                fontSize: 'var(--od-text-sm)',
                lineHeight: 'var(--od-leading-body)',
                color: 'var(--od-text-muted)',
                '& a': { color: 'var(--od-text)', wordBreak: 'break-word', ...focusSx },
              }}
            >
              {guide.references.map((r) => (
                <li key={r.text}>
                  {r.text}{' '}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {r.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </li>
              ))}
            </Box>
          </Box>
        )}

        {/* Cierre */}
        <Box sx={{ mt: { xs: 6, md: 8 }, pt: 4, borderTop: 'var(--od-rule)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Pill href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener">
              Escríbenos por WhatsApp
            </Pill>
            <Pill
              href={forSale ? `/catalogo/${forSale.slug}/` : '/catalogo/'}
              sx={{
                bgcolor: 'transparent',
                color: 'var(--od-text)',
                border: '1px solid var(--od-tinta)',
              }}
            >
              {forSale ? 'Ver ejemplares disponibles' : 'Ver catálogo'}
            </Pill>
          </Box>
          <Box
            component="p"
            sx={{ m: 0, mt: 3, fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}
          >
            Actualizado: <time dateTime={updated}>{fDay(updated)}</time>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
