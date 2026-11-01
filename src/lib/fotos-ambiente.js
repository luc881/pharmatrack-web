// ----------------------------------------------------------------------
// Fotos de ambiente provisionales (Unsplash, licencia Unsplash: uso comercial
// libre, crédito agradecido pero no obligatorio). Ocupan el lugar de las
// fotos propias del criadero mientras se hacen; para cambiarlas basta con
// reemplazar el archivo en public/fotos/ambiente/ y el autor aquí.
// Regla: son ambiente, nunca la foto de un producto o especie a la venta.
// ----------------------------------------------------------------------

const f = (name, by) => ({ src: `/fotos/ambiente/${name}.jpg`, by });

export const FOTOS = {
  criadero: f('criadero', 'Mamun Srizon'),
  frasco: f('frasco', 'Trần Quang Phú'),
  preguntas: f('preguntas', 'Wyxina Tresse'),
  corteza: f('corteza', 'Wyxina Tresse'),
  comoComprar: f('como-comprar', 'Sandie Peters'),
  fichas: f('fichas', 'Priscilla Du Preez'),
  divulgacion: f('divulgacion', 'hannah grace'),
  terrario: f('terrario', 'Wyxina Tresse'),
  isopodoAmarillo: f('isopodo-amarillo', 'Jackie Best'),
  isopodoBlanco: f('isopodo-blanco', 'Jackie Best'),
  isopodoMusgo: f('isopodo-musgo', 'Bria Dorothy'),
  suscripcion: f('suscripcion', 'Florian Pinkert'),
};

// Autores sin repetir, para la línea de créditos del pie
export const FOTOS_AUTORES = [...new Set(Object.values(FOTOS).map((x) => x.by))];
