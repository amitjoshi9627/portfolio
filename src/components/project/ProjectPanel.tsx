import { useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { PenTool, X } from "lucide-react";
import type { Project } from "../../data/projectData";
import { EASE_OUT, stagger } from "../../lib/motion";
import {
  FeedShiftVisual,
  VaakVisual,
  SilaVisual,
} from "../visuals/PersonalVisuals";
import {
  LumaVisual,
  RoiEngineVisual,
  SpoolVisual,
  type VisualProps,
} from "../visuals/ProfessionalVisuals";

const VISUALS: Record<string, (p: VisualProps) => React.ReactElement> = {
  "roi-engine": RoiEngineVisual,
  luma: LumaVisual,
  spool: SpoolVisual,
  sila: SilaVisual,
  vaak: VaakVisual,
  feedshift: FeedShiftVisual,
};

interface Props {
  project: Project;
  isActive: boolean;
  renderVisual: boolean;
  noteOpen: boolean;
  onToggleNote: () => void;
  reduced: boolean;
  mobile: boolean;
}

export function ProjectPanel({
  project,
  isActive,
  renderVisual,
  noteOpen,
  onToggleNote,
  reduced,
  mobile,
}: Props) {
  const Visual = VISUALS[project.id];
  const accent = project.accent;
  const personal = project.kind === "personal";

  /** On mobile every panel is mounted, so visuals only run while on screen. */
  const ref = useRef<HTMLElement>(null);
  const onScreen = useInView(ref, { amount: 0.3 });
  const revealed = useInView(ref, { amount: 0.2, once: true });
  const visualActive = mobile ? onScreen : isActive;
  const textShown = mobile ? revealed : isActive;

  return (
    <article
      ref={ref}
      className={`flex h-full w-full flex-col justify-center px-4 sm:px-8 ${
        mobile ? "py-10" : ""
      }`}
      aria-label={`${project.title} — ${project.subtitle}`}
    >
      <motion.div
        className="mx-auto w-full max-w-6xl"
        animate={
          mobile
            ? undefined
            : {
                opacity: isActive ? 1 : 0.35,
                scale: isActive ? 1 : 0.95,
                filter: isActive ? "blur(0px)" : "blur(3px)",
              }
        }
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE_OUT }}
      >
        {/* clapper header */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-forest/5 pb-3">
          <span className="label font-bold" style={{ color: accent }}>
            {personal ? "PERSONAL SKETCH" : "CASE STUDY"} {project.index}
          </span>
          <span className="hidden h-[2px] w-8 rounded-full bg-forest/20 sm:block" />
          <span className="label font-bold text-parchment-mist">TRANSITION · {project.cut}</span>
          {project.status ? (
            <span className="label font-bold rounded-md border-2 border-clay/30 bg-white/50 px-2 py-1 text-clay">
              {project.status}
            </span>
          ) : null}
          <span className="label ml-auto hidden font-bold text-parchment-mist sm:block">
            {project.keywords.join(" · ")}
          </span>
        </div>

        <div className="mt-[2vh] grid grid-cols-1 gap-[2.5vh] lg:mt-[3vh] lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          {/* text column */}
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            animate={textShown ? "show" : "hidden"}
          >
            <motion.h3
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
              }}
              className="font-display font-bold text-[clamp(2rem,6.0vmin,4.5rem)] leading-[0.92] tracking-[-0.02em] text-parchment uppercase"
            >
              {project.title.toUpperCase()}
            </motion.h3>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
              }}
              className="mt-[1.5vh] font-display text-[clamp(1rem,1.7vmin,1.3rem)] font-bold uppercase tracking-[0.05em]"
              style={{ color: accent }}
            >
              {project.subtitle}
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
              }}
              className="mt-[2vh] max-w-md text-[clamp(14px,1.5vmin,16px)] font-medium leading-relaxed text-parchment-dim"
            >
              {project.logline}
            </motion.p>

            {project.metrics ? (
              <motion.dl
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
                }}
                className="mt-[2vh] grid grid-cols-2 gap-4 border-y border-forest/15 py-[1.5vh] sm:grid-cols-4 sm:gap-x-6"
              >
                {project.metrics.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <dt className="sr-only">{m.label}</dt>
                    <dd>
                      <span className="block font-display font-bold text-base sm:text-lg lg:text-xl leading-snug text-parchment tracking-tight">
                        {m.value}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-parchment-dim/80 leading-tight">
                        {m.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </motion.dl>
            ) : null}

            <motion.ul
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.6, delay: 0.15 } },
              }}
              className="mt-[2.5vh] flex flex-col gap-3 lg:pr-3 divide-y divide-forest/10"
            >
              {project.details.map((d) => (
                <li key={d.label} className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[14px] leading-snug pt-3 first:pt-0">
                  <span 
                    className="font-mono text-[10px] font-bold uppercase tracking-widest shrink-0 sm:w-32 pt-0.5" 
                    style={{ color: accent }}
                  >
                    {d.label}
                  </span>
                  <span className="text-parchment-dim font-medium">{d.value}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
              }}
              className="mt-[2vh] flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={onToggleNote}
                data-cursor="NOTE"
                aria-expanded={noteOpen}
                className="group flex items-center gap-3 rounded-xl border-2 bg-white/50 px-3.5 py-2 sm:px-4 sm:py-2.5 text-left transition-colors hover:bg-white"
                style={{ borderColor: `${accent}55` }}
              >
                <PenTool size={15} strokeWidth={2} style={{ color: accent }} />
                <span>
                  <span className="label block font-bold text-[10px] sm:text-xs" style={{ color: accent }}>
                    ANIMATOR&rsquo;S NOTE
                  </span>
                  <span className="mt-0.5 sm:mt-1 block font-display font-bold text-sm sm:text-base text-parchment">
                    {project.note.question}
                  </span>
                </span>
              </button>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VIEW"
                  className="group flex h-full items-center gap-2 rounded-xl border-2 bg-transparent px-4 py-3 sm:py-3.5 transition-colors hover:bg-black/5"
                  style={{ borderColor: `${accent}25` }}
                >
                  <span className="label block font-bold text-[10px] sm:text-xs" style={{ color: accent }}>
                    VIEW ON GITHUB ↗
                  </span>
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* visual column */}
          <div className="relative" data-cursor={noteOpen ? "NOTE" : "VIEW"}>
            <motion.div
              className="relative flex h-[46svh] min-h-[340px] sm:min-h-[360px] max-h-[480px] w-full flex-col overflow-hidden rounded-xl border-2 p-3 sm:p-4 lg:p-4.5 lg:h-[48svh] lg:min-h-[380px]"
              style={{ borderColor: `${accent}28`, backgroundColor: "var(--color-ink-mid)" }}
              animate={{
                scale: noteOpen && !reduced ? 0.965 : 1,
                filter: noteOpen ? "saturate(0.5) brightness(0.9)" : "saturate(1) brightness(1)",
              }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {/* Per-project warm color wash on the visual frame background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${accent}15 0%, transparent 65%)`
                }}
              />
              <span className="sprocket absolute inset-x-0 top-0 z-10 h-2 opacity-10" />
              <span className="sprocket absolute inset-x-0 bottom-0 z-10 h-2 opacity-10" />
              <div className="relative z-20 min-h-0 w-full flex-1 overflow-hidden rounded-lg shadow-sm">
                {renderVisual && Visual ? (
                  <Visual active={visualActive} reduced={reduced} rewind={noteOpen} />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(120deg,rgba(44,53,57,0.02),transparent)]" />
                )}
              </div>
            </motion.div>

            {/* the note itself */}
            <AnimatePresence>
              {noteOpen ? (
                <motion.div
                  className="absolute inset-x-0 bottom-0 z-20 sm:inset-x-4"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE_OUT }}
                >
                  <div
                    className="paper-texture relative max-h-[55svh] overflow-y-auto px-4 py-4 text-[#2c3539]"
                    data-lenis-prevent
                  >
                    <button
                      type="button"
                      onClick={onToggleNote}
                      data-cursor="CLOSE"
                      className="absolute right-3 top-3 text-[#2c3539]/50 transition-colors hover:text-[#2c3539]"
                      aria-label="Close animator's note"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                    {/* ruled notebook page */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 top-[86px] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(44,53,57,0.07)_27px,rgba(44,53,57,0.07)_28px)]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-9 w-px bg-[#e28b7b]/30"
                    />

                    <div className="relative">
                      <span className="label font-bold text-[#2c3539]/50">ANIMATOR&rsquo;S NOTE</span>
                      <h4 className="mt-1 font-display font-bold text-xl leading-tight text-[#2c3539]">
                        {project.note.question}
                      </h4>
                      <p className="label mt-2 text-[#2c3539]/60">{project.note.body[0]}</p>

                      {/* the answer, in the animator's own hand */}
                      <div className="mt-3 space-y-2">
                        {project.note.body.slice(1).map((b, i) => (
                          <motion.p
                            key={b}
                            className="hand text-[17px] font-bold leading-snug text-[#2c3539]/90 sm:text-[18px]"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: reduced ? 0 : 0.45,
                              delay: reduced ? 0 : 0.18 + i * 0.14,
                              ease: EASE_OUT,
                            }}
                          >
                            {b}
                          </motion.p>
                        ))}
                      </div>

                      <motion.span
                        aria-hidden
                        className="hand mt-4 block text-right text-[18px] font-bold text-[#e28b7b]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: reduced ? 0 : 0.7 }}
                      >
                        — AJ
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
