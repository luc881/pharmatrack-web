'use client';

import { useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { SOCIALS, announcementFor } from 'src/sections/catalog/shop-info';

import { NavMobile } from './nav/mobile';
import { Footer, HomeFooter } from './footer';
import { MenuButton } from '../components/menu-button';
import { CartButton } from '../components/cart-button';
import { CloseCursor } from '../components/close-cursor';
import { SearchDialog } from '../components/search-dialog';
import { useSiteSettings } from '../site-settings-context';
import { AccountButton } from '../components/account-button';
import { useNavCategories } from '../nav-categories-context';
import { FavoritesButton } from '../components/favorites-button';
import { MainSection, LayoutSection, HeaderSection } from '../core';
import { splitNav, buildNavData, navData as mainNavData } from '../nav-config-main';

// ----------------------------------------------------------------------

function NavColumn({ items }) {
  const pathname = usePathname();

  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center', minWidth: 220 }}>
      {items.map((item) => {
        const active = pathname === item.path || pathname === `${item.path}/`;
        return (
          <Link
            key={item.title}
            component={RouterLink}
            href={item.path}
            underline="none"
            sx={{
              pb: 0.5,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'common.white',
              position: 'relative',
              whiteSpace: 'nowrap',
              // la línea crece desde el centro al hacer hover (o si es la página activa)
              '&::after': {
                left: 0,
                right: 0,
                bottom: 0,
                height: '2px',
                content: '""',
                position: 'absolute',
                bgcolor: 'currentColor',
                transform: active ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
              },
              '&:hover::after': { transform: 'scaleX(1)' },
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
  const search = useBoolean();
  const { onToggle: onToggleSearch } = search;

  const isHomePage = pathname === '/';

  // Atajo de teclado: ⌘K / Ctrl+K abre el buscador
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggleSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onToggleSearch]);

  // Vienen resueltas del servidor (layout raíz): la barra sale correcta desde
  // el primer render, sin el parpadeo de pintar la lista fija y corregirla.
  const categories = useNavCategories();
  const site = useSiteSettings();
  const announcement = announcementFor(site?.shipping_enabled !== false);

  const dynamicNav = categories ? buildNavData(categories) : mainNavData;
  const { left: navLeft, right: navRight } = splitNav(dynamicNav);
  const navData = slotProps?.nav?.data ?? dynamicNav;

  const renderHeader = () => {
    const headerSlots = {
      /** @slot Anuncio + redes sociales (textos y links en shop-info.js) */
      topArea: (
        <>
          {announcement && (
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
              {announcement}
            </Box>
          )}

          {SOCIALS.length > 0 && (
            <Box sx={(theme) => ({ borderBottom: `solid 1px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.08)}` })}>
              <Container sx={{ py: 0.5, gap: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                {SOCIALS.map((social) => (
                  <IconButton
                    key={social.label}
                    size="small"
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={social.label}
                    sx={{ color: 'common.white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    <Iconify icon={social.icon} width={17} />
                  </IconButton>
                ))}
              </Container>
            </Box>
          )}
        </>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              color: 'common.white',
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo (solo móvil: en desktop va centrado) */}
          <Logo
            variant="badge"
            sx={(theme) => ({
              width: 46,
              height: 46,
              borderRadius: '50%',
              bgcolor: '#F7F0E6',
              overflow: 'hidden',
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />

          {/** @slot Búsqueda — abre el modal (⌘K en desktop); visible también en móvil */}
          <IconButton
            onClick={search.onTrue}
            aria-label="Buscar en el catálogo"
            sx={{ color: 'common.white' }}
          >
            <Iconify icon="ri:search-line" width={22} />
          </IconButton>
        </>
      ),
      /** @slot Nav de escritorio: columnas de categorías a los lados del logo */
      centerArea: (
        <Box
          sx={(theme) => ({
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: {
              gap: 10,
              width: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          })}
        >
          <NavColumn items={navLeft} />

          {/* Medallón circular. El arte del logo está hecho para fondo claro
              (el gecko es crema y desaparecería sobre la barra oscura), así
              que el disco lleva el mismo crema del archivo: sin costura y sin
              el doble marco que salía con un recuadro blanco. */}
          <Logo
            variant="badge"
            sx={{
              width: 132,
              height: 132,
              borderRadius: '50%',
              bgcolor: '#F7F0E6',
              overflow: 'hidden',
            }}
          />

          <NavColumn items={navRight} />
        </Box>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, color: 'common.white' }}>
          {/** @slot Carrito de cotización */}
          <CartButton sx={{ color: 'inherit' }} />

          {/** @slot Favorites button */}
          <FavoritesButton sx={{ color: 'inherit' }} />

          {/** @slot Cuenta del cliente (login con Google) */}
          <AccountButton
            sx={(theme) => ({
              color: 'common.white',
              borderColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.4),
              '&:hover': { borderColor: 'common.white' },
            })}
          />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={[
          (theme) => ({
            // barra oscura fija en ambos temas; sin el velo claro del scroll
            bgcolor: theme.vars.palette.grey[900],
            color: theme.vars.palette.common.white,
            '--offset-color': theme.vars.palette.common.white,
            '&::before': { display: 'none' },
          }),
          ...(Array.isArray(slotProps?.header?.sx)
            ? slotProps.header.sx
            : [slotProps?.header?.sx]),
        ]}
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
        '--layout-header-desktop-height': '160px',
        ...cssVars,
      }}
      sx={sx}
    >
      {renderMain()}
      <SearchDialog open={search.value} onClose={search.onFalse} />
      <CloseCursor />
    </LayoutSection>
  );
}
