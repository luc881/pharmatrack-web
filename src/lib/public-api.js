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

// Antes 300s "porque la taxonomía cambia poco", pero ahora estos grupos
// llevan las banderas de visible/menú/destacado que se ajustan a mano desde
// el dashboard: esperar 5 minutos para ver el efecto es demasiado.
export async function getGroups() {
  try {
    const res = await fetch(`${BASE}/groups`, { next: { revalidate: 30 } });
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

const SITE_DEFAULTS = { show_category_browse: true, shipping_enabled: true };

// Ajustes públicos del sitio (p. ej. show_category_browse). Si el API no
// responde, defaults sensatos para no romper la home.
export async function getSiteSettings() {
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/settings/site`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return SITE_DEFAULTS;
    return await res.json();
  } catch {
    return SITE_DEFAULTS;
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
