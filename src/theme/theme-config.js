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
  // Marca (brand/BRAND.md): cuerpo Inter, títulos (h1–h3) Playfair Display serif
  fontFamily: {
    primary: 'Inter Variable',
    secondary: 'Playfair Display',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    // Marca (opción A): el primario es la tinta negro verdoso (botones "tinta
    // sobre hueso"). Valores de public/brand/tokens.css.
    primary: {
      lighter: '#F2F1EC',
      light: '#5B5F5A',
      main: '#1C2320',
      dark: '#161B19',
      darker: '#161B19',
      contrastText: '#F6F5F1',
    },
    // Avisos (rediseño): lo no disponible y los errores van en el neutro gris
    // azulado (--od-neutro-*), sin rojo ni naranja; el éxito, en el acento musgo.
    // El mensaje siempre dice qué pasó: el color no carga el significado solo.
    secondary: {
      lighter: '#F1F0EA',
      light: '#A6B6B7',
      main: '#67767C',
      dark: '#4C585D',
      darker: '#303840',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#F1F0EA',
      light: '#A6B6B7',
      main: '#67767C',
      dark: '#4C585D',
      darker: '#303840',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#E5F1CD',
      light: '#55B895',
      main: '#247465',
      dark: '#173E36',
      darker: '#0F2A24',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#F1F0EA',
      light: '#A6B6B7',
      main: '#67767C',
      dark: '#4C585D',
      darker: '#303840',
      contrastText: '#FFFFFF',
    },
    error: {
      lighter: '#E4E8E7',
      light: '#A6B6B7',
      main: '#303840',
      dark: '#22282E',
      darker: '#161A1E',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAF9F6',
      100: '#F6F5F1',
      200: '#EFEDE8',
      300: '#DAD7D0',
      400: '#BDBAB2',
      500: '#8F918B',
      600: '#5B5F5A',
      700: '#464A46',
      800: '#2C302D',
      900: '#161B19',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
