// Seed temporal — los títulos, códigos, secciones y minutos de lectura vienen del prototipo.
// El cuerpo completo solo existe para ART-002 (la vista de artículo del prototipo); el resto
// trae excerpt y portada. Sustituir por el CMS en la fase 7 (ver API-CONTRACT.md).
import type { Article } from '../types';

const wiki = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

const cover = (file: string, alt: string) => ({ url: wiki(file), alt, width: 1600, height: 900 });

export const articles: Article[] = [
  {
    code: 'ART-002',
    slug: 'isopodos-y-colembolos-equipo-de-limpieza',
    section: 'Bioactivo',
    title: 'Isópodos y colémbolos: el equipo de limpieza del terrario',
    excerpt:
      'Quién procesa la materia muerta del terrario, en qué proporción conviene sembrarlos y qué esperar el primer mes.',
    readingMinutes: 6,
    author: 'Opuntia Den',
    publishedAt: '2026-06-12T00:00:00.000Z',
    cover: cover('Mossy%20Forest%20Floor%20(60670374).jpeg', 'Suelo de bosque con musgo y hojarasca'),
    body: [
      {
        type: 'paragraph',
        html: 'Un terrario bioactivo no se limpia: se equilibra. Estos dos invertebrados hacen el trabajo que de otro modo harías tú con pinzas.',
      },
      { type: 'heading', id: 's1', text: 'Qué hace cada uno' },
      { type: 'paragraph', html: 'Los isópodos procesan hojarasca y madera blanda…' },
      { type: 'heading', id: 's2', text: 'Proporción y siembra' },
      { type: 'paragraph', html: 'Para un bioactivo de 20 litros…' },
      {
        type: 'table',
        caption: 'Referencia rápida',
        head: ['Volumen', 'Isópodos', 'Colémbolos'],
        rows: [
          ['10 L', '15 – 20', '1 cultivo'],
          ['20 L', '25 – 30', '1 – 2 cultivos'],
          ['40 L', '50 +', '2 cultivos'],
        ],
      },
      { type: 'heading', id: 's3', text: 'Errores comunes' },
      {
        type: 'paragraph',
        html: 'El primero es introducirlos en un sustrato demasiado seco: sin humedad no colonizan. Si vas a montar tu primer bioactivo, empieza con <em>Porcellionides pruinosus</em>.',
      },
    ],
    mentionedSkus: ['ISO-007', 'ISO-003', 'ACC-001', 'ACC-002'],
  },
  {
    code: 'ART-004',
    slug: 'como-armar-un-bioactivo-de-20-litros',
    section: 'Montaje',
    title: 'Cómo armar un bioactivo de 20 litros',
    excerpt:
      'Capas de drenaje, sustrato y hojarasca, con las cantidades exactas y los tiempos de reposo antes de sembrar.',
    readingMinutes: 7,
    author: 'Opuntia Den',
    publishedAt: '2026-05-28T00:00:00.000Z',
    cover: cover('Terrarium.JPG', 'Terrario montado por capas'),
    body: [],
    mentionedSkus: ['ACC-003', 'ACC-001', 'ACC-002', 'KIT-001'],
  },
  {
    code: 'ART-005',
    slug: 'armadillidium-cinco-morfos',
    section: 'Especies',
    title: 'Armadillidium: cinco morfos y qué esperar de cada uno',
    excerpt:
      'Diferencias reales de temperatura, humedad y ritmo de reproducción entre los morfos más pedidos.',
    readingMinutes: 8,
    author: 'Opuntia Den',
    publishedAt: '2026-05-14T00:00:00.000Z',
    cover: cover('ZebraIsopod.jpg', 'Armadillidium maculatum'),
    body: [],
    mentionedSkus: ['ISO-002', 'ISO-005', 'ISO-004', 'ISO-001'],
  },
  {
    code: 'ART-006',
    slug: 'humedad-como-leer-el-sustrato',
    section: 'Cuidados',
    title: 'Humedad: cómo leer el sustrato sin higrómetro',
    excerpt:
      'El método de la mano y la hojarasca: tres señales visibles que te dicen si riegas o esperas.',
    readingMinutes: 5,
    author: 'Opuntia Den',
    publishedAt: '2026-04-30T00:00:00.000Z',
    cover: cover('Moss,%20Forest%20Floor,%20Vermont.jpg', 'Sustrato húmedo con musgo'),
    body: [],
    mentionedSkus: ['ACC-001', 'ACC-004', 'ISO-006', 'ACC-002'],
  },
  {
    code: 'ART-007',
    slug: 'que-comen-y-cada-cuando',
    section: 'Alimentación',
    title: 'Qué comen realmente y cada cuándo',
    excerpt:
      'Hojarasca, madera blanda, calcio y proteína: el calendario simple que evita mudas fallidas.',
    readingMinutes: 6,
    author: 'Opuntia Den',
    publishedAt: '2026-04-16T00:00:00.000Z',
    cover: cover('Leaf%20litter.jpg', 'Hojarasca seca'),
    body: [],
    mentionedSkus: ['ACC-005', 'ACC-002', 'ISO-003', 'ISO-007'],
  },
  {
    code: 'ART-008',
    slug: 'cuando-separar-una-camada',
    section: 'Cría',
    title: 'Cuándo separar una camada y cómo hacerlo',
    excerpt:
      'Señales de que la colonia está lista para dividirse y el procedimiento sin pérdidas.',
    readingMinutes: 7,
    author: 'Opuntia Den',
    publishedAt: '2026-04-02T00:00:00.000Z',
    cover: cover('Terrarium2.jpg', 'Contenedores de cría'),
    body: [],
    mentionedSkus: ['ISO-001', 'ISO-007', 'ACC-003', 'ACC-001'],
  },
];

export const getArticleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
