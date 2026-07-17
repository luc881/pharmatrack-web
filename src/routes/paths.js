// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  catalog: '/catalogo',
  // Un solo segmento dinámico: numérico = detalle de animal, texto = categoría raíz
  catalogCategory: (slug) => `/catalogo/${slug}`,
  catalogDetails: (id) => `/catalogo/${id}`,
  // Dashboard de administración (proyecto aparte)
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.farmaciaselene.com',
};
