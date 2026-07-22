// Rangos de código postal por estado. Espejo de utils/mx_address.py en la API:
// sólo SUGIERE el estado al escribir el CP, el cliente puede corregirlo.
const RANGES = [
  [1000, 16999, 'Ciudad de México'],
  [20000, 20999, 'Aguascalientes'],
  [21000, 22999, 'Baja California'],
  [23000, 23999, 'Baja California Sur'],
  [24000, 24999, 'Campeche'],
  [25000, 27999, 'Coahuila'],
  [28000, 28999, 'Colima'],
  [29000, 30999, 'Chiapas'],
  [31000, 33999, 'Chihuahua'],
  [34000, 35999, 'Durango'],
  [36000, 38999, 'Guanajuato'],
  [39000, 41999, 'Guerrero'],
  [42000, 43999, 'Hidalgo'],
  [44000, 49999, 'Jalisco'],
  [50000, 57999, 'Estado de México'],
  [58000, 61999, 'Michoacán'],
  [62000, 62999, 'Morelos'],
  [63000, 63999, 'Nayarit'],
  [64000, 67999, 'Nuevo León'],
  [68000, 71999, 'Oaxaca'],
  [72000, 75999, 'Puebla'],
  [76000, 76999, 'Querétaro'],
  [77000, 77999, 'Quintana Roo'],
  [78000, 79999, 'San Luis Potosí'],
  [80000, 82999, 'Sinaloa'],
  [83000, 85999, 'Sonora'],
  [86000, 86999, 'Tabasco'],
  [87000, 89999, 'Tamaulipas'],
  [90000, 90999, 'Tlaxcala'],
  [91000, 96999, 'Veracruz'],
  [97000, 97999, 'Yucatán'],
  [98000, 99999, 'Zacatecas'],
];

export function stateForZip(zip) {
  if (!/^\d{5}$/.test(zip ?? '')) return null;
  const number = Number(zip);
  return RANGES.find(([start, end]) => number >= start && number <= end)?.[2] ?? null;
}
