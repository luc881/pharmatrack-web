// ----------------------------------------------------------------------
// Optimización de imágenes de Cloudinary.
//
// Las fotos se suben desde el dashboard y quedan guardadas a resolución
// completa: una foto de celular son 3-5 MB, y el catálogo muestra decenas.
// Cloudinary transforma al vuelo si se le insertan parámetros en la ruta:
//
//   f_auto  → WebP/AVIF si el navegador los soporta (30-50% menos peso)
//   q_auto  → calidad ajustada al contenido, sin diferencia visible
//   w_XXX   → el ancho que de verdad se va a mostrar
//   dpr_2.0 → el doble para pantallas retina, sin pedir el original
//
// Si la URL no es de Cloudinary (picsum de los datos de prueba, o una foto
// pegada a mano) se devuelve tal cual: nunca rompe una imagen.
// ----------------------------------------------------------------------

const CLOUDINARY = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export function cdnImage(url, width) {
  if (!url) return url;

  const match = CLOUDINARY.exec(url);
  if (!match) return url;

  const [, base, rest] = match;
  // Si alguien ya puso transformaciones a mano, no las pisamos
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return url;

  const params = ['f_auto', 'q_auto', 'dpr_auto'];
  if (width) params.push(`w_${Math.round(width)}`, 'c_limit');

  return `${base}${params.join(',')}/${rest}`;
}
