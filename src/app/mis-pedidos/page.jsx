import { OdLayout } from 'src/layouts/od/od-layout';

import { OrdersView } from 'src/sections/account/orders-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Mis pedidos',
  robots: { index: false },
};

export default function Page() {
  return (
    <OdLayout offsetTop subscribe={false}>
      <OrdersView />
    </OdLayout>
  );
}
