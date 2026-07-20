import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Categorías raíz por defecto (fallback SSR antes de que /api/nav-categories
// responda con las visibles reales; se sincroniza con los grupos del backend)
const CATEGORIES = [
  { title: 'Arácnidos', slug: 'aracnidos' },
  { title: 'Reptiles', slug: 'reptiles' },
  { title: 'Anfibios', slug: 'anfibios' },
  { title: 'Insectos', slug: 'insectos' },
  { title: 'Crustáceos', slug: 'crustaceos' },
  { title: 'Miriápodos', slug: 'miriapodos' },
];

// Arma la nav completa a partir de las categorías (fijas por defecto o las
// visibles que devuelve el backend): Inicio + Catálogo + categorías + Artículos.
export function buildNavData(categories = CATEGORIES) {
  return [
    { title: 'Inicio', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
    {
      title: 'Catálogo',
      path: paths.catalog,
      icon: <Iconify width={22} icon="solar:cat-bold-duotone" />,
    },
    ...categories.map((category) => ({
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
}

// Reparte la nav en dos columnas equilibradas a los lados del logo
export function splitNav(items) {
  const half = Math.ceil(items.length / 2);
  return { left: items.slice(0, half), right: items.slice(half) };
}

export const navData = buildNavData();

const { left: navLeft, right: navRight } = splitNav(navData);
export { navLeft, navRight };
