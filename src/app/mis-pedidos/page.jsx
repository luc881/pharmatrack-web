import { MainLayout } from 'src/layouts/main';

import { OrdersView } from 'src/sections/account/orders-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Mis pedidos',
  robots: { index: false },
};

export default function Page() {
  return (
    <MainLayout>
      <OrdersView />
    </MainLayout>
  );
}
