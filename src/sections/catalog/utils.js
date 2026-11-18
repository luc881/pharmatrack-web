// ----------------------------------------------------------------------

export const SEX_LABELS = { male: 'Macho', female: 'Hembra', unknown: 'Desconocido' };

export const STATUS_LABELS = { available: 'Disponible', reserved: 'Reservado', sold: 'Vendido' };

export const STATUS_COLORS = { available: 'success', reserved: 'warning', sold: 'default' };

export function scientificName(species) {
  return [species?.genus?.name, species?.name].filter(Boolean).join(' ');
}

// ----------------------------------------------------------------------

export function slugify(name) {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      // todo lo que no sea alfanumérico se vuelve guion: títulos con "/",
      // "+" o paréntesis rompían la ruta [slug] (el "/" partía la URL)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

// Sube por parent_id hasta el grupo raíz (arácnidos, reptiles, etc.)
export function rootGroupOf(species, groups) {
  const byId = new Map(groups.map((g) => [g.id, g]));
  let group = byId.get(species?.genus?.group?.id);
  while (group?.parent_id) group = byId.get(group.parent_id);
  return group ?? null;
}

// Cadena de grupos desde la raíz hasta el grupo hoja del que cuelga la especie:
// p. ej. Crustáceos → Isópodos. La usa el detalle para el breadcrumb completo y
// para mostrar el subgrupo (último) en el chip, no solo la raíz.
export function groupPathOf(species, groups) {
  const byId = new Map(groups.map((g) => [g.id, g]));
  const chain = [];
  let group = byId.get(species?.genus?.group?.id);
  while (group) {
    chain.unshift({ id: group.id, name: group.name, slug: slugify(group.name) });
    group = group.parent_id ? byId.get(group.parent_id) : null;
  }
  return chain;
}

// Un grupo (raíz o subgrupo) y todos sus descendientes, por id
export function descendantGroupIds(groupId, groups) {
  const childrenOf = new Map();
  groups.forEach((g) => {
    const p = g.parent_id ?? null;
    if (!childrenOf.has(p)) childrenOf.set(p, []);
    childrenOf.get(p).push(g.id);
  });
  const ids = new Set();
  const stack = [groupId];
  while (stack.length) {
    const cur = stack.pop();
    if (ids.has(cur)) continue;
    ids.add(cur);
    (childrenOf.get(cur) ?? []).forEach((c) => stack.push(c));
  }
  return ids;
}

// Resuelve un slug a cualquier grupo (raíz o subgrupo). Si hay nombres
// repetidos gana el primero — los nombres suelen ser únicos en la práctica.
export function groupBySlug(slug, groups) {
  return groups.find((g) => slugify(g.name) === slug) ?? null;
}

// Especies cuyo género cuelga del grupo dado o de cualquier descendiente
export function speciesInGroup(speciesList, group, groups) {
  const ids = descendantGroupIds(group.id, groups);
  return speciesList.filter((i) => ids.has(i.species?.genus?.group?.id));
}

// Categorías = grupos raíz con animales; foto = primer animal con imagen
export function buildCategories(animals, groups) {
  const categories = [];
  const seen = new Map();
  animals.forEach((animal) => {
    const root = rootGroupOf(animal.species, groups);
    if (!root) return;
    if (!seen.has(root.id)) {
      const entry = { id: root.id, name: root.name, slug: slugify(root.name), photo: null };
      seen.set(root.id, entry);
      categories.push(entry);
    }
    const entry = seen.get(root.id);
    if (!entry.photo) entry.photo = animal.image ?? animal.photos?.[0] ?? null;
  });
  return categories;
}

// ----------------------------------------------------------------------

export function speciesSlug(species) {
  return `${slugify(species.common_name ?? scientificName(species))}-${species.id}`;
}

export function saleFormatLabel(species) {
  if (species?.sale_format === 'package') return `Paquete de ${species.package_size}`;
  if (species?.sale_format === 'colony') return 'Cepa';
  if (species?.sale_format === 'piece') return 'Por pieza';
  return null;
}

// «Por pieza»: un lote por sexo (sin sexar, hembras, machos), cada uno con su
// precio y su cantidad; la ficha deja elegir cuál cotizar
export const PIECE_SEX_LABELS = { unknown: 'Sin sexar', female: 'Hembra', male: 'Macho' };
const PIECE_SEX_ORDER = ['unknown', 'female', 'male'];

// "-15%" cuando hay precio anterior (compareAt) por encima del actual
export function offerPct(price, compareAt) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

// Slug canónico del producto/insumo: "titulo-id"
export function productSlug(product) {
  return `${slugify(product.title)}-${product.id}`;
}

// Granel = el precio es por unidad de MEDIDA (se pesa/mide al vender)
export function isBulkWeight(product) {
  return ['g', 'kg', 'ml', 'l'].includes((product.unit_name ?? '').toLowerCase());
}

// ----------------------------------------------------------------------
// Listados por VARIEDAD: cada variedad de una especie es su propia entrada
// del catálogo (precio, fotos, descripción propia); la ficha de cuidados se
// hereda de la especie. Los ejemplares sin variedad (nominal) se agrupan por
// especie. Hay dos tipos de especie (species.variety_mode):
//   named → variedades con nombre (Glacier, Papaya): una por ejemplar
//   genes → genes combinables (Banana + Pastel): la entrada es la combinación
// Las funciones de abajo aceptan un morph, una lista de morphs o null.
// ----------------------------------------------------------------------

const byId = (a, b) => a.id - b.id;
const asVariety = (morph) =>
  (Array.isArray(morph) ? morph : morph ? [morph] : []).slice().sort(byId);

// La variedad que define el listado de un ejemplar
export function varietyOf(animal) {
  const morphs = animal.morphs ?? [];
  return animal.species?.variety_mode === 'genes' ? asVariety(morphs) : morphs.slice(0, 1);
}

// s{especie} (nominal) · m{morph} (una variedad) · c{id}x{id} (combinación)
export function listingKey(species, morph) {
  const variety = asVariety(morph);
  if (!variety.length) return `s${species.id}`;
  if (variety.length === 1) return `m${variety[0].id}`;
  return `c${variety.map((m) => m.id).join('x')}`;
}

export function listingTitle(species, morph) {
  const base = species.common_name ?? scientificName(species);
  const variety = asVariety(morph);
  return variety.length ? `${base} ${variety.map((m) => m.name).join(' ')}` : base;
}

export function listingSlug(species, morph) {
  return `${slugify(listingTitle(species, morph))}-${listingKey(species, morph)}`;
}

// Sufijo del slug: -c{id}x{id} (combinación de genes), -m{id} (morph),
// -s{id} (especie) o -{num} (species legacy)
export function parseListingParam(param) {
  const combo = /-c(\d+(?:x\d+)+)$/.exec(param);
  if (combo) return { type: 'combo', ids: combo[1].split('x').map(Number) };
  const morph = /-m(\d+)$/.exec(param);
  if (morph) return { type: 'morph', id: Number(morph[1]) };
  const species = /-s(\d+)$/.exec(param);
  if (species) return { type: 'species', id: Number(species[1]) };
  const legacy = /-(\d+)$/.exec(param);
  if (legacy) return { type: 'legacy-species', id: Number(legacy[1]) };
  return null;
}

// Antes esta funcion nacia de los ejemplares, asi que una especie sin ninguno
// no producia tarjeta. Ahora nace de los taxones visibles y les adjunta sus
// ejemplares: los que no tengan quedan con count 0, que es exactamente el
// camino "Agotado" que animalToCard ya implementa.
export function buildListings(animals, taxa = []) {
  const map = new Map();

  const seed = (species, variety) => {
    const morphs = asVariety(variety);
    // una sola variedad: la descripción y la foto de esa variedad
    const morph = morphs.length === 1 ? morphs[0] : null;
    const key = listingKey(species, morphs);
    let entry = map.get(key);
    if (entry) return entry;
    entry = {
      key,
      species,
      morph,
      title: listingTitle(species, morphs),
      slug: listingSlug(species, morphs),
      description: morph?.description ?? species.description ?? null,
      minPrice: null,
      maxPrice: null,
      compareAt: null,
      lastPrice: null,
      latestId: 0,
      count: 0,
      photos: [],
      // Respaldo si ningun ejemplar trae foto propia: la del morph, si no la
      // de la especie. animalToCard usa photos[0] ?? taxonPhoto, para que una
      // foto real de ejemplar siempre le gane a la del taxon.
      taxonPhoto: morph?.image ?? species.image ?? null,
      // todas las fotos de la variedad (o de la especie): la galería las usa
      // cuando ningún ejemplar trae fotos propias
      taxonPhotos: (morph ? morph.photos : species.photos) ?? [],
      morphs,
      sexes: [],
      lots: [],
    };
    map.set(key, entry);
    return entry;
  };

  // 1) Una entrada por cada taxon visible: la especie base y cada variedad.
  //    En una especie de genes un gen suelo no es algo que se venda: sus
  //    entradas salen de las combinaciones que hay en los ejemplares.
  taxa.forEach((species) => {
    // la nominal se anuncia aparte de sus variedades: oculta, no hay tarjeta
    // base, pero Glacier sigue
    if (species.nominal_public !== false) seed(species, null);
    if (species.variety_mode === 'genes') return;
    (species.morphs ?? []).forEach((morph) => seed(species, morph));
  });

  // 2) Adjuntar los ejemplares a su entrada (creandola si el taxon no vino).
  animals.forEach((animal) => {
    if (!animal.species) return;
    const entry = seed(animal.species, varietyOf(animal));
    entry.lastPrice = animal.price;
    // El listado existe por CUALQUIER ejemplar (así aparece "agotado" cuando
    // ya no queda ninguno disponible), pero count/min/maxPrice solo cuentan
    // los disponibles: son los únicos comprables hoy.
    if (animal.status === 'available') {
      const piece = animal.species.sale_format === 'piece';
      // por pieza cuentan las piezas del lote, no los registros
      entry.count += piece ? Number(animal.stock ?? 1) : 1;
      if (piece) {
        entry.lots.push({
          sex: animal.sex,
          price: animal.price,
          compareAt: animal.compare_at_price ?? null,
          stock: Number(animal.stock ?? 1),
        });
      }
      if (entry.minPrice === null || animal.price < entry.minPrice) {
        entry.minPrice = animal.price;
        entry.compareAt = animal.compare_at_price ?? null;
      }
      entry.maxPrice = entry.maxPrice === null ? animal.price : Math.max(entry.maxPrice, animal.price);
    }
    entry.latestId = Math.max(entry.latestId, animal.id);
    if (!entry.sexes.includes(animal.sex)) entry.sexes.push(animal.sex);
    [animal.image, ...(animal.photos ?? [])].filter(Boolean).forEach((url) => {
      if (!entry.photos.includes(url)) entry.photos.push(url);
    });
  });
  map.forEach((entry) => {
    entry.lots.sort((a, b) => PIECE_SEX_ORDER.indexOf(a.sex) - PIECE_SEX_ORDER.indexOf(b.sex));
  });
  return [...map.values()].map((raw) => {
    // sin fotos de ejemplares, las de la variedad o especie (fuente de verdad)
    const entry = raw.photos.length ? raw : { ...raw, photos: [...raw.taxonPhotos] };
    const tiers = entry.species.price_tiers;
    if (tiers?.length) {
      const prices = tiers.map((t) => t.price);
      return { ...entry, minPrice: Math.min(...prices), maxPrice: Math.max(...prices), compareAt: null };
    }
    // Agotado y sin escalas de precio: no hay disponible que cotizar, se
    // muestra el último precio conocido (informativo; el botón de compra
    // queda deshabilitado en la ficha por count === 0).
    if (entry.minPrice === null) {
      return { ...entry, minPrice: entry.lastPrice, maxPrice: entry.lastPrice };
    }
    return entry;
  });
}

// Listados (morph/especie) cuyo género cuelga del grupo dado o un descendiente
export function listingsInGroup(listings, group, groups) {
  const ids = descendantGroupIds(group.id, groups);
  return listings.filter((i) => ids.has(i.species?.genus?.group?.id));
}

// El público ve especies, no folios individuales: agrupa los animales
// por especie con precio (rango), fotos y morphs combinados.
export function buildSpeciesList(animals) {
  const map = new Map();
  animals.forEach((animal) => {
    if (!animal.species) return;
    let entry = map.get(animal.species.id);
    if (!entry) {
      entry = {
        species: animal.species,
        slug: speciesSlug(animal.species),
        minPrice: null,
        maxPrice: null,
        // precio anterior (tachado) del ejemplar más barato — la oferta visible
        compareAt: null,
        lastPrice: animal.price, // ponytail: precio a mostrar si nada queda disponible
        latestId: animal.id,
        count: 0,
        photos: [],
        morphs: [],
        sexes: [],
      };
      map.set(animal.species.id, entry);
    }
    entry.lastPrice = animal.price;
    // La entrada existe por CUALQUIER ejemplar (así aparece "agotado" cuando
    // ya no queda ninguno disponible), pero count/min/maxPrice solo cuentan
    // los disponibles: son los únicos comprables hoy.
    if (animal.status === 'available') {
      entry.count += 1;
      if (entry.minPrice === null || animal.price < entry.minPrice) {
        entry.minPrice = animal.price;
        entry.compareAt = animal.compare_at_price ?? null;
      }
      entry.maxPrice = entry.maxPrice === null ? animal.price : Math.max(entry.maxPrice, animal.price);
    }
    entry.latestId = Math.max(entry.latestId, animal.id);
    if (!entry.sexes.includes(animal.sex)) entry.sexes.push(animal.sex);
    [animal.image, ...(animal.photos ?? [])].filter(Boolean).forEach((url) => {
      if (!entry.photos.includes(url)) entry.photos.push(url);
    });
    (animal.morphs ?? []).forEach((morph) => {
      if (!entry.morphs.some((m) => m.id === morph.id)) entry.morphs.push(morph);
    });
  });
  return [...map.values()].map((entry) => {
    // Con escalas de precio (paquetes de 6/12/18), el rango sale de las escalas
    const tiers = entry.species.price_tiers;
    if (tiers?.length) {
      const prices = tiers.map((t) => t.price);
      // con escalas de precio la oferta por ejemplar no aplica
      return { ...entry, minPrice: Math.min(...prices), maxPrice: Math.max(...prices), compareAt: null };
    }
    if (entry.minPrice === null) {
      return { ...entry, minPrice: entry.lastPrice, maxPrice: entry.lastPrice };
    }
    return entry;
  });
}
