import { useEffect } from "react";
import Lenis from "lenis";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useLenis() {
  useEffect(() => {
    // Keep enabled even if OS prefers reduced motion (user requested smooth scrolling).
    // If you want to respect reduced motion, uncomment:
    // if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      // Inertia / momentum feel: duration + easing (no `lerp`)
      duration: 0.75,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1.6,
      touchMultiplier: 1,
      syncTouch: false,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);
}

