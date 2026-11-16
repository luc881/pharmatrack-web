import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { Pill, Star, OdImage } from 'src/layouts/od/od-ui';
import { placePhotos, videoPoster, sheetSections } from 'src/lib/care-sheets';

import { SheetLink } from './sheet-link';
import { SheetHeroMedia } from './sheet-hero-media';
import { renderInline, renderMarkdown } from './sheet-markdown';

// ----------------------------------------------------------------------
// Detalle de una ficha de cuidados (API /public/care-sheets), estilo ficha de
// especie de PhasmaMX con la marca:
//  - Portada oscura a todo lo ancho: video o foto de fondo con velo, nombre
//    científico grande, nombre común, autoridad, localidad y etiquetas.
//  - Una franja con los datos que más se buscan (temperatura, humedad,
//    tamaño, dificultad) en cifras grandes.
//  - Debajo, en pantallas grandes, dos columnas: el contenido (descripción,
//    morfología, hábitat, lo básico, secciones del cuerpo) y una barra lateral
//    con tarjetas (ficha técnica, datos rápidos, origen, etiquetas) y, fijos al
//    leer, el índice de la ficha y la tarjeta de venta. En celular, una columna.
//  - Las fotos van dentro de las secciones (placePhotos): las que eligieron
//    sección en el dashboard, ahí; las demás se reparten solas. Las variedades
//    llevan la foto de su variedad (de Animales).
// Texto en tuna solo sobre papel/noche (sobre crema queda en 4.49:1): aquí la
// tuna es decorativa (barras, destellos) y los números van en tinta.
// ----------------------------------------------------------------------

