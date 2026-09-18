import { motion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";

interface DirectorAnnotationProps {
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
  reduced: boolean;
  visible: boolean;
}

/**
 * Small handwritten director note that appears contextually.
 */
export function DirectorAnnotation({
  text,
  position,
  delay = 0,
  reduced,
  visible,
}: DirectorAnnotationProps) {
  const positions = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  };

  if (!visible) return null;

  return (
    <motion.div
      className={`hand pointer-events-none absolute z-10 max-w-[160px] text-[13px] leading-tight text-amber-dust/90 ${positions[position]}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease: EASE_OUT }}
    >
      {text}
      <span className="ml-1.5 text-[10px] text-ember/60">— AJ</span>
    </motion.div>
  );
}
