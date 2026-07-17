import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  // ponytail: nombre placeholder derivado del dominio; cambiarlo cuando definan la marca
  appName: 'Selene Exotics',
  appVersion: packageJson.version,
  // Defaults de producción: el .env está gitignoreado, así Vercel funciona sin configurar nada
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://api.farmaciaselene.com',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  // URL pública del sitio (metadata OG / sitemap)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.farmaciaselene.com',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
};
