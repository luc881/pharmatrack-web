import { getSiteSettings, getSpeciesCatalog } from 'src/lib/public-api';

import { PalettePreview } from 'src/sections/prueba-paletas/palette-preview';

// ----------------------------------------------------------------------
// /prueba-paletas — página oculta para comparar paletas con degradados
// (Feral Gradient Builder) antes de tocar el sitio. Sin enlaces, fuera del
// sitemap y con noindex. Borrar cuando se elija una.
// ----------------------------------------------------------------------

export const metadata = {
  title: { absolute: 'Prueba de paletas · Opuntia Den' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const [site, species] = await Promise.all([getSiteSettings(), getSpeciesCatalog()]);

  return <PalettePreview media={site.media} species={species.slice(0, 4)} />;
}
