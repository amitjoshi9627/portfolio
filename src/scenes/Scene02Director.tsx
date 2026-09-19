import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Download, Briefcase, GraduationCap } from "lucide-react";
import {
  DIRECTOR_STATEMENT,
  DIRECTORS_BOARD,
  EDUCATION,
  LINKS,
  PROFILE,
  ROLES,
} from "../data/projectData";
import { EASE_OUT, inViewSoft, riseLine, stagger } from "../lib/motion";
import { Annotation, SceneSection, Slate } from "../components/ui/Primitives";

/**
 * SCENE 02 — THE DIRECTOR / RÉSUMÉ
 * Identity → Philosophy → Career Proof → Technical Breadth.
 * An animator's statement followed by the production record discovered
 * on the animator's desk: years of craft, employment history, and toolkit.
 */
export function Scene02Director({ reduced }: { reduced: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: boardRef,
    offset: ["start end", "end start"],
  });
  const driftA = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["5%", "-5%"]);
  const driftB = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-3%", "4%"]);

  return (
    <SceneSection id="director" label="The director" className="px-4 py-[8vh] sm:px-8 sm:py-[12vh] bg-ink-mid">
      <div className="mx-auto max-w-7xl">
        <Slate index="02" title="THE DIRECTOR" note="INT. STUDIO — PHILOSOPHY & CAREER RECORD" />

        {/* ── TOP: THE ANIMATOR'S PHILOSOPHY ────────────────────────────── */}
        <motion.div
          className="mt-[6vh] max-w-5xl sm:mt-[8vh]"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inViewSoft}
        >
          {/* Kicker */}
          <motion.p
            variants={riseLine}
            className="font-mono font-bold text-xs sm:text-sm uppercase tracking-[0.2em] text-[#C45E28] mb-[1.5vh] sm:mb-[2vh]"
          >
            {DIRECTOR_STATEMENT[0]}
          </motion.p>

          {/* Main Statement */}
          <motion.h2
            variants={riseLine}
            className="font-display font-bold text-[clamp(1.8rem,5vmin,3.8rem)] leading-[1.08] tracking-tight uppercase text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.15)] mb-[3vh] sm:mb-[3.5vh] max-w-5xl"
          >
            I treat it as a{" "}
            <span className="text-[#C45E28] text-[1.1em] font-extrabold inline-block tracking-[0.02em] [text-shadow:0_3px_6px_rgba(196,94,40,0.28),0_1px_2px_rgba(0,0,0,0.15)]">
              character
            </span>{" "}
            in a larger system.
          </motion.h2>

          {/* Curvy Saying in Quotes */}
          <motion.blockquote
            variants={riseLine}
            className="mt-[2.5vh] sm:mt-[3vh] max-w-2xl pl-5 sm:pl-6 border-l-2 border-[#C45E28]/40"
          >
            <p className="font-hand text-[clamp(1.35rem,2.8vmin,1.9rem)] leading-[1.45] text-parchment font-semibold tracking-wide">
              “The difficult part is not teaching the model to speak.<br className="hidden sm:inline" />
              {" "}It is deciding what the system should see,<br className="hidden sm:inline" />
              {" "}what it should carry forward,<br className="hidden sm:inline" />
              {" "}and where it must be allowed to fail.”
            </p>
          </motion.blockquote>
        </motion.div>

        {/* ── CINEMATIC PIVOT: THE RECORD ───────────────────────────────── */}
        <motion.div
          className="mt-[8vh] sm:mt-[10vh] mb-[5vh] sm:mb-[7vh] flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <span className="h-[1px] flex-1 bg-forest/20" />
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-forest/25 bg-white/70 backdrop-blur-sm shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C45E28] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#1D2B26] font-bold">
              THE RECORD — NOTES FROM THE DESK
            </span>
          </div>
          <span className="h-[1px] flex-1 bg-forest/20" />
        </motion.div>

        {/* ── TWO-COLUMN EVIDENCE CANVAS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-[6vh] lg:grid-cols-2 lg:gap-[8vh] relative items-start">

          {/* LEFT: CAREER EVIDENCE & TIMELINE */}
          <div className="relative border-l-2 border-forest/20 pl-6 sm:pl-8 space-y-[6vh]">

            {/* 1. The Metric & Identity Block */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            >
              <div className="flex items-baseline gap-4">
                <span className="block font-display font-bold text-[clamp(5rem,12vmin,11rem)] leading-[0.8] text-parchment [text-shadow:0_2px_4px_rgba(0,0,0,0.15)]">
                  {PROFILE.years}+
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.4rem,2.8vmin,2.2rem)] font-bold uppercase tracking-[0.18em] text-forest">
                    Years of Craft
                  </h3>
                  <p className="label font-bold text-parchment-mist mt-1">2020 — PRESENT</p>
                </div>
              </div>

              <Annotation className="mt-[2vh] block text-[#C45E28] text-[17px] sm:text-[19px] max-w-md font-semibold" rotate={-1.2}>
                — “{PROFILE.tagline}”
              </Annotation>

              <p className="mt-[2.5vh] max-w-lg font-sans text-[15px] sm:text-[16px] text-parchment-dim leading-relaxed">
                Building intelligent systems, turning noisy signals into useful decisions, and carrying mathematical ideas all the way into production.
              </p>
            </motion.div>

            {/* 2. Production History (Chronological Employment Timeline) */}
            <motion.div
              className="pt-[4vh] border-t border-forest/15"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <div className="flex items-center gap-2 mb-[3vh]">
                <Briefcase size={16} className="text-[#C45E28]" />
                <h4 className="label font-bold tracking-[0.25em] text-parchment-dim">PRODUCTION HISTORY</h4>
              </div>

              <ol className="space-y-[3.5vh] relative pl-1">
                {ROLES.map((r, i) => (
                  <motion.li
                    key={r.company}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
                    className="relative pl-6 border-l-2 border-forest/20"
                  >
                    <span
                      className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${i === 0 ? "bg-[#44634b] shadow-[0_0_8px_rgba(68,99,75,0.7)]" : "bg-[#44634b]/30"
                        }`}
                    />

                    {i === 0 && (
                      <div className="mb-3.5 mt-0.5">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest bg-[#354f3c] text-[#FAF7F0] border border-[#44634b]/60 shadow-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#7ec48e] animate-pulse" />
                          CURRENT
                        </span>
                      </div>
                    )}

                    <h5 className="font-display font-bold text-[20px] sm:text-[22px] leading-tight text-parchment">
                      {r.company}
                    </h5>
                    <p className="mt-0.5 font-medium text-[14px] text-parchment-dim">{r.title}</p>
                    <p className="label font-bold mt-1 text-parchment-mist text-[11px]">{r.period}</p>
                    {r.meta && (
                      <p className="font-mono text-[11px] text-parchment-mist/80 mt-0.5">{r.meta}</p>
                    )}
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* 3. Training & Education */}
            <motion.div
              className="pt-[4vh] border-t border-forest/15"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap size={16} className="text-[#C45E28]" />
                <h4 className="label font-bold tracking-[0.25em] text-parchment-dim">TRAINING & FOUNDATION</h4>
              </div>
              <p className="font-display font-bold text-[19px] leading-snug text-parchment">
                {EDUCATION.school}
              </p>
              <p className="mt-1 text-[14px] font-medium text-parchment-dim">{EDUCATION.degree}</p>
              <p className="label font-bold mt-1.5 text-parchment-mist text-[11px]">{EDUCATION.date}</p>
            </motion.div>

            {/* 4. Formal Résumé Action / Discovered on the Desk */}
            <motion.div
              className="pt-[3vh]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <a
                href={LINKS.resume}
                download="Amit_Joshi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="DOWNLOAD"
                className="group inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border border-[#44634b] bg-[#44634b] text-[#FAF7F0] shadow-md hover:bg-[#2e4534] hover:border-[#2e4534] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/15 text-[#FAF7F0] group-hover:bg-sunset group-hover:text-white transition-colors duration-200">
                  <FileText size={18} />
                </div>
                <div className="text-left">
                  <span className="block font-display font-bold text-[13px] tracking-[0.15em] uppercase text-[#FAF7F0] group-hover:text-white transition-colors">
                    DOWNLOAD FULL RÉSUMÉ
                  </span>
                  <span className="block font-mono text-[11px] text-[#d9e5dc] group-hover:text-white/90 transition-colors">
                    Complete career record
                  </span>
                </div>
                <Download size={16} className="ml-1 text-[#d9e5dc] group-hover:text-sunset-glow group-hover:translate-y-0.5 transition-all" />
              </a>
            </motion.div>

          </div>

          {/* RIGHT: THE TECHNICAL CANVAS & TOOLKIT */}
          <div ref={boardRef} className="relative pt-[2vh] lg:pt-0">
            <div className="flex items-end justify-between border-b-2 border-forest/20 pb-[2vh] mb-[4vh]">
              <div>
                <h3 className="font-display uppercase tracking-[0.05em] font-bold text-3xl text-parchment">
                  The Toolkit
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest text-parchment-dim mt-1">
                  Core Disciplines
                </p>
              </div>
              <p className="label font-bold text-[#C45E28]">ACTIVE STACK</p>
            </div>

            {/* 12 Core Disciplines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2vh] sm:gap-[2.5vh]">
              {DIRECTORS_BOARD.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="paint-wash px-5 py-4 group cursor-default transition-all duration-300 ease-out hover:bg-[#FAF7EE] hover:border-forest/30 rounded-lg shadow-xs hover:shadow-sm"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.08, ease: EASE_OUT }}
                  style={{ y: i % 2 === 0 ? driftA : driftB }}
                >
                  <div className="flex items-center justify-between mb-[1vh]">
                    <span className="font-mono text-[10px] font-bold text-forest/70 group-hover:text-forest transition-colors">
                      DISCIPLINE // {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-forest/30 group-hover:bg-sunset transition-colors" />
                  </div>
                  <h4 className="font-display font-bold text-[18px] tracking-wide text-parchment group-hover:text-sunset transition-colors">
                    {item.label}
                  </h4>
                </motion.div>
              ))}
            </div>

            <Annotation className="mt-[4vh] block text-right text-parchment-dim" rotate={-1.5}>
              // precision instruments for complex thought
            </Annotation>

            {/* Supporting Architectural Vocabulary */}
            <motion.div
              className="mt-[6vh] p-5 sm:p-6 rounded-xl border border-[#44634b]/25 bg-[#e8e2cd] shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <h5 className="label font-bold tracking-[0.25em] text-[#1D2B26]/80 mb-3.5">
                SYSTEM AT SCALE
              </h5>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {[
                  "State-Space Models",
                  "Retrieval Systems",
                  "Multi-Agent Orchestration",
                  "Tri-Modal Search",
                  "Vector Indexing",
                  "Parallel Processing",
                  "Low-Latency APIs",
                  "Containerized Ingestion",
                  "Spoof Detection",
                ].map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1.5 rounded-md border border-[#44634b]/20 bg-white/50 backdrop-blur-sm font-mono text-[11px] font-bold text-parchment shadow-xs hover:border-[#44634b]/40 hover:bg-white/70 transition-colors"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </SceneSection>
  );
}
