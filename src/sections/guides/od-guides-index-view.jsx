import Box from '@mui/material/Box';

import { GUIDE_GROUPS } from 'src/lib/guides';

import { GuideLink } from './guide-link';

// ----------------------------------------------------------------------
// Índice /guias: un bloque por grupo. Las guías salen de src/content/guias;
// un grupo sin ninguna se muestra como "Próximamente", sin enlace.
// ----------------------------------------------------------------------

const LABEL = {
  fontFamily: 'var(--od-font-body)',
  fontWeight: 500,
  fontSize: 'var(--od-text-xs)',
  letterSpacing: 'var(--od-tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--od-text-muted)',
};

const cardSx = {
  minHeight: 64,
  px: 2.5,
  py: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  color: 'var(--od-text)',
  textDecoration: 'none',
  transition: 'transform 200ms ease',
  '&:focus-visible': { outline: '2px solid var(--od-focus)', outlineOffset: '3px' },
  '@media (hover: hover)': { '&:hover': { transform: 'translate(-2px, -2px)' } },
};

export function OdGuidesIndexView({ guides }) {
  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', px: '18px', pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 9 } }}>
      <Box component="p" sx={{ ...LABEL, m: 0 }}>
        Opuntia Den
      </Box>
      <Box
        component="h1"
        sx={{
          m: 0,
          mt: 1.5,
          fontFamily: 'var(--od-font-display)',
          fontWeight: 400,
          fontSize: 'clamp(2.25rem, 7vw, var(--od-text-3xl))',
          lineHeight: 'var(--od-leading-tight)',
        }}
      >
        Guías de cuidado
      </Box>

      {GUIDE_GROUPS.map((group) => {
        const items = guides.filter((g) => g.grupo === group.key);
        return (
          <Box
            component="section"
            key={group.key}
            id={group.key}
            aria-labelledby={`g-${group.key}`}
            sx={{ mt: 5, scrollMarginTop: 96 }}
          >
            <Box
              component="h2"
              id={`g-${group.key}`}
              sx={{
                m: 0,
                pb: 1.5,
                borderBottom: 'var(--od-rule)',
                fontFamily: 'var(--od-font-display)',
                fontWeight: 400,
                fontSize: 'var(--od-text-xl)',
              }}
            >
              {group.name}
            </Box>
            {items.length ? (
              <Box
                component="ul"
                sx={{ m: 0, mt: 2, p: 0, listStyle: 'none', display: 'grid', gap: 1.5 }}
              >
                {items.map((g) => (
                  <li key={g.slug}>
                    <GuideLink href={`/guias/${g.slug}/`} className="od-card" sx={cardSx}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            fontFamily: 'var(--od-font-display)',
                            fontSize: 'var(--od-text-lg)',
                            lineHeight: 1.25,
                          }}
                        >
                          <em>{g.nombre_cientifico}</em>
                          {g.localidad && ` “${g.localidad}”`}
                        </Box>
                        {g.nombre_comun && (
                          <Box
                            sx={{
                              mt: 0.5,
                              fontSize: 'var(--od-text-sm)',
                              color: 'var(--od-text-muted)',
                            }}
                          >
                            {g.nombre_comun}
                          </Box>
                        )}
                      </Box>
                      <Box component="span" aria-hidden sx={{ fontSize: 18 }}>
                        →
                      </Box>
                    </GuideLink>
                  </li>
                ))}
              </Box>
            ) : (
              <Box component="p" sx={{ m: 0, mt: 2, color: 'var(--od-text-muted)' }}>
                Próximamente
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
