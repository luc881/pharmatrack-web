'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AccountButton({ sx, fullWidth, ...other }) {
  const { data: session, status } = useSession();
  const [anchor, setAnchor] = useState(null);

  if (status !== 'authenticated') {
    return (
      <Button
        variant="outlined"
        fullWidth={fullWidth}
        onClick={() => signIn('google')}
        startIcon={<Iconify icon="logos:google-icon" width={16} />}
        sx={sx}
        {...other}
      >
        Entrar
      </Button>
    );
  }

  const user = session.user ?? {};

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Mi cuenta" sx={sx}>
        <Avatar src={user.image ?? undefined} alt={user.name ?? ''} sx={{ width: 30, height: 30 }}>
          {(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }} noWrap>
          {user.email}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem component={RouterLink} href={paths.orders} onClick={() => setAnchor(null)}>
          Mis pedidos
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.account} onClick={() => setAnchor(null)}>
          Mis datos
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.favorites} onClick={() => setAnchor(null)}>
          Favoritos
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => signOut()} sx={{ color: 'error.main' }}>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
