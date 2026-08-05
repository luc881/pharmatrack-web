import type { Category, Level, Product, SortKey } from '../types';

/** '$1,450 MXN' — formato único de precio en todo el sitio. */
export function money(n: number): string {
  return '$' + n.toLocaleString('es-MX') + ' MXN';
}

/** Badge automático cuando el producto no trae uno manual. */
export function autoBadge(p: Product): string | null {
  if (p.badge) return p.badge;
  if (!p.inStock) return 'Agotado';
  if (p.stockQty > 0 && p.stockQty <= 6) return `Quedan ${p.stockQty}`;
  return null;
}

export function stockNote(p: Product): string {
  if (!p.inStock) return 'Sin fecha de reingreso confirmada.';
  if (p.stockQty <= 6) return `Quedan ${p.stockQty} — se reabastece cada 3 – 4 semanas.`;
  return 'Disponible ahora.';
}

export function addLabel(p: Product): string {
  return p.inStock ? 'Añadir al carrito' : 'Avísame';
}

export interface FilterState {
  category: Category | 'all';
  level: Level | 'all';
  sort: SortKey;
}

/** Filtrado + orden idénticos al prototipo. `rel` conserva el orden de la fuente. */
export function filterProducts(all: Product[], f: FilterState): Product[] {
  let list = all.filter(
    (p) =>
      (f.category === 'all' || p.category === f.category) &&
      (f.level === 'all' || p.level === f.level),
  );
  if (f.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (f.sort === 'stock') list = [...list].sort((a, b) => Number(b.inStock) - Number(a.inStock));
  return list;
}

/** Búsqueda: mínimo 2 caracteres, sobre nombre + nombre científico + SKU. */
export function searchProducts(all: Product[], q: string): Product[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  return all.filter((p) =>
    `${p.name} ${p.scientificName ?? ''} ${p.sku}`.toLowerCase().includes(needle),
  );
}

export function resultsLabel(n: number): string {
  return `${n} ${n === 1 ? 'resultado' : 'resultados'}`;
}

export function readingLabel(minutes: number): string {
  return `${minutes} min de lectura`;
}
