// Tira de cuidados de la ficha: 6 columnas en escritorio, 2 × 3 en móvil.
// Solo se renderiza si product.care existe (category === 'iso').
import type { Care } from '../types';

const FIELDS: { key: keyof Care; label: string }[] = [
  { key: 'origin', label: 'Origen' },
  { key: 'temperature', label: 'Temperatura' },
  { key: 'humidity', label: 'Humedad' },
  { key: 'size', label: 'Tamaño' },
  { key: 'difficulty', label: 'Dificultad' },
  { key: 'rarity', label: 'Rareza' },
];

export function CareStrip({ care }: { care: Care }) {
  return (
    <dl
      className="od-care"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        margin: 0,
        border: '1px solid var(--color-divider)',
        borderRadius: 'var(--radius-strip)',
        overflow: 'hidden',
      }}
    >
      {FIELDS.map((f, i) => (
        <div
          key={f.key}
          style={{
            padding: '26px 20px',
            borderRight: i < FIELDS.length - 1 ? '1px solid var(--color-divider)' : undefined,
            background: i % 2 === 0 ? 'var(--color-neutral-200)' : 'var(--color-accent-100)',
          }}
        >
          <dt
            style={{
              marginBottom: 14,
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-600)',
            }}
          >
            {f.label}
          </dt>
          <dd
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 22 }}
          >
            {care[f.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* Móvil:
@media (max-width: 760px) {
  .od-care { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .od-care > div { border-right: 1px solid var(--color-divider); border-bottom: 1px solid var(--color-divider); }
}
*/
