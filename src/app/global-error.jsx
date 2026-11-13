'use client';

import { useEffect } from 'react';

import { reloadIfStaleBuild } from 'src/lib/chunk-reload';

// ----------------------------------------------------------------------
// Error en el layout raíz (cuando ni error.jsx alcanza): reemplaza la pantalla
// negra de Next. Trae su propio <html>; sin los estilos del sitio, todo va en
// línea. Mismo trato a la versión vieja del sitio: recarga sola una vez.
// ----------------------------------------------------------------------

export default function GlobalError({ error }) {
  useEffect(() => {
    if (!reloadIfStaleBuild(error)) console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '48px 20px', background: '#eeece6', color: '#1c2320', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ maxWidth: 460 }}>
          <img src="/brand/assets/logo/sello-oscuro.svg" alt="" width={88} height={88} />
          <h1 style={{ margin: '24px 0 0', fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 34, lineHeight: 1.15 }}>Esta página no cargó bien</h1>
          <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: 1.6 }}>Recarga la página. Si sigue igual, regresa al inicio.</p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => window.location.reload()} style={{ font: 'inherit', fontSize: 15, padding: '13px 26px', borderRadius: 999, border: 0, background: '#1c2320', color: '#eeece6', cursor: 'pointer' }}>
              Recargar
            </button>
            <a href="/" style={{ fontSize: 15, padding: '13px 26px', borderRadius: 999, border: '1px solid currentColor', color: 'inherit', textDecoration: 'none' }}>
              Ir al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
