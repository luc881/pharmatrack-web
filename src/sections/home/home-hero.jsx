import { useRef, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';

import { HeroVideo } from './components/hero-video';

// ----------------------------------------------------------------------

const mdKey = 'md';
const lgKey = 'lg';

const motionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

export function HomeHero({ sx, ...other }) {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up(mdKey));

  // El parallax sólo existe en escritorio; en móvil ni se calcula
  const scrollProgress = useScrollPercent(mdUp);

  const distance = mdUp ? scrollProgress.percent : 0;

  const y1 = useTransformY(scrollProgress.scrollY, distance * -7);
  const y2 = useTransformY(scrollProgress.scrollY, distance * -6);
  const y3 = useTransformY(scrollProgress.scrollY, distance * -5);

  const opacity = useTransform(
    scrollProgress.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scrollProgress.percent / 100).toFixed(1)) : 1]
  );

  const renderHeading = () => (
    <m.div {...motionProps}>
      <Box
        component="h1"
        sx={[
          (theme) => ({
            my: 0,
            mx: 'auto',
            maxWidth: 780,
            display: 'flex',
            flexWrap: 'wrap',
            typography: 'h2',
            justifyContent: 'center',
            fontFamily: theme.typography.fontSecondaryFamily,
            [theme.breakpoints.up(lgKey)]: {
              fontSize: theme.typography.pxToRem(72),
              lineHeight: '90px',
            },
          }),
        ]}
      >
        <Box component="span" sx={{ width: 1, color: 'common.white', opacity: 0.92 }}>
          Animales exóticos
        </Box>
        <Box component="span" sx={{ color: 'common.white' }}>de</Box>
        <Box
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={[
            (theme) => ({
              // Colores de tuna (el fruto del nopal): magenta-rojo a naranja.
              // El verde se perdía sobre el musgo del fondo; estos cálidos
              // contrastan y siguen siendo del mismo mundo del logo.
              ...theme.mixins.textGradient(
                `300deg, #E0384E 0%, #F26B3A 25%, #F59E42 50%, #F26B3A 75%, #E0384E 100%`
              ),
              backgroundSize: '400%',
              ml: { xs: 0.75, md: 1, xl: 1.5 },
            }),
          ]}
        >
          {CONFIG.appName}
        </Box>
      </Box>
    </m.div>
  );

  const renderText = () => (
    <m.div {...motionProps}>
      <Typography
        variant="body2"
        sx={[
          (theme) => ({
            mx: 'auto',
            maxWidth: 480,
            fontWeight: 500,
            color: 'common.white',
            opacity: 0.88,
            [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px', maxWidth: 640 },
          }),
        ]}
      >
        Tarántulas, reptiles y más animales exóticos con procedencia legal, criados con cuidado y
        listos para un nuevo hogar.
      </Typography>
    </m.div>
  );

  const renderButtons = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          href={paths.catalog}
          color="primary"
          size="large"
          variant="contained"
          startIcon={<Iconify width={24} icon="solar:cat-bold-duotone" />}
          sx={{ height: 52 }}
        >
          Ver catálogo
        </Button>
      </m.div>

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          href={paths.catalog}
          color="inherit"
          size="large"
          variant="outlined"
          startIcon={<Iconify width={24} icon="solar:star-bold-duotone" />}
          sx={{
            height: 52,
            color: 'common.white',
            borderColor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.6),
            '&:hover': { borderColor: 'common.white' },
          }}
        >
          Recién llegados
        </Button>
      </m.div>
    </Box>
  );

  return (
    <Box
      ref={scrollProgress.elementRef}
      component="section"
      sx={[
        (theme) => ({
          overflow: 'hidden',
          position: 'relative',
          // En móvil el hero no tenía alto propio: se ajustaba al texto y el
          // video quedaba en una franja. svh evita el salto que da vh cuando
          // la barra del navegador aparece y desaparece al hacer scroll.
          display: 'flex',
          minHeight: '78vh',
          // svh no salta cuando la barra del navegador aparece al hacer
          // scroll; @supports porque en un objeto JS la clave duplicada
          // pisaría al respaldo en vez de convivir con él como en CSS.
          '@supports (height: 100svh)': { minHeight: '78svh' },
          [theme.breakpoints.up(mdKey)]: {
            minHeight: 760,
            height: '100vh',
            maxHeight: 1440,
            display: 'block',
            willChange: 'opacity',
            mt: 'calc(var(--layout-header-desktop-height) * -1)',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity }}
        sx={[
          (theme) => ({
            width: 1,
            flexGrow: 1,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            transition: theme.transitions.create(['opacity']),
            [theme.breakpoints.up(mdKey)]: {
              height: 1,
              position: 'fixed',
              maxHeight: 'inherit',
            },
          }),
        ]}
      >
        <Container
          component={MotionContainer}
          sx={[
            (theme) => ({
              py: 3,
              gap: 5,
              zIndex: 9,
              flex: '1 1 auto',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              [theme.breakpoints.up(mdKey)]: {
                flex: '1 1 auto',
                justifyContent: 'center',
                py: 'var(--layout-header-desktop-height)',
              },
            }),
          ]}
        >
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            <m.div style={{ y: y1 }}>{renderHeading()}</m.div>
            <m.div style={{ y: y2 }}>{renderText()}</m.div>
          </Stack>

          <m.div style={{ y: y3 }}>{renderButtons()}</m.div>
        </Container>

        <HeroVideo />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useTransformY(value, distance) {
  const physics = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

// `enabled` es la clave del rendimiento: esto guarda el porcentaje en estado
// de React, así que cada evento de scroll re-renderizaba el hero entero
// (titular, textos, botones, video) — decenas de veces por segundo. En móvil
// el parallax ni siquiera se usa, y ese trabajo en el hilo principal es lo que
// hacía tironear al carrusel. Ahora sólo se actualiza si sirve para algo y si
// el valor cambió de verdad.
function useScrollPercent(enabled = true) {
  const elementRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    if (!enabled) return;

    const heroHeight = elementRef.current?.offsetHeight ?? 0;
    if (!heroHeight) return;

    const scrollPercent = Math.min(100, Math.floor((scrollHeight / heroHeight) * 100));
    setPercent((current) => (current === scrollPercent ? current : scrollPercent));
  });

  return { elementRef, percent, scrollY };
}