const LABEL = {
  fontFamily: 'var(--od-font-body)',
  fontWeight: 500,
  fontSize: 'var(--od-text-xs)',
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

// entrada escalonada de la portada
const rise = (i) => ({ animation: `odRise 0.9s var(--od-ease) ${0.15 + i * 0.1}s both` });

// Estilos del HTML del Markdown (párrafos, listas, tabla)
const proseSx = {
  maxWidth: '72ch',
  fontSize: { xs: 'var(--od-text-base)', md: 17 },
  lineHeight: 1.75,
  color: 'var(--od-text)',
  '& p': { m: 0, mb: 2 },
  '& strong': { fontWeight: 600 },
  '& ul, & ol': { m: 0, mb: 2, pl: 3 },
  '& li': { mb: 1, pl: 0.5 },
  '& ul > li::marker': { color: 'var(--od-text-muted)' },
  '& ol > li::marker': { fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  '& > :last-child': { mb: 0 },
  '& .od-guide-table': {
    ...focusSx,
    overflowX: 'auto',
    mb: 2,
    bgcolor: 'var(--od-papel)',
    border: 'var(--od-rule)',
    borderRadius: 'var(--od-radius-sm)',
  },
  // en celular la tabla se ajusta al ancho (antes se cortaba a la derecha)
  '& table': {
    width: 1,
    minWidth: { xs: 0, sm: 520 },
    borderCollapse: 'collapse',
    fontSize: 'var(--od-text-sm)',
  },
  '& th, & td': { p: 1.5, textAlign: 'left', verticalAlign: 'top', borderBottom: 'var(--od-rule)' },
  '& tbody tr:last-child > *': { borderBottom: 0 },
  '& thead th': LABEL,
  '& tbody th': { fontWeight: 600 },
};

// «01 ——— DESCRIPCIÓN GENERAL» con la línea a todo lo ancho
function SectionHead({ id, children }) {
  return (
    <Box
      component="h2"
      id={id}
      sx={{
        m: 0,
        mb: 3,
        pb: 1.5,
        fontFamily: 'var(--od-font-display)',
        fontWeight: 400,
        fontSize: { xs: 28, md: 36 },
        lineHeight: 1.15,
        color: 'var(--od-text)',
        borderBottom: 'var(--od-rule)',
      }}
    >
      {children}
    </Box>
  );
}

function Section({ id, title, children }) {
  return (
    <Box
      component="section"
      aria-labelledby={id}
      className="od-reveal"
      sx={{ mt: { xs: 7, md: 10 }, scrollMarginTop: 96, '&:first-of-type': { mt: 0 } }}
    >
      <SectionHead id={id}>{title}</SectionHead>
      {children}
    </Box>
  );
}

// Tarjeta de la barra lateral: rótulo arriba, filas abajo
function Card({ title, children, dark = false, sx }) {
  return (
    <Box
      component="section"
      aria-label={title}
      sx={[
        {
          bgcolor: dark ? 'var(--od-noche)' : 'var(--od-papel)',
          color: dark ? 'var(--od-papel)' : 'var(--od-text)',
          border: dark ? 0 : 'var(--od-rule)',
          borderRadius: 'var(--od-radius-md)',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          ...LABEL,
          px: 2.5,
          py: 1.75,
          color: dark ? 'var(--od-arena-texto)' : 'var(--od-text-muted)',
          borderBottom: dark ? '1px solid rgba(238,236,230,0.16)' : 'var(--od-rule)',
        }}
      >
        {title}
      </Box>
      {children}
    </Box>
  );
}

// Filas etiqueta / valor (ficha técnica, datos rápidos)
function Rows({ rows }) {
  return (
    <Box component="dl" sx={{ m: 0 }}>
      {rows.map((r) => {
        // valores largos (localidades, autoridad) van debajo de la etiqueta a todo lo ancho
        const stack = String(r.value).length > 22;
        return (
          <Box
            key={r.label}
            sx={{
              px: 2.5,
              py: 1.5,
              display: 'flex',
              flexDirection: stack ? 'column' : 'row',
              alignItems: stack ? 'flex-start' : 'baseline',
              justifyContent: 'space-between',
              gap: stack ? 0.5 : 2,
              '& + &': { borderTop: 'var(--od-rule)' },
            }}
          >
            <Box component="dt" sx={{ ...LABEL, flexShrink: 0 }}>
              {r.label}
            </Box>
            <Box
              component="dd"
              sx={{
                m: 0,
                textAlign: stack ? 'left' : 'right',
                fontFamily: 'var(--od-font-display)',
                fontSize: 17,
                lineHeight: 1.3,
                fontStyle: r.italic ? 'italic' : 'normal',
              }}
            >
              {r.value}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function Chip({ children, dark = false }) {
  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.5,
        fontSize: 13,
        border: '1px solid',
        borderColor: dark ? 'rgba(238,236,230,0.35)' : 'var(--od-linea)',
        borderRadius: 'var(--od-radius-pill)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
}

// Fotos de una sección: una sola a lo ancho; dos o más, en pares
function SectionPhotos({ photos }) {
  if (!photos.length) return null;
  const single = photos.length === 1;
  return (
    <Box
      sx={{
        mt: 4,
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', sm: single ? '1fr' : 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {photos.map((p) => (
        <Box component="figure" key={p.src} sx={{ m: 0 }}>
          <OdImage
            src={p.src}
            alt={p.alt}
            ratio={single ? '16 / 10' : '4 / 5'}
            radius={10}
            width={single ? 1200 : 720}
          />
          <Box
            component="figcaption"
            sx={{ mt: 1, fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}
          >
            {p.alt}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Una tarjeta por variedad con su foto; lleva a sus ejemplares si hay en venta
function Varieties({ items }) {
  if (!items.length) return null;
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        mt: 4,
        p: 0,
        listStyle: 'none',
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
      }}
    >
      {items.map((v) => {
        const body = (
          <>
            <OdImage src={v.src} alt={v.name} ratio="1 / 1" radius={10} width={560} />
            <Box sx={{ mt: 1, fontFamily: 'var(--od-font-display)', fontSize: 20 }}>{v.name}</Box>
            {v.href && (
              <Box sx={{ fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}>
                {v.count} en venta →
              </Box>
            )}
          </>
        );
        return (
          <li key={v.name}>
            {v.href ? (
              <SheetLink
                href={v.href}
                sx={{ ...focusSx, display: 'block', color: 'inherit', textDecoration: 'none' }}
              >
                {body}
              </SheetLink>
            ) : (
              body
            )}
          </li>
        );
      })}
    </Box>
  );
}

// Lo que más se busca, en cifras grandes, bajo la portada
const GLANCE = [/^temperatura/i, /^humedad/i, /tamaño|hembra adulta/i, /^dificultad/i];

// «17–28 °C (mejor 22–26 °C)» → cifra «17–28 °C» y nota «mejor 22–26 °C»
const splitFigure = (value) => {
  const [figure, ...note] = String(value).split(/\s*[(,]\s*/);
  return { figure, note: note.join(', ').replace(/\)$/, '') };
};

const crumbSx = {
  ...focusSx,
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};

export function OdCareSheetDetailView({ guide, forSale = null, varieties = [] }) {
  const updated = (guide.updated_at ?? '').slice(0, 10);
  const { intro, sections } = sheetSections(guide.body ?? '');
  // la dificultad sale del campo propio; una fila «Dificultad» en los datos rápidos la repetiría
  const facts = guide.difficulty
    ? [
        { label: 'Dificultad', value: guide.difficulty },
        ...guide.facts.filter((f) => f.label.trim().toLowerCase() !== 'dificultad'),
      ]
    : guide.facts;
  const taxonomy = guide.taxonomy.map((t) => ({ label: t.rank, value: t.name, italic: t.italic }));
  const morphology = guide.morphology ?? [];
  const tags = guide.tags ?? [];
  const glance = GLANCE.map((re) => facts.find((f) => re.test(f.label))).filter(Boolean);

  const titles = sections.map((s) => s.title);
  // sin video, la primera foto es la portada y no se repite abajo
  const isVarieties = (t) => /^variedades/i.test(t);
  const { bySection, rest } = placePhotos(guide.photos, titles, {
    skipFirst: !guide.video,
    noAuto: (t) => varieties.length > 0 && isVarieties(t),
  });
  // sin sección «Variedades» en el cuerpo, las fotos de variedades van con su propia sección
  const ownVarieties = varieties.length > 0 && !titles.some(isVarieties);

  const toc = [
    { id: 'descripcion', title: 'Descripción general' },
    morphology.length > 0 && { id: 'morfologia', title: 'Morfología' },
    ownVarieties && { id: 'variedades', title: 'Variedades' },
    guide.habitat && { id: 'habitat', title: 'Hábitat y comportamiento' },
    guide.basics.length > 0 && { id: 'lo-basico', title: 'Lo básico' },
    ...sections.map((sec, i) => ({ id: `sec-${i + 1}`, title: sec.title })),
    (rest.length > 0 || guide.video) && { id: 'fotos', title: 'Más fotos' },
    guide.references.length > 0 && { id: 'referencias', title: 'Referencias' },
  ].filter(Boolean);

  return (
    <>
      {/* ── Portada ─────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          minHeight: { xs: '64vh', md: '72vh' },
          bgcolor: 'var(--od-noche)',
          color: 'var(--od-papel)',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -2 }}>
          <SheetHeroMedia video={guide.video} photo={guide.photos[0]} />
        </Box>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background:
              'linear-gradient(180deg, rgba(28,35,32,0.45) 0%, rgba(28,35,32,0.55) 45%, rgba(28,35,32,0.94) 100%)',
          }}
        />
        <Box
          sx={{
            width: 1,
            px: { xs: '18px', md: 'var(--od-gutter)' },
            pt: 14,
            pb: { xs: 5, md: 8 },
          }}
        >
          <Box
            component="nav"
            aria-label="Migas de pan"
            sx={{ fontSize: 'var(--od-text-sm)', color: 'var(--od-arena-texto)', ...rise(0) }}
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

          <Box
            component="h1"
            sx={{
              m: 0,
              mt: { xs: 3, md: 4 },
              fontFamily: 'var(--od-font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(2.75rem, 8.6vw, 8.75rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.01em',
              textWrap: 'balance',
              ...rise(1),
            }}
          >
            {guide.scientific_name}
          </Box>

          <Box
            sx={{
              mt: { xs: 2.5, md: 3.5 },
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 3,
              ...rise(2),
            }}
          >
            <Box>
              {guide.common_name && (
                <Box component="p" sx={{ m: 0, fontSize: { xs: 20, md: 26 }, lineHeight: 1.3 }}>
                  {guide.common_name}
                  {guide.locality && (
                    <Box component="span" sx={{ color: 'var(--od-arena-texto)' }}>
                      {' '}
                      · “{guide.locality}”
                    </Box>
                  )}
                </Box>
              )}
              {guide.authority && (
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    mt: 1,
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    color: 'var(--od-arena-texto)',
                  }}
                >
                  {guide.authority}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {guide.difficulty && <Chip dark>Dificultad: {guide.difficulty}</Chip>}
              {guide.origin && <Chip dark>{guide.origin}</Chip>}
              {forSale && (
                <SheetLink
                  href={`/catalogo/${forSale.slug}/`}
                  sx={{
                    ...focusSx,
                    px: 1.75,
                    py: 0.5,
                    fontSize: 13,
                    color: 'var(--od-noche)',
                    bgcolor: 'var(--od-papel)',
                    borderRadius: 'var(--od-radius-pill)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {forSale.count} en venta →
                </SheetLink>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Contenido + barra lateral ───────────────────────────── */}
      <Box
        sx={{
          px: { xs: '18px', md: 'var(--od-gutter)' },
          pt: { xs: 5, md: 9 },
          pb: { xs: 7, md: 11 },
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 380px' },
          gap: { xs: 6, lg: '72px' },
          color: 'var(--od-text)',
        }}
      >
        {glance.length >= 2 && (
          <Box
            component="dl"
            aria-label="Lo esencial en cifras"
            sx={{
              gridColumn: '1 / -1',
              m: 0,
              pb: { xs: 4, md: 6 },
              display: 'grid',
              gap: { xs: 3, md: 4 },
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: `repeat(${glance.length}, minmax(0, 1fr))`,
              },
              borderBottom: 'var(--od-rule)',
            }}
          >
            {glance.map((f) => (
              <Box key={f.label}>
                <Box component="dt" sx={LABEL}>
                  {f.label}
                </Box>
                <Box
                  component="dd"
                  sx={{
                    m: 0,
                    mt: 1,
                    fontFamily: 'var(--od-font-display)',
                    fontSize: { xs: 24, md: 34 },
                    lineHeight: 1.15,
                  }}
                >
                  {splitFigure(f.value).figure}
                </Box>
                {splitFigure(f.value).note && (
                  <Box
                    sx={{ mt: 0.5, fontSize: 'var(--od-text-sm)', color: 'var(--od-text-muted)' }}
                  >
                    {splitFigure(f.value).note}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Box component="article" sx={{ minWidth: 0 }}>
          <Section id="descripcion" title="Descripción general">
            <Box
              component="p"
              sx={{
                m: 0,
                maxWidth: '62ch',
                fontSize: { xs: 19, md: 22 },
                lineHeight: 1.6,
                textWrap: 'pretty',
              }}
            >
              {guide.summary}
            </Box>
            {/* en celular los datos rápidos van aquí; en escritorio, a la derecha */}
            {facts.length > 0 && (
              <Card title="Datos rápidos" sx={{ mt: 4, display: { lg: 'none' } }}>
                <Rows rows={facts} />
              </Card>
            )}
          </Section>

          {morphology.length > 0 && (
            <Section id="morfologia" title="Morfología">
              <Box sx={{ display: 'grid', gap: 3.5 }}>
                {morphology.map((m) => (
                  <Box key={m.label} sx={{ position: 'relative', pl: 3 }}>
                    {/* la barra se dibuja al entrar en pantalla */}
                    <Box
                      aria-hidden
                      className="od-reveal-bar"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        bottom: 4,
                        width: 2,
                        bgcolor: 'var(--od-tuna)',
                      }}
                    />
                    <Box sx={{ ...LABEL, color: 'var(--od-text)', fontWeight: 600 }}>{m.label}</Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        mt: 1,
                        maxWidth: '68ch',
                        fontSize: { xs: 16, md: 17 },
                        lineHeight: 1.7,
                      }}
                    >
                      {m.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Section>
          )}

          {ownVarieties && (
            <Section id="variedades" title="Variedades">
              <Varieties items={varieties} />
            </Section>
          )}

          {guide.habitat && (
            <Section id="habitat" title="Hábitat y comportamiento">
              <Box
                component="p"
                sx={{ m: 0, maxWidth: '62ch', fontSize: { xs: 19, md: 22 }, lineHeight: 1.6 }}
              >
                {guide.habitat}
              </Box>
            </Section>
          )}

          {guide.basics.length > 0 && (
            <Box
              component="section"
              aria-labelledby="lo-basico"
              className="od-card od-reveal"
              sx={{ mt: { xs: 7, md: 10 }, overflow: 'hidden', scrollMarginTop: 96 }}
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
                  sx={{
                    m: 0,
                    mt: 2,
                    p: 0,
                    listStyle: 'none',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: '14px 32px',
                  }}
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

          {intro && (
            <Box
              className="od-reveal"
              sx={[proseSx, { mt: 6 }]}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(intro) }}
            />
          )}

          {sections.map((sec, i) => (
            <Section key={sec.title} id={`sec-${i + 1}`} title={sec.title}>
              <Box
                sx={proseSx}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(sec.markdown) }}
              />
              {isVarieties(sec.title) && <Varieties items={varieties} />}
              <SectionPhotos photos={bySection[i]} />
            </Section>
          ))}

          {(rest.length > 0 || guide.video) && (
            <Section id="fotos" title="Más fotos">
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 1.5,
                }}
              >
                {rest.map((f) => (
                  <OdImage
                    key={f.src}
                    src={f.src}
                    alt={f.alt}
                    ratio="3 / 4"
                    radius={10}
                    width={640}
                  />
                ))}
                {guide.video && (
                  <Box
                    component="video"
                    controls
                    playsInline
                    preload="metadata"
                    poster={videoPoster(guide.video.src, 720)}
                    aria-label={guide.video.alt}
                    sx={{
                      display: 'block',
                      width: 1,
                      aspectRatio: '3 / 4',
                      objectFit: 'cover',
                      bgcolor: 'var(--od-noche)',
                      borderRadius: '10px',
                    }}
                  >
                    <source src={guide.video.src} type="video/mp4" />
                  </Box>
                )}
              </Box>
            </Section>
          )}

          {guide.references.length > 0 && (
            <Section id="referencias" title="Referencias">
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
            </Section>
          )}

          <Box
            component="p"
            sx={{
              m: 0,
              mt: { xs: 6, md: 8 },
              fontSize: 'var(--od-text-sm)',
              color: 'var(--od-text-muted)',
            }}
          >
            Actualizado: <time dateTime={updated}>{fDay(updated)}</time>
          </Box>
        </Box>

        {/* Barra lateral: corre con la página (es más alta que la pantalla); la tarjeta
            de venta/contacto queda fija al final mientras se lee */}
        <Box
          component="aside"
          aria-label="Datos de la especie"
          sx={{ display: 'grid', alignContent: 'start', gap: 2.5 }}
        >
          {taxonomy.length > 0 && (
            <Card title="Ficha técnica" sx={{ animation: 'odSlide 0.8s var(--od-ease) 0.3s both' }}>
              <Rows rows={taxonomy} />
            </Card>
          )}
          {facts.length > 0 && (
            <Card
              title="Datos rápidos"
              sx={{
                display: { xs: 'none', lg: 'block' },
                animation: 'odSlide 0.8s var(--od-ease) 0.4s both',
              }}
            >
              <Rows rows={facts} />
            </Card>
          )}
          {(guide.origin || guide.locality) && (
            <Card title="Origen" sx={{ animation: 'odSlide 0.8s var(--od-ease) 0.5s both' }}>
              <Box sx={{ px: 2.5, py: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  aria-hidden
                  sx={{ width: 18, height: 18, mt: '3px', flexShrink: 0 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.4" />
                </Box>
                <Box>
                  {guide.origin && <Box sx={{ fontSize: 16 }}>{guide.origin}</Box>}
                  {guide.locality && (
                    <Box sx={{ mt: 0.5, fontSize: 14, color: 'var(--od-text-muted)' }}>
                      Población «{guide.locality}»
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          )}
          {tags.length > 0 && (
            <Card title="Etiquetas" sx={{ animation: 'odSlide 0.8s var(--od-ease) 0.6s both' }}>
              <Box sx={{ px: 2.5, py: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </Box>
            </Card>
          )}
          {/* índice y venta quedan a la vista mientras se lee (ocupan el hueco de la columna) */}
          <Box
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 112 },
              display: 'grid',
              gap: 2.5,
              animation: 'odSlide 0.8s var(--od-ease) 0.7s both',
            }}
          >
            {toc.length > 2 && (
              <Card title="En esta ficha" sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Box component="nav" aria-label="Secciones de la ficha">
                  <Box component="ol" sx={{ m: 0, py: 1, px: 0, listStyle: 'none' }}>
                    {toc.map((t) => (
                      <li key={t.id}>
                        <Box
                          component="a"
                          href={`#${t.id}`}
                          sx={{
                            ...focusSx,
                            display: 'block',
                            px: 2.5,
                            py: 0.75,
                            fontSize: 15,
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': { color: 'var(--od-text-muted)' },
                          }}
                        >
                          {t.title}
                        </Box>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Card>
            )}
            <Card dark title={forSale ? 'En venta' : '¿Dudas de cuidado?'}>
              <Box sx={{ px: 2.5, py: 2.5, display: 'grid', gap: 2 }}>
                <Box sx={{ fontFamily: 'var(--od-font-display)', fontSize: 22, lineHeight: 1.25 }}>
                  {forSale
                    ? `${forSale.count} ${forSale.count === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}`
                    : 'Te ayudamos por WhatsApp.'}
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {forSale && (
                    <Pill variant="light" href={`/catalogo/${forSale.slug}/`}>
                      Ver ejemplares
                    </Pill>
                  )}
                  <Pill
                    href={`https://wa.me/${CONFIG.whatsapp}`}
                    target="_blank"
                    rel="noopener"
                    variant={forSale ? 'outline' : 'light'}
                  >
                    Escríbenos
                  </Pill>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
