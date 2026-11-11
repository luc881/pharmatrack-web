'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import { MaskLines } from 'src/layouts/od/od-mask-lines';
import { Pill, Kicker, Display } from 'src/layouts/od/od-ui';
import { gsap, prefersReducedMotion } from 'src/layouts/od/od-gsap';

import { when } from './tracking-details';

// ----------------------------------------------------------------------
// Rastreo sin cuenta: para quien compró por WhatsApp y recibió su número de
// guía. /rastreo?guia=NUMERO abre el resultado directo (el enlace que se manda).
// Arriba los datos generales; abajo los movimientos en tabla, que entran uno
// tras otro.
// ----------------------------------------------------------------------

const cellSx = {
  px: { xs: 1, md: 2 },
  py: 1.75,
  fontSize: 15,
  textAlign: 'left',
  verticalAlign: 'top',
  borderBottom: '1px solid var(--color-divider)',
};

const headSx = {
  px: { xs: 1, md: 2 },
  py: 1.25,
  fontSize: 13,
  fontWeight: 400,
  textAlign: 'left',
  color: 'var(--color-neutral-600)',
  borderBottom: '1px solid var(--color-text)',
};

function Fact({ label, children, big = false }) {
  return (
    <Box data-rise sx={{ py: 2, px: { xs: 1, md: 2 }, borderTop: '1px solid var(--color-text)' }}>
      <Kicker>{label}</Kicker>
      <Box
        sx={{
          mt: 0.75,
          overflowWrap: 'anywhere',
          ...(big
            ? { fontFamily: 'var(--font-heading)', fontSize: { xs: 24, md: 30 }, lineHeight: 1.15 }
            : { fontSize: 16, fontVariantNumeric: 'tabular-nums' }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function Result({ data }) {
  const ref = useRef(null);
  const events = data.events ?? [];

  // Primero los datos generales, luego cada movimiento, escalonados
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('[data-rise]', {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      });
    }, ref);
    return () => ctx.revert();
  }, [data]);

  return (
    <Box ref={ref} sx={{ mt: { xs: 5, md: 7 } }}>
      <Box
        sx={{
          display: 'grid',
          columnGap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr 1fr', md: '1.4fr 1fr 1.2fr 1.2fr' },
        }}
      >
        <Fact label="Estado" big>
          {data.status_label ?? 'Guía generada'}
        </Fact>
        <Fact label="Paquetería">{data.carrier?.toUpperCase() ?? '—'}</Fact>
        <Fact label="Número de guía">{data.tracking_number}</Fact>
        <Fact label="Entrega estimada">
          {data.estimated_delivery ? when(data.estimated_delivery) : 'Por confirmar'}
        </Fact>
      </Box>

      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Display component="h2" size="clamp(22px, 2.4vw, 30px)" sx={{ mb: 2, px: { xs: 1, md: 2 } }}>
          Movimientos
        </Display>

        {events.length > 0 ? (
          <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Box component="table" sx={{ width: '100%', minWidth: 460, borderCollapse: 'collapse' }}>
              <Box component="thead">
                <Box component="tr">
                  {['Fecha', 'Movimiento', 'Lugar'].map((head) => (
                    <Box key={head} component="th" scope="col" sx={headSx}>
                      {head}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {events.map((event, index) => (
                  <Box component="tr" key={`${event.date}-${index}`} data-rise>
                    <Box
                      component="td"
                      sx={{ ...cellSx, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', color: 'var(--color-neutral-700)' }}
                    >
                      {event.date ? when(event.date) : '—'}
                    </Box>
                    <Box component="td" sx={{ ...cellSx, fontWeight: index === 0 ? 500 : 400 }}>
                      {event.description}
                    </Box>
                    <Box component="td" sx={{ ...cellSx, color: 'var(--color-neutral-700)' }}>
                      {event.location ?? '—'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            data-rise
            sx={{ px: { xs: 1, md: 2 }, py: 3, fontSize: 15, lineHeight: 1.7, color: 'var(--color-neutral-700)', borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)' }}
          >
            Todavía no hay movimientos. La paquetería puede tardar unas horas en registrar el
            paquete después de que lo entregamos.
          </Box>
        )}

        {data.tracking_url && (
          <Box data-rise sx={{ mt: 2.5, px: { xs: 1, md: 2 }, fontSize: 14 }}>
            <Link href={data.tracking_url} target="_blank" rel="noopener" color="inherit" underline="always">
              Ver también en la página de la paquetería
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function TrackingView() {
  const initial = useSearchParams().get('guia') ?? '';
  const [number, setNumber] = useState(initial);
  const [result, setResult] = useState(null); // { data } | { error }
  const [loading, setLoading] = useState(false);

  const search = async (value) => {
    const wanted = value.trim();
    if (!wanted) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(wanted)}`);
      const body = await res.json().catch(() => ({}));
      if (res.ok) setResult({ data: body });
      else if (res.status === 429) setResult({ error: 'Demasiadas consultas seguidas. Espera un minuto.' });
      else setResult({ error: body.detail ?? 'No se pudo consultar la guía.' });
    } catch {
      setResult({ error: 'No se pudo consultar la guía. Revisa tu conexión.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) search(initial);
    // solo al abrir con ?guia=
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      component="section"
      sx={{ mx: 'auto', maxWidth: 920, px: { xs: '18px', md: 4 }, pt: { xs: 5, md: 9 }, pb: { xs: 10, md: 15 } }}
    >
      <Box className="od-rise" sx={{ textAlign: 'center' }}>
        <Kicker>Sin cuenta, solo con tu número de guía</Kicker>
        <Display component="h1" size="clamp(36px, 5vw, 68px)" sx={{ mt: 1.5, lineHeight: 1.05 }}>
          <MaskLines>Rastrea tu envío</MaskLines>
        </Display>
        <Box sx={{ mt: 2.5, mx: 'auto', maxWidth: '46ch', fontSize: 16, lineHeight: 1.8, color: 'var(--color-neutral-700)', textWrap: 'pretty' }}>
          Escribe el número que te mandamos por WhatsApp o correo y te decimos por dónde va tu
          paquete.
        </Box>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            search(number);
          }}
          sx={{ mt: 4, mx: 'auto', maxWidth: 520, gap: 1.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <TextField
            label="Número de guía"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 60, autoComplete: 'off' } }}
            sx={{ flex: '1 1 260px', '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: 'var(--color-bg)' } }}
          />
          <Pill type="submit" disabled={loading} sx={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Consultando…' : 'Rastrear'}
          </Pill>
        </Box>

        {/* el resultado se anuncia a lectores de pantalla */}
        <Box role="status" aria-live="polite">
          {result?.error && (
            <Box sx={{ mt: 3, mx: 'auto', maxWidth: 520, fontSize: 15, color: 'var(--color-neutral-700)' }}>
              {result.error}
            </Box>
          )}
        </Box>
      </Box>

      {result?.data && <Result data={result.data} />}
    </Box>
  );
}
