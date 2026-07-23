import { validateCart } from 'src/lib/public-api';

// ponytail: proxy same-origin para el carrito (componente cliente). El endpoint
// del backend es público, así que aquí no hace falta token de cliente.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) return Response.json({ items: [] });
  const data = await validateCart(items);
  return Response.json(data ?? { items: [] });
}
