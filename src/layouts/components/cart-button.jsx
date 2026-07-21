'use client';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { signIn, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

// ----------------------------------------------------------------------
// Carrito de cotización. Con sesión iniciada el pedido queda guardado (y
// visible en "Mis pedidos") y después se abre WhatsApp con el folio; sin
// sesión sigue funcionando igual que siempre, sólo con el link de WhatsApp.
// Nunca hay cobro en línea: el precio lo confirma el negocio.
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
  const { status } = useSession();
  const [copied, setCopied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const signedIn = status === 'authenticated';
  const summary = buildSummary(items, total);
  const whatsappUrl = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Guarda el pedido y sólo entonces abre WhatsApp con el folio. Si falla,
  // el carrito se queda intacto para poder reintentar.
  const handleOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const res = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ key: i.key, qty: i.qty })) }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.detail ?? 'No se pudo enviar el pedido. Inténtalo de nuevo.');
        return;
      }
      clear();
      drawer.onFalse();
      if (WHATSAPP) {
        window.open(
          whatsappUrl(`Hola, acabo de hacer el pedido #${body.id} en la página:\n\n${summary}`),
          '_blank',
          'noopener'
        );
      }
    } catch {
      setError('No se pudo enviar el pedido. Revisa tu conexión.');
    } finally {
      setPlacing(false);
    }
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

            {error && (
              <Alert severity="error" sx={{ mb: 2, typography: 'caption' }}>
                {error}
              </Alert>
            )}

            <Stack spacing={1}>
              {signedIn ? (
                <>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="success"
                    loading={placing}
                    onClick={handleOrder}
                  >
                    Hacer pedido
                  </Button>
                  <Button
                    fullWidth
                    color="inherit"
                    component={RouterLink}
                    href={paths.orders}
                    onClick={drawer.onFalse}
                  >
                    Ver mis pedidos
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={() => signIn('google')}
                  startIcon={<Iconify icon="logos:google-icon" width={18} />}
                >
                  Entrar para guardar el pedido
                </Button>
              )}

              {WHATSAPP && !signedIn ? (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  href={whatsappUrl(summary)}
                  target="_blank"
                  rel="noopener"
                >
                  Enviar cotización por WhatsApp
                </Button>
              ) : null}

              {!WHATSAPP && !signedIn && (
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
