# Rediseño del sitio: plan acordado (taste-skill v2.1.5)

Iniciado el 2026-10-31 y ajustado el mismo día con las referencias del usuario (aldena.framer.media,
reelio.framer.media, monopo.london). Prueba de paletas: `/prueba-paletas/` (se borra al terminar).

## Hecho

1. **Paleta (paso 1).** Primero Musgo; luego se cambió a la **opción A**, con dos paletas:
   - página en neutros: fondo hueso #EEECE6, tinta #1C2320, oscuros #161B19;
   - el verde musgo solo en el acento #247465 y en los degradados de Feral.
   - Sin rojo. Ver `public/brand/BRAND.md` §3.
2. **Tipografía y limpieza (paso 2).** Sin etiquetitas en mayúsculas, sin numeración 01/02/03, sin
   emojis de interfaz y con texto de 13px como mínimo.
3. **Marco (paso 3).**
   - El contenido crece hasta 1840px.
   - Barra flotante plana, sin cinta que corre ni franja de aviso.
   - Sello flotante más chico.
   - La cinta de novedades se edita en el dashboard (Links y eventos).
   - Degradado «aurora» en la banda del criadero.

## Pendiente

4. **Estados en neutro.** Desactivado, agotado, vacío, errores de formulario y avisos, y la 404 con el
   degradado neutro (sin la ilustración genérica).
5. **Secciones** (dirección de la skill: «dark room», solo en algunas secciones; el catálogo y las fichas
   siguen en hueso).
   - a. **Fotos libres de ambiente.**
     - 8 a 12 fotos de Wikimedia, CC0 o CC BY (evitar BY-SA), bajadas con `assets.mjs --get`.
     - Créditos en el pie.
     - Mismo tratamiento en todas: grano CSS y un leve oscurecido.
     - Van en los espacios de imagen del sitio para cambiarlas desde el dashboard.
     - **Nunca en tarjetas ni fichas de producto:** una foto encontrada no se presenta como el animal
       que se vende.
   - b. **Portada estilo Aldena.** Foto de ambiente a sangre con grano, «OPUNTIA» gigante encima en
     Playfair crema, «Historia natural» y un botón abajo a la izquierda.
   - c. **Especies destacadas como escena fija.**
     - Al bajar, la sección se queda fija.
     - Fondo desenfocado a sangre: un degradado de Feral musgo mientras no haya foto propia, y la foto
       propia desenfocada cuando exista.
     - Foto nítida al centro.
     - El nombre en Playfair gigante y tenue corre detrás.
   - d. **«Todo para tu terrario» en carrusel en perspectiva.**
     - Las tarjetas laterales van inclinadas y se enderezan al centro.
     - Precio «Desde $…».
     - Scroll nativo con scroll-snap y CSS.
   - e. **El criadero en dos columnas.** Título corto a la izquierda y texto grande a la derecha, que
     se entinta al bajar.
   - f. **Cierre con degradado.** Prisma musgo antes del pie: «¿Dudas antes de comprar?» + WhatsApp.
6. **Movimiento** (framer-motion y CSS, sin dependencias nuevas, con respaldo para movimiento reducido):
   - texto que se entinta al bajar;
   - la escena fija con el nombre que corre;
   - el carrusel que se endereza;
   - fotos que entran con un leve zoom;
   - «OPUNTIA» que se encoge al hacer scroll;
   - la barra que toma el color de la sección.

## Reglas

- **Degradados.**
  - 2 o 3 momentos por página.
  - Nunca foto y degradado en la misma sección.
  - Nunca en botones, tarjetas ni texto.
  - Con el mismo grano que las fotos.
  - Los elegidos se guardan en `public/brand/degradados/`.
- **No copiar de las referencias:**
  - la pantalla de carga y el cursor personalizado de Aldena (la skill los prohíbe);
  - la cuadrícula de líneas con crucecitas y las etiquetitas «• Intro» de Reelio;
  - las métricas inventadas.
- **Letras que se deshacen en pixeles** (canvas, Aldena): opcional al final.
- **Excepciones a la skill por marca:**
  - itálica en nombres científicos;
  - el sello y el divisor de hojas, con medida;
  - los degradados.
- **Fotos propias de los animales:** lo que más mejorará el sitio cuando existan.

## Pendientes marcados

- **Cambiar el video de la portada** (decisión del usuario, para después): por ahora se queda el
  video de musgo actual, con grano y el estilo Aldena del paso 5b.
- **Cambiar las fotos de ambiente por fotos propias.** Hoy son 12 de Unsplash, en
  `public/fotos/ambiente/` y `src/lib/fotos-ambiente.js` (archivo y autor). Para cambiarlas basta con
  reemplazar el archivo (mismo nombre) y el autor. La línea de créditos del pie sale de esa lista.
  Opcional: pasarlas a espacios de imagen editables desde el dashboard.
- **Huecos a los lados en pantallas de 1920px o más.** Las notas verticales de los márgenes
  (`OdGutterNote`) se quitaron en el paso 2 (commit cc5121e). Las había puesto el usuario para tapar
  ese hueco. El contenido ya crece hasta 1840px; en 2560px quedan 360px por lado. Se revisa al terminar
  todos los pasos y, si aún molesta, se restauran desde ese commit.
- **Destacado del nopal** en la cabecera del catálogo (`destacado-noche.svg`): trae fondo propio. Falta
  una versión de marca con fondo #161B19 o transparente.
- **Logo y favicon:** el usuario puede aprobar copias recoloreadas (mismo trazo) para la paleta nueva.

## ¿Versión oscura?

La skill no contempla un interruptor claro/oscuro: trata «clara u oscura» como una decisión de
composición. Recomendación: no hacerlo por ahora, porque duplica todas las revisiones. Si se hace
después:
- `color-scheme: dark`;
- fondo muy profundo con un tinte (no negro puro);
- tinta clara suave (no blanco puro);
- texto secundario a 4.5:1;
- profundidad con superficies un paso más claras, sin brillos.
