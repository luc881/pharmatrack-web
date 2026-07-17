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
