import { CONFIG } from 'src/global-config';

import { OdLinksPage } from 'src/sections/links/od-links-page';

// ----------------------------------------------------------------------
// /gracias — destino del QR del sticker que va con cada compra.
// LA URL YA ESTÁ IMPRESA: no mover ni redirigir esta ruta. El contenido se
// edita en el dashboard (Sitio → Links y eventos). Quien la abre ya compró:
// primero las guías.
// ----------------------------------------------------------------------

const TITLE = 'Gracias por tu compra · Opuntia Den';
const DESCRIPTION = 'Guías de cuidado, contacto y redes de Opuntia Den, criadero en la Ciudad de México.';

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [CONFIG.ogImage],
  },
};

export default function Page() {
  return <OdLinksPage pageKey="gracias" visit="visita_gracias" sections={['guides', 'links', 'event']} phone />;
}
