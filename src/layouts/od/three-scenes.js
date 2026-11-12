// ----------------------------------------------------------------------
// Constructores de las escenas three.js (modelos de Poliigon reducidos en
// Blender, en public/3d). Cada uno recibe (THREE, { scene, camera, renderer }) y devuelve un
// `step(time)` que anima el grupo; el hook useThreeScene se encarga del render,
// el IntersectionObserver y el dispose.
// ----------------------------------------------------------------------

// Luz de ambiente con el HDRI «cobblestone parish road» (Poly Haven, reducido
// a 512x256: public/3d/ambiente.hdr). Solo ilumina; no se ve de fondo.
function lightWithHdri(THREE, scene, renderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  import('three/examples/jsm/loaders/RGBELoader.js').then(({ RGBELoader }) => {
    new RGBELoader().load('/3d/ambiente.hdr', (hdr) => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(hdr).texture;
      hdr.dispose();
      pmrem.dispose();
    });
  });
}

// Tocón fotoescaneado (Poliigon TreeStump024, reducido a 15k triángulos y
// texturas 1K en Blender: public/3d/tocon.glb). Gira lento; el GLTFLoader se
// importa solo aquí para no pesar en el resto del sitio.
export function buildStump(THREE, { scene, renderer }) {
  // iluminado solo con el HDRI (sin luces propias)
  lightWithHdri(THREE, scene, renderer);

  const g = new THREE.Group();
  scene.add(g);
  import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
    new GLTFLoader().load('/3d/tocon.glb', (gltf) => {
      const model = gltf.scene;
      // encuadre por la esfera que lo envuelve; sus esquinas al girar llegan a
      // ~0.83 del radio, así que 2.2 aún deja margen en un cuadro de 1.89
      const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
      const k = 2.2 / sphere.radius;
      model.scale.setScalar(k);
      model.position.copy(sphere.center.multiplyScalar(-k));
      g.add(model);
    });
  });

  return () => {
    g.rotation.y += 0.003;
  };
}

// Mesa Nimbus con una pecera vacía y una roca adentro (Poliigon
// CoffeeTableNimbusGoldReplica001 + el recipiente de aquarium.blend + rock.blend;
// materiales horneados y malla comprimida con Draco en Blender:
// public/3d/mesa-acuario.glb, 1 MB). Fondo negro,
// luz del HDRI; solo gira. El decodificador de Draco vive en public/draco.
export function buildMesaAcuario(THREE, { scene, renderer }) {
  // iluminado solo con el HDRI (también da los reflejos del dorado)
  lightWithHdri(THREE, scene, renderer);

  const g = new THREE.Group();
  scene.add(g);
  Promise.all([import('three/examples/jsm/loaders/GLTFLoader.js'), import('three/examples/jsm/loaders/DRACOLoader.js')]).then(([{ GLTFLoader }, { DRACOLoader }]) => {
    const draco = new DRACOLoader().setDecoderPath('/draco/');
    new GLTFLoader().setDRACOLoader(draco).load('/3d/mesa-acuario.glb', (gltf) => {
      draco.dispose();
      const model = gltf.scene;
      // la placa del piso (1 cm entre la madera y el vidrio) era de vidrio y
      // dejaba una línea negra; ahora es opaca, del tono de la madera (su
      // mapeo no casa con la textura de la madera, que se veía gris)
      const plate = new THREE.MeshStandardMaterial({ color: 0x4f2c1b, roughness: 0.8 });
      model.traverse((o) => {
        if (!o.isMesh) return;
        const name = o.material?.name ?? '';
        if (name.startsWith('Aqua_Base')) o.material = plate;
        // vidrio: transparente simple con reflejos (la transmisión sobre el
        // fondo negro lo teñía de café)
        if (name.startsWith('Aqua_Glass')) {
          o.material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide });
        }
      });
      // encuadre por la esfera que lo envuelve (la mesa es redonda: al girar no se sale)
      const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
      const k = 1.6 / sphere.radius;
      model.scale.setScalar(k);
      model.position.copy(sphere.center.multiplyScalar(-k));
      g.add(model);
    });
  });

  return () => {
    g.rotation.y += 0.004;
  };
}

