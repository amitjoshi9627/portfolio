import { useEffect, useState } from "react";

function query(q: string): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(q).matches;
}

function useMedia(q: string): boolean {
  const [matches, setMatches] = useState(() => query(q));

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(q);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [q]);

  return matches;
}

export interface Environment {
  /** User asked for less motion — every non-essential animation must stop. */
  reduced: boolean;
  /** Viewport below the tablet breakpoint. */
  mobile: boolean;
  /** Below the desktop breakpoint — pinned horizontal scenes unroll vertically. */
  compact: boolean;
  /** No precise pointer — hide the custom cursor, enlarge hit areas. */
  touch: boolean;
  /** Cheap heuristic for low-powered devices. */
  lowPower: boolean;
}

export function useEnvironment(): Environment {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMedia("(max-width: 767px)");
  const compact = useMedia("(max-width: 1023px)");
  const touch = useMedia("(hover: none), (pointer: coarse)");

  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const isBrowser = typeof navigator !== "undefined";
    const cores = isBrowser ? (navigator.hardwareConcurrency ?? 8) : 8;
    setLowPower(cores <= 4);
  }, []);

  return { reduced, mobile, compact, touch, lowPower };
}
