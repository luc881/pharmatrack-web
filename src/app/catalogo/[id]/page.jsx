import { notFound, permanentRedirect } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { MainLayout } from 'src/layouts/main';
import { getAnimal, getGroups, getAnimals } from 'src/lib/public-api';

import { CatalogView } from 'src/sections/catalog/catalog-view';
import { SpeciesDetailsView } from 'src/sections/catalog/species-details-view';
import {
  slugify,
  speciesSlug,
  rootGroupOf,
  scientificName,
  buildCategories,
  saleFormatLabel,
  buildSpeciesList,
} from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

// Un solo segmento dinámico:
//   /catalogo/gecko-crestado-3 → especie (termina en -id)
//   /catalogo/aracnidos        → categoría raíz
//   /catalogo/6                → URL vieja de animal: redirige a su especie
const speciesIdOf = (param) => {
  const match = /-(\d+)$/.exec(param);
  return match ? Number(match[1]) : null;
};
const isLegacyAnimalId = (param) => /^\d+$/.test(param);

async function loadCatalog() {
  const [{ data: animals }, groups] = await Promise.all([getAnimals(), getGroups()]);
  return {
    groups,
    categories: buildCategories(animals, groups),
    speciesList: buildSpeciesList(animals),
  };
}

export async function generateMetadata({ params }) {
  const { id: param } = await params;

  // Los redirects van aquí y no solo en la página: generateMetadata corre
  // antes de que empiece el streaming, así el 308 sale como status real
  if (isLegacyAnimalId(param)) {
    const animal = await getAnimal(param);
    if (!animal?.species) return { title: 'No encontrado' };
    permanentRedirect(`/catalogo/${speciesSlug(animal.species)}`);
  }

  const { categories, speciesList } = await loadCatalog();

  const sid = speciesIdOf(param);
  if (sid) {
    const item = speciesList.find((i) => i.species.id === sid);
    if (!item) return { title: 'No encontrado' };
    if (param !== item.slug) permanentRedirect(`/catalogo/${item.slug}`);

    const sci = scientificName(item.species);
    const title = item.species.common_name ? `${item.species.common_name} — ${sci}` : sci;
    const format = saleFormatLabel(item.species);
    // la ficha de la especie es mejor meta description que el texto genérico
    const description =
      item.species.description?.split('\n')[0]?.slice(0, 300) ??
      `${item.species.common_name ?? sci} (${sci}) en venta${format ? ` — ${format.toLowerCase()}` : ''}. Animales exóticos con procedencia legal.`;

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

  const category = categories.find((c) => c.slug === param);
  if (!category) return { title: 'No encontrado' };

  return {
    title: `${category.name} en venta`,
    description: `${category.name} disponibles con fotos, precios y procedencia legal.`,
  };
}

export default async function Page({ params }) {
  const { id: param } = await params;

  // URLs viejas /catalogo/{animal_id}: redirige a la página de su especie
  if (isLegacyAnimalId(param)) {
    const animal = await getAnimal(param);
    if (!animal?.species) notFound();
    // permanente: Google transfiere la URL vieja de animal a la de especie
    permanentRedirect(`/catalogo/${speciesSlug(animal.species)}`);
  }

  const { groups, categories, speciesList } = await loadCatalog();

  const sid = speciesIdOf(param);
  if (sid) {
    const item = speciesList.find((i) => i.species.id === sid);
    if (!item) notFound();
    // slug desactualizado o manipulado → URL canónica (evita duplicados en Google)
    if (param !== item.slug) permanentRedirect(`/catalogo/${item.slug}`);

    const root = rootGroupOf(item.species, groups);
    const category = root ? { name: root.name, slug: slugify(root.name) } : null;
    const title = item.species.common_name ?? scientificName(item.species);

    // Relacionados: misma categoría raíz, sin repetir la especie actual
    const related = speciesList
      .filter((i) => i.species.id !== sid && rootGroupOf(i.species, groups)?.id === root?.id)
      .slice(0, 8);

    // Datos estructurados para resultados enriquecidos (precio/disponibilidad)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description:
        item.species.description ?? `${scientificName(item.species)} en venta en ${CONFIG.appName}.`,
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
        <SpeciesDetailsView item={item} category={category} related={related} />
      </MainLayout>
    );
  }

  const category = categories.find((c) => c.slug === param);
  if (!category) notFound();

  const filtered = speciesList.filter(
    (i) => rootGroupOf(i.species, groups)?.id === category.id
  );

  return (
    <MainLayout>
      <CatalogView items={filtered} categories={categories} category={category} />
    </MainLayout>
  );
}
