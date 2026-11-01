# Rediseño del sitio (taste-skill v2.1.5): terminado el 2026-10-31

Referencias del usuario: aldena.framer.media, reelio.framer.media, monopo.london. Dirección de la skill:
«dark room» en algunas secciones; el catálogo y las fichas siguen en hueso.

## Qué se hizo

1. **Paleta, opción A** (`public/brand/BRAND.md` §3):
   - página en neutros: fondo hueso #EEECE6, tinta #1C2320, oscuros #161B19;
   - verde musgo solo en el acento #247465 y en los degradados de Feral (`public/brand/degradados/`);
   - neutro gris azulado para lo no disponible;
   - sin rojo.
2. **Tipografía y limpieza.** Sin etiquetitas en mayúsculas, sin numeración 01/02/03, sin emojis de
   interfaz y con 13px como mínimo.
3. **Marco.**
   - El contenido crece hasta 1840px.
   - Barra flotante plana, sin cinta que corre ni franja de aviso.
   - Sello flotante de 96–120px, oculto en móvil.
   - La cinta de novedades se edita en el dashboard (Links y eventos).
4. **Estados.** OdEmpty en todos los vacíos; avisos del tema en neutro y éxito en musgo; 404 sobre el
   degradado neutro.
5. **Secciones del inicio**, en orden:
   1. Portada estilo Aldena: video a sangre y «OPUNTIA» gigante (h1).
   2. Franja de confianza.
   3. Especies destacadas como escena fija: una pantalla por especie y degradados de fondo mientras no
      haya foto propia.
   4. El criadero en dos columnas, con texto que se entinta.
   5. Banda del degradado aurora con nombres y cifras.
   6. Compra por categoría.
   7. Seis cosas dentro del frasco.
   8. Cómo comprar, en claro.
   9. Todo para tu terrario, en carrusel en perspectiva.
   10. Divulgación.
   11. Preguntas.
   12. Cierre con el degradado prisma (reemplazó a la suscripción).
   13. Pie con créditos de las fotos.

   Claras y oscuras se alternan.
6. **Movimiento**, solo con CSS ligado al scroll y respaldo para movimiento reducido:
   - «OPUNTIA» se encoge al bajar;
   - la foto del criadero entra con zoom;
   - los títulos suben palabra por palabra;
   - el texto del criadero se entinta;
   - las tarjetas del carrusel se enderezan al centro;
   - la barra toma el color de la sección.

**Fotos de ambiente provisionales:**
- 9 de Unsplash en `public/fotos/ambiente/`, con su autor en `src/lib/fotos-ambiente.js`.
- Llevan grano CSS (`.od-grain`).
- Nunca en tarjetas ni fichas de producto.

## Pendientes (para después)

- **Cambiar el video de la portada** (decisión del usuario).
- **Cambiar las fotos de ambiente por fotos propias.** Se reemplaza el archivo con el mismo nombre y
  el autor en `fotos-ambiente.js`. Opcional: pasarlas a espacios editables desde el dashboard.
- **Fotos propias de las especies.** Es lo que más mejorará el sitio: el catálogo y la escena de
  especies las usan solas en cuanto existan (la escena usa la foto nítida y desenfocada de fondo).
- **Portada del artículo «Cómo elegir tu primer gecko»:** es una foto de San Francisco. Se cambia en el
  dashboard (Divulgación).
- **Huecos a los lados en pantallas grandes.**
  - En 1920px ya solo quedan 40px por lado; en 2560px quedan 360px.
  - Las notas verticales de los márgenes (`OdGutterNote`, commit cc5121e) se pueden restaurar si
    molesta.
- **Destacado del nopal** de la cabecera del catálogo (`destacado-noche.svg`): trae fondo propio. Falta
  una versión de marca con fondo #161B19 o transparente.
- **Logo y favicon:** el usuario puede aprobar copias recoloreadas (mismo trazo).
- **Detalles menores:**
  - «Fichas de *cuidados*» lleva una palabra en itálica de acento (la skill lo evita);
  - el gran «DIVULGACIÓN» en gris;
  - «(Preguntas frecuentes) / 06 respuestas» en la cabecera de preguntas;
  - las pestañas del móvil a 12px.

## ¿Versión oscura?

No por ahora. La skill trata «clara u oscura» como composición, no como interruptor, y un interruptor
duplicaría todas las revisiones.
