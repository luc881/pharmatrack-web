import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getProducts, getArticles, getSiteSettings, getSpeciesCatalog } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdHomeView } from 'src/sections/home/od/od-home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, taxa, products, articles, site] = await Promise.all([
    getAnimals(),
    getSpeciesCatalog(),
    getProducts(),
    getArticles(),
    getSiteSettings(),
  ]);

  const listings = buildListings(animals, taxa);

  return (
    <OdLayout homeMasthead>
      <OdHomeView species={listings} products={products} articles={articles} media={site.media} />
    </OdLayout>
  );
}
