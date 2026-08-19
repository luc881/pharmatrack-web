import { CONFIG } from 'src/global-config';
import { OdLayout } from 'src/layouts/od/od-layout';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

// El layout vive en la ruta (server component) y no dentro de NotFoundView,
// que es cliente: OdLayout es async y un componente cliente no puede
// renderizar un server component async.
export default function Page() {
  return (
    <OdLayout>
      <NotFoundView />
    </OdLayout>
  );
}
