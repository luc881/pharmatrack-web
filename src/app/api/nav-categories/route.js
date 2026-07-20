import { getGroups } from 'src/lib/public-api';

import { slugify } from 'src/sections/catalog/utils';

// ponytail: proxy same-origin (el API sólo permite CORS a app.*). El backend ya
// filtra los grupos ocultos, así que la nav sólo lista los grupos raíz visibles.
export async function GET() {
  const groups = await getGroups();
  const roots = groups
    .filter((g) => g.parent_id == null)
    .map((g) => ({ title: g.name, slug: slugify(g.name) }));
  return Response.json(roots);
}
