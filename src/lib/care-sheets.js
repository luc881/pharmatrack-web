// ----------------------------------------------------------------------
// Ayudas de las fichas de cuidados (vienen del API: /public/care-sheets).
// ----------------------------------------------------------------------

// 'Phyllium gardabagusi “Argopuro”': la localidad con comillas tipográficas
export const sheetTitle = (s) =>
  s.locality ? `${s.scientific_name} “${s.locality}”` : s.scientific_name;

// Cuadro del segundo 2 del video (Cloudinary lo genera al vuelo, sin agrandar)
export const videoPoster = (src, w = 1600) =>
  src
    .replace('/video/upload/', `/video/upload/so_2,f_auto,q_auto,w_${w},c_limit/`)
    .replace(/\.mp4$/, '.jpg');

// La ficha de una especie del catálogo (una por especie, por id)
export const sheetForSpecies = (sheets, speciesId) =>
  sheets.find((s) => s.species_id === speciesId) ?? null;

// Cuerpo partido por "## ": cada sección lleva su kicker numerado. Lo que
// vaya antes del primer "## " queda como intro sin título.
export function sheetSections(body) {
  const [intro, ...chunks] = body.split(/^## +/m);
  return {
    intro: intro.trim(),
    sections: chunks.map((chunk) => {
      const nl = chunk.indexOf('\n');
      return nl === -1
        ? { title: chunk.trim(), markdown: '' }
        : { title: chunk.slice(0, nl).trim(), markdown: chunk.slice(nl + 1).trim() };
    }),
  };
}

const fold = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

// Reparte las fotos de la ficha entre las secciones del cuerpo (por título).
// La foto con `section` va en esa sección (si se renombró, cae en automático);
// las automáticas van de una en una cada dos secciones sin foto propia, y las
// que sobren quedan en `rest` («Más fotos»). skipFirst: la primera ya es la
// portada y no se repite en automático. noAuto(título): secciones que no
// reciben fotos automáticas (Variedades ya trae las suyas).
export function placePhotos(photos, titles, { skipFirst = false, noAuto = () => false } = {}) {
  const at = new Map(titles.map((t, i) => [fold(t), i]));
  const bySection = titles.map(() => []);
  const auto = [];
  photos.forEach((p, i) => {
    const target = p.section ? at.get(fold(p.section)) : undefined;
    if (target !== undefined) bySection[target].push(p);
    else if (!(skipFirst && i === 0)) auto.push(p);
  });
  const slots = titles
    .map((_, i) => i)
    .filter((i) => i % 2 === 0 && !bySection[i].length && !noAuto(titles[i]));
  slots.forEach((i, k) => auto[k] && bySection[i].push(auto[k]));
  return { bySection, rest: auto.slice(slots.length) };
}
