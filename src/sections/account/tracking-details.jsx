'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate, fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

// la paquetería manda fechas en formatos distintos: si no se entiende, tal cual
export const when = (date) => {
  // una fecha sin hora (la entrega estimada) no lleva «12:00 am»
  const formatted = /^\d{4}-\d{2}-\d{2}$/.test(date) ? fDate(date) : fDateTime(date);
  return formatted && formatted !== 'Invalid' ? formatted : date;
};

// `data` = respuesta del rastreo (null mientras carga). Si no hay movimientos
// (o la paquetería no respondió), queda el enlace directo a la paquetería.
export function TrackingDetails({ data, trackingUrl }) {
  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.neutral' }}>
      {!data && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Consultando a la paquetería…
        </Typography>
      )}

      {data?.status_label && <Typography variant="subtitle2">{data.status_label}</Typography>}
      {data?.estimated_delivery && (
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          Entrega estimada: {when(data.estimated_delivery)}
        </Typography>
      )}

      {data?.events?.length > 0 && (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {data.events.map((event, index) => (
            <Box key={`${event.date}-${index}`}>
              <Typography variant="body2">{event.description}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {[event.date && when(event.date), event.location].filter(Boolean).join(' · ')}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {data && !data.status_label && !data.events?.length && (
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          Todavía no hay movimientos. La paquetería puede tardar unas horas en registrar el
          paquete.
        </Typography>
      )}

      {data && trackingUrl && (
        <Link
          href={trackingUrl}
          target="_blank"
          rel="noopener"
          variant="caption"
          sx={{ mt: 1.5, display: 'inline-block' }}
        >
          Ver en la paquetería
        </Link>
      )}
    </Box>
  );
}
