import { OdLayout } from 'src/layouts/od/od-layout';

import { OdCartView } from 'src/sections/catalog/od/od-cart-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Tu cotización',
  robots: { index: false },
};

export default function Page() {
  return (
    <OdLayout offsetTop subscribe={false}>
      <OdCartView />
    </OdLayout>
  );
}
