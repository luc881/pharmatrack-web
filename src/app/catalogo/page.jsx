import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getProducts, getSpeciesCatalog } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdCatalogView } from 'src/sections/catalog/od/od-catalog-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Catálogo',
  description:
    'Isópodos de colección, sustratos y accesorios en venta, con fotos y precios. Entrega en persona en CDMX.',
};

export default async function Page() {
  const [{ data: animals }, taxa, products] = await Promise.all([
    getAnimals(),
    getSpeciesCatalog(),
    getProducts(),
  ]);

  return (
    <OdLayout>
      <OdCatalogView items={buildListings(animals, taxa)} products={products} />
    </OdLayout>
  );
}
