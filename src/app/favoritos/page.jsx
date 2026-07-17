import { MainLayout } from 'src/layouts/main';
import { getAnimals } from 'src/lib/public-api';

import { buildSpeciesList } from 'src/sections/catalog/utils';
import { FavoritesView } from 'src/sections/catalog/favorites-view';

// ----------------------------------------------------------------------

// Página personal (localStorage): fuera del índice de Google
export const metadata = {
  title: 'Favoritos',
  robots: { index: false },
};

export default async function Page() {
  const { data: animals } = await getAnimals();

  return (
    <MainLayout>
      <FavoritesView items={buildSpeciesList(animals)} />
    </MainLayout>
  );
}
