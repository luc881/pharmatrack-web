'use client';

// La barra flotante se invierte cuando una sección de fondo oscuro cruza su banda.
// Marca esas secciones con data-dark en el JSX; el hook hace el resto.
import { useEffect, useState } from 'react';

/** Banda que ocupa la barra: mismos números del prototipo. */
const TOP = 104;
const BOTTOM = 58;

export function useNavTheme() {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      let dark = false;
      document.querySelectorAll<HTMLElement>('[data-dark]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < TOP && r.bottom > BOTTOM) dark = true;
      });
      setOnDark((prev) => (prev === dark ? prev : dark));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return {
    onDark,
    style: {
      background: onDark ? 'rgba(246,244,241,0.94)' : 'rgba(28,26,24,0.9)',
      color: onDark ? 'var(--color-text)' : 'var(--color-neutral-100)',
      borderColor: onDark ? 'var(--color-divider)' : 'rgba(240,235,224,0.24)',
    } as React.CSSProperties,
    counterStyle: {
      background: onDark ? 'var(--color-neutral-900)' : 'var(--color-neutral-100)',
      color: onDark ? 'var(--color-neutral-100)' : 'var(--color-neutral-900)',
    } as React.CSSProperties,
  };
}
