import { Suspense } from 'react';

import { OdLayout } from 'src/layouts/od/od-layout';

import { TrackingView } from 'src/sections/account/tracking-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Rastrea tu envío',
  description: 'Consulta por dónde va tu paquete con el número de guía, sin crear cuenta.',
};

export default function Page() {
  return (
    // sideArt: el contenido va centrado y angosto; en pantallas anchas los
    // lados llevan las curvas de nivel animadas
    <OdLayout sideArt={1000}>
      {/* useSearchParams (?guia=) pide Suspense al prerenderizar */}
      <Suspense>
        <TrackingView />
      </Suspense>
    </OdLayout>
  );
}
