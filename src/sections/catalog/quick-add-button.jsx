'use client';

import { useState } from 'react';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { useCart } from './use-cart';

// ----------------------------------------------------------------------
// Agregar a cotización directo desde la tarjeta, sin entrar al detalle.
// Mismo patrón que el corazón: aparece al hover (clase fav-btn del card
// base) y queda fijo en pantallas táctiles. Palomea 1.5s al agregar.
// ----------------------------------------------------------------------

export function QuickAddButton({ item, sx }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <IconButton
      size="small"
      className="fav-btn"
      aria-label="Agregar a cotización"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      sx={[
        (theme) => ({
          bgcolor: 'background.paper',
          boxShadow: theme.vars.customShadows?.z8,
          '&:hover': { bgcolor: 'background.paper' },
          opacity: 0,
          transform: 'translateY(-6px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
          '@media (hover: none)': { opacity: 1, transform: 'none' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Iconify
        width={18}
        icon={added ? 'eva:checkmark-fill' : 'solar:cart-plus-bold'}
        sx={{ color: added ? 'success.main' : 'text.secondary' }}
      />
    </IconButton>
  );
}
