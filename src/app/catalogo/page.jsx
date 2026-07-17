import { MainLayout } from 'src/layouts/main';
import { getAnimals } from 'src/lib/public-api';

import { CatalogView } from 'src/sections/catalog/catalog-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Catálogo',
  description: 'Animales exóticos disponibles: tarántulas, reptiles y más.',
};

export default async function Page({ searchParams }) {
  const { group_id: groupId, genus_id: genusId, species_id: speciesId } = await searchParams;
  const { data: animals } = await getAnimals();

  return (
    <MainLayout>
      <CatalogView
        animals={animals}
        initialGroupId={Number(groupId) || null}
        initialGenusId={Number(genusId) || null}
        initialSpeciesId={Number(speciesId) || null}
      />
    </MainLayout>
  );
}
