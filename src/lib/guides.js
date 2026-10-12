import { z } from 'zod';
import path from 'path';
import { cache } from 'react';
import { load } from 'js-yaml';
import { readdir, readFile } from 'fs/promises';

// ----------------------------------------------------------------------
// Guías de cuidado: un .md por especie en src/content/guias (frontmatter YAML
// + cuerpo Markdown). Agregar una guía = agregar un archivo; el esquema de
// abajo valida el frontmatter y el build falla si falta algo.
// ----------------------------------------------------------------------

const DIR = path.join(process.cwd(), 'src/content/guias');

// Grupos del índice /guias, en orden. Sin guía publicada salen "Próximamente".
export const GUIDE_GROUPS = [
  { key: 'fasmidos', name: 'Fásmidos' },
  { key: 'isopodos', name: 'Isópodos' },
  { key: 'colembolos', name: 'Colémbolos' },
  { key: 'cucarachas', name: 'Cucarachas' },
];

const text = z.string().trim().min(1);

const GuideSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  grupo: z.enum(GUIDE_GROUPS.map((g) => g.key)),
  grupo_nombre: text,
  nombre_cientifico: text,
  // quién describió la especie y el año, p. ej. "Cumming, Bank, Le Tirant & Bradler, 2020"
  autoridad: text.optional(),
  localidad: text.optional(),
  origen: text.optional(),
  nombre_comun: text.optional(),
  dificultad: text.optional(),
  resumen: text,
  datos: z.array(z.object({ etiqueta: text, valor: text })).default([]),
  resumen_rapido: z.array(text).default([]),
  // Ficha técnica: rango y valor; `cursiva` para nombres científicos
  taxonomia: z
    .array(z.object({ rango: text, nombre: text, cursiva: z.boolean().default(false) }))
    .default([]),
  referencias: z.array(z.object({ texto: text, url: z.url().optional() })).default([]),
  // fecha ISO; el esquema core de js-yaml la deja como texto
  actualizado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function parse(file, raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${file}: falta el frontmatter (---)`);
  const result = GuideSchema.safeParse(load(match[1]));
  if (!result.success) throw new Error(`${file}: ${z.prettifyError(result.error)}`);
  if (`${result.data.slug}.md` !== file)
    throw new Error(`${file}: el slug debe coincidir con el nombre del archivo`);
  return { ...result.data, body: match[2] };
}

export const getGuides = cache(async () => {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.md')).sort();
  return Promise.all(files.map(async (f) => parse(f, await readFile(path.join(DIR, f), 'utf8'))));
});

export async function getGuide(slug) {
  return (await getGuides()).find((g) => g.slug === slug) ?? null;
}

// 'Phyllium gardabagusi “Argopuro”' — la localidad con comillas tipográficas
export const guideTitle = (g) =>
  g.localidad ? `${g.nombre_cientifico} “${g.localidad}”` : g.nombre_cientifico;

const fold = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Guía de una especie del catálogo (genus.name + species.name de la API):
// mismo binomio. Si la especie trae localidad entre comillas
// ('Klugii "Montenegro"'), se prefiere la guía de esa localidad.
export function guideForSpecies(guides, species) {
  const genus = species?.genus?.name;
  const name = species?.name ?? '';
  if (!genus || !name) return null;
  const epithet = name.split(/[\s"“”]/)[0];
  const locality = /["“]([^"”]+)["”]/.exec(name)?.[1];
  const same = guides.filter((g) => fold(g.nombre_cientifico) === fold(`${genus} ${epithet}`));
  return (locality && same.find((g) => fold(g.localidad) === fold(locality))) || same[0] || null;
}

// Cuerpo partido por "## ": cada sección lleva su kicker numerado. Lo que
// vaya antes del primer "## " queda como intro sin título.
export function guideSections(body) {
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
