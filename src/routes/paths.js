// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  catalog: '/catalogo',
  catalogDetails: (id) => `/catalogo/${id}`,
  // Dashboard de administración (proyecto aparte)
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.farmaciaselene.com',
};
