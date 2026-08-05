'use client';

// Carrusel con autoavance: 8000 ms en el prototipo. Se pausa con hover/foco y con motion reducido.
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCarousel(length: number, intervalMs = 8000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || paused || length < 2) return;
    timer.current = window.setInterval(next, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, length, intervalMs, next]);

  /** Repartir en el contenedor: onMouseEnter/Leave/FocusCapture/BlurCapture. */
  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(length).padStart(2, '0')}`;

  return { index, setIndex, next, prev, counter, pauseHandlers };
}
