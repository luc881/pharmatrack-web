'use client';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// Link interno con sx: las vistas de guías son de servidor y no pueden
// pasarle un componente (función) a Box por `component`.
export function GuideLink(props) {
  return <Box component={RouterLink} {...props} />;
}
