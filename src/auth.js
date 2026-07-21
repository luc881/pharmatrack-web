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
  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/shop/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: '/cuenta' },
  callbacks: {
    async jwt({ token, account }) {
      // `account` sólo llega en el login; después el token ya viene poblado
      if (account?.id_token) {
        const session = await exchangeForApiToken(account.id_token);
        if (!session) return null; // API caída o token rechazado: no hay sesión
        token.apiToken = session.access_token;
        token.customerId = session.customer.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.customerId = token.customerId;
      return session; // apiToken se queda en el JWT, fuera del alcance del cliente
    },
  },
});
