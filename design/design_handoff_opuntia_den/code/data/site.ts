// Contenido de chrome y textos compartidos. Sustituir por siteSettings del CMS (fase 7).
import type { Faq, ShippingZone } from '../types';

export const marqueeLines = [
  'Entrega en persona en CDMX',
  'Garantía de llegada con vida',
  'Envíos nacionales por cita',
  'Criadero propio desde 2019',
];

export const nav = {
  left: [
    { label: 'Mayoreo', href: '/asesoria' },
    { label: 'Asesoría', href: '/asesoria' },
  ],
  menu: [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Isópodos', href: '/catalogo?cat=iso' },
    { label: 'Sustratos y accesorios', href: '/catalogo?cat=acc' },
    { label: 'El criadero', href: '/criadero' },
    { label: 'Envíos y entregas', href: '/envios' },
    { label: 'Asesoría', href: '/asesoria' },
    { label: 'Divulgación', href: '/articulos' },
    { label: 'Contacto', href: '/contacto' },
  ],
  tabbar: [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Buscar', href: '#search' },
    { label: 'Favoritos', href: '/favoritos' },
    { label: 'Carrito', href: '/carrito' },
  ],
};

export const footer = {
  columns: [
    {
      title: 'Tienda',
      links: [
        { label: 'Isópodos', href: '/catalogo?cat=iso' },
        { label: 'Sustratos y accesorios', href: '/catalogo?cat=acc' },
        { label: 'Kit de arranque', href: '/catalogo/kit-de-arranque' },
      ],
    },
    {
      title: 'Compra',
      links: [
        { label: 'Envíos y entregas', href: '/envios' },
        { label: 'Asesoría', href: '/asesoria' },
        { label: 'Contacto', href: '/contacto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Aviso de privacidad', href: '/legal#privacidad' },
        { label: 'Términos', href: '/legal#terminos' },
        { label: 'Garantía de llegada con vida', href: '/legal#garantia' },
      ],
    },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/' },
  ],
};

export const shippingZones: ShippingZone[] = [
  { id: 'cdmx', label: 'Ciudad de México', cost: 0, note: 'Gratis (entrega en persona)' },
  { id: 'meta', label: 'Zona metropolitana', cost: 120, note: 'Entrega por cita, 1 – 2 días' },
  { id: 'nac', label: 'Resto del país', cost: 380, note: 'Salidas martes y jueves, caja térmica' },
];

/** Bloques de confianza de la ficha, separados por filetes. */
export const trustBlocks = [
  {
    title: 'Entrega en persona',
    body: 'Nos vemos en un punto acordado de la CDMX: revisas los animales antes de pagar el resto.',
  },
  {
    title: 'Garantía de llegada con vida',
    body: 'Si algo llega sin vida, lo reponemos en el siguiente envío. Solo pedimos foto el mismo día.',
  },
  {
    title: 'Entregas por cita',
    body: 'Escribimos por WhatsApp para acordar día y hora. Sin sorpresas ni cajas esperando al sol.',
  },
];

export const heroCopy = {
  kicker: 'Criadero en Ciudad de México',
  title: 'Invertebrados de colección',
  cta: { label: 'Ver catálogo', href: '/catalogo' },
  scrollHint: 'Desliza',
  video: { src: '/video/hero.mp4', webm: '/video/hero.webm', poster: '/video/hero-poster.jpg' },
};

export const faqs: Faq[] = [
  {
    id: 'faq-1',
    group: 'fauna',
    question: '¿Es legal tener isópodos en casa?',
    answer:
      'Sí. Las especies del catálogo no están restringidas y provienen de cría en cautiverio, no de captura.',
  },
  {
    id: 'faq-2',
    group: 'envios',
    question: '¿Qué pasa si no estoy cuando llegue el paquete?',
    answer: 'Reagendamos la entrega. Las cajas se envían con hojarasca y humedad para 72 horas.',
  },
  {
    id: 'faq-3',
    group: 'asesoria',
    question: '¿Puedo pedir ayuda después de comprar?',
    answer:
      'Sí, la asesoría está incluida: escríbenos por WhatsApp cuando tengas dudas de humedad, comida o cría.',
  },
];

export const checkoutSteps = ['Datos de contacto', 'Entrega', 'Pago'];
