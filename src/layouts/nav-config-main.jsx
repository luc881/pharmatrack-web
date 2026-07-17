import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  { title: 'Inicio', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
  {
    title: 'Catálogo',
    path: paths.catalog,
    icon: <Iconify width={22} icon="solar:cat-bold-duotone" />,
  },
];
