# Rediseño con la paleta Musgo — recomendaciones de la skill (taste-skill v2.1.5)

Fecha: 2026-10-31. Dirección dealt: **Colour chapters** (seed 1711916268), con `--keep palette,type`.
Prueba visual: `/prueba-paletas/#musgo` (borrar al terminar).

## Paleta

| Rol | Hex |
|---|---|
| Fondo (crema verdoso) | #EFF0E2 |
| Superficie | #F7F7EE |
| Tinta | #173E36 |
| Tinta secundaria | #4E6660 |
| Acento (solo la acción principal) | #247465 |
| Campos de capítulo | #173E36 · #247465 · #55B895 · #ACDDB5 · #E5F1CD |
| Neutro (desactivado, agotado, vacío, error) | #303840 · #67767C · #A6B6B7 · #D4DDDA · #F1F0EA |

Sin tuna/rojo en ningún lado. Degradados de Feral solo en 1–2 capítulos (portada o cierre).

## La idea

«En esta página, las capas del frasco bioactivo (luz, musgo, hojarasca, sustrato) se vuelven los
capítulos de color»: arriba lo más claro, al bajar cada sección es un estrato más profundo, y el pie es
el sustrato oscuro (#173E36).

Cosa viva: en «Nuestra selección», tocar el nombre de una especie cambia la foto y el dato (humedad,
tamaño adulto, dificultad).

## Recomendaciones por sección del inicio

1. Portada: el video de musgo en un panel grande con «Historia natural» y un botón; a la derecha, una
   columna de 5 bloques con los colores de la paleta que son la navegación (cada bloque lleva a la
   sección de ese color). En el teléfono, los bloques pasan a barras debajo del video.
2. Nuestra selección: «objeto sobre un disco»: un círculo grande verde musgo con la foto recortada del
   animal encima; a la izquierda la lista de 4–6 especies; al tocar una cambia foto, color del disco y
   el dato.
3. Compra por categoría: pestañas por categoría (Isópodos, Colémbolos, Fásmidos, Insumos) y debajo
   bandas alternas con las especies (nombre, precio, disponibilidad).
4. El criadero: sin estadísticas en cajas; el texto grande en dos columnas con 5–6 palabras clave
   resaltadas en tonos musgo (CDMX, colonias, parámetros medidos, entrega en persona); la última frase
   resaltada es el enlace a WhatsApp.
5. Seis cosas dentro del frasco: hojas de color apiladas que se deslizan una sobre otra al bajar
   (sticky), una por elemento, como estratos del terrario; cada una con su foto.
6. Tres pasos: palabras grandes (Elige / Paga o aparta / Recibe), sin 01/02/03 ni vidrio.
7. Preguntas: una banda por pregunta, alternando dos tonos musgo, todas las respuestas visibles.
8. Cierre: una fila de tres mosaicos: el central con el degradado de Feral y «¿Dudas antes de
   comprar?» + WhatsApp; a los lados una foto y un bloque de color.
9. Pie: «OPUNTIA DEN» a todo lo ancho (recortado abajo, nunca arriba), debajo WhatsApp, Instagram y
   CDMX grandes, y los enlaces chicos a la derecha; fondo #173E36.

## Reglas generales

- Quitar: el rojo, etiquetitas en mayúsculas sobre los títulos (máximo 1–2 en toda la página),
  numeración 01/02/03, paneles de vidrio, la franja de 4 íconos en círculo, la cinta de texto corriendo,
  la doble barra de navegación, emojis de interfaz (✓ ✕ ♥) y el sello flotante encima del contenido.
- Tipografía: Playfair + Inter; cinco tamaños como máximo; texto de cuerpo 18px; títulos de 2 líneas
  como máximo en cualquier ancho.
- Excepciones a la skill que se quedan por marca: itálica en nombres científicos, el sello y el
  divisor de hojas (con medida), los degradados en 1–2 capítulos.
- Movimiento: la barra de arriba cambia de color según el capítulo que tiene debajo (300ms); entrada
  escalonada de título, texto y foto en cada sección; respuesta al pasar el cursor en botones y
  tarjetas; el video de la portada como imagen en movimiento. Todo respeta movimiento reducido.
- Fotos: lo que más falta. Mínimo 4 fotos reales por página (ideal 6–12). Fotos recortadas de los
  animales para el disco. Para huecos: láminas antiguas de historia natural de colecciones abiertas
  (Wikimedia, Met) con crédito en el pie. Corregir la portada equivocada de «Cómo elegir tu primer
  gecko».
- Catálogo y ficha: misma paleta; agotado en neutro con la foto en gris, sin cinta.

## Orden de trabajo (de más efecto y menos riesgo a menos)

1. Tokens: paleta Musgo + neutro en `public/brand/tokens.css` y el tema; quitar tuna.
2. Tipos y escala; quitar etiquetitas, numeración y emojis.
3. Marco: márgenes, ritmo de secciones, capítulos de color.
4. Estados: desactivado, agotado, vacío, error, 404.
5. Secciones nuevas (portada con columna de colores, disco, hojas apiladas, bandas, pie).
6. Movimiento.

## ¿Versión oscura?

La skill no contempla un interruptor claro/oscuro: trata «clara u oscura» como una decisión de
composición (59% de los sitios estudiados son claros, 41% oscuros). Con esta dirección los capítulos
profundos (#173E36, #247465) ya dan los momentos oscuros. Recomendación: no hacer interruptor por
ahora (duplica todas las revisiones: catálogo, fichas, carrito, formularios, fotos de producto); si se
hace después, sus reglas: `color-scheme: dark`, fondo musgo muy profundo (no negro), tinta crema suave
(no blanco puro), revisar el texto secundario a 4.5:1, profundidad con una superficie un paso más
clara (sin brillos) y pesos de letra más ligeros.
