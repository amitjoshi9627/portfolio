import { useEffect } from "react";

/**
 * Listens for "hardcut" events dispatched by the film reel navigator
 * and triggers a cinematic hard cut flash.
 */
export function useHardCut(reduced: boolean, onCut?: () => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.id) return;

      if (reduced) {
        onCut?.();
        return;
      }

      // Create the cinematic hard cut overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        background: #0a0a0a;
        opacity: 0;
      `;
      document.body.appendChild(overlay);

      // Flash
      requestAnimationFrame(() => {
        overlay.style.transition = "opacity 60ms linear";
        overlay.style.opacity = "0.92";

        setTimeout(() => {
          overlay.style.transition = "opacity 140ms ease-out";
          overlay.style.opacity = "0";

          setTimeout(() => {
            overlay.remove();
            onCut?.();
          }, 180);
        }, 70);
      });
    };

    window.addEventListener("hardcut", handler);
    return () => window.removeEventListener("hardcut", handler);
  }, [reduced, onCut]);
}
