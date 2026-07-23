'use client';

import { use, createContext } from 'react';

// ----------------------------------------------------------------------
// Los ajustes públicos del sitio (shipping_enabled, etc.) se resuelven en el
// servidor (layout raíz) y bajan por contexto, para que la barra de anuncio y
// demás copy salgan correctos desde el primer render, sin parpadeo.
// `null` = sin dato; los consumidores caen a sus defaults.
// ----------------------------------------------------------------------

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ site, children }) {
  return <SiteSettingsContext value={site}>{children}</SiteSettingsContext>;
}

export function useSiteSettings() {
  return use(SiteSettingsContext);
}
