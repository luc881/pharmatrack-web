// La píldora es el único botón del sistema. Variantes exactas del prototipo.
// Alturas: sm 40px (barra), md 48px, lg 56px (acción principal de ficha).
import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'dark' | 'light' | 'outline' | 'outlineLight';
type Size = 'sm' | 'md' | 'lg';

const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  letterSpacing: '0.06em',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background var(--dur-pill) var(--ease), color var(--dur-pill) var(--ease), transform var(--dur-pill) var(--ease), border-color var(--dur-pill) var(--ease)',
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '11px 22px' },
  md: { padding: '14px 30px' },
  lg: { padding: '18px 36px', fontSize: 14, minHeight: 56 },
};

const variants: Record<Variant, React.CSSProperties> = {
  dark: {
    background: 'var(--color-neutral-900)',
    color: 'var(--color-neutral-100)',
    border: '1px solid transparent',
  },
  light: {
    background: 'var(--color-neutral-100)',
    color: 'var(--color-neutral-900)',
    border: '1px solid transparent',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid var(--color-divider)',
  },
  outlineLight: {
    background: 'transparent',
    color: '#eae7e7',
    border: '1px solid rgba(234,231,231,0.5)',
  },
};

/* Hover (llévalo a CSS/Tailwind, no a estilos en línea):
   .od-pill:hover  { background: var(--color-accent-700); color: var(--color-neutral-100);
                     transform: translateY(-3px); border-color: transparent; }
   .od-pill:active { transform: translateY(-1px); } */

interface Props {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: React.ReactNode;
}

export function Pill({
  variant = 'dark',
  size = 'md',
  href,
  children,
  ...rest
}: Props & Omit<ComponentProps<'button'>, 'children'>) {
  const style = { ...base, ...sizes[size], ...variants[variant] };
  if (href) {
    return (
      <Link className="od-pill" href={href} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button className="od-pill" type="button" style={style} {...rest}>
      {children}
    </button>
  );
}
