import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { shutter } from "../../lib/ambience";
import ghibliBg from "../../assets/ghibli_bg.jpg";

interface Props {
  reduced: boolean;
  onDone: () => void;
}

const STEPS = [
  { count: 3, label: "SKETCHING CONCEPTS", desc: "Pencil on paper" },
  { count: 2, label: "WATERCOLOR WASH", desc: "Adding vibrancy" },
  { count: 1, label: "ANIMATION FRAMES", desc: "Breathing life" },
];

let hasSeenIntro = false;

export function AcademyLeader({ reduced, onDone }: Props) {
  const stepDuration = reduced ? 300 : 850;
  const [index, setIndex] = useState(0);
  const [punch, setPunch] = useState(false);
  const [gone, setGone] = useState(hasSeenIntro);
  const completedRef = useRef(hasSeenIntro);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    hasSeenIntro = true;
    shutter(0.14);
    setPunch(true);
    window.setTimeout(() => {
      setGone(true);
      onDone();
    }, 320);
  };

  useEffect(() => {
    if (hasSeenIntro) {
      onDone();
      return;
    }

    const timers: number[] = [];
    STEPS.forEach((_, i) => {
      if (i === 0) return;
      timers.push(window.setTimeout(() => setIndex(i), stepDuration * i));
    });

    timers.push(
      window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          hasSeenIntro = true;
          setPunch(true);
          window.setTimeout(() => {
            setGone(true);
            onDone();
          }, 350);
        }
      }, stepDuration * STEPS.length)
    );

    return () => timers.forEach(window.clearTimeout);
  }, [stepDuration, onDone]);

  useEffect(() => {
    if (hasSeenIntro) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const current = STEPS[index] || STEPS[0];

  if (gone) return null;

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[200] flex cursor-pointer select-none items-center justify-center overflow-hidden bg-[#fdfbf7]"
          onClick={handleFinish}
          role="status"
          aria-live="polite"
          aria-label={`Animation starting in ${current.count}. Click or press space to start immediately.`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── SKETCHBOOK TEXTURES ──────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none">
            <img src={ghibliBg} alt="" className="h-full w-full object-cover opacity-[0.2] saturate-50 mix-blend-multiply blur-lg" />
          </div>
          <div className="grain-layer absolute inset-0 opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />

          {/* ── TOP CORNER TAPE ─────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-40">
            <div className="absolute top-8 left-[-10px] w-24 h-5 bg-[#e8e1cf] -rotate-45" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-40">
            <div className="absolute top-8 right-[-10px] w-24 h-5 bg-[#e8e1cf] rotate-45" />
          </div>

          {/* ── CENTRAL HAND-DRAWN CIRCLE ──────────────────────── */}
          <motion.div
            className="relative flex aspect-square w-[min(70vw,360px)] flex-col items-center justify-center pointer-events-none"
            animate={punch && !reduced ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Pencil sketch circles */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full opacity-70 pointer-events-none" aria-hidden>
              <motion.circle
                cx="200" cy="200" r="180" fill="none" stroke="#2c3539" strokeWidth="1" strokeDasharray="8 6"
                animate={{ rotate: 360 }} transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: "200px 200px" }}
              />
              <motion.circle
                cx="200" cy="200" r="165" fill="none" stroke="#7eb86c" strokeWidth="1.5" strokeDasharray="20 10 5 10"
                animate={{ rotate: -360 }} transition={{ duration: 50, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: "200px 200px" }}
              />
              <circle cx="200" cy="200" r="150" fill="none" stroke="#2c3539" strokeWidth="0.5" />
              
              {/* Hand drawn crosshairs */}
              <path d="M200 10 Q 205 100 200 150" fill="none" stroke="#2c3539" strokeWidth="0.5" />
              <path d="M200 390 Q 195 300 200 250" fill="none" stroke="#2c3539" strokeWidth="0.5" />
              <path d="M10 200 Q 100 205 150 200" fill="none" stroke="#2c3539" strokeWidth="0.5" />
              <path d="M390 200 Q 300 195 250 200" fill="none" stroke="#2c3539" strokeWidth="0.5" />
            </svg>

            {/* Watercolor splash behind number - optimized */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(245,215,110,0.25)_0%,transparent_50%)] rounded-full blur-xl pointer-events-none" />

            {/* Central Number - Refined, cleaner size */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.count}
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(3px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.06, filter: "blur(3px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="font-display font-bold text-[#2c3539] [text-shadow:0_2px_8px_rgba(245,215,110,0.5)]"
                    style={{ fontSize: "clamp(3.8rem,min(11vw,16.5vh),6.2rem)", lineHeight: 1 }}
                  >
                    {current.count}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sub-label inside reticle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.label}
                className="absolute -bottom-8 z-10 text-center w-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <span className="label font-bold block text-sm tracking-widest text-[#2c3539]">
                  {current.label}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── BOTTOM CONTROL BAR ───────────────── */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 px-6 sm:px-14">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
              <div className="text-center sm:text-left">
                <span className="font-display font-bold block text-2xl text-[#2c3539]/80 uppercase">
                  {current.desc}
                </span>
              </div>

              {/* Interactive Skip Button */}
              <div className="pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinish();
                  }}
                  className="group flex items-center gap-3 rounded-full border border-[#2c3539]/20 bg-white/40 px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-[#2c3539]/40 hover:bg-white"
                  aria-label="Skip animation"
                >
                  <span className="label text-[#2c3539]/70 transition-colors group-hover:text-[#2c3539]">
                    SKIP TO ANIMATION
                  </span>
                  <span className="flex items-center gap-1 rounded bg-[#2c3539]/5 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#2c3539]/60 transition-colors group-hover:bg-[#2c3539]/10 group-hover:text-[#2c3539]">
                    SPACE ↵
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── BLOWING LEAF PUNCH TRANSITION ─────── */}
          <AnimatePresence>
            {punch && !reduced ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Bright white paper flash */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4, times: [0, 0.4, 1] }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
