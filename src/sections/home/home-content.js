// ----------------------------------------------------------------------
// Contenido editable de las secciones de la home (FAQ, reseñas, artículos).
// ponytail: constantes en un solo lugar, se editan con deploy — igual que
// shop-info.js; migrar al backend cuando haga falta editarlas sin deploy.
// ----------------------------------------------------------------------

// Las tres primeras preguntas dependen de si hay envíos; el resto es común.
const FAQS_SHIPPING = [
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
];

const FAQS_LOCAL = [
  {
    question: '¿Cómo hago un pedido?',
    answer:
      'Elige el animal en el catálogo y mándanos mensaje con el botón de WhatsApp de su página. Te confirmamos disponibilidad y formas de pago, y coordinamos la entrega en persona en CDMX.',
  },
  {
    question: '¿Hacen envíos o solo entrega local?',
    answer:
      'Por ahora solo entregamos en persona en CDMX. Coordinamos día y punto de encuentro por WhatsApp; no hacemos envíos por paquetería.',
  },
  {
    question: '¿Garantizan la llegada con vida?',
    answer:
      'Sí. Revisas el animal en el momento de la entrega y te lo damos sano y activo; si algo no está bien, lo resolvemos ahí mismo.',
  },
];

const FAQS_COMMON = [
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

// FAQ según si los envíos están habilitados.
export const faqsFor = (shippingEnabled) => [
  ...(shippingEnabled ? FAQS_SHIPPING : FAQS_LOCAL),
  ...FAQS_COMMON,
];

// Reseñas de muestra — REEMPLÁZALAS con reseñas reales de clientes.
// species: texto del link (opcional), href: ruta de la especie (opcional).
export const REVIEWS = [
  {
    name: 'Cliente de ejemplo',
    rating: 5,
    text: 'Mi tarántula llegó perfectamente empacada y muy activa. El vendedor me resolvió todas las dudas del terrario antes de comprar.',
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
    text: 'Buena atención por WhatsApp de principio a fin. El empaque térmico se nota bien pensado para proteger al animal.',
    species: null,
    href: null,
  },
];
