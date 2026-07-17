import { MainLayout } from 'src/layouts/main';
import { getAnimals } from 'src/lib/public-api';

import { HomeView } from 'src/sections/home/home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const { data: animals } = await getAnimals();

  return (
    <MainLayout>
      <HomeView animals={animals} />
    </MainLayout>
  );
}
