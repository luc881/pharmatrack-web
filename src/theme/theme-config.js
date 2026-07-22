// ----------------------------------------------------------------------

export const themeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Public Sans Variable',
    secondary: 'Barlow',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    // Verde del cactus del logo. `light` es el tono exacto (#919569); `main`
    // va más oscuro a propósito: sobre ese verde el texto blanco de los
    // botones daría 2.9:1 de contraste (ilegible). Así queda en 4.8:1.
    primary: {
      lighter: '#EDEFE1',
      light: '#919569',
      main: '#6B7548',
      dark: '#4C5432',
      darker: '#2F3520',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#EFD6FF',
      light: '#C684FF',
      main: '#8E33FF',
      dark: '#5119B7',
      darker: '#27097A',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#CAFDF5',
      light: '#61F3F3',
      main: '#00B8D9',
      dark: '#006C9C',
      darker: '#003768',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D3FCD2',
      light: '#77ED8B',
      main: '#22C55E',
      dark: '#118D57',
      darker: '#065E49',
      contrastText: '#ffffff',
    },
    warning: {
      lighter: '#FFF5CC',
      light: '#FFD666',
      main: '#FFAB00',
      dark: '#B76E00',
      darker: '#7A4100',
      contrastText: '#1C252E',
    },
    error: {
      lighter: '#FFE9D5',
      light: '#FFAC82',
      main: '#FF5630',
      dark: '#B71D18',
      darker: '#7A0916',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FDFBF7',
      100: '#F9F5EC',
      200: '#F2EDE1',
      300: '#E3DDCD',
      400: '#C8C3B2',
      500: '#9A968A',
      600: '#6E6B62',
      700: '#4C4A43',
      800: '#26251F',
      900: '#1A1A15',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
