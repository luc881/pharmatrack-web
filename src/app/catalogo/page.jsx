import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getProducts } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdCatalogView } from 'src/sections/catalog/od/od-catalog-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Catálogo',
  description:
    'Isópodos de colección, sustratos y accesorios en venta, con fotos y precios. Entrega en persona en CDMX.',
};

export default async function Page() {
  const [{ data: animals }, products] = await Promise.all([getAnimals(), getProducts()]);

  return (
    <OdLayout offsetTop>
      <OdCatalogView items={buildListings(animals)} products={products} />
    </OdLayout>
  );
}
