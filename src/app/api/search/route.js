import { getAnimals, getProducts, getArticles } from 'src/lib/public-api';

import { articleSlug } from 'src/sections/articles/utils';
import { slugify, scientificName, buildSpeciesList } from 'src/sections/catalog/utils';

// ponytail: proxy en el servidor porque el API sólo permite CORS a app.*,
// no a www.* — así el buscador del cliente pega same-origin y sin CORS.
// Indexa todo lo público: especies, productos/paquetes y artículos.
export async function GET() {
  const [{ data: animals }, products, articles] = await Promise.all([
    getAnimals(),
    getProducts(),
    getArticles(),
  ]);

  const species = buildSpeciesList(animals).map((item) => ({
    type: 'species',
    id: `sp-${item.species.id}`,
    title: item.species.common_name ?? scientificName(item.species),
    sub: scientificName(item.species),
    photo: item.photos[0] ?? null,
    price: item.minPrice,
    url: `/catalogo/${item.slug}`,
  }));

  const productItems = products.map((product) => ({
    type: 'product',
    id: `pr-${product.id}`,
    title: product.title,
    sub: product.is_bundle ? 'Paquete' : (product.category ?? 'Producto'),
    photo: product.image ?? null,
    price: product.price_retail,
    url: `/producto/${slugify(product.title)}-${product.id}`,
  }));

  const articleItems = articles.map((article) => ({
    type: 'article',
    id: `ar-${article.id}`,
    title: article.title,
    sub: article.category ?? 'Artículo',
    photo: article.cover_image ?? null,
    price: null,
    url: `/articulos/${articleSlug(article)}`,
  }));

  return Response.json([...species, ...productItems, ...articleItems]);
}
