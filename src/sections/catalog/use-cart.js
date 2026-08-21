'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------
// Carrito de cotización en localStorage (mismo patrón que use-favorites).
// No es un checkout: junta artículos para mandar el resumen por WhatsApp.
// Item: { key, title, detail?, price, qty, unit? ('g' para granel), image?, url? }
// ----------------------------------------------------------------------

export const CART_KEY = 'quote-cart';
export const CART_EVENT = 'cart:change';
const STORAGE_KEY = CART_KEY;
const EVENT = CART_EVENT;

const read = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const write = (items) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
};

export function useCart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((item) => {
    const current = read();
    const existing = current.find((i) => i.key === item.key);
    if (existing) {
      existing.qty += item.qty;
      write(current);
    } else {
      write([...current, item]);
    }
  }, []);

  const setQty = useCallback((key, qty) => {
    if (qty <= 0) {
      write(read().filter((i) => i.key !== key));
      return;
    }
    write(read().map((i) => (i.key === key ? { ...i, qty } : i)));
  }, []);

  const remove = useCallback((key) => {
    write(read().filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => write([]), []);

  // Reemplaza todo el carrito de una (lo usa la reconciliación contra el servidor)
  const replaceAll = useCallback((next) => write(next), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  return { items, count: items.length, total, add, setQty, remove, clear, replaceAll };
}
