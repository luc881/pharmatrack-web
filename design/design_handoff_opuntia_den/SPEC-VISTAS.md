# Especificación por vista

Los valores son literales del prototipo. Donde dice `var(--x)`, el token está en `code/tokens.css`.

## Chrome global

### Cinta (marquee)
Fondo `--color-neutral-900`, texto `--color-neutral-200`, 13px, padding 11px 0, desplazamiento
infinito `translateX(0 → -50%)` en 26 s lineal, contenido duplicado 2× para el bucle. Se detiene con
`prefers-reduced-motion`.

### Barra flotante
A 18px de los bordes, radio 20px, borde 1px, `backdrop-filter: blur(10px)`, sombra `--shadow-sm`,
`overflow: hidden`. Grid de 3 pistas `minmax(0,auto) minmax(0,1fr) minmax(0,auto)`.
Izquierda: botón Menú (hamburguesa de 3 líneas de 1px, ancho 20px, gap 4px) + Mayoreo + Asesoría.
Centro: `OPUNTIA DEN`, serif 21px, `letter-spacing: .3em`, mayúsculas.
Derecha: Buscar · `ES · MXN` · Favoritos · Carrito. Contadores en círculos de 22px, 11px tabular.
Celdas de 13px con `white-space: nowrap`, padding 16px 14–16px, separadas por bordes verticales de 1px.

**Inversión automática** (`use-nav-theme.ts`): mientras una sección `data-dark` cruza la banda
`top < 104px && bottom > 58px`, la barra usa:

| | sobre claro | sobre oscuro |
| --- | --- | --- |
| fondo | `rgba(28,26,24,0.9)` | `rgba(246,244,241,0.94)` |
| texto | `--color-neutral-100` | `--color-text` |
| borde | `rgba(240,235,224,0.24)` | `--color-divider` |
| contador | fondo `--color-neutral-100` / texto `--color-neutral-900` | invertido |

Hover de enlaces: color `--color-accent-700` + subrayado que crece de 0 % a 100 % —
`background-image: linear-gradient(currentColor, currentColor)` con `background-size` animado 450 ms.

### Pie
Cuatro columnas: marca, Tienda, Compra, Legal. Línea inferior con © y redes.

### Móvil (< 760px)
- Barra lateral de menú: `width: min(88vw, 390px)`, entra con `translateX(-100%) → 0` en 360 ms.
- Barra inferior fija de 5 pestañas (Inicio, Catálogo, Buscar, Favoritos, Carrito), 66px de alto,
  `body { padding-bottom: 66px }`. Todos los blancos táctiles ≥ 44px.
- Hoja inferior para ordenar y panel lateral para filtros (`translateY(100%) → 0`, 360 ms).
- Rejillas a dos columnas; imágenes con `aspect-ratio` fijo para no provocar CLS.
- Total del checkout fijo al fondo, por encima de la barra de pestañas.

## 1 · Home (`/`)

1. **Hero a pantalla completa.** `height: 100vh`, `overflow: hidden`. Video de fondo
   `autoplay muted loop playsinline`, `object-fit: cover`, con `poster`. Velo
   `linear-gradient(180deg, rgba(32,31,29,.44), rgba(32,31,29,.16) 42%, rgba(32,31,29,.52))`.
   Kicker 12px `.3em` mayúsculas; título serif `clamp(48px, 7.4vw, 122px)` weight 300,
   `line-height: 1.0`, color `#f6f4f1`; píldora clara “Ver catálogo” (radio 999px, padding 16px 36px).
   Al centro-abajo, “Desliza” en 11px con tracking `.24em`.
2. **Divisor de marquesina.** Cinta de texto a sangre entre el hero y el contenido.
3. **Composición en L.** Grid `minmax(0,1.02fr) minmax(0,1fr)` × 2 filas, gap 16px,
   padding 90px 18px 0. Izquierda: imagen a dos filas, `aspect-ratio: 3/4`, radio 16px.
   Arriba a la derecha: kicker terracota + titular serif `clamp(38px,3.9vw,66px)` (máx. 16ch),
   píldora oscura “Descubrir”, contador `01 / 02` y dos flechas circulares de 46px (carrusel de 2
   mensajes, transición `odFade` 500 ms). Abajo a la derecha: imagen `aspect-ratio: 16/10`.
