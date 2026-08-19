import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getProducts, getArticles, getSiteSettings } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdHomeView } from 'src/sections/home/od/od-home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, products, articles, site] = await Promise.all([
    getAnimals(),
    getProducts(),
    getArticles(),
    getSiteSettings(),
  ]);

  const listings = buildListings(animals);

  return (
    <OdLayout homeMasthead>
      <OdHomeView species={listings} products={products} articles={articles} media={site.media} />
    </OdLayout>
  );
}
