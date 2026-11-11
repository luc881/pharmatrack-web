import { CONFIG } from 'src/global-config';
import { visitorHeaders } from 'src/lib/visitor-headers';

// Rastreo sin cuenta: proxy same-origin al endpoint público de la API, que solo
// conoce las guías generadas por el negocio.
export async function GET(req, { params }) {
  const { number } = await params;
  try {
    const res = await fetch(
      `${CONFIG.serverUrl}/api/v1/public/tracking/${encodeURIComponent(number)}`,
      { headers: visitorHeaders(req), cache: 'no-store' }
    );
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return Response.json({ detail: 'No se pudo contactar el servidor' }, { status: 502 });
  }
}
