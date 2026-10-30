import { CONFIG } from 'src/global-config';
import {
  getGroups,
  getAnimals,
  getProducts,
  getArticles,
  getCareSheets,
  getSpeciesCatalog,
} from 'src/lib/public-api';

import { articleSlug } from 'src/sections/articles/utils';
import { productSlug, buildListings, buildCategories } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function sitemap() {
  const [{ data: animals }, groups, articles, products, taxa, sheets] = await Promise.all([
    getAnimals(),
    getGroups(),
    getArticles(),
    getProducts(),
    getSpeciesCatalog(),
    getCareSheets(),
  ]);

  return [
    { url: CONFIG.siteUrl, changeFrequency: 'daily' },
    { url: `${CONFIG.siteUrl}/catalogo`, changeFrequency: 'daily' },
    { url: `${CONFIG.siteUrl}/links`, changeFrequency: 'weekly' },
    ...buildCategories(animals, groups).map((category) => ({
      url: `${CONFIG.siteUrl}/catalogo/${category.slug}`,
      changeFrequency: 'daily',
    })),
    ...buildListings(animals, taxa).map((item) => ({
      url: `${CONFIG.siteUrl}/catalogo/${item.slug}`,
      changeFrequency: 'daily',
    })),
    ...(articles.length ? [{ url: `${CONFIG.siteUrl}/articulos`, changeFrequency: 'weekly' }] : []),
    ...articles.map((article) => ({
      url: `${CONFIG.siteUrl}/articulos/${articleSlug(article)}`,
      changeFrequency: 'weekly',
    })),
    { url: `${CONFIG.siteUrl}/fichas/`, changeFrequency: 'weekly' },
    ...sheets.map((sheet) => ({
      url: `${CONFIG.siteUrl}/fichas/${sheet.slug}/`,
      lastModified: sheet.updated_at,
      changeFrequency: 'monthly',
    })),
    ...products.map((product) => ({
      url: `${CONFIG.siteUrl}/producto/${productSlug(product)}`,
      changeFrequency: 'weekly',
    })),
  ];
}
