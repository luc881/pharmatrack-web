import 'src/global.css';

import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { themeConfig, ThemeProvider } from 'src/theme';
import { OdPointerFx } from 'src/layouts/od/od-pointer-fx';
import { getSiteSettings, getNavCategories } from 'src/lib/public-api';
import { SiteSettingsProvider } from 'src/layouts/site-settings-context';
import { NavCategoriesProvider } from 'src/layouts/nav-categories-context';

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
  themeColor: '#2E2924', // noche, igual que brand/assets/favicon/site.webmanifest
};

export const metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: `${CONFIG.appName} — Criadero de invertebrados en CDMX`,
    template: `%s | ${CONFIG.appName}`,
  },
  description:
    'Criadero en Col. Roma Norte, CDMX: isópodos, colémbolos, fásmidos y sustratos para terrarios bioactivos. Entrega en persona.',
  icons: {
    icon: [
      { url: `${CONFIG.assetsDir}/favicon.ico`, sizes: 'any' },
      { url: `${CONFIG.assetsDir}/brand/assets/favicon/favicon-claro.svg`, type: 'image/svg+xml' },
      { url: `${CONFIG.assetsDir}/brand/assets/favicon/favicon-32-claro.png`, type: 'image/png', sizes: '32x32' },
    ],
    apple: `${CONFIG.assetsDir}/brand/assets/favicon/apple-touch-icon-claro.png`,
  },
  manifest: `${CONFIG.assetsDir}/brand/assets/favicon/site.webmanifest`,
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
  const [appConfig, navCategories, site] = await Promise.all([
    getAppConfig(),
    getNavCategories(),
    getSiteSettings(),
  ]);

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
                <OdPointerFx />
                <SessionProvider>
                  <AccountSync />
                  <NavCategoriesProvider categories={navCategories}>
                    <SiteSettingsProvider site={site}>
                      {children}
                    </SiteSettingsProvider>
                  </NavCategoriesProvider>
                </SessionProvider>
              </MotionLazy>
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
