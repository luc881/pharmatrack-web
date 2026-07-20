'use client';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

// ----------------------------------------------------------------------
// Carrito de cotización: el resumen se manda por el WhatsApp del cliente
// (link wa.me con el texto pre-llenado) — sin API de WhatsApp ni checkout.
// ----------------------------------------------------------------------

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

const buildSummary = (items, total) => {
  const lines = items.map((item) => {
    const qty = item.unit ? `${item.qty} ${item.unit} de` : `${item.qty}×`;
    const detail = item.detail ? ` (${item.detail})` : '';
    return `• ${qty} ${item.title}${detail} — ${fCurrency(item.price * item.qty)}`;
  });
  return `Hola, me gustaría cotizar este pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${fCurrency(total)}`;
};

function CartRow({ item, onQty, onRemove }) {
  // granel por gramos: pasos de 50; piezas: de 1 en 1
  const step = item.unit === 'g' ? 50 : 1;

  return (
    <Box sx={{ py: 1.5, gap: 1.5, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'background.neutral' }}>
        {item.image && <Image alt={item.title} src={item.image} ratio="1/1" />}
      </Box>

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {item.title}
        </Typography>
        {item.detail && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {item.detail}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fCurrency(item.price * item.qty)}
        </Typography>
      </Box>

      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <IconButton size="small" onClick={() => onQty(item.key, item.qty - step)}>
          <Iconify icon="eva:minus-circle-fill" width={18} sx={{ color: 'text.disabled' }} />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
          {item.qty}
          {item.unit ? ` ${item.unit}` : ''}
        </Typography>
        <IconButton size="small" onClick={() => onQty(item.key, item.qty + step)}>
          <Iconify icon="mingcute:add-line" width={18} />
        </IconButton>
      </Stack>

      <IconButton size="small" color="error" onClick={() => onRemove(item.key)}>
        <Iconify icon="solar:trash-bin-trash-bold" width={18} />
      </IconButton>
    </Box>
  );
}

export function CartButton({ sx }) {
  const drawer = useBoolean();
  const { items, count, total, setQty, remove, clear } = useCart();
  const [copied, setCopied] = useState(false);

  const summary = buildSummary(items, total);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <IconButton onClick={drawer.onTrue} aria-label="Cotización" sx={sx}>
        <Badge badgeContent={count} color="error" max={99}>
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={drawer.value}
        onClose={drawer.onFalse}
        slotProps={{ paper: { sx: { width: 1, maxWidth: 400, display: 'flex' } } }}
      >
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cotización {count > 0 && `(${count})`}
          </Typography>
          {count > 0 && (
            <Button size="small" color="inherit" onClick={clear}>
              Vaciar
            </Button>
          )}
          <IconButton onClick={drawer.onFalse}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ px: 2.5, flexGrow: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Stack spacing={1} sx={{ py: 10, alignItems: 'center', color: 'text.disabled' }}>
              <Iconify icon="solar:cart-plus-bold" width={40} />
              <Typography variant="body2">Tu cotización está vacía</Typography>
              <Typography variant="caption" sx={{ textAlign: 'center', maxWidth: 240 }}>
                Agrega animales y productos desde su página con «Agregar a cotización»
              </Typography>
            </Stack>
          ) : (
            <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
              {items.map((item) => (
                <CartRow key={item.key} item={item} onQty={setQty} onRemove={remove} />
              ))}
            </Stack>
          )}
        </Box>

        {items.length > 0 && (
          <Box sx={{ p: 2.5, borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Total estimado</Typography>
              <Typography variant="subtitle1">{fCurrency(total)}</Typography>
            </Box>

            <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
              Sin pago en línea: nos mandas el resumen y confirmamos disponibilidad, envío y total.
            </Typography>

            <Stack spacing={1}>
              {WHATSAPP ? (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(summary)}`}
                  target="_blank"
                  rel="noopener"
                >
                  Enviar cotización por WhatsApp
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={<Iconify icon="solar:copy-bold" width={18} />}
                  onClick={handleCopy}
                >
                  {copied ? '¡Resumen copiado!' : 'Copiar resumen del pedido'}
                </Button>
              )}
              {WHATSAPP && (
                <Button
                  fullWidth
                  color="inherit"
                  startIcon={<Iconify icon="solar:copy-bold" width={16} />}
                  onClick={handleCopy}
                >
                  {copied ? '¡Copiado!' : 'Copiar resumen'}
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Drawer>
    </>
  );
}
