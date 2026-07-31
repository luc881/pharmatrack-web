'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { Kicker, Display } from './od-ui';

// ----------------------------------------------------------------------
// Suscripción a novedades (feature nueva del rediseño). Al enviar sustituye el
// formulario por la confirmación, como el prototipo.
// ponytail: solo confirma en el cliente; falta el POST a un endpoint que guarde
// el correo (audiencia de Resend). Conectar cuando exista la ruta pública.
// ----------------------------------------------------------------------

export function OdSubscribe() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <Box component="section" sx={{ bgcolor: 'var(--color-neutral-100)', px: '18px', py: { xs: 9, md: 13 } }}>
      <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
        <Kicker sx={{ mb: 3 }}>Novedades</Kicker>

        {sent ? (
          <Display size="clamp(24px, 3vw, 34px)" sx={{ lineHeight: 1.3 }}>
            Listo — te avisamos de cada camada nueva.
          </Display>
        ) : (
          <>
            <Display size="clamp(28px, 3.6vw, 46px)" sx={{ mb: 4 }}>
              Entérate primero de cada camada
            </Display>

            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 460,
                mx: 'auto',
              }}
            >
              <Box
                component="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                aria-label="Tu correo"
                sx={{
                  flex: '1 1 220px',
                  minWidth: 0,
                  font: 'inherit',
                  fontSize: 14,
                  px: '18px',
                  py: '15px',
                  borderRadius: '14px',
                  color: 'var(--color-text)',
                  bgcolor: 'var(--color-neutral-100)',
                  border: '1px solid var(--color-divider)',
                  outline: 'none',
                  '&:focus': { borderColor: 'var(--color-accent)' },
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  border: 0,
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 14,
                  px: '30px',
                  py: '15px',
                  borderRadius: '999px',
                  bgcolor: 'var(--color-neutral-900)',
                  color: 'var(--color-neutral-100)',
                  transition: 'background 400ms, transform 400ms var(--od-ease)',
                  '&:hover': { bgcolor: 'var(--color-accent-700)', transform: 'translateY(-3px)' },
                }}
              >
                Suscribirme
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
