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
    // Marca (paleta Musgo): el primario es la tinta musgo (botones "tinta
    // sobre crema"). Valores de public/brand/tokens.css.
    primary: {
      lighter: '#F3F4E8',
      light: '#4E6660',
      main: '#173E36',
      dark: '#133129',
      darker: '#133129',
      contrastText: '#F7F7EE',
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
      50: '#FBFBF6',
      100: '#F7F7EE',
      200: '#EEF0E6',
      300: '#D6DCCD',
      400: '#B7C2B3',
      500: '#8E9D93',
      600: '#4E6660',
      700: '#2F4A43',
      800: '#1F3B34',
      900: '#133129',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
