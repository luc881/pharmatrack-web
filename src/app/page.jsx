import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getProducts, getArticles, getCareSheets, getSiteSettings, getSpeciesCatalog } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdHomeView } from 'src/sections/home/od/od-home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, taxa, products, articles, site, careSheets] = await Promise.all([
    getAnimals(),
    getSpeciesCatalog(),
    getProducts(),
    getArticles(),
    getSiteSettings(),
    getCareSheets(),
  ]);

  const listings = buildListings(animals, taxa);

  return (
    <OdLayout homeMasthead>
      <OdHomeView species={listings} products={products} articles={articles} careSheets={careSheets} media={site.media} ticker={site.ticker} />
    </OdLayout>
  );
}
