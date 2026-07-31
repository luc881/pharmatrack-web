import { getArticles } from 'src/lib/public-api';
import { OdLayout } from 'src/layouts/od/od-layout';

import { OdArticlesView } from 'src/sections/articles/od/od-articles-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Artículos',
  description: 'Guías de cuidado, especies y divulgación sobre animales exóticos.',
};

export default async function Page() {
  const articles = await getArticles();

  return (
    <OdLayout offsetTop>
      <OdArticlesView articles={articles} />
    </OdLayout>
  );
}
