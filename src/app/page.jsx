import { MainLayout } from 'src/layouts/main';
import { getAnimals } from 'src/lib/public-api';

import { HomeView } from 'src/sections/home/home-view';

// ----------------------------------------------------------------------

export default async function Page() {
  const { data: featured } = await getAnimals({ page_size: 8 });

  return (
    <MainLayout>
      <HomeView featured={featured} />
    </MainLayout>
  );
}