4. **Sección de marca.** Dos columnas. Izquierda: titular serif `clamp(32px,3.6vw,58px)`, píldora
   oscura “Ver el catálogo” e imagen chica desplazada (`margin: 90px 0 0 22%; width: 62%`, cuadrada).
   Derecha: imagen `aspect-ratio: 4/5` con `margin-top: 60px` y un recuadro blanco encajado abajo a la
   izquierda (150×150, padding 10px, fondo `--color-neutral-100`, sombra `--shadow-sm`).
5. **Bloque oscuro del frasco (3D).** `data-dark`. Escena `jar-scene`: frasco de vidrio con bandeja,
   sustrato y hojarasca; lista numerada de ingredientes a un lado (01 Sustrato húmedo, 02…).
6. **Póster a sangre.** Fondo `--color-accent-900`, padding 130px 32px, centrado. Titular serif
   `clamp(38px,5.4vw,84px)` en `#eae7e7` (máx. 20ch). Dos píldoras: una clara sólida y una de contorno
   `rgba(234,231,231,.5)`. `data-dark`.
7. **Selección de isópodos.** Titular centrado `clamp(34px,4.4vw,66px)`. Grid
   `repeat(auto-fit, minmax(230px,1fr))`, gap 18px. Píldora oscura “Ver más” centrada debajo.
8. **Divisor de pago (a sangre).** `min-height: 66vh`, imagen de fondo con velo `rgba(32,31,29,.5)`,
   titular serif `clamp(32px,4.2vw,58px)` + párrafo + píldora clara. Copy: “Pago con Mercado Pago o
   cierre por WhatsApp”. `data-dark`.
9. **Carrusel de divulgación.** Grid `minmax(280px,.85fr) minmax(0,1.15fr)`. Izquierda: titular,
   contador `01 / 04`, párrafo, píldora “Ver todos” y dos flechas de 52px (retroceso sólida oscura,
   avance de contorno). Derecha: dos tarjetas de artículo (imagen 4/5, kicker
   `ART-002 · Bioactivo` en terracota tabular, titular serif 21px, minutos de lectura).
   **Autoavance cada 8000 ms**, entrada `odSlide` (`translateX(56px) → 0`, opacidad 0 → 1, 600 ms).
   Se pausa con hover/foco y con motion reducido.
10. **Suscripción.** Fondo `--color-neutral-100`, campo de correo + botón; al enviar, el formulario se
    reemplaza por una confirmación en serif 24px. Validación: correo inválido marca el campo en error.
11. **Pie.**

### Tarjeta de producto (usada en 4 vistas)
Fondo `--color-neutral-100`, borde 1px `--color-divider`, radio 16px. Imagen interior con
`margin: 10px`, `aspect-ratio: 3/4.3`, `overflow: hidden`. Badge “Nuevo” arriba a la izquierda
(píldora, fondo `--color-accent-400`, texto `--color-accent-900`); corazón ♡/♥ arriba a la derecha.
Pie: categoría 13px gris, nombre serif 18px, precio tabular a la derecha.
Hover: `translateY(-8px)` + `--shadow-md` en 450 ms; la segunda imagen baja como cortina y la barra de
acción (“Añadir al carrito”) sube desde el borde inferior; zoom de imagen a 1.06 en 1100 ms.
Agotado: imagen al 55 % de opacidad, badge “Agotado”, acción “Avísame”.

## 2 · Catálogo (`/catalogo`)
Cabecera con miga de pan, título display y bajada. Cuerpo en dos columnas: barra lateral de 232px
(control segmentado de categoría — Todo / Isópodos / Sustratos y accesorios —, radios de nivel y
rango de precio 100–2200) y rejilla `repeat(auto-fit, minmax(240px,1fr))` con gap 44px 28px.
Barra superior de resultados: contador (`N resultados`), chips activos con “×” y selector de orden.
Vacío: mensaje + botón “Limpiar filtros”. Móvil: botones “Filtros (N)” y “Ordenar” que abren panel y
hoja.

## 3 · Ficha (`/catalogo/[slug]`)
Miga de pan: Inicio / Catálogo / Isópodos / nombre.
Dos columnas `minmax(0,1.08fr) minmax(0,1fr)`, gap 48px; la derecha `position: sticky; top: 100px`.

