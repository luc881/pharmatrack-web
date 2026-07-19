import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// ponytail: categorías raíz fijas (coinciden con los seeds del backend);
// si algún día agregan un grupo raíz nuevo hay que sumarlo aquí
const CATEGORIES = [
  { title: 'Arácnidos', slug: 'aracnidos' },
  { title: 'Reptiles', slug: 'reptiles' },
  { title: 'Anfibios', slug: 'anfibios' },
  { title: 'Insectos', slug: 'insectos' },
  { title: 'Crustáceos', slug: 'crustaceos' },
  { title: 'Miriápodos', slug: 'miriapodos' },
];

export const navData = [
  { title: 'Inicio', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
  {
    title: 'Catálogo',
    path: paths.catalog,
    icon: <Iconify width={22} icon="solar:cat-bold-duotone" />,
  },
  ...CATEGORIES.map((category) => ({
    title: category.title,
    path: paths.catalogCategory(category.slug),
    icon: <Iconify width={22} icon="solar:star-bold-duotone" />,
  })),
  {
    title: 'Artículos',
    path: paths.articles,
    icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  },
];

// Nav de escritorio: columnas a los lados del logo centrado
export const navLeft = navData.slice(0, 4);
export const navRight = navData.slice(4);
