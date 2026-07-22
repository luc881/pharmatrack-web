import 'src/global.css';

import { SessionProvider } from 'next-auth/react';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { getNavCategories } from 'src/lib/public-api';
import { NavCategoriesProvider } from 'src/layouts/nav-categories-context';
import { themeConfig, ThemeProvider, primary as primaryColor } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { SiteSplash } from 'src/components/loading-screen';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

import { AccountSync } from 'src/sections/account/account-sync';

// ----------------------------------------------------------------------

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: `${CONFIG.appName} — Animales exóticos`,
    template: `%s | ${CONFIG.appName}`,
  },
  description:
    'Tienda de animales exóticos: tarántulas, reptiles y más, con procedencia legal.',
  icons: [
    { rel: 'icon', url: `${CONFIG.assetsDir}/logo/opuntia-favicon.png`, type: 'image/png' },
    { rel: 'shortcut icon', url: `${CONFIG.assetsDir}/favicon.ico` },
    { rel: 'apple-touch-icon', url: `${CONFIG.assetsDir}/logo/opuntia-favicon.png` },
  ],
};

// ----------------------------------------------------------------------

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [settings] = await Promise.all([detectSettings()]);

    return {
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }) {
  const [appConfig, navCategories] = await Promise.all([getAppConfig(), getNavCategories()]);

  return (
    <html lang="es" dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

        <SettingsProvider
          cookieSettings={appConfig.cookieSettings}
          defaultSettings={defaultSettings}
        >
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <MotionLazy>
                <SiteSplash />
                <ProgressBar />
                <SessionProvider>
                  <AccountSync />
                  <NavCategoriesProvider categories={navCategories}>
                    {children}
                  </NavCategoriesProvider>
                </SessionProvider>
              </MotionLazy>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
