'use client';

// Montaje compartido de las tres escenas three.js.
// - importación dinámica: three no entra al bundle inicial
// - no monta en viewport < 700px ni con prefers-reduced-motion
// - render pausado fuera de pantalla (IntersectionObserver)
// - dispose() de geometrías, materiales y renderer al desmontar
import { useEffect, useRef } from 'react';

type Build = (three: typeof import('three'), ctx: {
  scene: import('three').Scene;
  camera: import('three').PerspectiveCamera;
  width: number;
  height: number;
}) => (time: number) => void;

interface Options {
  /** FOV y posición de cámara: jar (32, 0,0.5,10.5) · log (32, 0,0.2,7.4) · stack (30, 0,3.4,17) */
  fov: number;
  position: [number, number, number];
  lookAt?: [number, number, number];
  /** stack usa fondo 0xd8d9d6; jar y log son alpha */
  background?: number | null;
  minWidth?: number;
}

export function useThreeScene(build: Build, opts: Options) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || window.innerWidth < (opts.minWidth ?? 700)) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const width = el.clientWidth || 380;
      const height = el.clientHeight || 500;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: opts.background == null,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.domElement.style.display = 'block';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      if (opts.background != null) scene.background = new THREE.Color(opts.background);
      const camera = new THREE.PerspectiveCamera(opts.fov, width / height, 0.1, 100);
      camera.position.set(...opts.position);
      camera.lookAt(...(opts.lookAt ?? [0, 0, 0]));

      const step = build(THREE, { scene, camera, width, height });

      let raf = 0;
      let visible = true;
      const tick = (t: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        step(t);
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: '120px' },
      );
      io.observe(el);

      const onResize = () => {
        const w = el.clientWidth || width;
        const h = el.clientHeight || height;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('resize', onResize);
        scene.traverse((obj) => {
          const mesh = obj as import('three').Mesh;
          mesh.geometry?.dispose?.();
          const mat = mesh.material as import('three').Material | import('three').Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose?.();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
