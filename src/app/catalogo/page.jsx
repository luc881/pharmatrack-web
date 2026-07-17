import { MainLayout } from 'src/layouts/main';
import { getGroups, getAnimals } from 'src/lib/public-api';

import { buildCategories } from 'src/sections/catalog/utils';
import { CatalogView } from 'src/sections/catalog/catalog-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Catálogo',
  description:
    'Animales exóticos en venta: arácnidos, reptiles, anfibios y más, con fotos, precios y procedencia legal.',
};

export default async function Page() {
  const [{ data: animals }, groups] = await Promise.all([getAnimals(), getGroups()]);

  return (
    <MainLayout>
      <CatalogView animals={animals} categories={buildCategories(animals, groups)} />
    </MainLayout>
  );
}
