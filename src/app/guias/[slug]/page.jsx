import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { OdLayout } from 'src/layouts/od/od-layout';
import { getGuide, getGuides, guideTitle } from 'src/lib/guides';

import { OdGuideDetailView } from 'src/sections/guides/od-guide-detail-view';

// ----------------------------------------------------------------------
// /guias/[slug] — una guía de cuidados. Solo existen los slugs de los .md;
// cualquier otro da 404.
// ----------------------------------------------------------------------

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

const SEAL = {
  url: '/brand/assets/logo/sello-claro-480.png',
  width: 480,
  height: 480,
  alt: 'Sello de Opuntia Den',
};

export async function generateMetadata({ params }) {
  const guide = await getGuide((await params).slug);
  if (!guide) return {};
  const title = `Guía de cuidados: ${guideTitle(guide)} · Opuntia Den`;
  const url = `${CONFIG.siteUrl}/guias/${guide.slug}/`;
  return {
    title: { absolute: title },
    description: guide.resumen,
    alternates: { canonical: url },
    openGraph: { type: 'article', title, description: guide.resumen, url, images: [SEAL] },
  };
}

export default async function Page({ params }) {
  const guide = await getGuide((await params).slug);
  if (!guide) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Guía de cuidados: ${guideTitle(guide)}`,
    description: guide.resumen,
    dateModified: guide.actualizado,
    inLanguage: 'es-MX',
    image: `${CONFIG.siteUrl}${SEAL.url}`,
    mainEntityOfPage: `${CONFIG.siteUrl}/guias/${guide.slug}/`,
    author: { '@type': 'Organization', name: CONFIG.appName, url: CONFIG.siteUrl },
    publisher: { '@type': 'Organization', name: CONFIG.appName, url: CONFIG.siteUrl },
  };

  return (
    <OdLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }}
      />
      <OdGuideDetailView guide={guide} />
    </OdLayout>
  );
}
