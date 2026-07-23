// Barra de anuncio en la parte superior del sitio. Cambia según si los envíos
// están habilitados (con envíos apagados solo hay entrega en persona en CDMX).
export const announcementFor = (shippingEnabled) =>
  shippingEnabled
    ? 'Envíos a todo México — enviamos de lunes a miércoles'
    : 'Entrega en persona en CDMX — coordina por WhatsApp';

// Redes sociales del header — pon las URLs reales cuando existan las cuentas
export const SOCIALS = [
  { label: 'Instagram', icon: 'ri:instagram-fill', href: '#' },
  { label: 'Facebook', icon: 'ri:facebook-fill', href: '#' },
  { label: 'X', icon: 'ri:twitter-x-fill', href: '#' },
  { label: 'TikTok', icon: 'ri:tiktok-fill', href: '#' },
];

// Información de compra/envío que se muestra en cada detalle de especie.
// ponytail: vive aquí como constante (un solo lugar, se edita con deploy);
// migrar a una tabla de settings del backend si quieren cambiarla sin deploy.
// Los textos son placeholder — ajústalos a las políticas reales de la tienda.
export const SHOP_INFO = [
  {
    icon: 'solar:box-minimalistic-bold',
    title: 'Envío a todo México',
    description: 'Empaque térmico y aislado para proteger al animal en el trayecto.',
    color: 'primary.main',
  },
  {
    icon: 'solar:shield-check-bold',
    title: 'Garantía de llegada con vida',
    description: 'Aplica en envíos con entrega al día siguiente o recolección local.',
    color: 'text.primary',
  },
  {
    icon: 'solar:danger-triangle-bold',
    title: 'Enviamos de lunes a miércoles',
    description: 'Así el paquete no pasa el fin de semana en tránsito.',
    color: 'warning.main',
  },
];

// Mismos tres bloques, pero redactados para cuando los envíos están
// deshabilitados y solo se entrega en persona en CDMX.
export const SHOP_INFO_LOCAL = [
  {
    icon: 'solar:box-minimalistic-bold',
    title: 'Entrega en persona en CDMX',
    description: 'Coordinamos un punto de encuentro para entregarte el animal en mano.',
    color: 'primary.main',
  },
  {
    icon: 'solar:shield-check-bold',
    title: 'Garantía de llegada con vida',
    description: 'Recibes el animal sano y revisado en el momento de la entrega.',
    color: 'text.primary',
  },
  {
    icon: 'solar:danger-triangle-bold',
    title: 'Entregas por cita',
    description: 'Coordinamos día y punto de encuentro en CDMX por WhatsApp.',
    color: 'warning.main',
  },
];

// Elige la redacción según si los envíos están habilitados.
export const shopInfoFor = (shippingEnabled) => (shippingEnabled ? SHOP_INFO : SHOP_INFO_LOCAL);
