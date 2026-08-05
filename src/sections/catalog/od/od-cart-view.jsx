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
import { Display } from 'src/layouts/od/od-ui';

import { Iconify } from 'src/components/iconify';

import { useCart } from '../use-cart';

// ----------------------------------------------------------------------
// Página de cotización (estructura tipo "Mi carrito": ítems a la izquierda,
// tarjeta de resumen a la derecha). Misma lógica de pedido: entrega en CDMX se
// paga en línea con Mercado Pago; con envío se cierra por WhatsApp.
// ----------------------------------------------------------------------

const buildSummary = (items, total) => {
  const lines = items.map((item) => {
    const qty = item.unit ? `${item.qty} ${item.unit} de` : `${item.qty}×`;
    const detail = item.detail ? ` (${item.detail})` : '';
    return `• ${qty} ${item.title}${detail} — ${fCurrency(item.price * item.qty)}`;
  });
  return `Hola, me gustaría cotizar este pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${fCurrency(total)}`;
};

const circleBtn = {
  width: 44,
  height: 44,
  flexShrink: 0,
  borderRadius: '999px',
  border: '1px solid var(--color-divider)',
  bgcolor: 'transparent',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  fontSize: 20,
  color: 'inherit',
  transition: 'border-color 300ms, background 300ms',
  '&:hover': { borderColor: 'var(--color-accent)', bgcolor: 'var(--color-accent-100)' },
};

