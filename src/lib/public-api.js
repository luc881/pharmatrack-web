import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const BASE = `${CONFIG.serverUrl}/api/v1/public/animals`;

// ponytail: fetch nativo con revalidate de 60s; si el API no responde,
// catálogo vacío en lugar de tirar el build/página
export async function getAnimals(params = {}) {
  const qs = new URLSearchParams({ page: 1, page_size: 100, ...params });
  try {
    const res = await fetch(`${BASE}?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [], total: 0 };
    return await res.json();
  } catch {
    return { data: [], total: 0 };
  }
}

// La taxonomía cambia poco: revalidate más largo
export async function getGroups() {
  try {
    const res = await fetch(`${BASE}/groups`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getAnimal(id) {
  try {
    const res = await fetch(`${BASE}/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Ajustes públicos del sitio (p. ej. show_category_browse). Si el API no
// responde, defaults sensatos para no romper la home.
export async function getSiteSettings() {
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/settings/site`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { show_category_browse: true };
    return await res.json();
  } catch {
    return { show_category_browse: true };
  }
}

// ----------------------------------------------------------------------
// Artículos de divulgación (solo publicados)

const ARTICLES = `${CONFIG.serverUrl}/api/v1/public/articles`;

export async function getArticles() {
  try {
    const res = await fetch(ARTICLES, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getArticle(id) {
  try {
    const res = await fetch(`${ARTICLES}/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Productos con show_online (insumos de terrario, granel, etc.)
export async function getProducts() {
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/public/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/public/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
