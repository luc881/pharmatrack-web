// Cinta superior. Contenido duplicado 2× para el bucle de translateX(0 → -50%) en 26 s.
// Se detiene con prefers-reduced-motion (regla global en tokens.css).
import { marqueeLines } from '../data/site';

export function Marquee() {
  const run = [...marqueeLines, ...marqueeLines];
  return (
    <div
      data-dark
      aria-hidden
      style={{
        overflow: 'hidden',
        background: 'var(--color-neutral-900)',
        color: 'var(--color-neutral-200)',
        padding: '11px 0',
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 48,
          animation: 'odMarquee 26s linear infinite',
        }}
      >
        {run.map((line, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
