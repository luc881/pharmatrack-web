import { notFound, permanentRedirect } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { MainLayout } from 'src/layouts/main';
import { getArticle, getArticles } from 'src/lib/public-api';

import { articleSlug } from 'src/sections/articles/utils';
import { ArticleDetailView } from 'src/sections/articles/article-detail-view';

// ----------------------------------------------------------------------
// "guia-tarantulas-3": el id al final es el canónico; si el slug no
// coincide (título editado) se redirige 308 — mismo patrón que el catálogo.

const parseId = (slug) => {
  const match = /-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const id = parseId(slug);
  const article = id ? await getArticle(id) : null;
  if (!article) return { title: 'Artículo no encontrado' };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical: `${CONFIG.siteUrl}/articulos/${articleSlug(article)}` },
    openGraph: article.cover_image ? { images: [article.cover_image] } : undefined,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const id = parseId(slug);
  if (!id) notFound();

  const article = await getArticle(id);
  if (!article) notFound();

  const canonical = articleSlug(article);
  if (slug !== canonical) permanentRedirect(`/articulos/${canonical}`);

  // Relacionados: misma categoría primero, luego los más recientes
  const all = await getArticles();
  const related = all
    .filter((item) => item.id !== article.id)
    .sort((a, b) => (b.category === article.category) - (a.category === article.category))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.cover_image ?? undefined,
    datePublished: article.published_at,
    author: article.author_name
      ? { '@type': 'Person', name: article.author_name }
      : undefined,
  };

  return (
    <MainLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleDetailView article={article} related={related} />
    </MainLayout>
  );
}
