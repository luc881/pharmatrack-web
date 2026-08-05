// ----------------------------------------------------------------------
// Constructores de las escenas three.js, portados literalmente del prototipo
// (initJar / initLog). Cada uno recibe (THREE, { scene, camera }) y devuelve un
// `step(time)` que anima el grupo; el hook useThreeScene se encarga del render,
// el IntersectionObserver y el dispose.
// ----------------------------------------------------------------------

// Frasco de vidrio con bandeja, sustrato, musgo y hojarasca (bloque oscuro del
// home). Cámara: PerspectiveCamera(32) en (0, 0.5, 10.5), alpha.
export function buildJar(THREE, { scene }) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f6f, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe9c9, 0.8);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xdfe6e2, transmission: 0.95, thickness: 0.5, roughness: 0.06, metalness: 0, ior: 1.5, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
  const R = 1.6;
  const H = 4.0;
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 72, 1, true), glass));
  const topGlass = new THREE.Mesh(new THREE.CircleGeometry(R, 72), glass);
  topGlass.rotation.x = -Math.PI / 2;
  topGlass.position.y = H / 2;
  g.add(topGlass);

  const tray = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.12, R + 0.12, 0.55, 72), new THREE.MeshStandardMaterial({ color: 0x1b1917, roughness: 0.7, metalness: 0.1 }));
  tray.position.y = -H / 2 + 0.18;
  g.add(tray);
  const water = new THREE.Mesh(new THREE.CircleGeometry(R - 0.06, 72), new THREE.MeshStandardMaterial({ color: 0x2b2a24, roughness: 0.25, metalness: 0.2 }));
  water.rotation.x = -Math.PI / 2;
  water.position.y = -H / 2 + 0.46;
  g.add(water);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.08, R - 0.08, 0.5, 64), new THREE.MeshStandardMaterial({ color: 0x2e2419, roughness: 1 }));
  soil.position.y = -H / 2 + 0.7;
  g.add(soil);

  const mossMat = new THREE.MeshStandardMaterial({ color: 0x3f6b25, roughness: 1, flatShading: true });
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 16), mossMat);
  mound.scale.set(1.0, 0.72, 1.0);
  mound.position.y = -H / 2 + 1.0;
  g.add(mound);
  for (let i = 0; i < 22; i += 1) {
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.16 + Math.random() * 0.2, 10, 8), mossMat);
    const a = Math.random() * Math.PI * 2;
    const r = 0.25 + Math.random() * 0.95;
    t.position.set(Math.cos(a) * r, -H / 2 + 1.05 + Math.random() * 0.55 - r * 0.35, Math.sin(a) * r);
    t.scale.y = 0.7;
    g.add(t);
  }
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x4a3a29, roughness: 1, flatShading: true });
  for (let i = 0; i < 3; i += 1) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.4 + Math.random() * 0.7, 7), barkMat);
    const a = i * 2.1 + 0.6;
    b.position.set(Math.cos(a) * 0.55, -H / 2 + 1.5, Math.sin(a) * 0.55);
    b.rotation.set((Math.random() - 0.5) * 0.5, a, 0.25 + Math.random() * 0.3);
    g.add(b);
  }
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f7a2c, roughness: 0.75, side: THREE.DoubleSide });
  for (let i = 0; i < 26; i += 1) {
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.16 + Math.random() * 0.1, 6), leafMat);
    const a = Math.random() * Math.PI * 2;
    const r = 0.3 + Math.random() * 1.1;
    l.position.set(Math.cos(a) * r, -H / 2 + 1.2 + Math.random() * 1.3, Math.sin(a) * r);
    l.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    g.add(l);
  }
  const litterMat = new THREE.MeshStandardMaterial({ color: 0x7b5228, roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 18; i += 1) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.22 + Math.random() * 0.12, 5), litterMat);
    const a = Math.random() * Math.PI * 2;
    const r = 0.5 + Math.random() * 0.95;
    p.position.set(Math.cos(a) * r, -H / 2 + 0.98 - r * 0.2, Math.sin(a) * r);
    p.rotation.set(-Math.PI / 2 + (Math.random() - 0.5) * 0.8, Math.random() * Math.PI, 0);
    g.add(p);
  }
  const lamp = new THREE.MeshStandardMaterial({ color: 0xe8e6e1, roughness: 0.4, metalness: 0.2 });
  for (let i = 0; i < 3; i += 1) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 16, 1, true), lamp);
    c.material.side = THREE.DoubleSide;
    c.position.set(-0.55 + i * 0.55, H / 2 - 0.35, i % 2 ? 0.3 : -0.25);
    c.rotation.x = Math.PI;
    g.add(c);
  }
  const glow = new THREE.PointLight(0xfff3d6, 6, 6, 2);
  glow.position.set(0, H / 2 - 0.6, 0);
  g.add(glow);
  g.rotation.x = 0.05;
  scene.add(g);

  return () => {
    g.rotation.y += 0.005;
  };
}

