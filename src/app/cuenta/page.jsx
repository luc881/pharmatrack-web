import { MainLayout } from 'src/layouts/main';

import { AccountView } from 'src/sections/account/account-view';

// ----------------------------------------------------------------------

// Página personal: fuera del índice de Google
export const metadata = {
  title: 'Mi cuenta',
  robots: { index: false },
};

export default function Page() {
  return (
    <MainLayout>
      <AccountView />
    </MainLayout>
  );
}
