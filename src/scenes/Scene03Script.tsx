import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { SCRIPT_STAGES } from "../data/projectData";
import { EASE_OUT } from "../lib/motion";
import { Annotation, SceneSection, Slate } from "../components/ui/Primitives";

/** One line-art storyboard glyph per stage, drawn in as the stage arrives. */
const GLYPHS: string[][] = [
  ["M50 22a16 16 0 0 1 12 26c-6 6-12 8-12 16", "M50 76v2"], // QUESTION
  ["M22 22h22M22 22v22", "M78 22H56M78 22v22", "M22 78h22M22 78V56", "M78 78H56M78 78V56"], // FRAME
  ["M14 52h10l8-22 10 44 9-30 8 18 7-10h20"], // SIGNAL
  ["M50 78V54", "M50 54 26 26", "M50 54l24-28", "M26 26h-8", "M74 26h8"], // EXPERIMENT
  ["M24 74h52", "M32 74V56h20v18", "M56 74V40h16v34", "M32 56h20"], // BUILD
  ["M24 26h52v52H24z", "M24 44h52M24 60h52M42 26v52", "M50 56l8 10 16-22"], // EVALUATE
  ["M28 72h44", "M50 66V24", "M50 24l-12 14", "M50 24l12 14"], // DEPLOY
];

const drawStroke = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, delay: i * 0.1, ease: EASE_OUT },
      opacity: { duration: 0.15, delay: i * 0.1 },
    },
  }),
};

/**
 * SCENE 03 — THE STORYBOARD
 * A pinned frame in which one continuous diagram is sketched by the scroll.
 * Hand-painted paper textures, pencil strokes, and nature colors.
 */
