import { getGroups } from 'src/lib/public-api';

import { slugify } from 'src/sections/catalog/utils';

// ponytail: proxy same-origin (el API sólo permite CORS a app.*). El backend ya
// filtra los grupos ocultos, así que la nav sólo lista los grupos raíz visibles.
export async function GET() {
  const groups = await getGroups();
  const roots = groups
    // show_in_nav es aparte de show_public: un grupo puede estar activo en el
    // sitio (se vende, se destaca en la home) sin ocupar lugar en el menú
    .filter((g) => g.parent_id == null && g.show_in_nav !== false)
    .map((g) => ({ title: g.name, slug: slugify(g.name) }));
  return Response.json(roots);
}
