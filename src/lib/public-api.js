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

// Categorías del menú: raíces visibles y marcadas para la nav. Se resuelve en
// el servidor para que la barra salga correcta en el primer render — pedirlas
// desde el navegador hacía que parpadeara con la lista de respaldo.
export async function getNavCategories() {
  const { slugify } = await import('src/sections/catalog/utils');
  const groups = await getGroups();
  // Sin datos (API caída) devuelve null para que la barra use su lista fija en
  // vez de quedarse sin categorías.
  if (!groups.length) return null;
  return groups
    .filter((g) => g.parent_id == null && g.show_in_nav !== false)
    .map((g) => ({ title: g.name, slug: slugify(g.name) }));
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

// Respaldo si el API no responde. Son las mismas URLs sembradas en Cloudinary
// que usa SITE_DEFAULTS del backend: aqui no hay archivos locales que servir.
const SITE_MEDIA_DEFAULTS = {
  hero_video_mp4: 'https://res.cloudinary.com/dnxavfqhj/video/upload/v1787115691/pukyu6z7wfkpqaifzmor.mp4',
  hero_video_webm: 'https://res.cloudinary.com/dnxavfqhj/video/upload/v1787115692/jjzcsbb3u6nccqmydh9z.webm',
  hero_poster: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115694/bbrlmcwkgjngvme9thzu.jpg',
  moss_tall: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115695/bfqjr7t2tu5vrl0mdkhr.jpg',
  moss_wide: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115697/no2ujblgtav0rjemgpix.jpg',
  leaf_litter: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115698/rmkknlujheewmo2isf8l.jpg',
  terrarium: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115699/acknugtzwqg7iecawvbu.jpg',
  isopod_zebra: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115701/gjcseewc5tclvmflhkpt.png',
  isopod_cubaris: 'https://res.cloudinary.com/dnxavfqhj/image/upload/v1787115702/ko1qxvsltrlgb2d6ltjd.png',
};

const SITE_DEFAULTS = {
  show_category_browse: true,
  shipping_enabled: true,
  media: SITE_MEDIA_DEFAULTS,
};

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

// Revisa el carrito contra el catálogo (disponibilidad, precio, tope). Público
// (no requiere sesión): el carrito puede ser anónimo.
export async function validateCart(items) {
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/shop/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
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
