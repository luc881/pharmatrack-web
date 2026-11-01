// ----------------------------------------------------------------------
// Constructores de las escenas three.js (modelos de Poliigon reducidos en
// Blender, en public/3d). Cada uno recibe (THREE, { scene, camera, renderer }) y devuelve un
// `step(time)` que anima el grupo; el hook useThreeScene se encarga del render,
// el IntersectionObserver y el dispose.
// ----------------------------------------------------------------------

// Tocón fotoescaneado (Poliigon TreeStump024, reducido a 15k triángulos y
// texturas 1K en Blender: public/3d/tocon.glb). Gira lento; el GLTFLoader se
// importa solo aquí para no pesar en el resto del sitio.
export function buildStump(THREE, { scene }) {
  scene.add(new THREE.HemisphereLight(0xf4ead9, 0x2a231c, 1.1));
  const key = new THREE.DirectionalLight(0xfff1d8, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ad07a, 0.9);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

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

  // gira lento y sube y baja apenas, como flotando
  return (t) => {
    g.rotation.y += 0.003;
    g.position.y = Math.sin(t * 0.0009) * 0.09;
    g.rotation.z = Math.sin(t * 0.0006) * 0.025;
  };
}

// Mesa Nimbus con una roca con musgo encima (Poliigon CoffeeTableNimbusGold
// Replica001 + RockBoulderLarge049, combinados y reducidos en Blender:
// public/3d/mesa-roca.glb). Fondo gris verdoso oscuro (en blanco se perdían los detalles); solo gira. El ambiente de reflejos
// (RoomEnvironment) hace que la base dorada se vea como metal.
export function buildMesaRoca(THREE, { scene, renderer }) {
  import('three/examples/jsm/environments/RoomEnvironment.js').then(({ RoomEnvironment }) => {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  });
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4cc, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 4);
  scene.add(key);

  const g = new THREE.Group();
  scene.add(g);
  import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
    new GLTFLoader().load('/3d/mesa-roca.glb', (gltf) => {
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

// Registro por clave: OdScene recibe un string serializable (para poder usarse
// desde páginas server component) y aquí se resuelve la función + la cámara.
export const SCENES = {
  tocon: { build: buildStump, opts: { fov: 32, position: [0, 0.7, 6.6], lookAt: [0, 0, 0] } },
  mesa: { build: buildMesaRoca, opts: { fov: 30, position: [0, 1.7, 6.2], lookAt: [0, 0, 0], background: 0x3b403d } },
};
