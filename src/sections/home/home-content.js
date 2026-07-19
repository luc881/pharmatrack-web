// ----------------------------------------------------------------------
// Contenido editable de las secciones de la home (FAQ, reseñas, artículos).
// ponytail: constantes en un solo lugar, se editan con deploy — igual que
// shop-info.js; migrar al backend cuando haga falta editarlas sin deploy.
// ----------------------------------------------------------------------

export const FAQS = [
  {
    question: '¿Cómo hago un pedido?',
    answer:
      'Elige el animal en el catálogo y mándanos mensaje con el botón de WhatsApp de su página. Te confirmamos disponibilidad, costo de envío y formas de pago.',
  },
  {
    question: '¿Hacen envíos a todo México?',
    answer:
      'Sí. Enviamos de lunes a miércoles para que el paquete no pase el fin de semana en tránsito, con empaque térmico y aislado.',
  },
  {
    question: '¿Garantizan la llegada con vida?',
    answer:
      'Sí, la garantía de llegada con vida aplica en envíos con entrega al día siguiente y en recolección local. Pedimos video de apertura del paquete sin cortes.',
  },
  {
    question: '¿Qué necesito antes de comprar?',
    answer:
      'Tener el terrario o contenedor listo con el sustrato, temperatura y humedad que pide la especie. En la página de cada animal está su ficha de cuidados.',
  },
  {
    question: '¿Los animales son de procedencia legal?',
    answer:
      'Sí, trabajamos con ejemplares criados en cautiverio y de procedencia legal.',
  },
  {
    question: '¿Puedo apartar un animal?',
    answer:
      'Sí, con un anticipo apartamos tu ejemplar por tiempo limitado. Los detalles se acuerdan por WhatsApp.',
  },
];

// Reseñas de muestra — REEMPLÁZALAS con reseñas reales de clientes.
// species: texto del link (opcional), href: ruta de la especie (opcional).
export const REVIEWS = [
  {
    name: 'Cliente de ejemplo',
    rating: 5,
    text: 'Mi tarántula llegó al día siguiente, perfectamente empacada y muy activa. El vendedor me resolvió todas las dudas del terrario antes de comprar.',
    species: null,
    href: null,
  },
  {
    name: 'Cliente de ejemplo',
    rating: 5,
    text: 'Pedí una cepa de isópodos y llegó abundante, con sustrato y guía de cuidados. A las dos semanas ya tenía crías.',
    species: null,
    href: null,
  },
  {
    name: 'Cliente de ejemplo',
    rating: 4,
    text: 'Buena atención por WhatsApp y envío rápido. El empaque térmico se nota que está bien pensado para el calor de mi ciudad.',
    species: null,
    href: null,
  },
];
