import { useEffect } from "react";
import Lenis from "lenis";

let lenisRef: Lenis | null = null;

/** Scroll to an element id through Lenis when available, natively otherwise. */
export function scrollToId(
  id: string,
  options?: { immediate?: boolean; duration?: number; offset?: number }
) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) {
    if (options?.immediate) {
      lenisRef.scrollTo(el, { immediate: true, offset: options?.offset ?? 0 });
    } else {
      lenisRef.scrollTo(el, { offset: options?.offset ?? 0, duration: options?.duration ?? 1.1 });
    }
  } else {
    if (options?.immediate) {
      if (options?.offset) {
        const y = el.getBoundingClientRect().top + window.scrollY + options.offset;
        window.scrollTo({ top: y, behavior: "auto" });
      } else {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    } else {
      if (options?.offset) {
        const y = el.getBoundingClientRect().top + window.scrollY + options.offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
}

export function scrollToTop() {
  const openingEl = document.getElementById("opening");
  if (lenisRef) {
    if (openingEl) {
      lenisRef.scrollTo(openingEl, { offset: 0, duration: 1.1 });
    } else {
      lenisRef.scrollTo(0, { duration: 1.1 });
    }
  } else {
    if (openingEl) {
      openingEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

/** Absolute scroll position — used by the editing timeline scrubber. */
export function scrollToY(y: number, duration = 1.1) {
  if (lenisRef) lenisRef.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Hard cut back to the head of the film — used behind the rewind overlay. */
export function jumpToTop() {
  if (lenisRef) lenisRef.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0, behavior: "auto" });
}

/**
 * Lenis smooth scrolling. Disabled entirely for reduced-motion users and on
 * touch devices, where native momentum scrolling is better.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      lenisRef = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef = null;
    };
  }, [enabled]);
}
