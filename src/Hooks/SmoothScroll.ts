import { useEffect } from 'react'

// Lenis smooth scroll, skipped for reduced motion
export function useSmoothScroll() {
  useEffect(() => {
    const w = window as Window & { Lenis?: new (opts: { lerp: number }) => { raf: (t: number) => void } }
    if (w.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      const lenis = new w.Lenis({ lerp:0.15 });
      let rafId = 0;
      const lenisRaf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(lenisRaf); };
      rafId = requestAnimationFrame(lenisRaf);
      return () => cancelAnimationFrame(rafId);
    }
  }, [])
}