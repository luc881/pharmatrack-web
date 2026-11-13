// ----------------------------------------------------------------------
// Pestaña abierta durante una publicación nueva: al navegar, el navegador pide
// piezas de JavaScript de la versión vieja que Vercel ya no sirve y la página
// truena («This page couldn't load»). Si el error es ese, se recarga sola. La
// hora de la última recarga en sessionStorage evita un bucle si el fallo
// fuera otro: no recarga de nuevo antes de 30 s.
// ----------------------------------------------------------------------

const STALE = /ChunkLoadError|Loading (CSS )?chunk|dynamically imported module|Importing a module script failed/i;
const KEY = 'od-chunk-reload';
const WAIT_MS = 30_000;

export function reloadIfStaleBuild(error) {
  if (typeof window === 'undefined') return false;
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`;
  if (!STALE.test(text)) return false;
  if (Date.now() - Number(sessionStorage.getItem(KEY) ?? 0) < WAIT_MS) return false;
  sessionStorage.setItem(KEY, String(Date.now()));
  window.location.reload();
  return true;
}
