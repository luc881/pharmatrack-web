import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export function Footer({ sx, ...other }) {
  return (
    <FooterRoot sx={sx} {...other}>
      <Divider />
      <Container sx={{ py: 5, textAlign: 'center' }}>
        <Logo isSingle={false} sx={{ mx: 'auto', width: 200, height: 92 }} />
        <Box sx={{ mt: 2, gap: 3, display: 'flex', justifyContent: 'center' }}>
          <Link component={RouterLink} href={paths.catalog} color="inherit" variant="body2">
            Catálogo
          </Link>
          <Link component={RouterLink} href={paths.terms} color="inherit" variant="body2">
            Términos
          </Link>
          <Link component={RouterLink} href={paths.privacy} color="inherit" variant="body2">
            Privacidad
          </Link>
          <Link href={paths.appUrl} color="inherit" variant="body2">
            Acceso
          </Link>
        </Box>
        <Box sx={{ mt: 3, typography: 'caption', color: 'text.secondary' }}>
          © {new Date().getFullYear()} {CONFIG.appName}. Todos los derechos reservados.
        </Box>
      </Container>
    </FooterRoot>
  );
}

// El home usa el mismo footer que el resto de las páginas
export const HomeFooter = Footer;
