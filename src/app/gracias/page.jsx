import { LINK, PhoneLink, OdLinksPage } from 'src/sections/links/od-links-page';

// ----------------------------------------------------------------------
// /gracias — destino del QR del sticker que va con cada compra.
// LA URL YA ESTÁ IMPRESA: no mover ni redirigir esta ruta. Si cambia el
// contenido, se edita aquí. Quien la abre ya compró: primero las guías.
// ----------------------------------------------------------------------

const TITLE = 'Gracias por tu compra · Opuntia Den';
const DESCRIPTION = 'Guías de cuidado, contacto y redes de Opuntia Den, criadero en la Ciudad de México.';

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/brand/assets/logo/sello-claro-480.png', width: 480, height: 480, alt: 'Sello de Opuntia Den' }],
  },
};

export default function Page() {
  return (
    <OdLinksPage
      visit="visita_gracias"
      label="Criadero · Ciudad de México"
      title="Gracias por tu compra"
      lead="Gracias por llevarte un pedacito de nuestro criadero. Aquí tienes todo para que tus animales estén bien."
      sections={['guides', 'links']}
      links={[LINK.catalogo, LINK.instagram, LINK.whatsapp, LINK.sitio]}
      footer={
        <>
          Ciudad de México · <PhoneLink />
        </>
      }
    />
  );
}
