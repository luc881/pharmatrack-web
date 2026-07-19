import { MainLayout } from 'src/layouts/main';
import { getGroups, getAnimals, getProducts } from 'src/lib/public-api';

import { CatalogView } from 'src/sections/catalog/catalog-view';
import { buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Catálogo',
  description:
    'Animales exóticos en venta: arácnidos, reptiles, anfibios y más, con fotos, precios y procedencia legal.',
};

export default async function Page() {
  const [{ data: animals }, groups, products] = await Promise.all([getAnimals(), getGroups(), getProducts()]);

  return (
    <MainLayout>
      <CatalogView
        items={buildSpeciesList(animals)}
        categories={buildCategories(animals, groups)}
        products={products}
      />
    </MainLayout>
  );
}
