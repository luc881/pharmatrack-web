'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// "Novedades" (sección del home): tarjeta crema sobre foto de naturaleza entre
// dos marquesinas de avisos. Suscripción por correo.
// ponytail: la suscripción solo confirma en el cliente; falta el POST a un
// endpoint que guarde el correo (audiencia de Resend).
// ----------------------------------------------------------------------

const TICKER = ['Nueva camada — Cubaris Rubber Ducky', 'Entrega en persona en CDMX', 'Camada de julio disponible', 'Apartas con el 50%'];

function Ticker({ reverse = false }) {
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER];
  return (
    <Box data-dark="1" sx={{ bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-200)', py: '11px', overflow: 'hidden' }}>
      <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontSize: 13, letterSpacing: '0.05em', animation: `${reverse ? 'odMarqueeR' : 'odMarquee'} 52s linear infinite` }}>
        {items.map((t, i) => (
          <Box component="span" key={i} sx={{ px: '40px' }}>
            {t}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function OdNovedades() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <>
      <Ticker />
      <Box component="section" data-dark="1" sx={{ position: 'relative', px: { xs: '18px', md: '40px' }, py: { xs: '40px', md: '54px' }, overflow: 'hidden', isolation: 'isolate' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -2, backgroundImage: 'url(/assets/redesign/moss-forest-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, bgcolor: 'rgba(32,31,29,0.28)' }} />
        <Box sx={{ maxWidth: 1040, mx: 'auto', bgcolor: 'var(--color-neutral-100)', color: 'var(--color-text)', p: { xs: '28px 22px', md: '38px 46px 36px' }, boxShadow: 'var(--shadow-md)' }}>
          <Box sx={{ mb: 1.5, fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Novedades</Box>
          <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.08, maxWidth: '22ch' }}>
            Avisamos cuando sale camada nueva
          </Box>

          {sent ? (
            <Box sx={{ mt: 3.25, fontFamily: 'var(--font-heading)', fontSize: 24, animation: 'odFade 0.4s ease both' }}>
              Listo — te escribimos en cuanto haya camada nueva.
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 2.25, fontSize: 14, opacity: 0.78, maxWidth: '44ch', lineHeight: 1.6 }}>
                Un correo cada pocas semanas: especies disponibles, notas de cría y fechas de entrega. Nada más.
              </Box>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSent(true);
                }}
                sx={{ mt: 3.25, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}
              >
                <Box sx={{ flex: 1, minWidth: 240 }}>
                  <Box component="label" htmlFor="od-news-mail" sx={{ display: 'block', mb: 0.75, fontSize: 12, color: 'var(--color-neutral-600)' }}>
                    Correo electrónico
                  </Box>
                  <Box
                    component="input"
                    id="od-news-mail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    sx={{ width: 1, minHeight: 46, px: 1.5, border: '1px solid var(--color-divider)', borderRadius: '2px', bgcolor: 'var(--color-bg)', font: 'inherit', fontSize: 15, color: 'var(--color-text)', outline: 'none', '&:focus': { borderColor: 'var(--color-accent)' } }}
                  />
                </Box>
                <Box
                  component="button"
                  type="submit"
                  sx={{ height: 46, px: 3.5, border: '1px solid var(--color-neutral-900)', bgcolor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)', cursor: 'pointer', font: 'inherit', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', transition: 'background 300ms', '&:hover': { bgcolor: 'var(--color-accent-700)', borderColor: 'var(--color-accent-700)' } }}
                >
                  Suscribirme
                </Box>
              </Box>
              <Box sx={{ mt: 1.75, fontSize: 12, color: 'var(--color-neutral-600)' }}>
                Sin spam. Puedes darte de baja en cualquier momento.
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Ticker reverse />
    </>
  );
}
