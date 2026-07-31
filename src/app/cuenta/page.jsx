import { OdLayout } from 'src/layouts/od/od-layout';

import { AccountView } from 'src/sections/account/account-view';

// ----------------------------------------------------------------------

// Página personal: fuera del índice de Google
export const metadata = {
  title: 'Mi cuenta',
  robots: { index: false },
};

export default function Page() {
  return (
    <OdLayout offsetTop subscribe={false}>
      <AccountView />
    </OdLayout>
  );
}
