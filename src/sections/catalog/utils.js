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
        latestId: animal.id,
        photos: [],
        morphs: [],
        sexes: [],
      };
      map.set(animal.species.id, entry);
    }
    entry.minPrice = Math.min(entry.minPrice, animal.price);
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
      return { ...entry, minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
    }
    return entry;
  });
}
