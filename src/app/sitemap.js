import { CONFIG } from 'src/global-config';
import { getAnimals } from 'src/lib/public-api';

// ----------------------------------------------------------------------

export default async function sitemap() {
  const { data: animals } = await getAnimals();

  return [
    { url: CONFIG.siteUrl, changeFrequency: 'daily' },
    { url: `${CONFIG.siteUrl}/catalogo`, changeFrequency: 'daily' },
    ...animals.map((animal) => ({
      url: `${CONFIG.siteUrl}/catalogo/${animal.id}`,
      lastModified: animal.updated_at ?? undefined,
    })),
  ];
}
