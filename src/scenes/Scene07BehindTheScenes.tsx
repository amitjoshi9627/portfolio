import { motion } from "framer-motion";
import { BEHIND_STATEMENT, LINKS } from "../data/projectData";
import { EASE_OUT, inViewSoft } from "../lib/motion";
import { Annotation, SceneSection, Slate } from "../components/ui/Primitives";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: i * 0.12, ease: EASE_OUT }, opacity: { duration: 0.2, delay: i * 0.12 } },
  }),
};

/** Hand-drawn animator's desk: lightbox, storyboard, monitor, notes. */
function SetSketch() {
  const stroke = "rgba(44,53,57,0.4)"; // pencil sketch color
  return (
    <motion.svg
      viewBox="0 0 820 300"
      preserveAspectRatio="xMidYMid meet"
      className="h-auto w-full"
      fill="none"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      role="img"
      aria-label="A line drawing of an animator's studio: a lightbox, a storyboard, an editing monitor and pinned sketches."
    >
      <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.05))" }}>
        {/* desk edge */}
        <motion.path d="M20 270 H800" custom={0} variants={draw} strokeDasharray="4 6" />

        {/* lightbox (repurposed from tripod/camera) */}
        <motion.path d="M100 240 L120 176 M220 240 L200 176 M200 176 H120" custom={1} variants={draw} />
        <motion.path d="M104 128 H216 V176 H104 Z" custom={2} variants={draw} fill="rgba(245,215,110,0.1)" stroke="#f5d76e" />
        <motion.path d="M216 142 L246 128 V172 L216 160 Z" custom={3} variants={draw} />
        <motion.circle cx="160" cy="152" r="16" custom={4} variants={draw} stroke="#e28b7b" />
        <motion.path d="M104 152 h30" custom={5} variants={draw} stroke="#7eb86c" />

        {/* storyboard */}
        <motion.path d="M330 96 H520 V214 H330 Z" custom={2} variants={draw} fill="rgba(255,255,255,0.5)" />
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M344 ${112 + i * 34} H506`}
            custom={3 + i * 0.4}
            variants={draw}
            strokeDasharray="2 5"
          />
        ))}
        <motion.path d="M344 112 H400 V140 H344 Z" custom={4} variants={draw} stroke="#e28b7b" />
        <motion.path d="M425 268 V214 M425 268 H375 M425 268 H475" custom={5} variants={draw} />

        {/* editing monitor */}
        <motion.path d="M600 118 H790 V226 H600 Z" custom={3} variants={draw} />
        <motion.path
          d="M614 186 q18 -34 34 0 t34 -10 t34 22 t34 -40 t26 18"
          custom={5}
          variants={draw}
          stroke="#7eb86c"
        />
        <motion.path d="M614 148 H700" custom={4} variants={draw} />
        <motion.path d="M695 226 V254 H710 V226" custom={5} variants={draw} />
        <motion.path d="M660 254 H750" custom={6} variants={draw} />

        {/* pinned notes */}
        <motion.path d="M556 60 H596 V100 H556 Z" custom={6} variants={draw} fill="rgba(135,206,235,0.1)" stroke="#87ceeb" />
        <motion.path d="M258 52 H300 V92 H258 Z" custom={6} variants={draw} fill="rgba(226,139,123,0.1)" />
        <motion.path d="M60 200 H96 V236 H60 Z" custom={7} variants={draw} />
      </g>
    </motion.svg>
  );
}

/**
 * SCENE 07 — BEHIND THE SCENES
 * The illusion breaks: the studio desk, the credits roll, the archive of other work.
 */
export function Scene07BehindTheScenes() {
  return (
    <SceneSection
      id="behind"
      label="Behind the scenes"
      className="px-4 py-[12vh] sm:px-8 sm:py-[18vh] bg-[#fdfbf7]"
    >
      <div className="mx-auto max-w-6xl">
        <Slate index="07" title="BEHIND THE SCENES" note="THE STUDIO DESK" />

        <div className="mt-[5vh] grid grid-cols-1 gap-[5vh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewSoft}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="font-display font-bold text-[clamp(2.2rem,6.1vmin,4.5rem)] leading-[0.95] text-parchment"
            >
              The animator&rsquo;s desk,
              <br />
              with the sunlight pouring in.
            </motion.h2>

            <div className="mt-[4vh] rounded-xl border-2 border-forest/10 bg-white/60 p-4 shadow-sm sm:p-6 paper-texture overflow-hidden min-w-0">
              <SetSketch />
            </div>

            <Annotation className="mt-5 block" rotate={-1.5}>
              the tools change, the craft remains
            </Annotation>

          </div>

          <div>
            <div className="mb-12 max-w-xl space-y-[2.5vh]">
              <p className="font-display font-bold text-[clamp(1.4rem,3.2vmin,2.4rem)] leading-[1.15] text-parchment">
                {BEHIND_STATEMENT.body[0]}
              </p>
              <p className="text-[15px] font-medium leading-relaxed text-parchment-dim whitespace-pre-line">
                {BEHIND_STATEMENT.body[1]}
              </p>
              <p className="text-[15px] font-medium leading-relaxed text-parchment-dim whitespace-pre-line text-right italic">
                {BEHIND_STATEMENT.body[2]}
              </p>
            </div>

            <div className="flex items-center justify-between border-b-2 border-forest/15 pb-3 mb-6">
                <h3 className="label font-bold tracking-[0.25em] text-parchment-mist">
                  STUDIO NOTES
                </h3>
                <span className="font-mono text-xs font-bold text-forest uppercase">COORDINATES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "CURRENTLY BUILDING",
                    value: "Vaak",
                  },
                  {
                    label: "CURRENT CURIOSITY",
                    value: "Can models explain their own evidence?",
                  },
                  {
                    label: "FAVORITE PART",
                    value: "The moment a prototype becomes useful.",
                  },
                  {
                    label: "OFF THE CLOCK",
                    value: "Photography · visual experiments · wandering around with a camera",
                  },
                ].map((note, i) => (
                  <motion.div
                    key={note.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT }}
                    className="p-4 rounded-xl border border-forest/15 bg-white/70 shadow-sm"
                  >
                    <span className="block font-mono text-[10px] font-bold text-forest tracking-wider uppercase mb-1.5">
                      {note.label}
                    </span>
                    <span className="block font-medium text-[13px] text-parchment leading-relaxed">
                      {note.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 border-t-2 border-forest/10 pt-6">
                <h3 className="font-display font-bold text-2xl text-parchment mb-4">
                  THE DESK IS OPEN.
                </h3>
                <div className="mt-3">
                  <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-forest/20 bg-forest/5 px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-forest transition-all hover:bg-forest/10 hover:border-forest/40"
                  >
                    GITHUB 
                    <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                </div>
              </div>

              <Annotation className="mt-6 block text-right text-forest" rotate={-1}>
                “every frame was placed on purpose”
              </Annotation>
            </div>
          </div>
        </div>
      </SceneSection>
    );
  }
