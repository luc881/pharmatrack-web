import { getSiteSettings } from 'src/lib/public-api';

// ponytail: proxy same-origin para los componentes cliente (el carrito).
// Las páginas de servidor ya los leen directo con getSiteSettings.
export async function GET() {
  return Response.json(await getSiteSettings());
}
