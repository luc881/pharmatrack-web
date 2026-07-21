'use client';

import { useState, useEffect, useCallback } from 'react';

// ponytail: favoritos por especie en localStorage; migrar a cuenta de
// usuario el día que haya inicio de sesión
export const FAVORITES_KEY = 'favorites';
export const FAVORITES_EVENT = 'favorites:change';
const KEY = FAVORITES_KEY;
const EVENT = FAVORITES_EVENT;

const read = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY)) ?? [];
    // Migración: antes se guardaban ids numéricos de especie; hoy las llaves
    // de listado son 's{speciesId}' o 'm{morphId}' — sin esto se perderían
    return stored.map((id) => (typeof id === 'number' ? `s${id}` : id));
  } catch {
    return [];
  }
};

export function useFavorites() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, toggle };
}
