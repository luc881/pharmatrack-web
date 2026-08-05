'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'od.favs.v1';

/** Favoritos por SKU, persistidos en localStorage. `ready` evita parpadeo al hidratar. */
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavs(JSON.parse(raw) as string[]);
    } catch {
      /* almacenamiento no disponible */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [favs, ready]);

  const has = useCallback((sku: string) => favs.includes(sku), [favs]);

  const toggle = useCallback((sku: string) => {
    setFavs((prev) => (prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]));
  }, []);

  return { favs, count: favs.length, ready, has, toggle };
}
