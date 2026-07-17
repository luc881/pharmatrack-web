// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  catalog: '/catalogo',
  // Un solo segmento dinámico: "gecko-crestado-3" = especie (termina en -id),
  // otro texto = categoría raíz, numérico puro = URL vieja de animal (redirige)
  catalogCategory: (slug) => `/catalogo/${slug}`,
  catalogSpecies: (slug) => `/catalogo/${slug}`,
  // Dashboard de administración (proyecto aparte)
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.farmaciaselene.com',
};
