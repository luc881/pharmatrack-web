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
