import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { imageClasses } from './classes';

// ----------------------------------------------------------------------

const sharedStyles = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'inherit',
  aspectRatio: 'inherit',
  borderRadius: 'inherit',
};

export const ImageRoot = styled('span', {
  shouldForwardProp: (prop) => !['effect', 'sx'].includes(prop),
})(({ effect }) => ({
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative',
  display: 'inline-block',
  verticalAlign: 'bottom',
  aspectRatio: 'var(--aspect-ratio)',
  ...(effect && getEffectStyles(effect)),
}));

export const ImageImg = styled('img')(() => ({
  ...sharedStyles,
  objectFit: 'cover',
}));

export const ImageOverlay = styled('span')({
  ...sharedStyles,
  zIndex: 1,
  position: 'absolute',
});

// Marcador en los tonos de la marca: el de la plantilla era un gris azulado
// que sobre el crema se veía como un hueco frío.
export const ImagePlaceholder = styled('span')(({ theme }) => ({
  ...sharedStyles,
  content: '""',
  position: 'absolute',
  backgroundImage: `linear-gradient(135deg,
    ${theme.vars.palette.background.neutral} 0%,
    ${varAlpha(theme.vars.palette.primary.lightChannel, 0.28)} 100%)`,
}));

// ----------------------------------------------------------------------

const getEffectStyles = (effect) => {
  const { style, duration } = effect ?? {};

  const transition =
    style === 'opacity'
      ? `opacity ${duration}ms`
      : `opacity ${Number(duration) / 2}ms, filter ${duration}ms`;

  return {
    [`& .${imageClasses.img}`]: {
      transition,
      ...(style === 'opacity' && { opacity: 0 }),
      ...(style === 'blur' && { filter: 'blur(12px)', opacity: 0 }),
      ...(style === 'black-and-white' && { filter: 'grayscale(1)', opacity: 0 }),
    },
    [`&.${imageClasses.state.loaded} .${imageClasses.img}`]: {
      ...(style === 'opacity' && { opacity: 1 }),
      ...(style === 'blur' && { filter: 'blur(0)', opacity: 1 }),
      ...(style === 'black-and-white' && { filter: 'grayscale(0)', opacity: 1 }),
    },
  };
};
