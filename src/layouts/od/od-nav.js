import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
// Rutas principales del sitio, una sola lista para la portada (masthead) y la
// barra de las páginas interiores (antes cada una tenía la suya y en las
// interiores solo salían Catálogo y Divulgación). `secondary` se oculta en
// escritorio angosto, donde no cabe todo junto a la marca.
// ----------------------------------------------------------------------

export const SITE_NAV = [
  { label: 'Catálogo', href: paths.catalog },
  { label: 'El criadero', href: paths.breeding },
  { label: 'Divulgación', href: paths.articles },
  { label: 'Asesoría', href: paths.advisory },
  { label: 'Envíos', href: paths.shipping, secondary: true },
  { label: 'Contacto', href: paths.contact, secondary: true },
];

// ¿El enlace corresponde a la ruta actual? (incluye subrutas: /articulos/x)
export const isCurrent = (pathname, href) =>
  !!pathname && (pathname === href || pathname.replace(/\/$/, '') === href || pathname.startsWith(`${href}/`));
