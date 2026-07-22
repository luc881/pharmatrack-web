import { notFound, permanentRedirect } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { MainLayout } from 'src/layouts/main';
import { getProduct, getProducts , getSiteSettings } from 'src/lib/public-api';

import { productSlug } from 'src/sections/catalog/product-card';
import { ProductDetailsView } from 'src/sections/catalog/product-details-view';

// ----------------------------------------------------------------------
// "cueva-de-resina-1702": el id al final es el canónico; si el slug no
// coincide se redirige 308 — mismo patrón que especies y artículos.

const parseId = (slug) => {
  const match = /-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const id = parseId(slug);
  const product = id ? await getProduct(id) : null;
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: product.title,
    description: product.description?.split('\n')[0] ?? undefined,
    alternates: { canonical: `${CONFIG.siteUrl}/producto/${productSlug(product)}` },
    openGraph: product.image ? { images: [product.image] } : undefined,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const id = parseId(slug);
  if (!id) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  const canonical = productSlug(product);
  if (slug !== canonical) permanentRedirect(`/producto/${canonical}`);

  // Relacionados: misma categoría primero
  const all = await getProducts();
  const related = all
    .filter((item) => item.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 4);

  const site = await getSiteSettings();

  return (
    <MainLayout>
      <ProductDetailsView
        product={product}
        related={related}
        shippingEnabled={site.shipping_enabled !== false}
      />
    </MainLayout>
  );
}
