import { CONFIG } from 'src/global-config';
import { getGroups, getAnimals } from 'src/lib/public-api';

import { buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function sitemap() {
  const [{ data: animals }, groups] = await Promise.all([getAnimals(), getGroups()]);

  return [
    { url: CONFIG.siteUrl, changeFrequency: 'daily' },
    { url: `${CONFIG.siteUrl}/catalogo`, changeFrequency: 'daily' },
    ...buildCategories(animals, groups).map((category) => ({
      url: `${CONFIG.siteUrl}/catalogo/${category.slug}`,
      changeFrequency: 'daily',
    })),
    ...buildSpeciesList(animals).map((item) => ({
      url: `${CONFIG.siteUrl}/catalogo/${item.slug}`,
      changeFrequency: 'daily',
    })),
  ];
}
