# Contrato de datos

Lo que la BD/CMS debe entregar para que el front funcione sin datos hardcodeados.
Los tipos canónicos están en `code/types.ts`; los seeds en `code/data/`.

## Colecciones

### `products`
| Campo | Tipo | Notas |
| --- | --- | --- |
| `sku` | string | clave estable: `ISO-00N`, `ACC-00N`, `KIT-00N` |
| `slug` | string | único, en URL: `/catalogo/shiro-utsuri` |
| `name` | string | nombre comercial |
| `scientificName` | string \| null | se muestra en cursiva; null en accesorios |
| `category` | `'iso' \| 'acc'` | animal vivo / sustratos y accesorios |
| `level` | `'beg' \| 'int' \| 'adv'` | nivel de cuidado |
| `price` | number | MXN, entero, sin impuestos añadidos |
| `inStock` | boolean | |
| `stockQty` | number | dispara “Quedan N” con ≤ 6 |
| `badge` | string \| null | manual; el automático se calcula en el front |
| `images` | `{ url, alt, width, height }[]` | mínimo 3 en animales (galería + miniaturas) |
| `description` | string | párrafo de la ficha |
| `habitat` | string \| null | “Hábitat y comportamiento” |
| `care` | `Care` \| null | obligatorio si `category === 'iso'` |
| `taxonomy` | `{ label, value }[]` | 5 filas |
| `origin` | string \| null | “Distribución / origen” |
| `tags` | string[] | píldoras de la ficha |
| `variants` | `{ id, name, priceDelta }[]` | por defecto: trío +0, paquete de 6 +220, colonia de 12 +640 |
| `relatedSkus` | string[] | “Suele ir con”, 4 elementos |
| `updatedAt` | ISO string | para revalidación |

`Care` = `{ origin, temperature, humidity, size, difficulty, rarity }` — seis cadenas cortas
(la tira de cuidados las muestra en serif 22px, así que máximo ~14 caracteres cada una).

### `articles`
| Campo | Tipo | Notas |
| --- | --- | --- |
| `code` | string | `ART-002`; se muestra en el kicker |
| `slug` | string | `/articulos/isopodos-y-colembolos` |
| `section` | string | “Bioactivo”, “Montaje”, “Especies”, “Cuidados”, “Alimentación”, “Cría” |
| `title` | string | |
| `excerpt` | string | bajada, ~38ch en tarjeta y 54ch en cabecera |
| `readingMinutes` | number | se muestra “N min de lectura” |
| `author` | string | firma |
| `publishedAt` | ISO string | |
| `cover` | `{ url, alt, width, height }` | 16/9 en la vista, 4/5 en tarjeta |
| `body` | bloques enriquecidos | debe soportar: h2 con ancla, párrafo, cita, tabla, lista, `<em>` |
| `mentionedSkus` | string[] | “Especies mencionadas”, 4 |

El índice pegajoso se genera de los `h2` del cuerpo — el CMS debe exponer sus anclas.

### `shippingZones`
```
{ id: 'cdmx' | 'meta' | 'nac', label, cost, note }
```
Valores actuales: `cdmx` 0 (“Gratis (entrega en persona)”), `meta` 120, `nac` 380.
Costos y textos deben ser editables sin deploy.

### `faqs`
`{ id, question, answer, group }` — usadas en Envíos y Asesoría.

### `siteSettings`
Cinta del marquee (array de frases), enlaces de nav y pie, WhatsApp, correo, horario de entregas,
copy del hero (kicker, título, CTA), URL del video y su póster, textos legales.

### `users` (solo si se activa cuenta)
El prototipo no tiene login. Si se añade: `{ id, email, name, phone, favorites: sku[], orders: id[] }`.
Favoritos y carrito hoy viven en `localStorage`; al haber cuenta, se sincronizan al iniciar sesión
(unión de ambos conjuntos, sin borrar lo local).

## Endpoints / consultas

| Uso | Forma sugerida |
| --- | --- |
| Catálogo | `getProducts({ category?, level?, sort?, limit, offset })` — filtrado y orden en servidor |
| Ficha | `getProductBySlug(slug)` + `getProductsBySkus(relatedSkus)` |
| Índice de notas | `getArticles({ limit, offset })` |
| Artículo | `getArticleBySlug(slug)` + `getProductsBySkus(mentionedSkus)` |
| Búsqueda | `searchProducts(q)` sobre `name`, `scientificName`, `sku`; mínimo 2 caracteres |
| Envío | `getShippingZones()` |
| Pedido | **ya existe** en el repo (Mercado Pago + Resend). El front solo entrega `{ lines: [{sku, qty}], zoneId, contact }` |

## Revalidación

Catálogo y artículos con ISR (`revalidate: 300`) más webhook de invalidación al publicar.
El stock es lo único que conviene leer en cada request (o cada 30 s) para no vender lo agotado.
