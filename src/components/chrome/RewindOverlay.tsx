import { AnimatePresence, motion } from "framer-motion";
import { Rewind } from "lucide-react";

const BANDS = [0, 1, 2, 3, 4, 5];

/**
 * Full-frame rewind treatment: the tape runs backwards while the page snaps to
 * the head of the film. Purely decorative — the scroll happens regardless.
 */
export function RewindOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* darkened gate */}
          <motion.div
            className="absolute inset-0 bg-ink-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.94, 0.94, 0.7] }}
            transition={{ duration: 1.5, times: [0, 0.18, 0.75, 1] }}
          />

          {/* tape bands travelling backwards */}
          {BANDS.map((b) => (
            <motion.div
              key={b}
              className="absolute inset-x-0 h-[22vh] bg-[linear-gradient(to_bottom,transparent,rgba(245,241,232,0.07),rgba(245,241,232,0.02),transparent)]"
              initial={{ y: "-40vh" }}
              animate={{ y: "140vh" }}
              transition={{
                duration: 0.42,
                ease: "linear",
                repeat: Infinity,
                delay: b * 0.07,
              }}
            />
          ))}

          {/* horizontal tracking tears */}
          <motion.div
            className="absolute inset-x-0 h-[3px] bg-paper/25"
            animate={{ y: ["92vh", "-6vh"] }}
            transition={{ duration: 0.31, ease: "linear", repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-x-0 h-px bg-ember/60"
            animate={{ y: ["70vh", "-10vh"] }}
            transition={{ duration: 0.47, ease: "linear", repeat: Infinity }}
          />

          {/* jitter frame */}
          <motion.div
            className="absolute inset-0 border border-paper/10"
            animate={{ x: [0, -3, 2, -1, 0], y: [0, 2, -2, 1, 0] }}
            transition={{ duration: 0.18, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <motion.div
              className="flex items-center gap-3 text-paper"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            >
              <Rewind size={22} strokeWidth={1.4} />
              <span className="label text-base tracking-[0.4em]">REWIND</span>
            </motion.div>
            <motion.span
              className="font-mono text-xs tracking-[0.3em] text-paper/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ◀◀ RETURNING TO REEL 01
            </motion.span>
          </div>

          <div className="grain-layer animate-grain absolute -inset-[10%] opacity-[0.12]" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
