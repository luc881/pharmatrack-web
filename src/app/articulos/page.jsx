import { getArticles } from 'src/lib/public-api';
import { OdLayout } from 'src/layouts/od/od-layout';

import { OdArticlesView } from 'src/sections/articles/od/od-articles-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Artículos',
  description: 'Guías de cuidado, especies y divulgación sobre isópodos, colémbolos, fásmidos y terrarios bioactivos.',
};

export default async function Page() {
  const articles = await getArticles();

  return (
    <OdLayout>
      <OdArticlesView articles={articles} />
    </OdLayout>
  );
}
