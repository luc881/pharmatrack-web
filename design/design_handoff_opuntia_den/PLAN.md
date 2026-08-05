# Plan de implementación

Siete fases. Cada una es un commit (o varios) con criterios de aceptación verificables.

## Árbol de archivos objetivo

Adapta los nombres a las convenciones del repo si ya existen equivalentes. Si el repo usa Pages
Router, traduce `app/` a `pages/` conservando la misma división de componentes.

```
app/
  layout.tsx                    fuentes, tokens.css, <FloatingNav>, <Footer>, providers
  page.tsx                      Home
  catalogo/page.tsx             Catálogo (filtros por searchParams)
  catalogo/[slug]/page.tsx      Ficha (generateStaticParams + generateMetadata)
  articulos/page.tsx            Índice de notas
  articulos/[slug]/page.tsx     Artículo
  carrito/page.tsx              Carrito
  checkout/page.tsx             Checkout de 3 pasos (client)
  favoritos/page.tsx            Favoritos (client)
  criadero/page.tsx             El criadero
  envios/page.tsx               Envíos y entregas
  asesoria/page.tsx             Asesoría
  contacto/page.tsx             Contacto
  legal/page.tsx                Legal (con anclas por sección)
components/
  layout/floating-nav.tsx       barra flotante + inversión clara/oscura
  layout/marquee.tsx            cinta superior
  layout/mobile-nav.tsx         panel lateral (móvil)
  layout/tab-bar.tsx            barra inferior de 5 pestañas (móvil)
  layout/footer.tsx
  layout/search-overlay.tsx
  ui/pill.tsx                   el botón del sistema (todas las variantes)
  ui/arrow-button.tsx           flechas circulares 46/52px
  ui/kicker.tsx                 etiqueta en mayúsculas con tracking
  ui/quantity-stepper.tsx
  ui/toast.tsx
  ui/skeleton.tsx
  ui/sheet.tsx                  hoja inferior / panel lateral (móvil)
  product/product-card.tsx      tarjeta con cortina de imagen + ♡ + barra de acción
  product/product-grid.tsx
  product/gallery.tsx           imagen principal + miniaturas + zoom
  product/care-strip.tsx        tira de 6 datos de cuidados
  product/variant-picker.tsx
  catalog/filter-panel.tsx      categoría + nivel + precio
  catalog/sort-sheet.tsx
  catalog/active-chips.tsx
  cart/cart-drawer.tsx
  cart/cart-line.tsx
  cart/checkout-steps.tsx
  cart/order-summary.tsx        total fijo en móvil
  editorial/article-card.tsx
  editorial/article-carousel.tsx
  editorial/toc.tsx             índice pegajoso
  home/hero-video.tsx
  home/l-composition.tsx
  home/poster-band.tsx
  home/newsletter.tsx
  three/jar-scene.tsx           frasco (bloque oscuro del home)
  three/log-scene.tsx           tronco con musgo
  three/stack-scene.tsx         mesa de frascos
  three/use-three-scene.ts      montaje, resize, IntersectionObserver, dispose
hooks/
  use-cart.tsx                  provider + localStorage
  use-favorites.ts
  use-nav-theme.ts              inversión de la barra según secciones data-dark
  use-carousel.ts               autoavance con pausa al hover/focus
  use-media-query.ts
lib/
  format.ts                     money(), readingTime()
  filters.ts                    filtrado, orden, chips (lógica portada del prototipo)
  types.ts
data/                           seeds; se sustituyen por CMS/BD en la fase 7
  products.ts
  articles.ts
  site.ts
styles/
  tokens.css
```

## Fase 1 · Fundaciones

- Copia `code/tokens.css` a `styles/tokens.css` e impórtalo en el layout raíz.
- Fuentes con `next/font/google`: Playfair Display (300/400/500) y DM Sans (300/400/500) →
  expón las variables CSS `--font-heading` / `--font-body`.
- Fusiona `code/tailwind.config.ts` con el config existente (solo el bloque `theme.extend`).
- Copia `code/lib/format.ts` y `code/types.ts`.

**Aceptación:** una página en blanco con un h1 y un párrafo reproduce exactamente la tipografía y el
fondo del prototipo. Ningún hex en el código de la app.

## Fase 2 · Chrome global

- `floating-nav.tsx`, `marquee.tsx`, `footer.tsx`, `mobile-nav.tsx`, `tab-bar.tsx`,
  `search-overlay.tsx`, `toast.tsx`.
- `use-nav-theme.ts`: `IntersectionObserver` sobre las secciones marcadas `data-dark`; la barra
  invierte fondo, texto, bordes y las píldoras de contador.
