'use client';

import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { signIn, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useCart } from 'src/sections/catalog/use-cart';

// ----------------------------------------------------------------------
// Carrito. Mandar el pedido requiere sesión: queda guardado con folio y el
// cliente sigue su estado en "Mis pedidos". Entrega en CDMX se paga en línea
// al momento (el precio del catálogo es el total); con envío se abre WhatsApp
// y el cobro va después por link, cuando ya se cotizó el envío.
// ----------------------------------------------------------------------

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
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState('pickup');
  const [phone, setPhone] = useState('');
  const [shippingEnabled, setShippingEnabled] = useState(true);

  const signedIn = status === 'authenticated';
  const summary = buildSummary(items, total);
  // Con los envíos apagados sólo existe la entrega en CDMX
  const isPickup = delivery === 'pickup' || !shippingEnabled;
  const phoneOk = phone.replace(/\D/g, '').length >= 10;

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((site) => {
        if (site) setShippingEnabled(site.shipping_enabled !== false);
      })
      .catch(() => {});
  }, []);

  // Precargar el teléfono del perfil (si ya lo dio, no se le vuelve a pedir)
  useEffect(() => {
    if (!signedIn) return;
    fetch('/api/shop/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.phone) setPhone((current) => current || me.phone);
      })
      .catch(() => {});
  }, [signedIn]);

  // Guarda el pedido y, según la entrega, manda a pagar (CDMX) o abre
  // WhatsApp con el folio (envío: falta cotizar el envío antes de cobrar).
  // Si algo falla, el carrito queda intacto para reintentar.
  const handleOrder = async () => {
    // sin teléfono no hay entrega personal: evita el escenario de un pago
    // acreditado sin forma de contactar al cliente (la API también lo exige)
    if (isPickup && !phoneOk) {
      setError('Escribe un teléfono con WhatsApp (10 dígitos) para coordinar la entrega.');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const res = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ key: i.key, qty: i.qty })),
          delivery_method: isPickup ? 'pickup' : 'shipping',
          contact_phone: phone || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.detail ?? 'No se pudo enviar el pedido. Inténtalo de nuevo.');
        return;
      }

      if (isPickup) {
        const pay = await fetch(`/api/shop/orders/${body.id}/checkout`, { method: 'POST' });
        const payBody = await pay.json();
        if (!pay.ok) {
          // el pedido ya quedó guardado: se vacía el carrito y se avisa
          clear();
          setError(
            `${payBody.detail ?? 'No se pudo abrir el pago.'} Tu pedido ${body.code} quedó guardado; escríbenos por WhatsApp.`
          );
          return;
        }
        clear();
        window.location.href = payBody.payment_url;
        return;
      }

      clear();
      drawer.onFalse();
      const text = `Hola, acabo de hacer el pedido ${body.code ?? `#${body.id}`} en la página:\n\n${summary}`;
      window.open(
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener'
      );
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
              {/* con entrega en CDMX el monto es el final; con envío falta cotizar */}
              <Typography variant="subtitle1">
                {signedIn && isPickup ? 'Total a pagar' : 'Total estimado'}
              </Typography>
              <Typography variant="subtitle1">{fCurrency(total)}</Typography>
            </Box>

            {signedIn && (
              <>
                {shippingEnabled && (
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    size="small"
                    value={delivery}
                    onChange={(_, value) => value && setDelivery(value)}
                    sx={{ mb: 1 }}
                  >
                    <ToggleButton value="pickup">Entrega en CDMX</ToggleButton>
                    <ToggleButton value="shipping">Envío</ToggleButton>
                  </ToggleButtonGroup>
                )}

                <Typography
                  variant="caption"
                  sx={{ mb: 1.5, display: 'block', color: 'text.secondary' }}
                >
                  {isPickup
                    ? 'Pagas ahora en línea y acordamos por WhatsApp el punto y la hora de entrega. El precio mostrado es el total.'
                    : 'Nos mandas el resumen y te cotizamos el envío; el link de pago te llega por WhatsApp con el total final.'}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  type="tel"
                  label="Tu WhatsApp"
                  placeholder="55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={isPickup}
                  error={isPickup && phone.length > 0 && !phoneOk}
                  helperText={
                    isPickup
                      ? 'Para coordinar la entrega. Queda guardado en tu cuenta.'
                      : 'Opcional: para contactarte más rápido.'
                  }
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {!signedIn && (
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
                {shippingEnabled
                  ? 'Entregamos en persona en CDMX o enviamos a todo el país.'
                  : 'Entregamos en persona en la Ciudad de México.'}
              </Typography>
            )}

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
                    {isPickup ? `Pagar ${fCurrency(total)}` : 'Pedir cotización'}
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
                <>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={() => signIn('google')}
                    startIcon={<Iconify icon="logos:google-icon" width={18} />}
                  >
                    Entrar para hacer tu pedido
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  >
                    Con tu cuenta guardamos el pedido y puedes seguir su estado.
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Drawer>
    </>
  );
}
