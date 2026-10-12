import { OdLinksPage } from 'src/sections/links/od-links-page';

// ----------------------------------------------------------------------
// /links — enlace de la bio de Instagram. Quien la abre todavía no compra:
// primero qué es Opuntia Den y dónde ver o comprar. Sin dirección: la tienda
// no tiene local abierto al público. El contenido se edita en el dashboard
// (Sitio → Links y eventos).
// ----------------------------------------------------------------------

const TITLE = 'Opuntia Den · Historia natural';
const DESCRIPTION = 'Isópodos, colémbolos, fásmidos y bioactivo. Criadero en CDMX, entregas a convenir.';

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
  return <OdLinksPage pageKey="links" visit="visita_links" prefix="links_" sections={['links', 'guides', 'event']} />;
}
