import { useEffect, useState } from "react";
import { syncUrl } from "../lib/routing";

/**
 * Tracks which scene section currently owns the viewport center.
 * Accurately handles long multi-viewport scroll scenes (e.g. Scene 5 at 660vh).
 */
export function useActiveScene(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let currentActive = ids[0];
    
    // IntersectionObserver natively shifts bounding calculations to the browser GPU thread
    const observer = new IntersectionObserver(
      (entries) => {
        // We only care about elements that are currently intersecting the threshold
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentActive = entry.target.id;
          }
        });
        
        setActive((prev) => {
          if (prev !== currentActive) {
            syncUrl(currentActive, true); // replaceState on scroll
            return currentActive;
          }
          return prev;
        });
      },
      {
        root: null,
        // Trigger when the element reaches 25% down from the top of the viewport
        rootMargin: "-25% 0px -65% 0px", 
        threshold: 0
      }
    );

    // Observe all scenes
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [ids.join("|")]);

  return active;
}
