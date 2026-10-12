// Copia de LINK_PAGES_DEFAULTS del API (routes/settings.py): se usa si el API no
// responde, para que el QR del sticker nunca muestre una página rota.
export const LINK_PAGES_DEFAULTS = {
  events: [
    {
      title: 'Animalia Otoño CDMX 2026',
      place: 'Centro de Convenciones Tlatelolco, CDMX',
      date: '2026-11-21',
      time: '',
      ends: '',
      url: '',
      url_label: 'Más información',
    },
  ],
  guides: [
    {
      name: 'Fásmidos',
      url: '/guias/phyllium-gardabagusi-argopuro',
      sub: false,
    },
    {
      name: 'Phyllium gardabagusi "Argopuro"',
      url: '/guias/phyllium-gardabagusi-argopuro',
      sub: true,
    },
    {
      name: 'Isópodos',
      url: '/articulos/isopodos-y-colembolos-el-equipo-de-limpieza-del-terrario-2',
      sub: false,
    },
    {
      name: 'Colémbolos',
      url: '/articulos/isopodos-y-colembolos-el-equipo-de-limpieza-del-terrario-2',
      sub: false,
    },
    {
      name: 'Cucarachas',
      url: '',
      sub: false,
    },
  ],
  pages: {
    gracias: {
      label: 'Criadero · Ciudad de México',
      title: 'Gracias por tu compra',
      lead: 'Gracias por llevarte un pedacito de nuestro criadero. Aquí tienes todo para que tus animales estén bien.',
      footer: 'Ciudad de México',
      buttons: [
        {
          label: 'Ver catálogo',
          url: '/catalogo',
          primary: true,
        },
        {
          label: 'Instagram · @opuntia_den',
          url: 'https://www.instagram.com/opuntia_den/',
          primary: false,
        },
        {
          label: 'WhatsApp · Ventas Opuntia',
          url: 'https://wa.me/525562292037',
          primary: false,
        },
        {
          label: 'Sitio web',
          url: '/',
          primary: false,
        },
      ],
    },
    links: {
      label: 'Criadero · CDMX',
      title: 'Historia natural',
      lead: 'Isópodos, colémbolos, fásmidos y bioactivo. Entregas a convenir.',
      footer: 'CDMX · Entregas a convenir',
      buttons: [
        {
          label: 'Ver catálogo',
          url: '/catalogo',
          primary: true,
        },
        {
          label: 'Escríbenos por WhatsApp',
          url: 'https://wa.me/525562292037',
          primary: false,
        },
        {
          label: 'Instagram · @opuntia_den',
          url: 'https://www.instagram.com/opuntia_den/',
          primary: false,
        },
        {
          label: 'Sitio web',
          url: '/',
          primary: false,
        },
      ],
    },
  },
};
