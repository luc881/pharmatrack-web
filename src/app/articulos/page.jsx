import { MainLayout } from 'src/layouts/main';
import { getArticles } from 'src/lib/public-api';

import { ArticlesView } from 'src/sections/articles/articles-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Artículos',
  description: 'Guías de cuidado, especies y divulgación sobre animales exóticos.',
};

export default async function Page() {
  const articles = await getArticles();

  return (
    <MainLayout>
      <ArticlesView articles={articles} />
    </MainLayout>
  );
}
