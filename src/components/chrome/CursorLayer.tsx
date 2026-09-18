import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Custom cursor. Any element can request a label with `data-cursor="VIEW"`.
 * Hidden on touch devices; falls back to the native cursor there.
 */

interface Firefly {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  duration: number;
}

export function CursorLayer({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 800, damping: 45, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 800, damping: 45, mass: 0.2 });

  const [hovered, setHovered] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const fireflyIdCounter = useRef(0);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("no-native-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest?.("button, a, input, select, textarea, [role='button'], [data-cursor], .cursor-pointer")
      );
      setHovered(isInteractive);

      // Spawn subtle fireflies
      const now = performance.now();
      // Throttle spawn rate to avoid overwhelming DOM
      if (now - lastSpawnTime.current > 120 && Math.random() > 0.4) {
        lastSpawnTime.current = now;
        const id = fireflyIdCounter.current++;
        
        const startX = e.clientX + (Math.random() * 10 - 5);
        const startY = e.clientY + (Math.random() * 10 - 5);
        // Fly up smoothly, drift slightly left/right
        const endX = startX + (Math.random() * 100 - 50);
        const endY = startY - (100 + Math.random() * 150); 
        const duration = 5.5 + Math.random() * 2; // ~6-7 seconds
        
        const newFirefly: Firefly = {
          id,
          startX,
          startY,
          endX,
          endY,
          size: 1.5 + Math.random() * 2,
          duration,
        };

        setFireflies((prev) => [...prev.slice(-20), newFirefly]);

        // Remove after duration
        setTimeout(() => {
          setFireflies((prev) => prev.filter((f) => f.id !== id));
        }, duration * 1000);
      }
    };
    
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("no-native-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Firefly Trail Layer */}
      <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
        <AnimatePresence>
          {fireflies.map((ff) => (
            <motion.div
              key={ff.id}
              className="absolute rounded-full bg-sunset-glow"
              initial={{ opacity: 0, x: ff.startX, y: ff.startY }}
              animate={{
                opacity: [0, 0.6, 0.8, 0],
                x: ff.endX,
                y: ff.endY,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: ff.duration, ease: [0.25, 0.1, 0.25, 1] }} // Smooth quadratic bezier
              style={{
                width: ff.size,
                height: ff.size,
                boxShadow: "0 0 6px 1px rgba(249, 229, 150, 0.3)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Minimalist Cursor Layer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[160] mix-blend-difference"
        style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
          animate={{ scale: down ? 0.75 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          {/* Inner precision dot */}
          <motion.div
            className="rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            animate={{
              width: hovered ? 4 : 5,
              height: hovered ? 4 : 5,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
          />
          
          {/* Compact hover ring */}
          <motion.div
            className="absolute rounded-full border border-white/80 pointer-events-none"
            animate={{
              width: hovered ? 26 : 14,
              height: hovered ? 26 : 14,
              opacity: hovered ? 0.9 : 0.35,
              backgroundColor: hovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0)",
            }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
