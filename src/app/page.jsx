import { MainLayout } from 'src/layouts/main';
import { getGroups, getAnimals, getArticles } from 'src/lib/public-api';

import { HomeView } from 'src/sections/home/home-view';
import { buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, groups, articles] = await Promise.all([getAnimals(), getGroups(), getArticles()]);

  return (
    <MainLayout>
      <HomeView
        species={buildSpeciesList(animals)}
        categories={buildCategories(animals, groups)}
        articles={articles}
      />
    </MainLayout>
  );
}