- **Izquierda:** imagen principal 4/5 con contador `1 / 3` en píldora oscura translúcida abajo a la
  derecha (clic → zoom a pantalla completa) y tres miniaturas cuadradas debajo (borde vira a acento en
  hover; cambian la principal).
- **Derecha:** etiqueta de categoría, H1 display `clamp(36px,4.4vw,62px)`, nombre científico en
  cursiva, descripción, lista Grupo / Disponibilidad / Formato, selector de variante (3 opciones),
  precio serif 40px, selector de cantidad en píldora (1–9), botón principal (56px de alto, radio 999px,
  oscuro; hover terracota + `translateY(-2px)`; al añadir cambia a “Agregado ✓” 1600 ms), nota de
  entrega y de stock, botón WhatsApp de contorno + ♡ + ↗ circulares, y tres bloques de confianza
  separados por filetes (Entrega en persona / Garantía de llegada con vida / Entregas por cita).
- **Tira de cuidados:** 6 columnas en contenedor con borde, radio 18px, `overflow: hidden`; fondos
  alternos `--color-neutral-200` / `--color-accent-100`; cada celda con etiqueta 10px mayúsculas
  `.2em` y valor serif 22px. Campos: Origen · Temperatura · Humedad · Tamaño · Dificultad · Rareza.
  Solo se muestra si `category === 'iso'`. En móvil, 2 columnas × 3 filas.
- **Cuerpo:** dos columnas `minmax(0,1.5fr) minmax(280px,.75fr)`. Izquierda: “Descripción general” y
  “Hábitat y comportamiento” (kicker mayúsculas con filete inferior + párrafos 16px/1.85). Derecha:
  tarjetas de Taxonomía (tabla de 5 filas), Distribución / origen y Etiquetas (píldoras).
- **“Suele ir con”:** cuatro tarjetas de producto.

## 4 · Artículo (`/articulos/[slug]`)
Encabezado centrado (kicker con código `ART-00N · Sección`, H1 display `clamp(36px,5vw,68px)`, bajada
17px máx. 54ch, firma y tiempo de lectura), imagen 16/9 a lo ancho y cuerpo en dos columnas: índice
pegajoso de 200px a la izquierda (marca la sección activa en `--color-accent-700`) y texto de 16–17px
con medida máxima de 68ch. Incluye cita con filete de acento a la izquierda y una tabla de referencia
encuadrada. Cierra con “Especies mencionadas” (4 tarjetas).

## 5 · Carrito y checkout (`/carrito`, `/checkout`)
Líneas con miniatura, nombre, nombre científico, precio unitario, stepper +/−, total de línea y
eliminar. Resumen: subtotal, envío (según zona), total. Vacío: ilustración/kicker + píldora “Ver
catálogo”.
**Checkout en 3 pasos** (`step` 0–2, más 3 = confirmación): 1) Datos de contacto, 2) Entrega — zona
(CDMX / metropolitana / nacional) con su costo y el mapa de zona de entrega, 3) Pago — resumen +
Mercado Pago o cierre por WhatsApp. Indicador de pasos arriba; “Atrás” siempre disponible. El paso 3
vacía el carrito y muestra la confirmación con número de pedido.
El cajón lateral de carrito se abre al añadir cualquier producto.

## 6 · Favoritos (`/favoritos`)
Misma rejilla del catálogo, filtrada por favoritos. Vacío: “Aún no guardas nada” + píldora al catálogo.

## 7 · Criadero (`/criadero`)
Kicker “El criadero”, H1 `clamp(34px,4.6vw,68px)`, párrafo de 62ch. Fila de tres cifras
(6 · Mismo día · Ficha propia) en serif 40px con su glosa. Escena 3D del tronco con musgo
(`log-scene`), tira de fotografía del taller y bloque de proceso.

## 8 · Envíos (`/envios`)
Tres columnas: Días de salida · Empaque · Garantía de llegada con vida. Tabla de zonas y costos.
Mapa de zona de entrega. Acordeón de preguntas frecuentes sobre fauna en fondo oscuro (`data-dark`).

