import { useEffect, useState } from "react";

/**
 * Drives a looping, stepped animation for a scene visual.
 * - Inactive scenes stay at step 0 and run no timers.
 * - Reduced-motion users are shown the final, fully-constructed state.
 */
export function useSequence(
  active: boolean,
  steps: number,
  interval = 1200,
  reduced = false,
): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    setTick(0);
    const id = window.setInterval(() => setTick((t) => (t + 1) % (steps + 3)), interval);
    return () => window.clearInterval(id);
  }, [active, reduced, steps, interval]);

  if (reduced) return steps;
  if (!active) return 0;
  return Math.min(tick, steps);
}
