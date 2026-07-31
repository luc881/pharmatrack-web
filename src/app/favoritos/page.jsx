import { getAnimals } from 'src/lib/public-api';
import { OdLayout } from 'src/layouts/od/od-layout';

import { buildListings } from 'src/sections/catalog/utils';
import { OdFavoritesView } from 'src/sections/catalog/od/od-favorites-view';

// ----------------------------------------------------------------------

// Página personal (localStorage): fuera del índice de Google
export const metadata = {
  title: 'Favoritos',
  robots: { index: false },
};

export default async function Page() {
  const { data: animals } = await getAnimals();

  return (
    <OdLayout offsetTop>
      <OdFavoritesView items={buildListings(animals)} />
    </OdLayout>
  );
}
