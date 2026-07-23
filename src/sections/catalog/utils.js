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
  return null;
}

// ----------------------------------------------------------------------
// Listados por MORPH: cada morph de una especie es su propia entrada del
// catálogo (precio, fotos, descripción propia); la ficha de cuidados se
// hereda de la especie. Los ejemplares sin morph se agrupan por especie.
// ----------------------------------------------------------------------

export function listingKey(species, morph) {
  return morph ? `m${morph.id}` : `s${species.id}`;
}

export function listingTitle(species, morph) {
  const base = species.common_name ?? scientificName(species);
  return morph ? `${base} ${morph.name}` : base;
}

export function listingSlug(species, morph) {
  return `${slugify(listingTitle(species, morph))}-${listingKey(species, morph)}`;
}

// Sufijo del slug: -m{id} (morph), -s{id} (especie) o -{num} (species legacy)
export function parseListingParam(param) {
  const morph = /-m(\d+)$/.exec(param);
  if (morph) return { type: 'morph', id: Number(morph[1]) };
  const species = /-s(\d+)$/.exec(param);
  if (species) return { type: 'species', id: Number(species[1]) };
  const legacy = /-(\d+)$/.exec(param);
  if (legacy) return { type: 'legacy-species', id: Number(legacy[1]) };
  return null;
}

export function buildListings(animals) {
  const map = new Map();
  animals.forEach((animal) => {
    if (!animal.species) return;
    // ponytail: agrupa por el primer morph del ejemplar (un ejemplar suele
    // tener un solo morph); sin morph, agrupa por especie
    const morph = animal.morphs?.[0] ?? null;
    const key = listingKey(animal.species, morph);
    let entry = map.get(key);
    if (!entry) {
      entry = {
        key,
        species: animal.species,
        morph,
        title: listingTitle(animal.species, morph),
        slug: listingSlug(animal.species, morph),
        description: morph?.description ?? animal.species.description ?? null,
        minPrice: animal.price,
        maxPrice: animal.price,
        compareAt: animal.compare_at_price ?? null,
        latestId: animal.id,
        photos: [],
        morphs: morph ? [morph] : [],
        sexes: [],
      };
      map.set(key, entry);
    }
    if (animal.price < entry.minPrice) {
      entry.minPrice = animal.price;
      entry.compareAt = animal.compare_at_price ?? null;
    }
    entry.maxPrice = Math.max(entry.maxPrice, animal.price);
    entry.latestId = Math.max(entry.latestId, animal.id);
    if (!entry.sexes.includes(animal.sex)) entry.sexes.push(animal.sex);
    [animal.image, ...(animal.photos ?? [])].filter(Boolean).forEach((url) => {
      if (!entry.photos.includes(url)) entry.photos.push(url);
    });
  });
  return [...map.values()].map((entry) => {
    const tiers = entry.species.price_tiers;
    if (tiers?.length) {
      const prices = tiers.map((t) => t.price);
      return { ...entry, minPrice: Math.min(...prices), maxPrice: Math.max(...prices), compareAt: null };
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
// disponibles por especie con precio (rango), fotos y morphs combinados.
export function buildSpeciesList(animals) {
  const map = new Map();
  animals.forEach((animal) => {
    if (!animal.species) return;
    let entry = map.get(animal.species.id);
    if (!entry) {
      entry = {
        species: animal.species,
        slug: speciesSlug(animal.species),
        minPrice: animal.price,
        maxPrice: animal.price,
        // precio anterior (tachado) del ejemplar más barato — la oferta visible
        compareAt: animal.compare_at_price ?? null,
        latestId: animal.id,
        photos: [],
        morphs: [],
        sexes: [],
      };
      map.set(animal.species.id, entry);
    }
    if (animal.price < entry.minPrice) {
      entry.minPrice = animal.price;
      entry.compareAt = animal.compare_at_price ?? null;
    }
    entry.maxPrice = Math.max(entry.maxPrice, animal.price);
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
    return entry;
  });
}
