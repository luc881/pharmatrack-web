# Handoff: Opuntia Den — rediseño web (home, catálogo, ficha, artículo)

## Overview
Rediseño completo del sitio público de **Opuntia Den**, tienda de invertebrados de colección
(isópodos, sustratos y accesorios) con entrega en persona en CDMX. El objetivo fue pasar de la
estética cálida/verde botánica actual a una dirección editorial, minimalista y aspiracional,
inspirada estructuralmente en luminaireauthentik.com.

La lógica de negocio YA EXISTE en el proyecto Next.js del cliente (checkout con Mercado Pago,
cierre alternativo por WhatsApp, correos transaccionales con Resend). **Esta entrega es solo la
capa visual/estructural**: no rediseña ni reimplementa esa lógica.

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — prototipos que
muestran la apariencia y el comportamiento buscados, no código de producción para copiar tal cual.
La tarea es **recrear estos diseños dentro del entorno existente del proyecto** (Next.js + React),
usando sus patrones, componentes y convenciones actuales. El HTML usa un runtime de plantillas
propio del entorno donde se diseñó; su markup y sus estilos en línea sirven como especificación
exacta de layout, tipografía, color y estados, no como archivos a importar.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciado, radios, transiciones y estados están
definidos y deben recrearse con precisión usando los componentes del codebase.

## Screens / Views
El prototipo agrupa cuatro vistas en un solo archivo, conmutables con la barra flotante inferior
derecha (ese conmutador es andamiaje del prototipo — **no** forma parte del diseño).

### 1. Home
Ruta sugerida: `/`

Orden de secciones:

1. **Barra fija superior (marquee + nav).** Un contenedor `position: fixed; top:0` que agrupa dos
   piezas para que viajen juntas al hacer scroll:
   - *Marquee*: fondo `--color-neutral-900`, texto `--color-neutral-200`, 13px, padding 11px 0,
     desplazamiento infinito `translateX(0 → -50%)` en 26s lineal. Contenido duplicado 2× para el bucle.
   - *Nav flotante*: barra a 18px de los bordes, fondo `color-mix(in srgb, var(--color-bg) 94%, transparent)`
     con `backdrop-filter: blur(10px)`, borde 1px `--color-divider`, radio 20px, sombra `--shadow-sm`,
     `overflow: hidden`. Grid de 3 pistas `minmax(0,auto) minmax(0,1fr) minmax(0,auto)`.
     Izquierda: botón Menú (hamburguesa de 3 líneas de 1px, ancho 20px, gap 4px) + Mayoreo + Asesoría,
     separados por bordes verticales de 1px. Centro: marca `OPUNTIA DEN`, serif 21px,
     letter-spacing .3em, mayúsculas. Derecha: Buscar · "ES · MXN" · Favoritos · Carrito, cada uno con
     separador vertical; los contadores son círculos de 22px, fondo `--color-neutral-900`, texto 11px tabular.
     Celdas 13px con `white-space: nowrap` y padding 16px 14-16px.
     Hover de enlaces: color `--color-accent-700` + subrayado que crece de 0% a 100% (truco de
     `background-image: linear-gradient(currentColor, currentColor)` + `background-size` animado 450ms).

2. **Hero a pantalla completa (video).** `height: 100vh`, `overflow: hidden`. El fondo es un
   **video** `autoplay muted loop playsinline` con `object-fit: cover` (en el prototipo es un
   placeholder de imagen). Encima: degradado `linear-gradient(180deg, rgba(32,31,29,.44), rgba(32,31,29,.16) 42%, rgba(32,31,29,.52))`.
   Contenido centrado: kicker 12px / letter-spacing .3em / mayúsculas, título display serif
   `clamp(48px, 7.4vw, 122px)`, weight 300, line-height 1.0, color #f6f4f1; píldora clara "Ver catálogo"
   (radio 999px, padding 16px 36px). Abajo al centro, la palabra "Desliza" en 11px con tracking .24em.