export function Scene03Script({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [stage, setStage] = useState(0);
  const count = SCRIPT_STAGES.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(count, Math.floor(((v - 0.08) / 0.78) * count) + 1);
    setStage((prev) => (prev === next ? prev : Math.max(0, next)));
  });

  const railScale = useTransform(scrollYProgress, [0.08, 0.86], [0, 1]);
  /* Two planes drifting at different rates — the parallax that gives it air. */
  const nearY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["4%", "-4%"]);
  const farY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-3%", "6%"]);
  const beam = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.4, 0.15]);

  const activeIndex = Math.max(0, Math.min(count - 1, stage - 1));
  const activeStage = SCRIPT_STAGES[activeIndex];

  return (
    <SceneSection id="script" label="The storyboard" className="h-[200vh] sm:h-[400vh] bg-ink-mid">
      <div ref={ref} className="absolute inset-0">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-4 sm:px-8 pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:items-start [@media(max-height:750px)]:pt-[12svh] [@media(max-height:750px)]:pb-12">
          {/* plane 0 — warm sunlight wall */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_22%_45%,rgba(212,122,67,0.15),transparent_70%)]"
            style={{ opacity: beam }}
          />
          {/* Sketchbook grid lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_right,rgba(29,43,38,0.03)_0_1px,transparent_1px_120px)]"
          />

          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 relative z-10">
            {/* ---------------------------------------------- left: the board */}
            <motion.div style={{ y: farY }} className="pt-[2vh] lg:pt-0">
              <Slate index="03" title="THE BLUEPRINT" />
              <h2 className="mt-[2vh] font-display font-bold uppercase tracking-[0.05em] text-[clamp(2rem,5.0vmin,4rem)] leading-[0.95] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                THE
                <br />
                STORYBOARD
              </h2>
              <p className="mt-[2vh] max-w-md text-[clamp(15px,1.75vmin,18px)] font-medium leading-relaxed text-parchment-dim">
                Before the code, there is a sketch. A question becomes a shape, the shape becomes a system, and the system earns its way into production.
              </p>

              {/* storyboard page stack */}
              <div className="relative mt-6 hidden w-full max-w-[280px] 2xl:max-w-[320px] lg:block">
                <motion.div
                  className="absolute inset-0 rotate-[-4deg] rounded-md border border-forest/20 bg-ink-rim/50 shadow-lg"
                  style={{ scale: useTransform(scrollYProgress, [0, 1], [0.95, 1.05]) }}
                />
                <motion.div
                  className="absolute inset-0 rotate-[-2deg] rounded-md border border-forest/30 bg-white/90 shadow-xl"
                  style={{ scale: useTransform(scrollYProgress, [0, 1], [0.98, 1.02]) }}
                />

                <motion.div
                  className="relative paper-texture bg-white/95 border border-forest/10 rounded-md overflow-hidden shadow-2xl"
                  style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]) }}
                >
                  <div className="flex items-center justify-between border-b border-forest/10 px-4 py-2 bg-white/50 backdrop-blur-md">
                    <span className="label tracking-widest text-parchment-mist text-[9px]">DRAFTING</span>
                    <span className="label text-forest font-bold text-[9px]">
                      {String(activeIndex + 1).padStart(2, "0")}/{count}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] w-full bg-[radial-gradient(ellipse_at_center,rgba(116,156,184,0.1)_0%,transparent_70%)]">
                    <AnimatePresence mode="wait">
                      <motion.svg
                        key={activeIndex}
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full p-8"
                        fill="none"
                        stroke="#386641"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                        aria-hidden
                      >
                        {GLYPHS[activeIndex].map((d, i) => (
                          <motion.path key={d} d={d} custom={i} variants={drawStroke} />
                        ))}
                      </motion.svg>
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-forest/10 px-4 py-3 bg-ink-mid/30">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeStage.id}
                        className="font-hand text-xl font-bold leading-tight text-parchment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.4 }}
                      >
                        {activeStage.caption}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <Annotation className="mt-8 hidden lg:block text-sunset" rotate={-3}>
                the code is just the final ink layer
              </Annotation>
            </motion.div>

            {/* --------------------------------------------- right: the list */}
            <motion.div style={{ y: nearY }} className="relative">
              {/* ghosted stage numeral, sitting behind everything */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none md:block"
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeIndex}
                    className="block font-display font-bold text-[clamp(10rem,25vh,18rem)] leading-none text-transparent opacity-10"
                    style={{ WebkitTextStroke: "2px rgba(56,102,65,0.4)" }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  >
                    0{activeIndex + 1}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="relative pl-4">
                <div className="absolute left-[27px] top-4 bottom-4 w-px bg-forest/15 sm:left-[29px]" />
                <motion.div
                  className="absolute left-[26px] top-4 w-[3px] rounded-full origin-top bg-forest sm:left-[28px]"
                  style={{ scaleY: railScale, height: "calc(100% - 32px)", filter: "drop-shadow(0 0 8px rgba(56,102,65,0.4))" }}
                />

                <ol className="relative space-y-[1.5vh] sm:space-y-[2.5vh]">
                  {SCRIPT_STAGES.map((s, i) => {
                    const on = stage > i;
                    const current = stage === i + 1;
                    return (
                      <li key={s.id} className="flex items-start gap-[1.5vh] sm:gap-[2.5vh]">
                        <span className="relative mt-2 flex h-6 w-6 shrink-0 items-center justify-center">
                          <motion.span
                            className="absolute inset-0 rounded-full border-[3px]"
                            animate={{
                              borderColor: on ? "rgba(56,102,65,1)" : "rgba(56,102,65,0.15)",
                              scale: current ? 1.3 : on ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                          />
                          <motion.span
                            className="h-2 w-2 rounded-full bg-forest"
                            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.2 }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                          />
                        </span>

                        <motion.div
                          className="min-w-0 flex-1 border-b border-forest/10 pb-[1vh]"
                          animate={{
                            opacity: on ? 1 : 0.3,
                            x: reduced ? 0 : current ? 12 : 0,
                          }}
                          transition={{ duration: 0.6, ease: EASE_OUT }}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="label text-[10px] text-forest/70 tracking-widest">
                              STAGE {String(i + 1).padStart(2, "0")}
                            </span>
                            <motion.h3
                              className="font-display font-bold uppercase leading-none mt-1"
                              animate={{
                                color: current ? "#1D2B26" : "rgba(29,43,38,0.6)",
                                fontSize: current ? "clamp(1.2rem,3.0vmin,2.5rem)" : "clamp(1rem,2.4vmin,2rem)",
                              }}
                              transition={{ duration: 0.5, ease: EASE_OUT }}
                            >
                              {s.label}
                            </motion.h3>
                          </div>
                          <AnimatePresence initial={false}>
                            {current ? (
                              <motion.p
                                className="mt-3 text-base font-medium leading-relaxed text-parchment-dim"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: reduced ? 0 : 0.4 }}
                              >
                                {s.caption}
                              </motion.p>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
