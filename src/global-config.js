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
  // Tarjeta para la vista previa al compartir (isotipo, 1200 × 630)
  ogImage: {
    url: '/brand/assets/og/opuntia-den-icono-1200x630.png',
    width: 1200,
    height: 630,
    alt: 'Opuntia Den',
  },
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
};