3. **Composición en L.** Grid `minmax(0,1.02fr) minmax(0,1fr)` × 2 filas, gap 16px, padding 90px 18px 0.
   - Celda izquierda: imagen que ocupa las dos filas, `aspect-ratio: 3/4`, radio 16px.
   - Celda superior derecha: bloque de texto (kicker terracota + titular serif `clamp(38px,3.9vw,66px)`,
     máx. 16 caracteres de ancho) y, abajo, píldora oscura "Descubrir" + contador "01 / 02" + dos flechas
     circulares de 46px.
   - Celda inferior derecha: imagen `aspect-ratio: 16/10`.
   Las dos imágenes forman la L que encierra el texto. Las flechas alternan entre dos mensajes (carrusel de 2).

4. **Sección de marca.** Dos columnas. Izquierda: titular serif `clamp(32px,3.6vw,58px)`, píldora oscura
   "Ver el catálogo", y una imagen chica desplazada (`margin: 90px 0 0 22%; width: 62%`, cuadrada).
   Derecha: imagen grande `aspect-ratio: 4/5` con `margin-top: 60px` y un recuadro blanco encajado
   abajo a la izquierda (150×150, padding 10px, fondo `--color-neutral-100`, sombra `--shadow-sm`).

5. **Póster a sangre.** Fondo `--color-accent-900` (#2f2620), padding 130px 32px, texto centrado.
   Titular serif `clamp(38px,5.4vw,84px)` en #eae7e7, máx. 20 caracteres de ancho. Dos píldoras:
   una clara sólida y una de contorno `rgba(234,231,231,.5)`.

6. **Selección de isópodos.** Titular centrado `clamp(34px,4.4vw,66px)`. Grid
   `repeat(auto-fit, minmax(230px,1fr))`, gap 18px. Tarjeta: fondo `--color-neutral-100`,
   borde 1px `--color-divider`, radio 16px; imagen interior con `margin: 10px`, `aspect-ratio: 3/4.3`,
   `overflow: hidden`; badge "Nuevo" (píldora, fondo `--color-accent-400`, texto `--color-accent-900`)
   arriba a la izquierda; corazón ♡ arriba a la derecha; pie con categoría 13px gris, nombre serif 18px
   y precio tabular alineado a la derecha. Hover: `translateY(-8px)` + `--shadow-md` en 450ms
   `cubic-bezier(.22,1,.36,1)`; la imagen hace zoom a 1.06 en 1100ms.
   Debajo, píldora oscura "Ver más" centrada.

7. **Divisor de pago (a sangre).** `min-height: 66vh`, imagen de fondo con velo `rgba(32,31,29,.5)`.
   Titular serif `clamp(32px,4.2vw,58px)` + párrafo + píldora clara. Copy: "Pago con Mercado Pago o
   cierre por WhatsApp".

8. **Carrusel de divulgación** (`id="divulgacion"`). Grid `minmax(280px,.85fr) minmax(0,1.15fr)`.
   Izquierda: titular + contador "01 / 04", párrafo, píldora "Ver todos" y, abajo, dos flechas de 52px
   (la de retroceso sólida oscura, la de avance de contorno). Derecha: dos tarjetas de artículo
   (imagen 4/5, kicker "ART-002 · Bioactivo" en terracota tabular, titular serif 21px, minutos de lectura).
   **Avanza solo cada 5.2s** y entra desde la derecha (`translateX(56px) → 0`, opacidad 0 → 1, 600ms).

9. **Suscripción** (compartida). Fondo `--color-neutral-100`, campo de correo + botón; al enviar se
   sustituye por un mensaje de confirmación en serif 24px.

10. **Pie** (compartido). Cuatro columnas: marca, Tienda, Compra, Legal; línea inferior con © y redes.

### 2. Catálogo
Ruta sugerida: `/catalogo`. Cabecera con miga de pan, título display y bajada. Cuerpo en dos columnas:
barra lateral de 232px (control segmentado de categoría — Todo / Isópodos / Sustratos y accesorios —,
casillas de nivel y rango de precio) y rejilla `repeat(auto-fit, minmax(240px,1fr))` con gap 44px 28px.
El filtro de categoría **funciona** y el contador de resultados se actualiza (14 / 08 / 06).

### 3. Ficha de producto
Ruta sugerida: `/catalogo/[slug]`. Estructura:
- Miga de pan: Inicio / Catálogo / Isópodos / nombre.
- Dos columnas `minmax(0,1.08fr) minmax(0,1fr)`, gap 48px, columna derecha `position: sticky; top: 100px`.
  Izquierda: imagen principal 4/5 con contador "1 / 3" en píldora oscura translúcida abajo a la derecha,
  y tres miniaturas cuadradas debajo (el borde vira a acento en hover; cambian la principal).
  Derecha: etiqueta de categoría, H1 display `clamp(36px,4.4vw,62px)`, nombre científico en cursiva,
  descripción, lista Grupo / Disponibilidad / Formato, precio serif 40px, selector de cantidad en píldora,
  botón principal (56px de alto, radio 999px, oscuro; hover terracota + `translateY(-2px)`),
  nota de entrega, botón WhatsApp de contorno + ♡ + ↗ circulares, y tres bloques de confianza
  separados por filetes (Entrega en persona / Garantía de llegada con vida / Entregas por cita).
- **Ficha de cuidados**: tira de 6 columnas en un contenedor con borde, radio 18px y `overflow: hidden`;
  fondos alternos `--color-neutral-200` / `--color-accent-100`; cada celda con etiqueta 10px en
  mayúsculas y valor serif 22px. Campos: Origen, Temperatura, Humedad, Tamaño, Dificultad, Rareza.
- Dos columnas `minmax(0,1.5fr) minmax(280px,.75fr)`: a la izquierda "Descripción general" y
  "Hábitat y comportamiento" (kicker en mayúsculas con filete inferior + párrafos de 16px/1.85);
  a la derecha tarjetas de Taxonomía (tabla de 5 filas), Distribución / origen y Etiquetas (píldoras).
- "Suele ir con": cuatro tarjetas de producto verticales con el mismo hover de elevación.

### 4. Artículo
Ruta sugerida: `/articulos/[slug]`. Encabezado centrado (kicker con código, H1 display, bajada, firma y
tiempo de lectura), imagen 16/9 a lo ancho, y cuerpo en dos columnas: índice pegajoso de 200px a la
izquierda y texto de 16-17px con medida máxima de 68 caracteres. Incluye cita con filete de acento a la
izquierda y una tabla de referencia rápida encuadrada. Cierra con "Especies mencionadas" (4 tarjetas).

## Interactions & Behavior
- **Navegación**: barra fija en el home (viaja con el marquee); pegajosa (`top: 0`) en catálogo, ficha y artículo.
- **Carrusel de artículos**: automático cada 5200ms, con flechas manuales; entrada `odSlide` 600ms `cubic-bezier(.22,1,.36,1)`.
- **Carrusel del hero en L**: manual, dos mensajes, transición `odFade` 500ms.
- **Galería de ficha**: las miniaturas cambian la imagen principal y el contador.
- **Cantidad**: límites 1–9. **Añadir al carrito**: cambia el rótulo a "Agregado ✓".
- **Filtro de catálogo**: control segmentado; muestra/oculta grupos y actualiza el contador.
- **Suscripción**: al enviar, sustituye el formulario por la confirmación.
- **Hovers** (todos en CSS, portables tal cual):
  - Imágenes: `transform: scale(1.06)`, 1100ms `cubic-bezier(.22,1,.36,1)`, recortadas por el contenedor con `overflow: hidden`.
  - Tarjetas: `translateY(-8px)` + `--shadow-md`, 450ms.
  - Píldoras: fondo → `--color-accent-700` y `translateY(-3px)`, 400ms.
  - Flechas: `scale(1.08)`, borde y texto en acento, fondo `--color-accent-100`, 350ms.
  - Enlaces de la barra: subrayado animado por `background-size`, 450ms.
- **Movimiento pendiente para desarrollo** (no está en el prototipo, se recomienda): revelados al hacer
  scroll y parallax suave del hero. Sugerido con Framer Motion o GSAP ScrollTrigger.
- **Accesibilidad**: respetar `prefers-reduced-motion` (desactivar marquee, autoavance y zooms).

## State Management
Estado local de la vista (no hay datos remotos en el prototipo):
- `gal` (0-2) — imagen activa de la galería.
- `qty` (1-9) — cantidad.
- `added` (bool) — rótulo del botón de carrito.
- `cat` ('all' | 'iso' | 'acc') — filtro de catálogo.
- `art` (0-1) — página del carrusel de artículos (avance automático por `setInterval`, limpiar al desmontar).
- `heroC` (0-1) — mensaje del hero en L.
- `sub` (bool) — suscripción enviada.

En producción, el catálogo, la ficha y los artículos deben venir del CMS/BD; el carrito y el checkout ya
existen (Mercado Pago) y solo cambian de piel.

## Design Tokens

Color (paleta cálida, sustituye a la anterior verde/gold):
| Token | Valor |
| --- | --- |
| `--color-bg` | #e9e3d8 |
| `--color-surface` | #ddd6c8 |
| `--color-text` | #3a322b |
| `--color-accent` | #9c5a33 |
| `--color-divider` | rgba(58,50,43,.17) |
| neutral 100→900 | #fdfcf9 · #f0ebe0 · #ddd6c8 · #c3b9a8 · #a1968a · #7d7469 · #5e574e · #453f38 · #332d27 |
| accent 100→900 | #f7ece0 · #eed7bd · #dfb587 · #cf9553 · #b87738 · #9c5a33 · #86482a · #63341e · #2f2620 |

Sombras: `--shadow-sm: 0 1px 2px rgba(45,43,43,.14)` · `--shadow-md: 0 3px 10px rgba(45,43,43,.16)` ·
`--shadow-lg: 0 12px 32px rgba(45,43,43,.22)`.

Tipografía:
- Titulares: **Playfair Display** (300 / 400 / 500), `--font-heading`. Los tamaños display van en weight 300.
- Cuerpo e interfaz: **DM Sans** (300 / 400 / 500), `--font-body`, base 15px / line-height 1.7.
- Kickers: 10-13px, mayúsculas, letter-spacing .16em–.30em.
- Cifras: `font-variant-numeric: tabular-nums` en precios, contadores y tablas.
- Nota: son las equivalencias libres de las tipografías comerciales de la referencia; si se licencian
  otras, basta cambiar las dos variables.

Radios: 14px (controles, campos, tarjetas menores) · 16px (imágenes y tarjetas) · 18px (tira de cuidados) ·
20px (barra de navegación) · 999px (píldoras, flechas, badges, contadores).

Espaciado: secciones de 90–130px verticales, 18px de margen lateral en el home y 40px en las vistas
interiores; gaps de 16-18px en rejillas de imagen y 22-28px en rejillas de producto.

Transiciones: 350ms (color/borde) · 400-450ms (elevación, píldoras) · 600ms (entrada de carrusel) ·
1100ms (zoom de imagen). Curva estándar `cubic-bezier(.22,1,.36,1)`.

## Assets
- **Fotografía**: el prototipo usa imágenes de Wikimedia Commons **solo como marcador de posición**
  (isópodos, terrarios, hojarasca, musgo). Tienen licencia Creative Commons y **deben sustituirse por
  fotografía propia** antes de publicar. Cada hueco de imagen está marcado con un texto que describe qué
  va ahí.
- **Video del hero**: pendiente. Formato recomendado: mp4 H.264 + webm, 1920×1080, sin audio, en bucle,
  con póster estático para la primera pintura.
- **Iconografía**: mínima y textual por decisión de diseño (Buscar, Favoritos, Carrito). Los pocos glifos
  (♡ ↗ ← →) pueden sustituirse por iconos de Lucide manteniendo tamaño y peso de trazo.
- **Tipografías**: Playfair Display y DM Sans desde Google Fonts.

## Files
- `Opuntia Den.dc.html` — el prototipo completo (home, catálogo, ficha, artículo).
- `image-slot.js` — componente de marcador de imagen usado por el prototipo; **no se transporta** al proyecto real.
- `styles.css` — hoja de tokens del sistema de diseño base; la paleta y las tipografías finales están
  sobrescritas en el bloque `:root` del propio prototipo (ver Design Tokens).

## Fuera de alcance
- Lógica de checkout, pagos y correos (ya implementada: Mercado Pago + Resend).
- Versión en inglés: el conmutador ES/EN es visual; falta el contenido traducido.
- Vistas de carrito, favoritos, login y páginas legales.
