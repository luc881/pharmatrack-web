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