// Tronco de corteza deformada con anillos, musgo y hojarasca (criadero).
// Cámara: PerspectiveCamera(32) en (0, 0.2, 7.4), alpha.
export function buildLog(THREE, { scene }) {
  scene.add(new THREE.HemisphereLight(0xf4ead9, 0x2a231c, 0.9));
  const key = new THREE.DirectionalLight(0xfff1d8, 1.7);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ad07a, 0.5);
  rim.position.set(-4, 1, -3);
  scene.add(rim);

  const g = new THREE.Group();
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x5b4530, roughness: 1, flatShading: true });
  const trunkGeo = new THREE.CylinderGeometry(0.72, 0.86, 5.4, 22, 8, false);
  const pos = trunkGeo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = Math.sin(y * 5.5 + x * 3.1) * 0.045 + Math.cos(z * 4.3 + y * 2.2) * 0.05;
    const r = Math.hypot(x, z) || 1;
    pos.setX(i, x + (x / r) * n);
    pos.setZ(i, z + (z / r) * n);
  }
  trunkGeo.computeVertexNormals();
  g.add(new THREE.Mesh(trunkGeo, barkMat));

  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc0a074, roughness: 0.85 });
  [-1, 1].forEach((sgn) => {
    const cap = new THREE.Mesh(new THREE.CircleGeometry(sgn > 0 ? 0.74 : 0.87, 26), ringMat);
    cap.position.y = sgn * 2.71;
    cap.rotation.x = sgn > 0 ? -Math.PI / 2 : Math.PI / 2;
    g.add(cap);
    for (let k = 1; k <= 3; k += 1) {
      const rg = new THREE.Mesh(new THREE.TorusGeometry(0.19 * k, 0.012, 6, 30), new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 0.9 }));
      rg.position.y = sgn * 2.72;
      rg.rotation.x = Math.PI / 2;
      g.add(rg);
    }
  });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x4a7a2e, roughness: 1, flatShading: true });
  for (let i = 0; i < 34; i += 1) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.14 + Math.random() * 0.16, 8, 6), mossMat);
    const a = Math.random() * Math.PI * 2;
    m.position.set(Math.sin(a) * 0.78, (Math.random() - 0.5) * 4.9, Math.cos(a) * 0.78);
    m.scale.set(1, 0.72, 0.8);
    g.add(m);
  }
  const litter = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 10; i += 1) {
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.2 + Math.random() * 0.12, 5), litter);
    const a = Math.random() * Math.PI * 2;
    l.position.set(Math.sin(a) * 0.85, (Math.random() - 0.5) * 4.6, Math.cos(a) * 0.85);
    l.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    g.add(l);
  }
  g.rotation.z = 0.05;
  scene.add(g);

  return () => {
    g.rotation.y += 0.006;
  };
}

// Mesa de frascos apilados (divisor 3D de las vistas interiores).
// Cámara: PerspectiveCamera(30) en (0, 3.4, 17), fondo 0xd8d9d6.
export function buildStack(THREE, { scene }) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9b7b0, 1.0));
  const key = new THREE.DirectionalLight(0xfff6e6, 2.0);
  key.position.set(4, 7, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-5, 2, 4);
  scene.add(fill);

  const g = new THREE.Group();
  const pale = new THREE.MeshStandardMaterial({ color: 0xe8e7e3, roughness: 0.55 });
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 3.2, 48), pale);
  plinth.position.y = -3.1;
  g.add(plinth);
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.18, 56), pale);
  tableTop.position.y = -1.42;
  g.add(tableTop);
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.5, 48), new THREE.MeshStandardMaterial({ color: 0xcfcdc8, roughness: 0.6 }));
  tray.position.y = -1.05;
  g.add(tray);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.12, 56), pale);
  disc.position.y = -0.74;
  g.add(disc);

  const palette = [0xc9603a, 0xd9a13c, 0x8fa8b8, 0x2f2c29, 0xe8e7e3, 0x7d9576, 0xb8724a, 0xd8d2c4];
  const rows = [7, 5, 3, 1];
  let y = -0.42;
  rows.forEach((count, ri) => {
    const radius = ri === rows.length - 1 ? 0 : (0.42 * (count - 1)) / 2 + 0.28;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + ri * 0.5;
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.72, 28), new THREE.MeshStandardMaterial({ color: palette[(ri * 3 + i) % palette.length], roughness: 0.42 }));
      jar.position.set(Math.cos(a) * radius, y + 0.36, Math.sin(a) * radius);
      g.add(jar);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.07, 28), pale);
      lid.position.set(jar.position.x, y + 0.75, jar.position.z);
      g.add(lid);
    }
    y += 0.78;
  });
  scene.add(g);

  return () => {
    g.rotation.y += 0.004;
  };
}

// Registro por clave: OdScene recibe un string serializable (para poder usarse
// desde páginas server component) y aquí se resuelve la función + la cámara.
export const SCENES = {
  jar: { build: buildJar, opts: { fov: 32, position: [0, 0.5, 10.5] } },
  log: { build: buildLog, opts: { fov: 32, position: [0, 0.2, 7.4], lookAt: [0, 0, 0] } },
  stack: { build: buildStack, opts: { fov: 30, position: [0, 3.4, 17], lookAt: [0, -0.6, 0], background: 0xd8d9d6 } },
};
