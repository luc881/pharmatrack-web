import { getGuides } from 'src/lib/guides';
import { OdLayout } from 'src/layouts/od/od-layout';

import { OdGuidesIndexView } from 'src/sections/guides/od-guides-index-view';

// ----------------------------------------------------------------------
// /guias — índice de las guías de cuidado (src/content/guias/*.md).
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Guías de cuidado',
  description: 'Guías de cuidado de Opuntia Den: fásmidos, isópodos, colémbolos y cucarachas.',
};

export default async function Page() {
  return (
    <OdLayout>
      <OdGuidesIndexView guides={await getGuides()} />
    </OdLayout>
  );
}
