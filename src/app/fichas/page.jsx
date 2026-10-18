import { Suspense } from 'react';

import { getCareSheets } from 'src/lib/public-api';
import { OdLayout } from 'src/layouts/od/od-layout';

import { OdCareSheetsIndexView } from 'src/sections/care-sheets/od-care-sheets-index-view';

// ----------------------------------------------------------------------
// /fichas — índice de las fichas de cuidados (API /public/care-sheets).
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Fichas de cuidados',
  description:
    'Fichas de cuidados de Opuntia Den: ficha técnica, datos rápidos y cuidados paso a paso de cada especie.',
};

export default async function Page() {
  const sheets = await getCareSheets();
  return (
    <OdLayout>
      {/* useSearchParams (?grupo=) necesita Suspense */}
      <Suspense>
        <OdCareSheetsIndexView sheets={sheets} />
      </Suspense>
    </OdLayout>
  );
}
