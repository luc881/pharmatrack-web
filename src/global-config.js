import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'Opuntia Den',
  appVersion: packageJson.version,
  // Defaults de producción: el .env está gitignoreado, así Vercel funciona sin configurar nada
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://api.opuntiaden.com',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  // URL pública del sitio (metadata OG / sitemap)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.opuntiaden.com',
  // WhatsApp del negocio con lada de país (52 = México), solo dígitos
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '525562292037',
  // Contacto visible: fuente única, igual que public/brand/BRAND.md §8
  phone: '55 6229 2037',
  phoneLabel: 'Ventas Opuntia',
  instagram: 'https://www.instagram.com/opuntia_den/',
  instagramHandle: '@opuntia_den',
  // Vista previa al compartir (WhatsApp…): el favicon original de la marca,
  // sin procesar. Cuadrado y de menos de 300 px, WhatsApp lo pone como
  // miniatura chica a un lado; con 300 px o más lo muestra en grande, y si se
  // le da una imagen panorámica la recorta y comprime (se veía pixeleada).
  ogImage: {
    url: '/brand/assets/favicon/favicon-192-claro.png',
    width: 192,
    height: 192,
    alt: 'Opuntia Den',
  },
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
};
