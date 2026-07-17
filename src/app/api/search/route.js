import { getAnimals } from 'src/lib/public-api';

import { scientificName, buildSpeciesList } from 'src/sections/catalog/utils';

// ponytail: proxy en el servidor porque el API sólo permite CORS a app.*,
// no a www.* — así el buscador del cliente pega same-origin y sin CORS.
export async function GET() {
  const { data } = await getAnimals();
  const list = buildSpeciesList(data).map((item) => ({
    id: item.species.id,
    title: item.species.common_name ?? scientificName(item.species),
    sci: scientificName(item.species),
    slug: item.slug,
    photo: item.photos[0] ?? null,
    price: item.minPrice,
  }));
  return Response.json(list);
}
