'use client';

import { useEffect } from 'react';

import { reloadIfStaleBuild } from 'src/lib/chunk-reload';

// ----------------------------------------------------------------------
// Error en el navegador dentro de cualquier página: en vez de la pantalla
// negra genérica de Next («This page couldn't load»), un aviso de la marca.
// Si el error es de una versión vieja del sitio (se publicó una nueva con la
// pestaña abierta), recarga solo.
// ----------------------------------------------------------------------

const btn = {
  font: 'inherit',
  fontSize: 15,
  padding: '13px 26px',
  borderRadius: 999,
  cursor: 'pointer',
  textDecoration: 'none',
};

export default function Error({ error, reset }) {
  useEffect(() => {
    if (!reloadIfStaleBuild(error)) console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '48px 20px',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 460 }}>
        <img src="/brand/assets/logo/sello-oscuro.svg" alt="" width={88} height={88} />
        <h1 style={{ margin: '24px 0 0', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.15 }}>
          Esta página no cargó bien
        </h1>
        <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: 1.6 }}>
          Vuelve a intentarlo. Si sigue igual, recarga la página o regresa al inicio.
        </p>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => reset()} style={{ ...btn, border: 0, background: 'var(--color-text)', color: 'var(--color-bg)' }}>
            Intentar de nuevo
          </button>
          <a href="/" style={{ ...btn, border: '1px solid currentColor', color: 'inherit' }}>
            Ir al inicio
          </a>
        </div>
      </div>
    </main>
  );
}
