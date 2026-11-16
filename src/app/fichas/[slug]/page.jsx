import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { sheetTitle } from 'src/lib/care-sheets';
import { OdLayout } from 'src/layouts/od/od-layout';
import { getAnimals, getCareSheet, getSpeciesCatalog } from 'src/lib/public-api';

import { buildListings } from 'src/sections/catalog/utils';
import { OdCareSheetDetailView } from 'src/sections/care-sheets/od-care-sheet-detail-view';

// ----------------------------------------------------------------------
// /fichas/[slug] — una ficha de cuidados (API /public/care-sheets/{slug}).
// Las direcciones viejas /guias/… redirigen aquí (next.config.mjs).
// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const sheet = await getCareSheet((await params).slug);
  if (!sheet) return { title: 'Ficha no encontrada' };
  const title = `Ficha de cuidados: ${sheetTitle(sheet)} · Opuntia Den`;
  const url = `${CONFIG.siteUrl}/fichas/${sheet.slug}/`;
  return {
    title: { absolute: title },
    description: sheet.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description: sheet.summary,
      url,
      images: [sheet.photos?.[0]?.src ?? CONFIG.ogImage],
    },
  };
}

export default async function Page({ params }) {
  const sheet = await getCareSheet((await params).slug);
  if (!sheet) notFound();

  // Ejemplares en venta de esta especie: el listado sin morph si existe,
  // si no el primero; el conteo suma todos sus morphs
  const [{ data: animals }, taxa] = await Promise.all([getAnimals(), getSpeciesCatalog()]);
  const listings = buildListings(animals, taxa).filter(
    (l) => l.count > 0 && l.species.id === sheet.species_id
  );
  const forSale = listings.length
    ? {
        slug: (listings.find((l) => !l.morphs.length) ?? listings[0]).slug,
        count: listings.reduce((n, l) => n + l.count, 0),
      }
    : null;

  // Cada variedad con su foto (de Animales) y, si hay ejemplares, el enlace a ellos
  const species = taxa.find((t) => t.id === sheet.species_id);
  const unquote = (name) => name.replace(/^['"‘’“”]+|['"‘’“”]+$/g, '');
  const varieties = (species?.morphs ?? [])
    .map((m) => {
      const src = m.photos?.[0] ?? m.image;
      const listing = listings.find((l) => l.morphs.length === 1 && l.morph?.id === m.id);
      return (
        src && {
          name: unquote(m.name),
          src,
          href: listing ? `/catalogo/${listing.slug}/` : null,
          count: listing?.count ?? 0,
        }
      );
    })
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Ficha de cuidados: ${sheetTitle(sheet)}`,
    description: sheet.summary,
    dateModified: sheet.updated_at,
    inLanguage: 'es-MX',
    image: sheet.photos?.[0]?.src ?? `${CONFIG.siteUrl}${CONFIG.ogImage.url}`,
    mainEntityOfPage: `${CONFIG.siteUrl}/fichas/${sheet.slug}/`,
    author: { '@type': 'Organization', name: CONFIG.appName, url: CONFIG.siteUrl },
    publisher: { '@type': 'Organization', name: CONFIG.appName, url: CONFIG.siteUrl },
  };

  return (
    <OdLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <OdCareSheetDetailView guide={sheet} forSale={forSale} varieties={varieties} />
    </OdLayout>
  );
}
