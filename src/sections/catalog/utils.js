// ----------------------------------------------------------------------

export const SEX_LABELS = { male: 'Macho', female: 'Hembra', unknown: 'Desconocido' };

export const STATUS_LABELS = { available: 'Disponible', reserved: 'Reservado', sold: 'Vendido' };

export const STATUS_COLORS = { available: 'success', reserved: 'warning', sold: 'default' };

export function scientificName(species) {
  return [species?.genus?.name, species?.name].filter(Boolean).join(' ');
}

// ----------------------------------------------------------------------

export function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

// Sube por parent_id hasta el grupo raíz (arácnidos, reptiles, etc.)
export function rootGroupOf(animal, groups) {
  const byId = new Map(groups.map((g) => [g.id, g]));
  let group = byId.get(animal.species?.genus?.group?.id);
  while (group?.parent_id) group = byId.get(group.parent_id);
  return group ?? null;
}

// Categorías = grupos raíz con animales; foto = primer animal con imagen
export function buildCategories(animals, groups) {
  const categories = [];
  const seen = new Map();
  animals.forEach((animal) => {
    const root = rootGroupOf(animal, groups);
    if (!root) return;
    if (!seen.has(root.id)) {
      const entry = { id: root.id, name: root.name, slug: slugify(root.name), count: 0, photo: null };
      seen.set(root.id, entry);
      categories.push(entry);
    }
    const entry = seen.get(root.id);
    entry.count += 1;
    if (!entry.photo) entry.photo = animal.image ?? animal.photos?.[0] ?? null;
  });
  return categories;
}