// Cactus en maceta de concreto (BlenderKit; sus materiales procedurales se
// hornearon a texturas 1K en Blender: public/3d/cactus.glb). Sin fondo; solo gira.
// Iluminado con un HDRI (antes se veía muy oscuro).
export function buildCactus(THREE, { scene, renderer }) {
  lightWithHdri(THREE, scene, renderer);
  const key = new THREE.DirectionalLight(0xfff4e2, 1.2);
  key.position.set(3, 5, 4);
  scene.add(key);

  const g = new THREE.Group();
  scene.add(g);
  import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
    new GLTFLoader().load('/3d/cactus.glb', (gltf) => {
      const model = gltf.scene;
      const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
      const k = 1.85 / sphere.radius;
      model.scale.setScalar(k);
      model.position.copy(sphere.center.multiplyScalar(-k));
      g.add(model);
    });
  });

  return () => {
    g.rotation.y += 0.004;
  };
}

// Libro viejo de tapa dura con hojas sueltas adentro (BlenderKit «Old Hardcover
// Book», exportado con Draco: public/3d/libro.glb, 2 MB). El modelo viene
// acostado; aquí se para de frente y se mece. `libroState` lo mueve desde
// fuera (la sección lo anima con el scroll): `open` 0-1 lo recuesta y saca las
// hojas sueltas en abanico (la tapa es una sola pieza: no se abre); `x`/`y`
// son la posición como fracción de media pantalla.
export const libroState = { open: 0, x: 0, y: 0, scale: 1 };

// La textura del modelo trae grabado otro título en la tapa y el lomo. Aquí se
// tapa con un parche de cuero liso de la contratapa y se escribe «Fichas de
// cuidados»; el relieve de las letras viejas se aplana en el mapa de normales.
// Coordenadas sobre la textura medida a 900 px: [x, y, ancho, alto].
// [x, y, ancho, alto, x de origen, y de origen]: el cuero que tapa cada
// título sale del mismo sitio de la contratapa (510 px a la izquierda), así
// trae el mismo desgaste y la misma luz horneada
const OLD_TITLES = [
  [625, 280, 175, 225, 115, 280], // tapa
  [412, 262, 74, 40, 80, 220], // lomo, título
  [420, 524, 62, 36, 80, 220], // lomo, tomo
];
const FEATHER = 14; // px (a 900) en que el parche se funde con lo de alrededor

const BOOK_GREEN = [46, 72, 54]; // verde del cuero a media luz (r, g, b)

