# Handoff · Opuntia Den — sitio completo (11 vistas)

Paquete de implementación para **Claude Code**: cómo llevar el prototipo de diseño al proyecto
Next.js de producción.

## Cómo usar este paquete

1. Copia esta carpeta a la raíz del repo de producción (o pásala como contexto a Claude Code).
2. Pídele a Claude Code que lea **`CLAUDE.md`** primero: contiene las reglas de trabajo.
3. `PLAN.md` es el plan por fases con el árbol de archivos exacto y criterios de aceptación.
4. `SPEC-VISTAS.md` es la especificación visual/funcional vista por vista.
5. `API-CONTRACT.md` es lo que la BD/CMS debe entregar.
6. `code/` son archivos **listos para copiar** al repo (tokens, tailwind, tipos, seeds, hooks,
   componentes de referencia). No son un starter completo: son la parte que no debe reinventarse.

## Qué es el prototipo

`Opuntia Den.dc.html` es una **referencia de diseño en HTML** — un prototipo con la apariencia y el
comportamiento buscados, no código de producción. Usa un runtime de plantillas propio del entorno de
diseño; su markup y sus estilos en línea son la especificación exacta de layout, tipografía, color y
estados. **No se importa al repo.** Lo que sí se transporta es `code/`.

Fidelidad: **alta (hifi)**. Colores, tipografía, espaciado, radios, transiciones y estados están
definidos y deben recrearse con precisión.

## Estado del prototipo

Once vistas navegables en un solo archivo, conmutables con la barra flotante inferior derecha
(ese conmutador es andamiaje: **no** forma parte del diseño).

| Vista | Ruta sugerida |
| --- | --- |
| Home | `/` |
| Catálogo | `/catalogo` |
| Ficha de producto | `/catalogo/[slug]` |
| Artículo | `/articulos/[slug]` |
| Carrito + checkout (3 pasos) | `/carrito`, `/checkout` |
| Favoritos | `/favoritos` |
| Criadero (nosotros) | `/criadero` |
| Envíos y entregas | `/envios` |
| Asesoría | `/asesoria` |
| Contacto | `/contacto` |
| Legal | `/legal` |

Incluye carrito y favoritos con estado de sesión, filtros y orden de catálogo, búsqueda, tres
escenas 3D en three.js, layout móvil completo (nav lateral, hoja de ordenar, panel de filtros, barra
inferior de 5 pestañas) y navegación con historial del navegador.

## Fuera de alcance

- Lógica de pagos y correos: **ya existe** en producción (Mercado Pago, cierre por WhatsApp, Resend).
  Solo cambia de piel.
- Contenido en inglés: el conmutador ES/EN es visual; falta la traducción.
- Fotografía y video definitivos (ver `SPEC-VISTAS.md` § Assets).

## Archivos del paquete

```
README.md            este índice
CLAUDE.md            reglas de trabajo para el agente
PLAN.md              plan por fases + árbol de archivos + criterios de aceptación
SPEC-VISTAS.md       especificación vista por vista, interacciones, móvil, assets
API-CONTRACT.md      datos que necesita la API/CMS
code/                archivos para copiar al repo
Opuntia Den.dc.html  el prototipo (referencia visual)
image-slot.js        marcador de imagen del prototipo — NO se transporta
styles.css           hoja de tokens del sistema base — reemplazada por code/tokens.css
```