function CartRow({ item, onQty, onRemove }) {
  const step = item.unit === 'g' ? 50 : 1;
  const atMax = item.max != null && item.qty >= item.max;

  return (
    <Box sx={{ py: { xs: 3, md: 4 }, borderBottom: '1px solid var(--color-divider)', display: 'flex', gap: { xs: 2, md: 3 }, alignItems: 'flex-start' }}>
      <Box
        {...(item.url ? { component: RouterLink, href: item.url } : {})}
        sx={{ width: { xs: 96, md: 116 }, flexShrink: 0, aspectRatio: '1 / 1', borderRadius: '12px', overflow: 'hidden', display: 'block', bgcolor: 'var(--color-neutral-200)' }}
      >
        {item.image && <Box component="img" src={item.image} alt={item.title} sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }} />}
      </Box>

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Box
          {...(item.url ? { component: RouterLink, href: item.url } : {})}
          sx={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'inherit', textDecoration: 'none', display: 'block' }}
        >
          {item.title}
        </Box>
        {item.detail && (
          <Box sx={{ mt: 0.5, fontSize: 14, color: 'var(--color-accent-700)' }}>{item.detail}</Box>
        )}
        <Box sx={{ mt: 0.75, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{fCurrency(item.price * item.qty)}</Box>
        <Box
          component="button"
          type="button"
          onClick={() => onRemove(item.key)}
          sx={{ mt: 1.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, font: 'inherit', fontSize: 14, color: 'var(--color-neutral-600)', textDecoration: 'underline', textUnderlineOffset: '3px', '&:hover': { color: 'var(--color-accent-700)' } }}
        >
          Eliminar
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Box component="button" type="button" aria-label="Quitar" onClick={() => onQty(item.key, item.qty - step)} sx={circleBtn}>–</Box>
        <Box component="span" sx={{ minWidth: 34, textAlign: 'center', fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>
          {item.qty}{item.unit ? ` ${item.unit}` : ''}
        </Box>
        <Box component="button" type="button" aria-label="Agregar" disabled={atMax} onClick={() => onQty(item.key, item.qty + step)}
          sx={{ ...circleBtn, ...(atMax && { cursor: 'default', color: 'var(--color-neutral-400)', '&:hover': {} }) }}>
          +
        </Box>
      </Box>
    </Box>
  );
}

function SummaryRow({ label, value, strong }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 1 }}>
      <Box sx={{ fontSize: strong ? 16 : 15, fontWeight: strong ? 600 : 400, color: strong ? 'var(--color-text)' : 'var(--color-neutral-700)' }}>{label}</Box>
      <Box sx={{ fontSize: 15, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>{value}</Box>
    </Box>
  );
}

const STEPS = ['Cotización', 'Datos y entrega', 'Pago'];

// Indicador de pasos del checkout. Se puede volver a un paso anterior.
function StepIndicator({ step, onGo }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 4, md: 6 }, flexWrap: 'wrap' }}>
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box
              component={i <= step ? 'button' : 'div'}
              type={i <= step ? 'button' : undefined}
              onClick={i < step ? () => onGo(i) : undefined}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                border: 0,
                bgcolor: 'transparent',
                font: 'inherit',
                cursor: i < step ? 'pointer' : 'default',
                color: active || done ? 'var(--color-text)' : 'var(--color-neutral-500)',
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: '999px',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid',
                  borderColor: active || done ? 'var(--color-accent)' : 'var(--color-divider)',
                  bgcolor: done ? 'var(--color-accent)' : active ? 'var(--color-accent-100)' : 'transparent',
                  color: done ? 'var(--color-neutral-100)' : 'inherit',
                }}
              >
                {done ? '✓' : i + 1}
              </Box>
              <Box component="span" sx={{ fontSize: 13, letterSpacing: '0.04em', display: { xs: active ? 'inline' : 'none', sm: 'inline' } }}>
                {label}
              </Box>
            </Box>
            {i < STEPS.length - 1 && (
              <Box sx={{ width: { xs: 18, sm: 40 }, height: '1px', bgcolor: 'var(--color-divider)' }} />
            )}
          </Box>
        );
      })}
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
  const [promo, setPromo] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  // Paso del checkout (0 cotización · 1 datos · 2 pago) y confirmación final
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(null);

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

      const code = body.code ?? `#${body.id}`;
      clear();
      const text = `Hola, acabo de hacer el pedido ${code} en la página:\n\n${summary}`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      // pantalla de confirmación en la página (la ruta de pago en línea redirige
      // a Mercado Pago, así que su confirmación llega por su URL de retorno)
      setConfirmed({ code });
    } catch {
      setError('No se pudo enviar el pedido. Revisa tu conexión.');
    } finally {
      setPlacing(false);
    }
  };

  // Avanza de "Datos y entrega" a "Pago" validando el teléfono si es pickup
  const goToPay = () => {
    if (isPickup && !phoneOk) {
      setError('Escribe un teléfono con WhatsApp (10 dígitos) para coordinar la entrega.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Confirmación (ruta de cierre por WhatsApp; el pago en línea redirige a MP)
  if (confirmed) {
    return (
      <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 6, md: 10 }, pb: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <Box sx={{ mb: 2, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
          Pedido confirmado
        </Box>
        <Display component="h1" size="clamp(36px, 5vw, 72px)" sx={{ lineHeight: 1.05 }}>
          ¡Gracias! Ya tenemos tu pedido.
        </Display>
        <Box sx={{ mt: 3, fontSize: 16, lineHeight: 1.8, color: 'var(--color-neutral-700)', maxWidth: '48ch', mx: 'auto' }}>
          Tu número de pedido es{' '}
          <Box component="span" sx={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--color-text)' }}>
            {confirmed.code}
          </Box>
          . Te escribimos por WhatsApp para coordinar la entrega. También te llegó un correo con el detalle.
        </Box>
        <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          <Button component={RouterLink} href={paths.catalog} variant="contained" sx={{ borderRadius: '999px', px: 3, bgcolor: 'var(--color-neutral-900)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}>
            Seguir viendo
          </Button>
          <Button component={RouterLink} href={paths.shipping} color="inherit" variant="outlined" sx={{ borderRadius: '999px', px: 3 }}>
            Cómo es la entrega
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ px: { xs: '18px', md: '40px' }, pt: { xs: 3, md: 5 }, pb: { xs: 8, md: 12 } }}>
      <Display component="h1" size="clamp(48px, 7vw, 104px)" sx={{ textAlign: 'center', lineHeight: 1, mb: { xs: 4, md: 6 } }}>
        Tu cotización{count > 0 ? ` (${count})` : ''}
      </Display>

      {items.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ mb: 1, fontFamily: 'var(--font-heading)', fontSize: 24 }}>Tu cotización está vacía</Box>
          <Box sx={{ mb: 4, fontSize: 15, color: 'var(--color-neutral-600)' }}>
            Agrega animales y productos desde su página con «Agregar a cotización».
          </Box>
          <Button component={RouterLink} href={paths.catalog} variant="contained" color="primary" size="large" sx={{ borderRadius: '999px' }}>
            Ver catálogo
          </Button>
        </Box>
      ) : (
        <>
          <StepIndicator step={step} onGo={setStep} />
          <Box sx={{ display: 'grid', gap: { xs: 4, md: '48px' }, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(340px, 0.62fr)' } }}>
            {/* Líneas (editables solo en el paso 0) */}
            <Box sx={{ minWidth: 0 }}>
              {notice && (
                <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setNotice('')}>
                  {notice}
                </Alert>
              )}
              <Box sx={{ borderTop: '1px solid var(--color-divider)' }}>
                {items.map((item) =>
                  step === 0 ? (
                    <CartRow key={item.key} item={item} onQty={setQty} onRemove={remove} />
                  ) : (
                    // recap compacto de solo lectura en datos/pago
                    <Box key={item.key} sx={{ py: 2, borderBottom: '1px solid var(--color-divider)', display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 56, height: 56, flexShrink: 0, borderRadius: '10px', overflow: 'hidden', bgcolor: 'var(--color-neutral-200)' }}>
                        {item.image && <Box component="img" src={item.image} alt={item.title} sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }} />}
                      </Box>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{item.title}</Box>
                        <Box sx={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>
                          {item.qty}{item.unit ? ` ${item.unit}` : '×'}{item.detail ? ` · ${item.detail}` : ''}
                        </Box>
                      </Box>
                      <Box sx={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{fCurrency(item.price * item.qty)}</Box>
                    </Box>
                  )
                )}
              </Box>
            </Box>

            {/* Panel derecho: cambia según el paso */}
            <Box sx={{ minWidth: 0, position: { md: 'sticky' }, top: { md: 130 }, border: '1px solid var(--color-divider)', borderRadius: '18px', p: { xs: 2.5, md: 3.5 }, bgcolor: 'var(--color-neutral-100)', boxShadow: 'var(--shadow-sm)' }}>
              <SummaryRow label="Subtotal" value={fCurrency(total)} />
              <SummaryRow label={isPickup ? 'Entrega en CDMX' : 'Envío'} value={isPickup ? fCurrency(0) : 'Por cotizar'} />
              <SummaryRow label="Impuestos" value="Incluidos" />
              <Box sx={{ my: 1.5, borderTop: '1px solid var(--color-divider)' }} />
              <SummaryRow label="Total" value={<Box component="span" sx={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{fCurrency(total)}</Box>} strong />

              {/* PASO 0 · Cotización */}
              {step === 0 && (
                <>
                  {!shippingEnabled && (
                    <Alert severity="info" icon={false} sx={{ mt: 2, py: 0.5, typography: 'caption' }}>
                      <strong>Solo entrega en persona en CDMX.</strong> Por ahora no hacemos envíos a domicilio.
                    </Alert>
                  )}
                  <Button fullWidth variant="contained" onClick={() => setStep(1)}
                    sx={{ mt: 3, borderRadius: '999px', py: 1.25, bgcolor: 'var(--color-neutral-900)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}>
                    Continuar
                  </Button>
                  <Button component={RouterLink} href={paths.catalog} color="inherit" size="small" fullWidth sx={{ mt: 1 }}>
                    Seguir viendo el catálogo
                  </Button>
                </>
              )}

              {/* PASO 1 · Datos y entrega */}
              {step === 1 && (
                <Box sx={{ mt: 2.5 }}>
                  {signedIn ? (
                    <>
                      {shippingEnabled && (
                        <ToggleButtonGroup exclusive fullWidth size="small" value={delivery} onChange={(_, v) => v && setDelivery(v)} sx={{ mb: 1.5 }}>
                          <ToggleButton value="pickup">Entrega en CDMX</ToggleButton>
                          <ToggleButton value="shipping">Envío</ToggleButton>
                        </ToggleButtonGroup>
                      )}
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
                        helperText={isPickup ? 'Para coordinar la entrega. Queda guardada en tu cuenta.' : 'Opcional: para contactarte más rápido.'}
                      />
                      {error && <Alert severity="error" sx={{ mt: 2, typography: 'caption' }}>{error}</Alert>}
                      <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
                        <Button color="inherit" onClick={() => { setError(''); setStep(0); }} sx={{ borderRadius: '999px' }}>
                          Atrás
                        </Button>
                        <Button fullWidth variant="contained" onClick={goToPay}
                          sx={{ borderRadius: '999px', bgcolor: 'var(--color-neutral-900)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}>
                          Continuar al pago
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ fontSize: 14, color: 'var(--color-neutral-700)', lineHeight: 1.6 }}>
                        Entra con Google para guardar tu pedido y coordinar la entrega.
                      </Box>
                      <Button fullWidth variant="contained" onClick={() => signIn('google')}
                        sx={{ mt: 2, borderRadius: '999px', py: 1.25, bgcolor: 'var(--color-neutral-900)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}>
                        Entrar para continuar
                      </Button>
                      <Button color="inherit" size="small" fullWidth sx={{ mt: 1 }} onClick={() => setStep(0)}>
                        Atrás
                      </Button>
                    </>
                  )}
                </Box>
              )}

              {/* PASO 2 · Pago */}
              {step === 2 && (
                <Box sx={{ mt: 2.5 }}>
                  <Box sx={{ mb: 2, p: 1.75, borderRadius: '12px', bgcolor: 'var(--color-bg)', fontSize: 13, lineHeight: 1.7, color: 'var(--color-neutral-700)' }}>
                    <Box><strong style={{ color: 'var(--color-text)' }}>{isPickup ? 'Entrega en persona · CDMX' : 'Envío a domicilio'}</strong></Box>
                    <Box>{isPickup ? 'Punto y hora se acuerdan por WhatsApp. Sin costo.' : 'Coordinamos costo y guía por WhatsApp.'}</Box>
                    {phone && <Box sx={{ mt: 0.5 }}>WhatsApp: {phone}</Box>}
                  </Box>

                  {/* Código de promoción (estructura; aún sin backend) */}
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPromoMsg(promo.trim() ? 'Por ahora no hay códigos de promoción activos.' : '');
                    }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid var(--color-divider)', borderRadius: '12px', px: 1.5 }}
                  >
                    <Box
                      component="input"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Código de promoción"
                      aria-label="Código de promoción"
                      sx={{ flex: 1, minWidth: 0, border: 0, outline: 'none', bgcolor: 'transparent', font: 'inherit', fontSize: 14, py: 1.25, color: 'var(--color-text)' }}
                    />
                    <Box component="button" type="submit" aria-label="Aplicar código" sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'var(--color-text)', display: 'grid', placeItems: 'center', p: 0.5, '&:hover': { color: 'var(--color-accent-700)' } }}>
                      <Iconify icon="eva:arrow-forward-outline" width={20} />
                    </Box>
                  </Box>
                  {promoMsg && <Box sx={{ mt: 1, fontSize: 12, color: 'var(--color-neutral-600)' }}>{promoMsg}</Box>}

                  {error && <Alert severity="error" sx={{ mt: 2, typography: 'caption' }}>{error}</Alert>}

                  <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
                    <Button color="inherit" onClick={() => { setError(''); setStep(1); }} sx={{ borderRadius: '999px' }}>
                      Atrás
                    </Button>
                    <Button fullWidth variant="contained" loading={placing} onClick={handleOrder}
                      sx={{ borderRadius: '999px', bgcolor: 'var(--color-neutral-900)', '&:hover': { bgcolor: 'var(--color-accent-700)' } }}>
                      {isPickup ? `Pagar ${fCurrency(total)}` : 'Pedir cotización'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
