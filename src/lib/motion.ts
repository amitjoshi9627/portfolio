import type { Transition, Variants } from "framer-motion";

/** Shared easing curves — slow, filmic, never bouncy unless intentional. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_FILM = [0.4, 0, 0.1, 1] as const;

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 22,
  mass: 0.7,
};

export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.5,
};

/** A slow dissolve — for scene-to-scene continuity. */
export const dissolve: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

/** Camera-style push: the frame settles toward the viewer. */
export const dolly: Variants = {
  hidden: { opacity: 0, scale: 1.08, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: EASE_OUT },
  },
};

/** Editorial line rise, used for large display type. */
export const riseLine: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_OUT } },
};

/** A hard cut — no fade, just a snap of scale. Use sparingly. */
export const hardCut: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: "linear" } },
};

/** Clip-path wipe, like a matte opening across the frame. */
export const wipeX: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.2, ease: EASE_FILM },
  },
};

export const wipeUp: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0.4 },
  show: {
    clipPath: "inset(0% 0 0 0)",
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_FILM },
  },
};

export const stagger = (each = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/** Viewport defaults so sections trigger once, slightly before entering. */
export const inView = { once: true, amount: 0.35, margin: "0px 0px -10% 0px" } as const;
export const inViewSoft = { once: true, amount: 0.2, margin: "0px 0px -5% 0px" } as const;
