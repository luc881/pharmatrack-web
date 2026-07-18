import { CONFIG } from 'src/global-config';
import { themeConfig } from 'src/theme/theme-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

// Sin drawer de ajustes: estos defaults son la única fuente de la apariencia.
// version viene del package.json — al cambiarla se resetea lo guardado en
// localStorage de visitas anteriores y todos reciben estos valores.
export const defaultSettings = {
  mode: themeConfig.defaultMode,
  direction: themeConfig.direction,
  contrast: 'high',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontSize: 18,
  fontFamily: 'Inter Variable',
  version: CONFIG.appVersion,
};
