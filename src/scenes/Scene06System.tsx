import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { SYSTEM_STAGES, PROFESSIONAL_PROJECTS, PERSONAL_PROJECTS, CAPABILITIES } from "../data/projectData";
import { EASE_OUT } from "../lib/motion";
import { SceneSection, Slate } from "../components/ui/Primitives";

/**
 * SCENE 06 — THE STUDIO
 * The camera pulls back until the six projects read as one pipeline:
 * data → model → api → system → evaluation → deployment → user.
 */
export function Scene06System({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [stage, setStage] = useState(0);
  const total = SYSTEM_STAGES.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.max(0, Math.min(total, Math.floor(((v - 0.1) / 0.62) * total) + 1));
    setStage((prev) => (prev === next ? prev : next));
  });

  const capabilitiesFade = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);
  const statement = useTransform(scrollYProgress, [0.65, 0.8, 1], [0, 1, 1]);
  /* A real pull-back: the frame starts pushed right up against the lens and
     retreats until the whole spine fits on screen. */
  const collapse = useTransform(
    scrollYProgress,
    [0, 0.34, 1],
    reduced ? [1, 1, 1] : [1.45, 1, 1],
  );
  const settle = useTransform(scrollYProgress, [0, 0.34], reduced ? [0, 0] : [50, 0]);
  const framing = useTransform(scrollYProgress, [0.02, 0.3, 1], [1, 0, 0]);
  const lineHeight = useTransform(scrollYProgress, [0, 0.3, 1], [0, 60, 60]);

  return (
    <SceneSection id="system" label="The studio" className="h-[300vh] sm:h-[420vh] bg-ink-mid">
      <div ref={ref} className="absolute inset-0">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-4 sm:px-8 bg-[radial-gradient(ellipse_at_center,rgba(253,251,247,0.8)_0%,transparent_100%)] pt-[calc(8svh+60px)] sm:pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:items-start [@media(max-height:750px)]:pt-[calc(12svh+56px)] [@media(max-height:750px)]:pb-24">
          {/* framing marks that fly outward as the camera retreats */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-6 z-20 sm:inset-10"
            style={{ opacity: framing }}
          >
            {[
              "left-0 top-0 border-l-[2px] border-t-[2px]",
              "right-0 top-0 border-r-[2px] border-t-[2px]",
              "left-0 bottom-0 border-l-[2px] border-b-[2px]",
              "right-0 bottom-0 border-r-[2px] border-b-[2px]",
            ].map((c) => (
              <span key={c} className={`absolute h-8 w-8 rounded-sm border-forest/20 ${c}`} />
            ))}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
              <span className="label font-bold tracking-widest text-sunset drop-shadow-sm mb-2">
                SCROLL DOWN
              </span>
              <motion.div 
                className="w-[2px] bg-gradient-to-b from-sunset/80 to-transparent rounded-full" 
                style={{ height: lineHeight }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-6xl"
            style={{ scale: collapse, y: settle }}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Slate index="06" title="THE STUDIO" />
                <h2 className="mt-[1.5vh] font-display font-bold text-[clamp(2rem,5.4vmin,4rem)] leading-[0.95] text-parchment">
                  ZOOM OUT.
                </h2>
              </div>
              <p className="max-w-xs text-[15px] font-medium leading-relaxed text-parchment-dim">
                Six projects, different problems. The tools change; the craft stays.
              </p>
            </div>

            {/* the six cuts feeding one spine */}
            <div className="mt-[3vh] flex flex-wrap gap-x-10 gap-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-parchment-mist">PRODUCTION</span>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {PROFESSIONAL_PROJECTS.map((p, i) => (
                    <motion.li
                      key={p.id}
                      className="label font-bold"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT }}
                      style={{ color: `${p.accent}` }}
                    >
                      {p.title.toUpperCase()}
                      {i < PROFESSIONAL_PROJECTS.length - 1 && (
                        <span className="ml-3 text-parchment-mist/30">·</span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-parchment-mist">PERSONAL</span>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {PERSONAL_PROJECTS.map((p, i) => (
                    <motion.li
                      key={p.id}
                      className="label font-bold"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (i + 3) * 0.06, ease: EASE_OUT }}
                      style={{ color: `${p.accent}` }}
                    >
                      {p.title.toUpperCase()}
                      {i < PERSONAL_PROJECTS.length - 1 && (
                        <span className="ml-3 text-parchment-mist/30">·</span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* the spine — horizontal scroll on mobile to preserve pipeline metaphor */}
            <div className="mt-[3vh] -mx-4 sm:mx-0">
              <ol className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-3 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-2 lg:grid-cols-7 lg:gap-2 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
              {SYSTEM_STAGES.map((s, i) => {
                const on = stage > i;
                return (
                  <li key={s.label} className="min-w-[42vw] sm:min-w-0 shrink-0 sm:shrink" style={{ scrollSnapAlign: 'start' }}>
                    <motion.div
                      className="flex h-full flex-col justify-between border-2 rounded-xl p-3 bg-white/50 min-h-[80px]"
                      animate={{
                        borderColor: on ? "rgba(126,184,108,0.6)" : "rgba(126,184,108,0.1)",
                        backgroundColor: on ? "rgba(126,184,108,0.1)" : "rgba(255,255,255,0.5)",
                        y: reduced ? 0 : on ? 0 : 6,
                        scale: on ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="label font-bold"
                          style={{ color: on ? "#7eb86c" : "rgba(44,53,57,0.4)" }}
                        >
                          {s.label}
                        </span>
                        <span className="label font-bold text-parchment-mist">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <ul className="mt-[1vh] space-y-[0.5vh]">
                        {s.tech.map((t) => (
                          <li
                            key={t}
                            className="font-mono font-bold text-[10px] leading-tight text-parchment-dim"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </li>
                  );
                })}
              </ol>
            </div>

            <motion.div
              className="mt-[2.5vh] flex justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="label text-[10px] sm:text-[11px] text-parchment-dim tracking-widest">
                FROM RAW SIGNAL TO SOMETHING PEOPLE CAN USE
              </span>
            </motion.div>

            <motion.div
              className="mt-[3vh] border-t-2 border-forest/10 pt-[2.5vh]"
              style={{ opacity: capabilitiesFade }}
            >
              <h3 className="label text-[10px] sm:text-[11px] text-parchment-dim tracking-widest mb-[1.5vh]">
                THE CAPABILITIES
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {CAPABILITIES.map((cap) => (
                  <motion.li 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    key={cap.label} 
                    className="flex flex-col gap-1.5 p-3 rounded-xl border border-forest/10 bg-white/40 backdrop-blur-md shadow-sm transition-all hover:bg-white/60 hover:shadow-md hover:border-forest/20 group"
                  >
                    <span className="font-mono font-bold text-[10px] text-sunset/90 tracking-widest uppercase group-hover:text-sunset transition-colors">
                      {cap.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {cap.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center rounded-md bg-white/60 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-forest ring-1 ring-inset ring-forest/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors group-hover:bg-white group-hover:ring-forest/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="mt-[3vh] border-t-2 border-forest/10 pt-[2.5vh]"
              style={{ opacity: statement }}
            >
              <div className="w-full text-center font-display font-bold text-[clamp(1.2rem,3.2vmin,2.4rem)] leading-[1.1] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] uppercase">
                <span className="block">The model is just a brush.</span>
                <span className="block text-forest">The system is the painting.</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SceneSection>
  );
}