function retitle(material) {
  const font = getComputedStyle(document.body).getPropertyValue('--font-heading') || 'serif';
  const edit = (texture, draw) => {
    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(texture.image, 0, 0);
    const k = canvas.width / 900;
    ctx.scale(k, k);
    draw(ctx, canvas, k);
    texture.image = canvas;
    texture.needsUpdate = true;
  };
  // parche: un trozo de cuero liso de la contratapa encima de cada título
  // viejo, con los bordes difuminados para que no se vea el recuadro
  const patch = (ctx, canvas, k) =>
    OLD_TITLES.forEach(([x, y, w, h, sx, sy]) => {
      const f = FEATHER;
      const W = Math.round((w + 2 * f) * k);
      const H = Math.round((h + 2 * f) * k);
      const piece = document.createElement('canvas');
      piece.width = W;
      piece.height = H;
      const pc = piece.getContext('2d');
      pc.drawImage(canvas, (sx - f) * k, (sy - f) * k, W, H, 0, 0, W, H);
      // máscara: el rectángulo del título, desenfocado (sin `filter`, como en
      // Safari, queda el borde recto: se ve igual que antes)
      const mask = document.createElement('canvas');
      mask.width = W;
      mask.height = H;
      const mc = mask.getContext('2d');
      mc.filter = `blur(${(f * k) / 2.5}px)`;
      mc.fillRect(f * k * 0.6, f * k * 0.6, W - 1.2 * f * k, H - 1.2 * f * k);
      pc.globalCompositeOperation = 'destination-in';
      pc.drawImage(mask, 0, 0);
      ctx.drawImage(piece, x - f, y - f, w + 2 * f, h + 2 * f);
    });
  edit(material.map, (ctx, canvas, k) => {
    // el cuero rojo pasa a verde oscuro de colección de ciencias: cada pixel
    // rojizo se cambia por el verde con su misma luz (se conserva el grano);
    // el dorado de los filetes, que no es rojizo, queda igual
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const red = Math.min(1, Math.max(0, (r - d[i + 1] * 1.25) / (r * 0.45 + 1)));
      const light = r / 135;
      d[i] = r + (BOOK_GREEN[0] * light - r) * red;
      d[i + 1] += (BOOK_GREEN[1] * light - d[i + 1]) * red;
      d[i + 2] += (BOOK_GREEN[2] * light - d[i + 2]) * red;
    }
    ctx.putImageData(pixels, 0, 0);
    patch(ctx, canvas, k);
    ctx.fillStyle = '#c8a468';
    ctx.textAlign = 'center';
    ctx.font = `36px ${font}`;
    ctx.fillText('Fichas', 712, 345);
    ctx.fillText('cuidados', 712, 440);
    ctx.font = `italic 28px ${font}`;
    ctx.fillText('de', 712, 390);
    ctx.font = `15px ${font}`;
    ctx.fillText('Fichas', 449, 288);
  });
  // las letras viejas también eran metálicas: sin esto quedaba su sombra
  if (material.metalnessMap) edit(material.metalnessMap, patch);
  // el relieve también: con el grano del cuero de la contratapa (antes se
  // aplanaba y ese recuadro liso era lo que se notaba)
  if (material.normalMap) edit(material.normalMap, patch);
}

// Composición (unidades: metros). Una pared de concreto con su buró y un
// florero encima; a su derecha, casi pegado, un librero. El libro flota
// frente a la cámara. Con `open` la cámara se corre del buró al librero.
// Un cuadro cuelga detrás del buró (distrae del grano de la pared).
// Modelos de BlenderKit aligerados en Blender (texturas a 1024 px en WebP,
// mallas reducidas, Draco): pared, buro, florero y cuadro, 2.2 MB; el librero,
// que llena la pantalla al final, a 2048 px salvo el relieve del mueble (6.9 MB).
// cámara baja y cerca, mirando el buró de abajo hacia arriba; el arco cerrado
// de la sección enseña la lámpara entera, el florero y la cubierta abajo
const CAM_BURO = { pos: [0, 0.3, 2.5], look: [0, 0.88, 0] };
// el librero (1.8 m de ancho) va centrado en x 1.85, a la derecha del buró. La
// cámara termina en x 1.4 y a la misma distancia de antes (a escala con la
// lámpara): el librero llega hasta el borde derecho de la toma y a la
// izquierda asoman el buró y el cuadro
const SHELF_X = 1.85;
const CAM_LIBRERO = { pos: [1.4, 0.95, 3.1], look: [1.4, 0.85, 0] };
// del libro a la cámara: 2 m lo deja justo delante del buró, a su escala
// (con `scale` 0.3 mide unos 18 cm: chico al lado del buró). Al abrir se
// acerca a 1.1 m para no quedar detrás de las repisas (en pantalla mide lo mismo)
const BOOK_DISTANCE = 2;
const BOOK_DISTANCE_OPEN = 1.1;
// cuánta luz del HDRI recibe el libro (lo demás, 1): el doble de antes
const BOOK_LIGHT = 3.6;

