'use client';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { useFavorites } from 'src/sections/catalog/use-favorites';

// ----------------------------------------------------------------------

export function FavoritesButton({ sx }) {
  const { ids } = useFavorites();

  return (
    <IconButton
      component={RouterLink}
      href={paths.favorites}
      aria-label="Favoritos"
      sx={sx}
    >
      <Badge badgeContent={ids.length} color="error">
        <Iconify icon="solar:heart-bold" />
      </Badge>
    </IconButton>
  );
}
