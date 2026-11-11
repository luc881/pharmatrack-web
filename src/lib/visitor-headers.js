// La API ve todas las peticiones de la tienda con la IP de este servidor. Para
// que sus límites cuenten por visitante se le manda la IP real, avalada con un
// secreto compartido (SHOP_PROXY_SECRET aquí y en la API): sin el secreto la
// API la ignora, porque cualquiera podría inventarla.
export function visitorHeaders(req) {
  const secret = process.env.SHOP_PROXY_SECRET;
  // En Vercel estas cabeceras las pone la plataforma, no el visitante
  const ip =
    req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim();
  return secret && ip ? { 'X-Client-IP': ip, 'X-Proxy-Secret': secret } : {};
}
