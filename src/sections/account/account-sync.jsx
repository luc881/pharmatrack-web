'use client';

import { useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { CART_KEY, CART_EVENT } from 'src/sections/catalog/use-cart';
import { FAVORITES_KEY, FAVORITES_EVENT } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------
// Un solo componente, montado en el layout, sincroniza favoritos y carrito
// con la cuenta. Los hooks de catálogo siguen intactos hablando sólo con
// localStorage: aquí escuchamos sus eventos y guardamos en el servidor.
// ----------------------------------------------------------------------

const read = (key) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
};

const write = (key, value, event) => {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(event));
};

// Al entrar por primera vez desde un dispositivo nuevo, lo que ya tenías
// aquí no se pierde: se junta con lo de la cuenta.
const mergeFavorites = (server, local) => [...new Set([...server, ...local])];

const mergeCart = (server, local) => {
  const byKey = new Map(server.map((item) => [item.key, item]));
  local.forEach((item) => byKey.set(item.key, item)); // lo local es lo más reciente
  return [...byKey.values()];
};

export function AccountSync() {
  const { status } = useSession();
  const lastSent = useRef('');

  useEffect(() => {
    if (status !== 'authenticated') {
      lastSent.current = '';
      return undefined;
    }

    let alive = true;
    let timer;

    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const payload = {
          favorites: read(FAVORITES_KEY),
          cart: read(CART_KEY),
        };
        const serialized = JSON.stringify(payload);
        if (serialized === lastSent.current) return;
        lastSent.current = serialized;
        fetch('/api/shop/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: serialized,
        }).catch(() => {});
      }, 600);
    };

    // 1) traer la cuenta, 2) fusionar con lo local, 3) devolver lo fusionado
    fetch('/api/shop/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((account) => {
        if (!alive || !account) return;
        const favorites = mergeFavorites(account.favorites ?? [], read(FAVORITES_KEY));
        const cart = mergeCart(account.cart ?? [], read(CART_KEY));
        write(FAVORITES_KEY, favorites, FAVORITES_EVENT);
        write(CART_KEY, cart, CART_EVENT);
        save();
      })
      .catch(() => {});

    window.addEventListener(FAVORITES_EVENT, save);
    window.addEventListener(CART_EVENT, save);
    return () => {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener(FAVORITES_EVENT, save);
      window.removeEventListener(CART_EVENT, save);
    };
  }, [status]);

  return null;
}
