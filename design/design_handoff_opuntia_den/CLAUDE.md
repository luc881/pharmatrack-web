# Reglas de trabajo — implementación de Opuntia Den

Lee este archivo antes de escribir código. Después: `PLAN.md`, luego `SPEC-VISTAS.md`.

## Objetivo

Recrear el rediseño de Opuntia Den en el proyecto **Next.js existente**, respetando sus patrones
actuales (App Router o Pages, según el repo), sus convenciones de carpetas y sus dependencias.
No introduzcas librerías nuevas sin necesidad real.

## Reglas duras

1. **No toques la lógica de negocio existente.** Checkout con Mercado Pago, cierre por WhatsApp y
   correos con Resend ya funcionan. Solo se reemplaza la capa visual y la estructura de vistas.
2. **Los tokens son la única fuente de color, tipografía y espaciado.** Copia `code/tokens.css` y
   consume `var(--*)` o las clases de Tailwind mapeadas en `code/tailwind.config.ts`.
   Nunca hardcodees un hex ni una familia tipográfica.
3. **Cero radios inventados.** La escala es 14 / 16 / 18 / 20 / 999px. Nada más.
4. **Una sola curva de easing:** `cubic-bezier(.22,1,.36,1)`. Duraciones permitidas: 350 / 400 / 450 /
   600 / 1100 ms (ver `SPEC-VISTAS.md` § Interacciones).
5. **Server Components por defecto.** Marca `"use client"` solo en componentes con estado o efectos
   (carrito, favoritos, filtros, carruseles, escenas 3D, hojas móviles).
6. **`prefers-reduced-motion`** desactiva marquee, autoavance de carrusel, zooms y las escenas 3D.
   Es requisito, no adorno.
7. **Todo el copy va en español de México**, tal como está en el prototipo. Extráelo a los archivos de
   `code/data/` o al CMS; no lo dejes incrustado en JSX.
8. Textos, precios y contadores con cifras usan `font-variant-numeric: tabular-nums`.

## Orden de trabajo

Sigue las fases de `PLAN.md` en orden. Al terminar cada fase, valida contra sus criterios de
aceptación antes de pasar a la siguiente. No empieces vistas nuevas con fases anteriores incompletas.

## Cómo leer el prototipo

`Opuntia Den.dc.html` usa un runtime de plantillas propio. Al leerlo:

- Los estilos en línea son la **especificación literal** (padding, grid, tamaños, colores).
- `{{ nombre }}` son valores calculados; su origen está en la clase `Component` al final del archivo
  (métodos `products()`, `shopVals()`, `renderVals()`). Ahí están las reglas de negocio del prototipo.
- `<sc-if>` / `<sc-for>` son condicionales y bucles → tradúcelos a JSX normal.
- `style-hover` / `style-active` son estados → tradúcelos a CSS (`:hover`, `:active`) o clases Tailwind.
- `data-m="..."` marca piezas que solo existen en móvil o solo en escritorio.
- `data-dark` marca secciones de fondo oscuro; la barra flotante invierte sus colores al cruzarlas.
- `image-slot` es un marcador de imagen del entorno de diseño → en producción es `next/image`.

## Definición de terminado

- Las 11 vistas existen como rutas reales con navegación por `next/link` (sin conmutador de vistas).
- Carrito y favoritos persisten en `localStorage` y se hidratan sin parpadeo.
- Lighthouse: CLS < 0.1; el hero no bloquea LCP (video con `poster` y `preload="none"` en móvil).
- Navegación por teclado completa y `:focus-visible` con el anillo de acento en todo elemento
  interactivo.
- Sin advertencias de hidratación en consola.
