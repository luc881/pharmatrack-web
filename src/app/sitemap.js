import { CONFIG } from 'src/global-config';
import { getGroups, getAnimals, getProducts, getArticles } from 'src/lib/public-api';

import { articleSlug } from 'src/sections/articles/utils';
import { productSlug } from 'src/sections/catalog/product-card';
import { buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function sitemap() {
  const [{ data: animals }, groups, articles, products] = await Promise.all([getAnimals(), getGroups(), getArticles(), getProducts()]);

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
    ...products.map((product) => ({
      url: `${CONFIG.siteUrl}/producto/${productSlug(product)}`,
      changeFrequency: 'weekly',
    })),
  ];
}