export function buildLibro(THREE, { scene, camera, renderer }) {
  // iluminado solo con el HDRI, como el tocón y la mesa (sin luces propias),
  // a la mitad de intensidad: es un cuarto en penumbra
  lightWithHdri(THREE, scene, renderer);
  renderer.toneMappingExposure = 0.55;

  // el libro cuelga de la cámara: así conserva su sitio en pantalla mientras ella viaja
  scene.add(camera);
  const book = new THREE.Group();
  camera.add(book);
  let sheets = [];
  // velo oscuro 30 cm detrás del libro y delante del librero: al abrir apaga
  // el fondo para que la lista se lea, sin apagar el libro
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: 0x0b0e0d, transparent: true, opacity: 0, depthWrite: false }));
  camera.add(veil);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), new THREE.MeshStandardMaterial({ color: 0x15110e, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(2, 0, 4);
  scene.add(floor);

  Promise.all([import('three/examples/jsm/loaders/GLTFLoader.js'), import('three/examples/jsm/loaders/DRACOLoader.js')]).then(([{ GLTFLoader }, { DRACOLoader }]) => {
    const draco = new DRACOLoader().setDecoderPath('/draco/');
    const loader = new GLTFLoader().setDRACOLoader(draco);
    const load = (name, place) => loader.load(`/3d/${name}.glb`, (gltf) => place(gltf.scene));

    // la pared mide 4 m: cuatro tramos seguidos cubren del buró al librero y los bordes
    load('pared', (wall) => {
      // el concreto venía estirado sobre los 4 m del panel y se veía pixeleado:
      // se repite 3 veces, así el grano queda más chico y nítido
      // el modelo trae un arco recortado en el concreto que deja ver un panel
      // liso y claro; quedaba cortado en el borde de la toma: ese panel pasa
      // a ser del mismo concreto y la pared se lee lisa
      let concrete = null;
      wall.traverse((o) => {
        if (o.material?.name === 'Concrete') concrete = o.material;
      });
      wall.traverse((o) => {
        if (o.material?.name === 'Concrete - Clean' && concrete) o.material = concrete;
        // la tira de luz que delineaba el arco
        if (o.material?.name === 'led') o.visible = false;
        if (o.material?.name !== 'Concrete') return;
        [o.material.map, o.material.normalMap, o.material.roughnessMap, o.material.metalnessMap].forEach((t) => {
          if (!t) return;
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(3, 3);
          // la cámara la ve de abajo, en ángulo: sin filtrado anisótropo se emborrona
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
          t.needsUpdate = true;
        });
      });
      [-4, 0, 4, 8].forEach((x) => {
        const part = x ? wall.clone() : wall;
        part.position.x = x;
        scene.add(part);
      });
    });
    load('buro', (table) => {
      table.position.set(0, 0, 0.27);
      scene.add(table);
    });
    // chico, sobre la cubierta del buró (a 0.556 m), a la derecha de la lámpara y hacia atrás
    load('florero', (vase) => {
      vase.scale.setScalar(0.28);
      const box = new THREE.Box3().setFromObject(vase);
      const center = box.getCenter(new THREE.Vector3());
      vase.position.set(0.14 - center.x, 0.556 - box.min.y, 0.3 - center.z);
      scene.add(vase);
    });
    // el cuadro viene acostado (la pintura mira a +y): se para contra la
    // pared, centrado sobre el buró, detrás de la lámpara; mide 44 x 55 cm
    load('cuadro', (painting) => {
      painting.rotation.x = Math.PI / 2;
      painting.scale.setScalar(0.38);
      painting.position.set(0, 1.12, 0.06);
      scene.add(painting);
    });
    load('librero', (shelf) => {
      shelf.position.set(SHELF_X, 0, 0.06);
      scene.add(shelf);
    });
    load('libro', (model) => {
      // de pie: 2.1 de alto, centrado, con la tapa hacia la cámara
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const k = 2.1 / Math.max(size.x, size.z);
      model.scale.setScalar(k);
      model.position.copy(box.getCenter(new THREE.Vector3()).multiplyScalar(-k));
      const stand = new THREE.Group();
      stand.rotation.x = Math.PI / 2;
      stand.add(model);
      book.add(stand);
      // el título de la tapa pasa a ser el nuestro
      const leather = model.getObjectByName('Book_00')?.material;
      if (leather?.map) (document.fonts?.ready ?? Promise.resolve()).then(() => retitle(leather));
      // las hojas sueltas (planos) guardan su sitio para poder salir y volver
      model.traverse((o) => {
        // más luz solo al libro: la escena va en penumbra (exposición 0.55) y
        // de pie recibe poca luz del HDRI (alumbra desde arriba)
        if (o.isMesh) o.material.envMapIntensity = BOOK_LIGHT;
        if (o.isMesh && o.name.startsWith('Plane')) sheets.push({ o, x: o.position.x, z: o.position.z, r: o.rotation.y });
      });
      sheets = sheets.sort((a, b) => a.o.position.y - b.o.position.y);
    });
  });

  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const mix = (a, b, t) => a + (b - a) * t;

  return (time) => {
    const o = libroState.open;
    const e = o * o * (3 - 2 * o);
    const s = time * 0.001;

    // cámara: del buró al librero de al lado
    pos.set(...CAM_BURO.pos.map((v, i) => mix(v, CAM_LIBRERO.pos[i], e)));
    look.set(...CAM_BURO.look.map((v, i) => mix(v, CAM_LIBRERO.look[i], e)));
    camera.position.copy(pos);
    camera.lookAt(look);
    veil.material.opacity = 0.62 * e;

    // libro, en el espacio de la cámara: x/y son fracción de media pantalla
    const dist = mix(BOOK_DISTANCE, BOOK_DISTANCE_OPEN, e);
    veil.position.z = -(dist + 0.3);
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * dist;
    // cerrado se mece enseñando tapa, lomo y cantos; abierto queda recostado, casi quieto
    book.rotation.y = (1 - e) * (0.55 * Math.sin(s * 0.5) - 0.25) + e * (0.1 * Math.sin(s * 0.4) - 0.2);
    book.rotation.x = 0.18 * (1 - e) - 0.55 * e + 0.03 * Math.sin(s * 0.8);
    book.rotation.z = -0.12 * e;
    book.position.set(libroState.x * halfH * camera.aspect, (libroState.y + 0.02 * Math.sin(s * 0.9)) * halfH, -dist);
    // `scale` 1 = el libro ocupa ~56% del alto; en pantallas angostas se achica al abrir
    book.scale.setScalar(((libroState.scale * 2 * halfH) / 3.75) * (1 - e * (1 - Math.min(1, camera.aspect / 1.6))));
    // las hojas salen en abanico (unidades del modelo: metros)
    sheets.forEach((sheet, i) => {
      const fan = i - (sheets.length - 1) / 2;
      sheet.o.position.x = sheet.x + e * (0.07 + i * 0.012);
      sheet.o.position.z = sheet.z + e * fan * 0.035;
      sheet.o.rotation.y = sheet.r - e * fan * 0.22;
    });
  };
}

// Registro por clave: OdScene recibe un string serializable (para poder usarse
// desde páginas server component) y aquí se resuelve la función + la cámara.
export const SCENES = {
  cactus: { build: buildCactus, opts: { fov: 30, position: [0, 0.4, 7], lookAt: [0, 0, 0] } },
  tocon: { build: buildStump, opts: { fov: 32, position: [0, 0.7, 6.6], lookAt: [0, 0, 0] } },
  // ~12 MB de modelos: se arma solo cuando la sección se acerca (lazy)
  libro: { build: buildLibro, opts: { fov: 30, position: [0, 0, 7], lookAt: [0, 0, 0], lazy: true } },
  mesa: { build: buildMesaAcuario, opts: { fov: 30, position: [0, 1.7, 6.2], lookAt: [0, 0, 0], background: 0x000000 } },
};
