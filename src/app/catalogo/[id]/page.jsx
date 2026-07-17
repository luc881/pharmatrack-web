import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { MainLayout } from 'src/layouts/main';
import { getAnimal, getGroups, getAnimals } from 'src/lib/public-api';

import { CatalogView } from 'src/sections/catalog/catalog-view';
import { AnimalDetailsView } from 'src/sections/catalog/animal-details-view';
import { slugify, rootGroupOf, scientificName, buildCategories } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

// Un solo segmento dinámico: /catalogo/6 = detalle, /catalogo/aracnidos = categoría
const isAnimalId = (param) => /^\d+$/.test(param);

async function findCategory(slug) {
  const [{ data: animals }, groups] = await Promise.all([getAnimals(), getGroups()]);
  const categories = buildCategories(animals, groups);
  const category = categories.find((c) => c.slug === slug) ?? null;
  return { animals, groups, categories, category };
}

export async function generateMetadata({ params }) {
  const { id: param } = await params;

  if (isAnimalId(param)) {
    const animal = await getAnimal(param);
    if (!animal) return { title: 'No encontrado' };

    const sci = scientificName(animal.species);
    const title = `${animal.species?.common_name ?? sci} — ${animal.code}`;
    const description =
      animal.description ?? `${sci} en venta. Animales exóticos con procedencia legal.`;
    const image = animal.image ?? animal.photos?.[0];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  }

  const { category } = await findCategory(param);
  if (!category) return { title: 'No encontrado' };

  return {
    title: `${category.name} en venta`,
    description: `${category.name} disponibles: ${category.count} ejemplar${category.count === 1 ? '' : 'es'} con fotos, precios y procedencia legal.`,
  };
}

export default async function Page({ params }) {
  const { id: param } = await params;

  if (isAnimalId(param)) {
    const [animal, groups] = await Promise.all([getAnimal(param), getGroups()]);
    if (!animal) notFound();

    const root = rootGroupOf(animal, groups);
    const category = root ? { name: root.name, slug: slugify(root.name) } : null;

    const title = animal.species?.common_name ?? scientificName(animal.species);
    const photos = [animal.image, ...(animal.photos ?? [])].filter(Boolean);

    // Datos estructurados para resultados enriquecidos (precio/disponibilidad)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      sku: animal.code,
      description:
        animal.description ?? `${scientificName(animal.species)} en venta en ${CONFIG.appName}.`,
      ...(photos.length ? { image: photos } : {}),
      offers: {
        '@type': 'Offer',
        price: animal.price,
        priceCurrency: 'MXN',
        availability:
          animal.status === 'available'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `${CONFIG.siteUrl}/catalogo/${animal.id}`,
      },
    };

    return (
      <MainLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AnimalDetailsView animal={animal} category={category} />
      </MainLayout>
    );
  }

  const { animals, groups, categories, category } = await findCategory(param);
  if (!category) notFound();

  const filtered = animals.filter((a) => rootGroupOf(a, groups)?.id === category.id);

  return (
    <MainLayout>
      <CatalogView animals={filtered} categories={categories} category={category} />
    </MainLayout>
  );
}
