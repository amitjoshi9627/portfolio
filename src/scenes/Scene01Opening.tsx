import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import { PROFILE } from "../data/projectData";
import { SceneSection } from "../components/ui/Primitives";
import { scrollToId } from "../hooks/useSmoothScroll";
import ghibliBg from "../assets/ghibli_bg.jpg";

interface Props {
  reduced: boolean;
  ready: boolean;
}

/** Intro sequence that cycles before revealing the final title. */
const INTRO_SEQUENCE = ["CIAO", "HOLA", "NAMASTE"];
const END_STEP = INTRO_SEQUENCE.length;

export function Scene01Opening({ reduced, ready }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [introStep, setIntroStep] = useState(0);
  useEffect(() => {
    if (!ready) {
      setIntroStep(0);
      return;
    }
    if (reduced) {
      setIntroStep(END_STEP);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= INTRO_SEQUENCE.length) {
        clearInterval(id);
        setIntroStep(END_STEP);
      } else {
        setIntroStep(i);
      }
    }, 1400); // Smoother, longer cinematic pacing
    return () => clearInterval(id);
  }, [ready, reduced]);

  const bgScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.45]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "5%"]);

  // Extreme X-Zoom effect on the big text Amit Joshi (centered in between the letter 'O', never fades)
  const textScale = useTransform(scrollYProgress, [0, 0.45], reduced ? [1, 1] : [1, 80]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Track the optical center of the letter 'O' for the camera to zoom right through the aperture
  // Negative offset shifts the focal point to the left; positive shifts to the right
  const ZOOM_X_OFFSET = -2.5;
  const [zoomOrigin, setZoomOrigin] = useState("61.3% 50%");
  const containerRef = useRef<HTMLDivElement>(null);
  const letterORef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateOrigin = () => {
      if (!containerRef.current || !letterORef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const oRect = letterORef.current.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) return;

      // Optical center of letter 'O' shifted significantly to the left
      const oCenterX = oRect.left + oRect.width / 2 - containerRect.left;
      const oCenterY = oRect.top + oRect.height / 2 - containerRect.top;

      const xPercent = (oCenterX / containerRect.width) * 100 + ZOOM_X_OFFSET;
      const yPercent = (oCenterY / containerRect.height) * 100;

      setZoomOrigin(`${xPercent.toFixed(1)}% ${yPercent.toFixed(1)}%`);
    };

    updateOrigin();

    if (document.fonts) {
      document.fonts.ready.then(updateOrigin);
    }

    window.addEventListener("resize", updateOrigin);
    return () => window.removeEventListener("resize", updateOrigin);
  }, []);

  const hint = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const paintingReveal: Variants = {
    hidden: { opacity: 0, filter: "blur(20px)", scale: 1.05 },
    show: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const titleReveal: Variants = {
    hidden: { opacity: 0, filter: "blur(24px)", scale: 0.88 },
    show: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const [firstName, ...lastParts] = PROFILE.name.split(" ");
  const lastName = lastParts.join(" ");
  const oIndex = lastName.indexOf("O");
  const beforeO = oIndex !== -1 ? lastName.slice(0, oIndex) : "";
  const afterO = oIndex !== -1 ? lastName.slice(oIndex + 1) : "";

  // Firefly data for subtle movement
  const fireflies = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
    size: 2 + Math.random() * 3,
  }));

  return (
    <SceneSection id="opening" label="Opening credits" className="h-[240vh] sm:h-[300vh] bg-black">
      <div ref={ref} className="absolute inset-0">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {/* ── BACKGROUND IMAGE ─── */}
          <motion.div
            className="absolute inset-0 z-0 h-full w-full"
            style={{ scale: bgScale, y: bgY, transformOrigin: "center center" }}
          >
            <img
              src={ghibliBg}
              alt="Hand-painted cinematic landscape"
              className="h-full w-full object-cover object-center"
            />

            {/* Subtle overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

            {/* Subtle Fireflies for movement */}
            {!reduced && fireflies.map((ff) => (
              <motion.div
                key={ff.id}
                className="absolute rounded-full bg-[#FFB703]"
                style={{
                  left: `${ff.x}%`,
                  top: `${ff.y}%`,
                  width: ff.size,
                  height: ff.size,
                  filter: "blur(1px)",
                  boxShadow: "0 0 6px 2px rgba(255, 183, 3, 0.4)",
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.1, 0.8, 0.1],
                }}
                transition={{
                  duration: ff.duration,
                  delay: ff.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* ── CINEMATIC INTRO SEQUENCE (CENTERED OVER THE LAKE) ─── */}
          <motion.div
            style={{ opacity: hint }}
            className="pointer-events-none absolute top-[53%] sm:top-[55%] left-0 right-0 -translate-y-1/2 z-30 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center min-h-[140px] w-full max-w-xl">
              <AnimatePresence>
                {introStep < END_STEP && (
                  <motion.div
                    key={introStep}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.97 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(8px)", scale: 1.03 }}
                    transition={{
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute flex flex-col items-center justify-center text-center"
                  >
                    <div className="flex flex-col items-center gap-2.5">
                      <span className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-[0.45em] sm:tracking-[0.6em] text-white uppercase pl-[0.45em] sm:pl-[0.6em] [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                        {INTRO_SEQUENCE[introStep]}
                      </span>
                      <span className="h-[3px] w-14 sm:w-18 rounded-full bg-[#FFB703]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── CENTERED FILMIC TEXT (PERFECTLY CENTERED IN THE LAKE ACROSS ALL ASPECT RATIOS) ── */}
          <div className="pointer-events-none absolute top-[51%] sm:top-[52%] left-0 right-0 -translate-y-1/2 z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <div className="flex flex-col items-center max-w-5xl relative w-full pointer-events-auto">
              {/* Main Title & Role */}
              <motion.div
                initial="hidden"
                animate={introStep === END_STEP ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, pointerEvents: "none" },
                  show: {
                    opacity: 1,
                    pointerEvents: "auto",
                    transition: { staggerChildren: 0.25, delayChildren: 0.1 }
                  }
                }}
                className="flex flex-col items-center w-full"
              >
                {/* Top Orange Line (fades out gracefully on scroll) */}
                <motion.span
                  variants={paintingReveal}
                  style={{ opacity: subtitleOpacity }}
                  className="h-[3px] w-16 sm:w-20 rounded-full bg-[#FFB703] mb-5 sm:mb-6 shadow-[0_0_10px_rgba(255,183,3,0.5)]"
                />

                {/* Big Text: AMIT JOSHI with Zoom Text Effect targeting inside the letter 'O' (never fades) */}
                <motion.div
                  ref={containerRef}
                  style={{
                    scale: textScale,
                    transformOrigin: zoomOrigin,
                    backfaceVisibility: "hidden",
                  }}
                  className="relative flex justify-center"
                >
                  <motion.h1
                    variants={titleReveal}
                    className="font-display font-bold text-[clamp(1.8rem,7.5vmin,6rem)] leading-[0.92] tracking-[0.04em] text-white uppercase [text-shadow:0_4px_8px_rgba(0,0,0,0.5)] whitespace-nowrap"
                  >
                    {firstName}{" "}
                    <span className="font-extrabold tracking-[0.06em]">
                      {oIndex !== -1 ? (
                        <>
                          <span>{beforeO}</span>
                          <span ref={letterORef}>O</span>
                          <span>{afterO}</span>
                        </>
                      ) : (
                        lastName
                      )}
                    </span>
                  </motion.h1>
                </motion.div>

                {/* Subtitle & Role (fades out gracefully on scroll) */}
                <motion.div
                  variants={paintingReveal}
                  style={{ opacity: subtitleOpacity }}
                  className="mt-6 flex flex-col items-center gap-2.5 w-full"
                >
                  <p className="font-display text-[clamp(0.85rem,1.5vmin,1.1rem)] font-semibold uppercase tracking-[0.35em] text-white/95 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                    {PROFILE.title}
                  </p>
                  <span className="h-[3px] w-16 sm:w-20 rounded-full bg-[#FFB703] my-1.5 shadow-[0_0_8px_rgba(255,183,3,0.5)]" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ── SCROLL PROMPT ───────────────────────────── */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-0 right-0 z-20 flex justify-center px-6 sm:px-12"
            style={{ opacity: hint }}
          >
            <button
              type="button"
              onClick={() => scrollToId("director")}
              data-cursor="ROLL"
              className="pointer-events-auto group flex flex-col items-center gap-2"
            >
              <span className="font-display text-xs font-bold tracking-[0.2em] text-white transition-colors duration-500 group-hover:text-sunset-glow [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                SCROLL TO EXPLORE
              </span>
              <motion.span
                aria-hidden
                className="block h-7 w-[2px] rounded-full origin-top bg-gradient-to-b from-sunset-glow to-transparent"
                animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </button>
          </motion.div>
        </div>
      </div>
    </SceneSection>
  );
}
