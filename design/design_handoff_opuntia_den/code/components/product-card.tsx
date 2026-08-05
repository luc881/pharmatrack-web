'use client';

// Tarjeta de producto: la pieza que más se repite (home, catálogo, favoritos, relacionados).
// Hover en escritorio: elevación -8px, cortina de la segunda imagen, zoom 1.06, barra de acción.
// En touch la barra de acción es visible siempre (ver product-card.css).
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '../types';
import { addLabel, autoBadge, money } from '../lib/format';
import { CATEGORY_LABEL } from '../types';

interface Props {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (sku: string) => void;
  onAdd: (sku: string) => void;
  /** true mientras el botón muestra la confirmación (1600 ms) */
  justAdded?: boolean;
  priority?: boolean;
}

export function ProductCard({
  product: p,
  isFavorite,
  onToggleFavorite,
  onAdd,
  justAdded = false,
  priority = false,
}: Props) {
  const badge = autoBadge(p);
  const soldOut = !p.inStock;

  return (
    <article className="od-card">
      <Link href={`/catalogo/${p.slug}`} className="od-card__link">
        <div className="od-card__media">
          <Image
            src={p.images[0].url}
            alt={p.images[0].alt}
            fill
            sizes="(max-width: 760px) 50vw, 280px"
            priority={priority}
            className="od-card__img"
            style={soldOut ? { opacity: 0.55 } : undefined}
          />
          {p.images[1] ? (
            <Image
              src={p.images[1].url}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 760px) 50vw, 280px"
              className="od-card__curtain"
            />
          ) : null}
          {badge ? <span className="od-card__badge">{badge}</span> : null}
        </div>

        <div className="od-card__foot">
          <p className="od-card__cat">{CATEGORY_LABEL[p.category]}</p>
          <h3 className="od-card__name">{p.name}</h3>
          <p className="od-card__price tnum">{money(p.price)}</p>
        </div>
      </Link>

      <button
        type="button"
        className="od-card__fav"
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        onClick={() => onToggleFavorite(p.sku)}
      >
        {isFavorite ? '♥' : '♡'}
      </button>

      <button type="button" className="od-card__action" onClick={() => onAdd(p.sku)}>
        {justAdded ? 'Agregado ✓' : addLabel(p)}
      </button>
    </article>
  );
}

/* product-card.css — estilos del hover, en CSS para que no vivan en JS

.od-card {
  position: relative;
  background: var(--color-neutral-100);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-card);
  transition: transform var(--dur-lift) var(--ease), box-shadow var(--dur-lift) var(--ease);
}
.od-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); }
.od-card__link { display: block; color: inherit; text-decoration: none; }
.od-card__media {
  position: relative; margin: 10px; aspect-ratio: 3 / 4.3;
  overflow: hidden; border-radius: calc(var(--radius-card) - 4px);
}
.od-card__img { object-fit: cover; transition: transform var(--dur-zoom) var(--ease); }
.od-card:hover .od-card__img { transform: scale(1.06); }
.od-card__curtain {
  object-fit: cover; transform: translateY(-100%);
  transition: transform var(--dur-slide) var(--ease);
}
.od-card:hover .od-card__curtain { transform: translateY(0); }
.od-card__badge {
  position: absolute; top: 12px; left: 12px; padding: 6px 12px;
  border-radius: var(--radius-pill); background: var(--color-accent-400);
  color: var(--color-accent-900); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
}
.od-card__fav {
  position: absolute; top: 18px; right: 18px; width: 34px; height: 34px;
  border: 0; border-radius: var(--radius-pill); background: rgba(253,252,249,0.86);
  color: var(--color-accent-700); font-size: 16px; cursor: pointer;
  transition: background var(--dur-color) var(--ease), transform var(--dur-color) var(--ease);
}
.od-card__fav:hover { background: var(--color-accent-100); transform: scale(1.08); }
.od-card__foot { display: grid; gap: 4px; padding: 14px 18px 20px; }
.od-card__cat { margin: 0; font-size: 13px; color: var(--color-neutral-600); }
.od-card__name { font-family: var(--font-heading); font-size: 18px; font-weight: 500; }
.od-card__price { margin: 0; font-variant-numeric: tabular-nums; text-align: right; }
.od-card__action {
  position: absolute; left: 10px; right: 10px; bottom: 10px;
  padding: 13px 0; border: 0; border-radius: var(--radius-pill);
  background: var(--color-neutral-900); color: var(--color-neutral-100);
  font-size: 13px; cursor: pointer;
  transform: translateY(calc(100% + 14px)); opacity: 0;
  transition: transform var(--dur-lift) var(--ease), opacity var(--dur-lift) var(--ease),
              background var(--dur-pill) var(--ease);
}
.od-card:hover .od-card__action,
.od-card:focus-within .od-card__action { transform: translateY(0); opacity: 1; }
.od-card__action:hover { background: var(--color-accent-700); }

@media (hover: none) {
  .od-card__action { position: static; transform: none; opacity: 1; margin: 0 10px 10px; }
  .od-card:hover { transform: none; box-shadow: none; }
}
*/
