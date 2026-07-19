import { slugify } from 'src/sections/catalog/utils';

// ----------------------------------------------------------------------

// Mismo patrón que las especies: "titulo-id"; el id al final es el canónico
export function articleSlug(article) {
  return `${slugify(article.title)}-${article.id}`;
}

export function fArticleDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Convierte el texto con convenciones del dashboard en secciones renderizables
// (estructura tipo phasmaMX): párrafo, subtítulo ("## "), cita ("> ") e
// imagen ("img: URL | pie de foto").
export function parseArticleBody(body) {
  const sections = [];
  let paragraph = [];

  const flush = () => {
    if (paragraph.length) {
      sections.push({ type: 'paragraph', content: paragraph.join(' ') });
      paragraph = [];
    }
  };

  (body ?? '').split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flush();
    } else if (line.startsWith('## ')) {
      flush();
      sections.push({ type: 'subheading', content: line.slice(3).trim() });
    } else if (line.startsWith('> ')) {
      flush();
      sections.push({ type: 'quote', content: line.slice(2).trim() });
    } else if (line.startsWith('img:')) {
      flush();
      const [src, caption] = line.slice(4).split('|').map((part) => part.trim());
      if (src) sections.push({ type: 'image', src, caption: caption ?? '' });
    } else {
      paragraph.push(line);
    }
  });
  flush();

  return sections;
}
