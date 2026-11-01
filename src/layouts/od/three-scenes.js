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

// Mesa Nimbus con un acuario plantado encima, sin peces ni agua (Poliigon
// CoffeeTableNimbusGoldReplica001 + aquarium.blend; materiales horneados,
// pasto aclarado y malla comprimida con Draco en Blender:
// public/3d/mesa-acuario.glb, 1 MB). El vidrio usa transmisión. Fondo oscuro,
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

// Registro por clave: OdScene recibe un string serializable (para poder usarse
// desde páginas server component) y aquí se resuelve la función + la cámara.
export const SCENES = {
  cactus: { build: buildCactus, opts: { fov: 30, position: [0, 0.4, 7], lookAt: [0, 0, 0] } },
  tocon: { build: buildStump, opts: { fov: 32, position: [0, 0.7, 6.6], lookAt: [0, 0, 0] } },
  mesa: { build: buildMesaAcuario, opts: { fov: 30, position: [0, 1.7, 6.2], lookAt: [0, 0, 0], background: 0x3b403d } },
};
