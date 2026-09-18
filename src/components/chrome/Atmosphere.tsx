import { memo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Props {
  reduced: boolean;
  lowPower: boolean;
}

const LEAVES = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 47) % 100,
  top: (i * 31) % 100,
  size: 6 + ((i * 7) % 12),
  duration: 12 + ((i * 5) % 14),
  delay: -(i * 2.3),
  rotate: (i * 45) % 360,
  opacity: 0.4 + ((i % 4) * 0.15),
}));

/**
 * The world's lighting. One fixed stack of gradient layers whose opacities are
 * driven by page scroll, moving the film through:
 * morning meadow → bright afternoon → golden hour sunset → starry night.
 */
export const Atmosphere = memo(function Atmosphere({ reduced, lowPower }: Props) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 });

  const morning = useTransform(p, [0.03, 0.14, 0.3, 0.4], [0, 0.9, 0.9, 0]);
  const day = useTransform(p, [0.28, 0.4, 0.55, 0.66], [0, 0.9, 0.9, 0]);
  const sunset = useTransform(p, [0.6, 0.72, 0.84, 0.93], [0, 0.9, 0.9, 0]);
  const night = useTransform(p, [0.88, 0.97], [0, 1]);

  const horizonY = useTransform(p, [0, 1], ["10%", "-24%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden bg-[#e0f3ff]">
      {/* ── BASE SKY (Light Blue) ───────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87ceeb] to-[#e0f3ff]" />

      {/* ── MORNING ────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#a1d9f1] via-[#d0ebf6] to-[#e8f6fc]"
        style={{ opacity: morning }}
      />
      
      {/* ── BRIGHT AFTERNOON ───────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#6cbdeb] via-[#aedcf4] to-[#f0f8fb]"
        style={{ opacity: day }}
      />
      
      {/* ── GOLDEN HOUR SUNSET ─────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#ff8c42] via-[#ffb372] to-[#ffdea1]"
        style={{ opacity: sunset }}
      />
      
      {/* ── STARRY NIGHT ───────────────────────────────────────────────── */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#1a2542] via-[#2c3e66] to-[#455b85]" 
        style={{ opacity: night }} 
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(1px 1px at 10% 20%, white, transparent), radial-gradient(1.5px 1.5px at 30% 40%, white, transparent), radial-gradient(2px 2px at 80% 15%, white, transparent), radial-gradient(1px 1px at 70% 60%, white, transparent), radial-gradient(1px 1px at 50% 80%, white, transparent)", backgroundSize: "200px 200px" }} />
      </motion.div>

      {/* ── SUN / MOON ─────────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 h-[70vh] w-[130vw] -translate-x-1/2 rounded-[50%]"
        style={{ 
          top: "40%", 
          y: horizonY,
          background: "radial-gradient(closest-side, rgba(245,215,110,0.6), transparent 75%)" 
        }}
      />

      {/* ── BLOWING LEAVES & POLLEN ─────────────────────────────────────── */}
      {!reduced && !lowPower ? (
        <div className="absolute inset-0">
          {LEAVES.map((leaf, i) => (
            <span
              key={i}
              className="absolute rounded-bl-full rounded-tr-full bg-[#7eb86c]"
              style={{
                left: `${leaf.left}%`,
                top: `${leaf.top}%`,
                width: leaf.size,
                height: leaf.size * 1.5,
                opacity: leaf.opacity,
                transform: `rotate(${leaf.rotate}deg)`,
                animation: `drift-up ${leaf.duration}s ease-in-out ${leaf.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});
