import { Suspense } from 'react';

import { OdPageHead } from 'src/layouts/od/od-ui';
import { OdLayout } from 'src/layouts/od/od-layout';

import { TrackingView } from 'src/sections/account/tracking-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Rastrea tu envío',
  description: 'Consulta por dónde va tu paquete con el número de guía, sin crear cuenta.',
};

export default function Page() {
  return (
    <OdLayout>
      <OdPageHead
        title="Rastrea tu envío"
        intro="Escribe tu número de guía y te decimos por dónde va tu paquete. No necesitas cuenta."
        introWidth="60ch"
      />
      {/* useSearchParams (?guia=) pide Suspense al prerenderizar */}
      <Suspense>
        <TrackingView />
      </Suspense>
    </OdLayout>
  );
}
