'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { EmptyContent } from 'src/components/empty-content';

import { SignInPrompt } from './account-view';

// ----------------------------------------------------------------------

export const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmado', color: 'info' },
  completed: { label: 'Entregado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
};

function OrderCard({ order, onCancel }) {
  const state = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    // confirm nativo: es una acción reversible a medias (puede volver a pedir)
    if (!window.confirm(`¿Cancelar el pedido #${order.id}?`)) return;
    setCancelling(true);
    try {
      await onCancel(order.id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ mb: 2, gap: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1">Pedido #{order.id}</Typography>
        <Label color={state.color}>{state.label}</Label>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {fDate(order.created_at)}
        </Typography>
      </Box>

      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} spacing={1}>
        {order.items.map((item) => (
          <Box key={item.id} sx={{ gap: 2, display: 'flex', alignItems: 'baseline' }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2">{item.title}</Typography>
              {item.detail && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {item.detail}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {item.quantity}
              {item.unit ? ` ${item.unit}` : '×'} {fCurrency(item.unit_price)}
            </Typography>
            <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right' }}>
              {fCurrency(item.subtotal)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2">Total estimado</Typography>
        <Typography variant="subtitle1">{fCurrency(order.total)}</Typography>
      </Box>

      {order.status === 'pending' && (
        <Box sx={{ mt: 1, gap: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ flexGrow: 1, color: 'text.secondary' }}>
            Te confirmamos disponibilidad, envío y total. Todavía no se cobra nada.
            ¿Te equivocaste? Cancela y vuelve a hacer el pedido desde el carrito.
          </Typography>
          <Button size="small" color="error" loading={cancelling} onClick={handleCancel}>
            Cancelar pedido
          </Button>
        </Box>
      )}
    </Card>
  );
}

export function OrdersView() {
  const { status } = useSession();
  const [orders, setOrders] = useState(null);

  const load = () =>
    fetch('/api/shop/orders')
      .then((res) => (res.ok ? res.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]));

  useEffect(() => {
    if (status !== 'authenticated') return;
    load();
  }, [status]);

  const handleCancel = async (id) => {
    const res = await fetch(`/api/shop/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      window.alert(body.detail ?? 'No se pudo cancelar el pedido.');
    }
    await load();
  };

  return (
    <Container sx={{ mb: 10, mt: { xs: 1, md: 3 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: { xs: 3, md: 5 } }}>
        Mis pedidos
      </Typography>

      {status === 'loading' && null}

      {status === 'unauthenticated' && (
        <SignInPrompt
          title="Entra para ver tus pedidos"
          description="Tus pedidos quedan guardados en tu cuenta con su estado actualizado."
        />
      )}

      {status === 'authenticated' &&
        (orders?.length ? (
          <Stack spacing={3} sx={{ maxWidth: 720 }}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </Stack>
        ) : (
          orders && (
            <EmptyContent
              filled
              title="Todavía no tienes pedidos"
              description="Cuando mandes una cotización desde el carrito, aparecerá aquí."
              action={
                <Button component={RouterLink} href={paths.catalog} variant="contained" sx={{ mt: 3 }}>
                  Ver catálogo
                </Button>
              }
            />
          )
        ))}
    </Container>
  );
}
