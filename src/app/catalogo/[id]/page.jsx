import { notFound } from 'next/navigation';

import { MainLayout } from 'src/layouts/main';
import { getAnimal } from 'src/lib/public-api';

import { scientificName } from 'src/sections/catalog/utils';
import { AnimalDetailsView } from 'src/sections/catalog/animal-details-view';

// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const { id } = await params;
  const animal = await getAnimal(id);
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

export default async function Page({ params }) {
  const { id } = await params;
  const animal = await getAnimal(id);
  if (!animal) notFound();

  return (
    <MainLayout>
      <AnimalDetailsView animal={animal} />
    </MainLayout>
  );
}
