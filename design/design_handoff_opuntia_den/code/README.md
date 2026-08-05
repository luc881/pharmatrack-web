# `code/` — archivos para copiar al repo

Dónde va cada archivo. Ajusta rutas si el repo usa otras convenciones, pero conserva la división.

| Archivo | Destino sugerido | Notas |
| --- | --- | --- |
| `tokens.css` | `styles/tokens.css` | importar en el layout raíz, antes de Tailwind |
| `tailwind.config.ts` | fusionar con el config existente | solo `theme.extend` |
| `types.ts` | `lib/types.ts` | tipos canónicos del dominio |
| `lib/format.ts` | `lib/format.ts` | precio, badges, filtros, búsqueda |
| `data/products.ts` | `data/products.ts` | seed; se reemplaza en la fase 7 |
| `data/articles.ts` | `data/articles.ts` | seed |
| `data/site.ts` | `data/site.ts` | nav, pie, zonas, copy del hero, FAQ |
| `hooks/use-cart.tsx` | `hooks/use-cart.tsx` | provider; montar en el layout raíz |
| `hooks/use-favorites.ts` | `hooks/use-favorites.ts` | |
| `hooks/use-nav-theme.ts` | `hooks/use-nav-theme.ts` | requiere `data-dark` en las secciones oscuras |
| `hooks/use-carousel.ts` | `hooks/use-carousel.ts` | |
| `hooks/use-three-scene.ts` | `components/three/use-three-scene.ts` | necesita `npm i three @types/three` |
| `components/pill.tsx` | `components/ui/pill.tsx` | el botón del sistema |
| `components/marquee.tsx` | `components/layout/marquee.tsx` | |
| `components/product-card.tsx` | `components/product/product-card.tsx` | el CSS del hover va al final del archivo |
| `components/care-strip.tsx` | `components/product/care-strip.tsx` | |

## Convenciones

- Los componentes traen su CSS en un bloque comentado al final: muévelo a un `.css` o tradúcelo a
  Tailwind, pero **no lo dejes como estilos en línea** — los hovers no funcionan así.
- `'use client'` solo donde ya está puesto. Todo lo demás es Server Component.
- Ningún archivo importa datos remotos: los seeds son inyectables, así que al llegar el CMS solo
  cambia el origen, no los componentes.