- Las 11 rutas existen como stubs con su `<h1>` y el chrome montado.

**Aceptación:** navegación completa entre las 11 rutas por teclado y por la barra inferior en móvil;
la barra se invierte al cruzar cualquier sección oscura; el marquee se detiene con
`prefers-reduced-motion`.

## Fase 3 · Sistema de producto

- `code/data/products.ts` como fuente temporal.
- `pill.tsx`, `product-card.tsx`, `product-grid.tsx`, `skeleton.tsx`.
- Hover de tarjeta: cortina de imagen hacia abajo, corazón arriba a la derecha, barra de acción
  inferior. En touch, la barra de acción es visible siempre (no hay hover).

**Aceptación:** la rejilla del catálogo iguala el prototipo en escritorio y a dos columnas en móvil,
con imágenes proporcionadas y skeleton mientras cargan.

## Fase 4 · Catálogo y ficha

- `lib/filters.ts` portado de `shopVals()` del prototipo (ver § Reglas de negocio).
- Filtros en `searchParams` (`?cat=iso&nivel=int&orden=asc`) para que sean compartibles y
  server-renderizables; `shown` (paginación “Cargar más”) es estado de cliente.
- Ficha: galería, tira de cuidados, taxonomía, variantes, cantidad 1–9, añadir al carrito con
  confirmación en el botón, bloques de confianza, “Suele ir con”.

**Aceptación:** los contadores de resultados coinciden con los del prototipo (14 / 8 / 6 según
categoría); los chips activos limpian su propio filtro; la ficha es estática por `slug` con metadata
propia.

## Fase 5 · Carrito, favoritos y checkout

- `use-cart.tsx` y `use-favorites.ts` (`code/hooks/`) con persistencia en `localStorage`.
- Cajón de carrito, líneas con +/−/eliminar, resumen y checkout de 3 pasos.
- El paso final conecta con el flujo de Mercado Pago **ya existente**: no lo reimplementes,
  solo pásale las líneas y el envío elegido.

**Aceptación:** el carrito sobrevive a un refresh; el total fijo en móvil no tapa el último campo;
`placeOrder` delega en el endpoint de pago existente.

## Fase 6 · Editorial y 3D

- Artículos: tarjetas, carrusel con autoavance de 8 s (pausa al hover/focus), índice pegajoso,
  cita con filete de acento, tabla de referencia.
- Tres escenas three.js con `use-three-scene.ts`: importación dinámica, montaje solo si el
  contenedor es visible y el viewport ≥ 700px, `dispose()` al desmontar, sin render fuera de pantalla.

**Aceptación:** las escenas no se descargan en móvil ni con motion reducido; no hay fugas de WebGL al
navegar entre rutas (verifica el contador de contextos).

## Fase 7 · Datos reales

- Sustituye `data/*.ts` por el CMS/BD según `API-CONTRACT.md`.
- ISR o revalidación por webhook para catálogo y artículos.
- Sustituye las imágenes de Wikimedia por fotografía propia y sube el video del hero.

**Aceptación:** ninguna URL de `commons.wikimedia.org` en el bundle; stock y precios vienen de la BD.

## Reglas de negocio a portar literalmente

Del prototipo (`shopVals()`), para que la implementación coincida:

- **Precio**: `$1,450 MXN` → `'$' + n.toLocaleString('es-MX') + ' MXN'`.
- **Envío**: CDMX `0` (gratis, entrega en persona) · zona metropolitana `120` · nacional `380`.
- **Badge automático**: si no hay badge manual y `qty <= 6` → `"Quedan N"`. Si `stock === 0` →
  `"Agotado"` y el botón dice `"Avísame"` (lleva a `/envios`).
- **Nota de stock**: `qty <= 6` → `"Quedan N — se reabastece cada 3 – 4 semanas."`;
  `stock === 0` → `"Sin fecha de reingreso confirmada."`; si no, `"Disponible ahora."`.
- **Variantes de ficha**: Trío de prueba `+0` · Paquete de 6 `+220` · Colonia de 12 `+640`.
- **Orden**: `rel` (por defecto, orden de la fuente) · `asc` · `desc` · `stock` (disponibles primero).
- **Búsqueda**: se activa a partir de 2 caracteres; busca en nombre + nombre científico + SKU.
- **Paginación**: 8 productos iniciales, +6 por clic en “Cargar más (N)”.
- **Cantidad**: 1–9 en la ficha; en el carrito, bajar de 1 elimina la línea.
- **Toast**: 2600 ms. Pulso del contador del carrito: 700 ms. Etiqueta “Agregado ✓”: 1600 ms.
