import { LINK, OdLinksPage } from 'src/sections/links/od-links-page';

// ----------------------------------------------------------------------
// /links — enlace de la bio de Instagram. Quien la abre todavía no compra:
// primero qué es Opuntia Den y dónde ver o comprar. Sin dirección: la tienda
// no tiene local abierto al público.
// ----------------------------------------------------------------------

const TITLE = 'Opuntia Den · Vida en miniatura';
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

// Se regenera cada hora para que el evento desaparezca solo al pasar la fecha
export const revalidate = 3600;

// Próximo evento: null para no mostrar nada. `ends` (YYYY-MM-DD, hora de
// CDMX) es el último día visible; `href` opcional abre "Más información".
// TODO(evento): falta el nombre y la sede de la convención; preguntarle al dueño.
const EVENT = {
  title: 'Convención · 22 de noviembre',
  ends: '2026-11-22',
  href: null,
};

export default function Page() {
  return (
    <OdLinksPage
      visit="visita_links"
      prefix="links_"
      label="Criadero · CDMX"
      title="Vida en miniatura"
      lead="Isópodos, colémbolos, fásmidos y bioactivo. Entregas a convenir."
      sections={['links', 'guides', 'event']}
      links={[LINK.catalogo, { ...LINK.whatsapp, label: 'Escríbenos por WhatsApp' }, LINK.instagram, LINK.sitio]}
      event={EVENT}
      footer="CDMX · Entregas a convenir"
    />
  );
}
