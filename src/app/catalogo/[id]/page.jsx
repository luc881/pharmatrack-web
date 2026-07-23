import { notFound, permanentRedirect } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { MainLayout } from 'src/layouts/main';
import { getAnimal, getGroups, getAnimals , getSiteSettings } from 'src/lib/public-api';

import { CatalogView } from 'src/sections/catalog/catalog-view';
import { SpeciesDetailsView } from 'src/sections/catalog/species-details-view';
import {
  groupBySlug,
  rootGroupOf,
  groupPathOf,
  listingSlug,
  buildListings,
  scientificName,
  buildCategories,
  saleFormatLabel,
  listingsInGroup,
  parseListingParam,
} from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

// Un solo segmento dinámico:
//   /catalogo/cubaris-murina-papaya-m12 → listado de un morph
//   /catalogo/gecko-crestado-s3         → listado de una especie (sin morph)
//   /catalogo/aracnidos                 → categoría raíz
//   /catalogo/gecko-crestado-3          → slug viejo de especie (redirige a -s3)
//   /catalogo/6                         → URL vieja de animal (redirige a su listado)
const isLegacyAnimalId = (param) => /^\d+$/.test(param);

// Resuelve un listado (morph o especie) del listado agrupado
const findListing = (listings, parsed) => {
  if (parsed.type === 'morph') return listings.find((i) => i.morph?.id === parsed.id);
  // species / legacy-species: el listado de la especie sin morph, o el primero de esa especie
  return (
    listings.find((i) => !i.morph && i.species.id === parsed.id) ||
    listings.find((i) => i.species.id === parsed.id)
  );
};

async function loadCatalog() {
  const [{ data: animals }, groups] = await Promise.all([getAnimals(), getGroups()]);
  return {
    groups,
    categories: buildCategories(animals, groups),
    listings: buildListings(animals),
  };
}

export async function generateMetadata({ params }) {
  const { id: param } = await params;

  if (isLegacyAnimalId(param)) {
    const animal = await getAnimal(param);
    if (!animal?.species) return { title: 'No encontrado' };
    permanentRedirect(`/catalogo/${listingSlug(animal.species, animal.morphs?.[0] ?? null)}`);
  }

  const { groups, listings } = await loadCatalog();
  const parsed = parseListingParam(param);

  if (parsed) {
    const item = findListing(listings, parsed);
    if (!item) return { title: 'No encontrado' };
    if (param !== item.slug) permanentRedirect(`/catalogo/${item.slug}`);

    const sci = scientificName(item.species);
    const title = item.title !== sci ? `${item.title} — ${sci}` : sci;
    const format = saleFormatLabel(item.species);
    const description =
      item.description?.split('\n')[0]?.slice(0, 300) ??
      `${item.title} (${sci}) en venta${format ? ` — ${format.toLowerCase()}` : ''}. Animales exóticos con procedencia legal.`;

    return {
      title,
      description,
      alternates: { canonical: `/catalogo/${item.slug}` },
      openGraph: {
        title,
        description,
        ...(item.photos[0] ? { images: [item.photos[0]] } : {}),
      },
    };
  }

  const category = groupBySlug(param, groups);
  if (!category) return { title: 'No encontrado' };

  return {
    title: `${category.name} en venta`,
    description: `${category.name} disponibles con fotos, precios y procedencia legal.`,
  };
}

export default async function Page({ params }) {
  const { id: param } = await params;

  // URLs viejas /catalogo/{animal_id}: redirige al listado de su morph/especie
  if (isLegacyAnimalId(param)) {
    const animal = await getAnimal(param);
    if (!animal?.species) notFound();
    permanentRedirect(`/catalogo/${listingSlug(animal.species, animal.morphs?.[0] ?? null)}`);
  }

  const { groups, categories, listings } = await loadCatalog();
  const parsed = parseListingParam(param);

  if (parsed) {
    const item = findListing(listings, parsed);
    if (!item) notFound();
    // slug desactualizado o manipulado → URL canónica (evita duplicados en Google)
    if (param !== item.slug) permanentRedirect(`/catalogo/${item.slug}`);

    const root = rootGroupOf(item.species, groups);
    // Cadena completa raíz → subgrupo (Crustáceos → Isópodos) para el breadcrumb
    // y el chip del subgrupo en el detalle.
    const categoryPath = groupPathOf(item.species, groups);

    // Relacionados: mismos listados de la categoría raíz, sin repetir el actual
    const related = listings
      .filter((i) => i.key !== item.key && rootGroupOf(i.species, groups)?.id === root?.id)
      .slice(0, 8);

    const site = await getSiteSettings();
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: item.title,
      description: item.description ?? `${scientificName(item.species)} en venta en ${CONFIG.appName}.`,
      ...(item.photos.length ? { image: item.photos } : {}),
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: item.minPrice,
        highPrice: item.maxPrice,
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        url: `${CONFIG.siteUrl}/catalogo/${item.slug}`,
      },
    };

    return (
      <MainLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SpeciesDetailsView
          item={item}
          categoryPath={categoryPath}
          related={related}
          shippingEnabled={site.shipping_enabled !== false}
        />
      </MainLayout>
    );
  }

  const category = groupBySlug(param, groups);
  if (!category) notFound();

  const filtered = listingsInGroup(listings, category, groups);

  return (
    <MainLayout>
      <CatalogView items={filtered} categories={categories} category={category} />
    </MainLayout>
  );
}
