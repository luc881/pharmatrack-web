import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getArticles } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdHomeView } from 'src/sections/home/od/od-home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, articles] = await Promise.all([getAnimals(), getArticles()]);

  const listings = buildListings(animals);

  return (
    <OdLayout>
      <OdHomeView species={listings} articles={articles} />
    </OdLayout>
  );
}
