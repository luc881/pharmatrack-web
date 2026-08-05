'use client';

import { useRef, useState, useEffect } from 'react';

// ----------------------------------------------------------------------
// Montaje compartido de las escenas three.js (portado del handoff).
// - importación dinámica: three no entra al bundle inicial
// - no monta en viewport < 700px ni con prefers-reduced-motion (degrada a la
//   imagen de respaldo del contenedor)
// - render pausado fuera de pantalla (IntersectionObserver)
// - dispose() de geometrías, materiales y renderer al desmontar
// Devuelve { ref, mounted }: `mounted` sirve para ocultar el respaldo cuando la
// escena ya está en pantalla.
// ----------------------------------------------------------------------

export function useThreeScene(build, opts) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || window.innerWidth < (opts.minWidth ?? 700)) return undefined;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const width = el.clientWidth || 380;
      const height = el.clientHeight || 500;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: opts.background == null });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      if (opts.background != null) scene.background = new THREE.Color(opts.background);
      const camera = new THREE.PerspectiveCamera(opts.fov, width / height, 0.1, 100);
      camera.position.set(...opts.position);
      camera.lookAt(...(opts.lookAt ?? [0, 0, 0]));

      const step = build(THREE, { scene, camera, width, height });
      setMounted(true);

      let raf = 0;
      let visible = true;
      const tick = (t) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        step(t);
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);

      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '120px' });
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
          obj.geometry?.dispose?.();
          const mat = obj.material;
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

  return { ref, mounted };
}
