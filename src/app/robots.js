import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
  };
}
