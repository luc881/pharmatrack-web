// Tipos canónicos del dominio. Fuente única para front, seeds y adaptadores del CMS.

export type Category = 'iso' | 'acc';
export type Level = 'beg' | 'int' | 'adv';
export type SortKey = 'rel' | 'asc' | 'desc' | 'stock';
export type ZoneId = 'cdmx' | 'meta' | 'nac';

export interface ImageRef {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** Tira de cuidados de la ficha: seis valores cortos (~14 caracteres máx.). */
export interface Care {
  origin: string;
  temperature: string;
  humidity: string;
  size: string;
  difficulty: string;
  rarity: string;
}

export interface Variant {
  id: string;
  name: string;
  /** Suma al precio base, en MXN. */
  priceDelta: number;
}

export interface Product {
  sku: string;
  slug: string;
  name: string;
  scientificName: string | null;
  category: Category;
  level: Level;
  price: number;
  inStock: boolean;
  stockQty: number;
  badge: string | null;
  images: ImageRef[];
  description: string;
  habitat: string | null;
  care: Care | null;
  taxonomy: { label: string; value: string }[];
  origin: string | null;
  tags: string[];
  variants: Variant[];
  relatedSkus: string[];
  updatedAt: string;
}

export interface Article {
  code: string;
  slug: string;
  section: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
  author: string;
  publishedAt: string;
  cover: ImageRef;
  /** Bloques del CMS; los h2 llevan ancla para el índice pegajoso. */
  body: ArticleBlock[];
  mentionedSkus: string[];
}

export type ArticleBlock =
  | { type: 'heading'; id: string; text: string }
  | { type: 'paragraph'; html: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] };

export interface ShippingZone {
  id: ZoneId;
  label: string;
  cost: number;
  note: string;
}

export interface CartLine {
  sku: string;
  qty: number;
  variantId?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  group: 'envios' | 'asesoria' | 'fauna';
}

/** Etiquetas de interfaz para los enumerados. */
export const CATEGORY_LABEL: Record<Category, string> = {
  iso: 'Isópodos',
  acc: 'Sustratos y accesorios',
};

export const LEVEL_LABEL: Record<Level, string> = {
  beg: 'Principiante',
  int: 'Intermedio',
  adv: 'Avanzado',
};

export const SORT_LABEL: Record<SortKey, string> = {
  rel: 'Relevancia',
  asc: 'Precio: menor a mayor',
  desc: 'Precio: mayor a menor',
  stock: 'Disponibles primero',
};
