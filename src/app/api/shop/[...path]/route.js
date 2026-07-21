import { getToken } from 'next-auth/jwt';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
// Proxy same-origin hacia /shop de la API. El token del cliente vive dentro
// de la cookie de sesión y sólo se lee aquí, en el servidor: el navegador
// nunca lo tiene, así que un XSS no se lleva una sesión de 30 días.
// ----------------------------------------------------------------------

// Auth.js nombra la cookie según si el sitio va por https; el nombre es
// además la "sal" del cifrado, así que hay que probar los dos.
const COOKIE_NAMES = ['__Secure-authjs.session-token', 'authjs.session-token'];

async function apiToken(req) {
  const secret = process.env.AUTH_SECRET;
  for (const name of COOKIE_NAMES) {
    if (!req.cookies.get(name)) continue;
    const token = await getToken({ req, secret, salt: name, cookieName: name });
    if (token?.apiToken) return token.apiToken;
  }
  return null;
}

async function forward(req, { params }) {
  const token = await apiToken(req);
  if (!token) return Response.json({ detail: 'No autenticado' }, { status: 401 });

  const { path } = await params;
  const body = req.method === 'GET' ? undefined : await req.text();

  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/shop/${path.join('/')}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body,
      cache: 'no-store',
    });
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return Response.json({ detail: 'No se pudo contactar el servidor' }, { status: 502 });
  }
}

export const GET = forward;
export const PUT = forward;
export const POST = forward;
