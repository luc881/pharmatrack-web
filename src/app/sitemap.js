import { CONFIG } from 'src/global-config';
import { getGroups, getAnimals, getArticles } from 'src/lib/public-api';

import { articleSlug } from 'src/sections/articles/utils';
import { buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function sitemap() {
  const [{ data: animals }, groups, articles] = await Promise.all([getAnimals(), getGroups(), getArticles()]);

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
    ...(articles.length ? [{ url: `${CONFIG.siteUrl}/articulos`, changeFrequency: 'weekly' }] : []),
    ...articles.map((article) => ({
      url: `${CONFIG.siteUrl}/articulos/${articleSlug(article)}`,
      changeFrequency: 'weekly',
    })),
  ];
}
