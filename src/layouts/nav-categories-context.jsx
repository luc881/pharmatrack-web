'use client';

import { use, createContext } from 'react';

// ----------------------------------------------------------------------
// Las categorías del menú se resuelven en el servidor (layout raíz) y bajan
// por contexto. Antes la barra se pintaba con una lista fija y la cambiaba
// cuando respondía un fetch del navegador: eso era el parpadeo al recargar o
// cambiar de página.
//
// `null` significa "sin dato" y hace que la barra caiga a su lista de
// respaldo, igual que antes.
// ----------------------------------------------------------------------

const NavCategoriesContext = createContext(null);

export function NavCategoriesProvider({ categories, children }) {
  return <NavCategoriesContext value={categories}>{children}</NavCategoriesContext>;
}

export function useNavCategories() {
  return use(NavCategoriesContext);
}
