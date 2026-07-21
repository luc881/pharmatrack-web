import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
// Cuentas de cliente del sitio público (nada que ver con el dashboard).
//
// Sesión en cookie firmada, sin base de datos del lado de Next: el ID token
// de Google se cambia una sola vez por un token de cliente de la API, que se
// guarda DENTRO del JWT de la cookie y nunca se expone al navegador — las
// llamadas de cliente pasan por el proxy /api/shop.
// ----------------------------------------------------------------------

async function exchangeForApiToken(idToken) {
  const res = await fetch(`${CONFIG.serverUrl}/api/v1/shop/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    // 503 = a la API le falta GOOGLE_CLIENT_ID; 401 = token rechazado
    throw new Error(`La API rechazó el login (HTTP ${res.status})`);
  }
  return res.json();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  // Errores y login caen en la misma página, que muestra el motivo
  pages: { signIn: '/cuenta', error: '/cuenta' },
  callbacks: {
    async jwt({ token, account }) {
      // `account` sólo llega en el login; después el token ya viene poblado
      if (account?.id_token) {
        // Si esto lanza, Auth.js aborta el login y manda a la página de
        // error: mejor un mensaje visible que una cookie a medias que
        // después revienta con 500 en /api/auth/session
        const session = await exchangeForApiToken(account.id_token);
        token.apiToken = session.access_token;
        token.customerId = session.customer.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.customerId = token?.customerId;
      return session; // apiToken se queda en el JWT, fuera del alcance del cliente
    },
  },
});
