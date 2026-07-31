'use client';

import { useRef, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { Pill, Kicker, Display } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

import { useCart } from '../use-cart';

// ----------------------------------------------------------------------
// Página de cotización (reemplaza al drawer). Misma lógica de pedido: entrega
// en CDMX se paga en línea con Mercado Pago; con envío se cierra por WhatsApp.
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
  const step = item.unit === 'g' ? 50 : 1;
  const atMax = item.max != null && item.qty >= item.max;

  return (
    <Box sx={{ py: 2.5, gap: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-divider)' }}>
      <Box
        {...(item.url ? { component: RouterLink, href: item.url } : {})}
        sx={{ width: 76, height: 76, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', display: 'block', bgcolor: 'var(--color-neutral-200)' }}
      >
        {item.image && (
          <Box component="img" src={item.image} alt={item.title} sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }} />
        )}
      </Box>

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Box
          {...(item.url ? { component: RouterLink, href: item.url } : {})}
          sx={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'inherit', textDecoration: 'none', display: 'block' }}
        >
          {item.title}
        </Box>
        {item.detail && (
          <Box sx={{ mt: 0.25, fontSize: 13, color: 'var(--color-neutral-600)' }}>{item.detail}</Box>
        )}
        <Box sx={{ mt: 0.5, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
          {fCurrency(item.price * item.qty)}
        </Box>
      </Box>

      <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-divider)', borderRadius: '999px' }}>
        <Box component="button" type="button" aria-label="Quitar" onClick={() => onQty(item.key, item.qty - step)}
          sx={{ width: 38, height: 40, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 16, color: 'inherit' }}>
          –
        </Box>
        <Box component="span" sx={{ minWidth: 40, textAlign: 'center', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
          {item.qty}{item.unit ? ` ${item.unit}` : ''}
        </Box>
        <Box component="button" type="button" aria-label="Agregar" disabled={atMax} onClick={() => onQty(item.key, item.qty + step)}
          sx={{ width: 38, height: 40, border: 0, bgcolor: 'transparent', cursor: atMax ? 'default' : 'pointer', fontSize: 16, color: atMax ? 'var(--color-neutral-400)' : 'inherit' }}>
          +
        </Box>
      </Box>

      <Box component="button" type="button" aria-label="Eliminar" onClick={() => onRemove(item.key)}
        sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'var(--color-neutral-500)', display: 'grid', placeItems: 'center', width: 36, height: 36, '&:hover': { color: 'var(--color-accent-700)' } }}>
        <Iconify icon="solar:trash-bin-trash-bold" width={18} />
      </Box>
    </Box>
  );
}

export function OdCartView() {
  const { items, count, total, setQty, remove, clear, replaceAll } = useCart();
  const { status } = useSession();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [delivery, setDelivery] = useState('pickup');
  const [phone, setPhone] = useState('');
  const [shippingEnabled, setShippingEnabled] = useState(true);

  const signedIn = status === 'authenticated';
  const summary = buildSummary(items, total);
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

  useEffect(() => {
    if (!signedIn) return;
    fetch('/api/shop/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.phone) setPhone((current) => current || me.phone);
      })
      .catch(() => {});
  }, [signedIn]);

  // Reconciliar contra el servidor una vez, cuando el carrito ya cargó
  const reconciled = useRef(false);
  useEffect(() => {
    if (reconciled.current || items.length === 0) return;
    reconciled.current = true;
    fetch('/api/cart-validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((i) => ({ key: i.key, qty: i.qty })) }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.items) return;
        const byKey = Object.fromEntries(data.items.map((r) => [r.key, r]));
        const removed = [];
        const adjusted = [];
        const next = [];
        items.forEach((it) => {
          const r = byKey[it.key];
          const max = r?.max_qty;
          if (!r || r.available === false || max === 0) {
            removed.push(it.title);
            return;
          }
          const qty = max != null ? Math.min(it.qty, max) : it.qty;
          if (qty !== it.qty) adjusted.push(r.title ?? it.title);
          next.push({ ...it, title: r.title ?? it.title, detail: r.detail ?? it.detail, price: r.unit_price ?? it.price, max, qty });
        });
        replaceAll(next);
        const msgs = [];
        if (removed.length) msgs.push(`Quitamos lo que ya no está disponible: ${removed.join(', ')}.`);
        if (adjusted.length) msgs.push(`Ajustamos la cantidad a lo disponible: ${adjusted.join(', ')}.`);
        setNotice(msgs.join(' '));
      })
      .catch(() => {});
  }, [items, replaceAll]);

  const handleOrder = async () => {
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
          clear();
          setError(`${payBody.detail ?? 'No se pudo abrir el pago.'} Tu pedido ${body.code} quedó guardado; escríbenos por WhatsApp.`);
          return;
        }
        clear();
        window.location.href = payBody.payment_url;
        return;
      }

      clear();
      const text = `Hola, acabo de hacer el pedido ${body.code ?? `#${body.id}`} en la página:\n\n${summary}`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    } catch {
      setError('No se pudo enviar el pedido. Revisa tu conexión.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <Kicker sx={{ mb: 2.5 }}>Inicio / Cotización</Kicker>
      <Display component="h1" size="clamp(40px, 5.4vw, 76px)" sx={{ lineHeight: 1.02, mb: { xs: 4, md: 6 } }}>
        Tu cotización {count > 0 && <Box component="span" sx={{ fontSize: '0.4em', color: 'var(--color-neutral-500)', verticalAlign: 'middle' }}>({count})</Box>}
      </Display>

      {items.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Box sx={{ mb: 1, fontFamily: 'var(--font-heading)', fontSize: 24 }}>Tu cotización está vacía</Box>
          <Box sx={{ mb: 4, fontSize: 15, color: 'var(--color-neutral-600)' }}>
            Agrega animales y productos desde su página con «Agregar a cotización».
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pill href={paths.catalog}>Ver catálogo</Pill>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: { xs: 4, md: '48px' }, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(320px, 0.6fr)' } }}>
          {/* Líneas */}
          <Box sx={{ minWidth: 0 }}>
            {notice && (
              <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setNotice('')}>
                {notice}
              </Alert>
            )}
            <Box sx={{ borderTop: '1px solid var(--color-divider)' }}>
              {items.map((item) => (
                <CartRow key={item.key} item={item} onQty={setQty} onRemove={remove} />
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button color="inherit" size="small" onClick={clear}>Vaciar cotización</Button>
            </Box>
          </Box>

          {/* Resumen / checkout */}
          <Box sx={{ minWidth: 0, position: { md: 'sticky' }, top: { md: 130 }, border: '1px solid var(--color-divider)', borderRadius: '18px', p: { xs: 2.5, md: 3 }, bgcolor: 'var(--color-neutral-100)' }}>
            {!shippingEnabled && (
              <Alert severity="info" icon={false} sx={{ mb: 2, py: 0.5, typography: 'caption' }}>
                <strong>Solo entrega en persona en CDMX.</strong> Por ahora no hacemos envíos a domicilio.
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
              <Box sx={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>
                {signedIn && isPickup ? 'Total a pagar' : 'Total estimado'}
              </Box>
              <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontVariantNumeric: 'tabular-nums' }}>
                {fCurrency(total)}
              </Box>
            </Box>

            {signedIn && (
              <>
                {shippingEnabled && (
                  <ToggleButtonGroup exclusive fullWidth size="small" value={delivery} onChange={(_, v) => v && setDelivery(v)} sx={{ mb: 1.5 }}>
                    <ToggleButton value="pickup">Entrega en CDMX</ToggleButton>
                    <ToggleButton value="shipping">Envío</ToggleButton>
                  </ToggleButtonGroup>
                )}

                <Box sx={{ mb: 1.5, fontSize: 13, color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
                  {isPickup
                    ? 'Pagas ahora en línea y acordamos por WhatsApp el punto y la hora de entrega. El precio mostrado es el total.'
                    : 'Nos mandas el resumen y te cotizamos el envío; el link de pago te llega por WhatsApp con el total final.'}
                </Box>

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
                  helperText={isPickup ? 'Para coordinar la entrega. Queda guardado en tu cuenta.' : 'Opcional: para contactarte más rápido.'}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {!signedIn && (
              <Box sx={{ mb: 2, fontSize: 13, color: 'var(--color-neutral-600)' }}>
                {shippingEnabled
                  ? 'Entregamos en persona en CDMX o enviamos a todo el país.'
                  : 'Entregamos en persona en la Ciudad de México.'}
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 2, typography: 'caption' }}>{error}</Alert>}

            {signedIn ? (
              <Button fullWidth size="large" variant="contained" color="primary" loading={placing} onClick={handleOrder}>
                {isPickup ? `Pagar ${fCurrency(total)}` : 'Pedir cotización'}
              </Button>
            ) : (
              <Button fullWidth size="large" variant="contained" onClick={() => signIn('google')} startIcon={<Iconify icon="logos:google-icon" width={18} />}>
                Entrar para hacer tu pedido
              </Button>
            )}

            <Box sx={{ mt: 1.5, textAlign: 'center' }}>
              <Button component={RouterLink} href={paths.catalog} color="inherit" size="small">
                Seguir viendo el catálogo
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
