'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { TrackingDetails } from './tracking-details';

// ----------------------------------------------------------------------
// Rastreo sin cuenta: para quien compró por WhatsApp y recibió su número de
// guía. /rastreo?guia=NUMERO abre el resultado directo (el enlace que se manda).
// ----------------------------------------------------------------------

export function TrackingView() {
  const initial = useSearchParams().get('guia') ?? '';
  const [number, setNumber] = useState(initial);
  const [result, setResult] = useState(null); // { number, data } | { number, error }
  const [loading, setLoading] = useState(false);

  const search = async (value) => {
    const wanted = value.trim();
    if (!wanted) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(wanted)}`);
      const body = await res.json().catch(() => ({}));
      setResult(
        res.ok
          ? { number: wanted, data: body }
          : {
              number: wanted,
              error:
                res.status === 429
                  ? 'Demasiadas consultas seguidas. Espera un minuto.'
                  : (body.detail ?? 'No se pudo consultar la guía.'),
            }
      );
    } catch {
      setResult({ number: wanted, error: 'No se pudo consultar la guía. Revisa tu conexión.' });
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
    <Container sx={{ mb: 10, mt: { xs: 3, md: 5 } }}>
      <Card sx={{ p: 3, maxWidth: 560 }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            search(number);
          }}
          sx={{ gap: 1.5, display: 'flex', alignItems: 'flex-start' }}
        >
          <TextField
            fullWidth
            size="small"
            label="Número de guía"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 60, autoComplete: 'off' } }}
            helperText="Es el que te mandamos por WhatsApp o correo al enviar tu paquete."
          />
          <Button type="submit" variant="contained" loading={loading} sx={{ mt: 0.25 }}>
            Rastrear
          </Button>
        </Box>

        {result?.error && (
          <Alert severity="warning" sx={{ mt: 2.5, typography: 'caption' }}>
            {result.error}
          </Alert>
        )}

        {result?.data && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {result.data.carrier?.toUpperCase()} · guía {result.data.tracking_number}
            </Typography>
            <TrackingDetails data={result.data} trackingUrl={result.data.tracking_url} />
          </Box>
        )}
      </Card>
    </Container>
  );
}
