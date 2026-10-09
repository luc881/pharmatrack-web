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
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '522225392960',
  // Contacto visible: fuente única, igual que public/brand/BRAND.md §8
  phone: '56 2157 8388',
  instagram: 'https://www.instagram.com/opuntia_den/',
  instagramHandle: '@opuntia_den',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
};
