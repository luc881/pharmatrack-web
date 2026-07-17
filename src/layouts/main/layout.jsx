'use client';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Logo } from 'src/components/logo';

import { ANNOUNCEMENT } from 'src/sections/catalog/shop-info';

import { NavMobile } from './nav/mobile';
import { Footer, HomeFooter } from './footer';
import { MenuButton } from '../components/menu-button';
import { CloseCursor } from '../components/close-cursor';
import { SignInButton } from '../components/sign-in-button';
import { SettingsButton } from '../components/settings-button';
import { FavoritesButton } from '../components/favorites-button';
import { MainSection, LayoutSection, HeaderSection } from '../core';
import { navLeft, navRight, navData as mainNavData } from '../nav-config-main';

// ----------------------------------------------------------------------

function NavColumn({ items, align }) {
  const pathname = usePathname();

  return (
    <Stack spacing={1} sx={{ alignItems: align, minWidth: 180 }}>
      {items.map((item) => {
        const active = pathname === item.path || pathname === `${item.path}/`;
        return (
          <Link
            key={item.title}
            component={RouterLink}
            href={item.path}
            underline="none"
            sx={{
              typography: 'overline',
              fontSize: 12,
              letterSpacing: '0.12em',
              color: active ? 'primary.main' : 'text.primary',
              transition: 'color 0.2s ease',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {item.title}
          </Link>
        );
      })}
    </Stack>
  );
}

export function MainLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const pathname = usePathname();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isHomePage = pathname === '/';

  const navData = slotProps?.nav?.data ?? mainNavData;

  const renderHeader = () => {
    const headerSlots = {
      /** @slot Barra de anuncio (texto en shop-info.js) */
      topArea: ANNOUNCEMENT ? (
        <Box
          sx={{
            py: 0.75,
            px: 2,
            textAlign: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            typography: 'caption',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {ANNOUNCEMENT}
        </Box>
      ) : null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo (solo móvil: en desktop va centrado) */}
          <Logo sx={(theme) => ({ [theme.breakpoints.up(layoutQuery)]: { display: 'none' } })} />
        </>
      ),
      /** @slot Nav de escritorio: columnas de categorías a los lados del logo */
      centerArea: (
        <Box
          sx={(theme) => ({
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: {
              gap: 8,
              width: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          })}
        >
          <NavColumn items={navLeft} align="flex-end" />

          <Link
            component={RouterLink}
            href="/"
            underline="none"
            sx={{ gap: 1.5, display: 'flex', alignItems: 'center', color: 'inherit' }}
          >
            <Logo isSingle sx={{ width: 52, height: 52 }} />
            <Typography variant="h3" component="span" sx={{ whiteSpace: 'nowrap' }}>
              {CONFIG.appName}
            </Typography>
          </Link>

          <NavColumn items={navRight} align="flex-start" />
        </Box>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/** @slot Favorites button */}
          <FavoritesButton />

          {/** @slot Settings button */}
          <SettingsButton />

          {/** @slot Sign in button */}
          <SignInButton />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () =>
    isHomePage ? (
      <HomeFooter sx={slotProps?.footer?.sx} />
    ) : (
      <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
    );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{
        // header más alto en desktop: 4 filas de links flanqueando el logo
        '--layout-header-desktop-height': '148px',
        ...cssVars,
      }}
      sx={sx}
    >
      {renderMain()}
      <CloseCursor />
    </LayoutSection>
  );
}