## 9 · Asesoría (`/asesoria`)
Oferta de acompañamiento: qué incluye, para quién, cómo se agenda. Formulario corto (nombre, correo,
especie de interés, nivel) + cierre por WhatsApp.

## 10 · Contacto (`/contacto`)
Formulario (nombre, correo, mensaje) con validación de correo, datos de contacto, horario de entregas
por cita y enlace a WhatsApp.

## 11 · Legal (`/legal`)
Índice lateral pegajoso + secciones ancladas: aviso de privacidad, términos, política de garantía de
llegada con vida, política de envíos. Medida de 68ch.

## Interacciones

| Elemento | Efecto | Duración |
| --- | --- | --- |
| Imágenes | `scale(1.06)`, recortadas por `overflow: hidden` | 1100 ms |
| Tarjetas | `translateY(-8px)` + `--shadow-md` | 450 ms |
| Cortina de imagen | segunda imagen entra desde arriba | 600 ms |
| Píldoras | fondo → `--color-accent-700`, `translateY(-3px)` | 400 ms |
| Flechas | `scale(1.08)`, borde y texto en acento, fondo `--color-accent-100` | 350 ms |
| Enlaces de la barra | subrayado por `background-size` | 450 ms |
| Entrada de carrusel | `odSlide` | 600 ms |
| Fundido de mensajes | `odFade` | 500 ms |
| Skeleton | `odShimmer` en bucle | — |
| Hojas móviles | `odSlideUp` / `odSlideL` | 360 ms |

Curva única: `cubic-bezier(.22,1,.36,1)`.

**Estados de carga:** skeleton con shimmer en toda imagen y en las rejillas antes de datos.
**Estados de error:** correo inválido en la suscripción y en contacto (campo en `--color-accent-700`
con mensaje de 12px). Fallo de red en checkout: mensaje inline + reintento, sin perder el carrito.
**Accesibilidad:** `prefers-reduced-motion` desactiva marquee, autoavance, zooms y las escenas 3D;
`aria-pressed` en favoritos; `aria-expanded` en menú, filtros y acordeones; foco atrapado en cajón,
hojas y zoom; `:focus-visible` con anillo de 2px en acento y `outline-offset: 2px`.

## Escenas 3D

three.js 0.160, importado dinámicamente. Montaje solo si `viewport ≥ 700px`, el contenedor es visible
y no hay motion reducido. `setPixelRatio(min(devicePixelRatio, 2))`. Render pausado fuera de pantalla.
`dispose()` de geometrías, materiales y renderer al desmontar.

| Escena | Dónde | Contenido | Cámara |
| --- | --- | --- | --- |
| `jar-scene` | bloque oscuro del home | frasco de vidrio (`MeshPhysicalMaterial`, `transmission: .95`, `opacity: .32`, R 1.6 × H 4.0), bandeja oscura, agua, sustrato y hojarasca | `PerspectiveCamera(32)`, `(0, 0.5, 10.5)`, alpha |
| `log-scene` | criadero | tronco de corteza deformada (`flatShading`), anillos, 34 esferas de musgo, 10 hojas | `PerspectiveCamera(32)`, `(0, 0.2, 7.4)`, alpha |
| `stack-scene` | mesa de frascos | plinto, mesa, bandeja y anillos de frascos con tapa | `PerspectiveCamera(30)`, `(0, 3.4, 17)`, fondo `0xd8d9d6` |

Luces: `HemisphereLight` + `DirectionalLight` clave y de relleno/borde (valores exactos en el
prototipo, métodos `initJar` / `initLog` / `initStack`).

## Assets

- **Fotografía:** el prototipo usa Wikimedia Commons **solo como marcador**. Licencia CC; **debe
  sustituirse por fotografía propia** antes de publicar. Cada hueco indica qué va ahí.
- **Video del hero:** pendiente. mp4 H.264 + webm, 1920×1080, sin audio, en bucle, con póster estático
  para la primera pintura. En móvil: `preload="none"` y solo póster.
- **Iconografía:** mínima y textual por decisión de diseño. Los glifos ♡ ♥ ↗ ← → pueden sustituirse por
  Lucide manteniendo tamaño y peso de trazo.
- **Tipografías:** Playfair Display y DM Sans (Google Fonts). Son equivalencias libres de las
  comerciales de la referencia; si se licencian otras, basta cambiar dos variables.
