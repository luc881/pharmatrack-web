import { MainLayout } from 'src/layouts/main';
import { getGroups, getAnimals, getArticles, getSiteSettings } from 'src/lib/public-api';

import { HomeView } from 'src/sections/home/home-view';
import { slugify, rootGroupOf, buildCategories, buildSpeciesList } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

export default async function Page() {
  const [{ data: animals }, groups, articles, site] = await Promise.all([
    getAnimals(),
    getGroups(),
    getArticles(),
    getSiteSettings(),
  ]);

  const species = buildSpeciesList(animals);

  // Mini-catálogos destacados: grupos raíz marcados con feature_home que tengan
  // al menos una especie disponible (si no, no se muestra la sección vacía)
  const featuredCategories = groups
    .filter((g) => g.feature_home && g.parent_id == null)
    .map((g) => ({
      id: g.id,
      name: g.name,
      slug: slugify(g.name),
      species: species.filter((s) => rootGroupOf(s.species, groups)?.id === g.id).slice(0, 8),
    }))
    .filter((c) => c.species.length > 0);

  return (
    <MainLayout>
      <HomeView
        species={species}
        categories={buildCategories(animals, groups)}
        featuredCategories={featuredCategories}
        showCategoryBrowse={site.show_category_browse !== false}
        articles={articles}
      />
    </MainLayout>
  );
}
