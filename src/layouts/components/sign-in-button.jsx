import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  return (
    <Button href={paths.appUrl} variant="outlined" sx={sx} {...other}>
      Acceso
    </Button>
  );
}
