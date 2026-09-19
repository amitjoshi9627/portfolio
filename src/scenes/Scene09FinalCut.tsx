import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { EDUCATION, FINAL_LINES, LINKS, PROFILE } from "../data/projectData";
import { EASE_OUT } from "../lib/motion";
import { SceneSection } from "../components/ui/Primitives";

interface Props {
  reduced: boolean;
  onReplay: () => void;
}




/* ----------------------------------------------------------------- credits */

const CREDITS: { role: string; value: string }[] = [
  { role: "CURRENTLY AT", value: "TIGER ANALYTICS" },
  { role: "FOCUS", value: "APPLIED AI & PRODUCTION ML" },
  { role: "CRAFT", value: "AI / ML SYSTEMS" },
  { role: "COLLEGE", value: "IIIT RANCHI" },
  { role: "RUNNING TIME", value: "6 YEARS" },
];

const SECONDARY = [
  { label: "GITHUB", href: LINKS.github, external: true },
  { label: "LINKEDIN", href: LINKS.linkedin, external: true },
  { label: "EMAIL", href: LINKS.email, external: false },
  { label: "RESUME", href: LINKS.resume, external: false },
];

/**
 * SCENE 09 — THE FINAL FRAME
 * The six cuts return as frames, fade, and the sketchbook signs off under a
 * full-bleed THE END watermark.
 */
export function Scene09FinalCut({ reduced, onReplay }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: endProgress } = useScroll({
    target: endRef,
    offset: ["start end", "end end"],
  });

  const storyOpacity = useTransform(scrollYProgress, [0.38, 0.55, 0.78, 0.95], [0, 1, 1, 0]);
  const storyY = useTransform(scrollYProgress, [0.38, 0.55, 0.78, 0.95], reduced ? [0, 0, 0, 0] : [24, 0, 0, -20]);
  const storyScale = useTransform(scrollYProgress, [0.38, 0.7], reduced ? [1, 1] : [0.95, 1.05]);

  /* The watermark drifts up and swells as the credits roll past it. */
  const markY = useTransform(endProgress, [0, 1], reduced ? ["0%", "0%"] : ["16%", "-8%"]);
  const markScale = useTransform(endProgress, [0, 1], reduced ? [1, 1] : [0.86, 1.06]);
  const markOpacity = useTransform(endProgress, [0.05, 0.45, 1], [0, 0.5, 1]);

  const [showReplay, setShowReplay] = useState(false);

  return (
    <SceneSection id="final" label="Final frame" className="relative bg-[#fdfbf7]">
      {/* warm sunlight wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_0%,rgba(245,215,110,0.15),transparent_62%),radial-gradient(60%_40%_at_50%_100%,rgba(126,184,108,0.1),transparent_65%)]"
      />

      {/* ------------------------------------------------ beat 1: the frames */}
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4 sm:px-8 pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:justify-start [@media(max-height:750px)]:pt-[12svh] [@media(max-height:750px)]:pb-32">


          <motion.div
            className="absolute px-6 text-center pointer-events-none"
            style={{ opacity: storyOpacity, y: storyY, scale: storyScale }}
          >
            <h2 className="font-display font-bold text-[clamp(1.9rem,7.4vmin,5.5rem)] leading-[1.02] tracking-[-0.01em] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
              EVERY SYSTEM HAS A STORY.
            </h2>
            <p className="mt-4 font-display font-bold text-parchment-dim text-[clamp(1rem,3.2vmin,1.5rem)] tracking-tight">
              Different problems. Different tools. The same instinct to build.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --------------------------------------------------- beat 2: the ask */}
      <div className="relative h-[250vh] bg-[#fdfbf7]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-4 sm:px-8 pt-[8svh] [@media(max-height:750px)]:pt-[12svh]">
          <div className="mx-auto w-full max-w-5xl">
          <motion.span
            className="label block font-bold text-clay"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            THE NEXT FRAME
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: EASE_OUT }}
            className="mt-[2.5vh] font-display font-bold text-[clamp(2.4rem,8.8vmin,6.5rem)] leading-[0.96] tracking-[-0.02em] text-parchment"
          >
            {FINAL_LINES.headline}
            <br />
            <span className="text-parchment-dim">{FINAL_LINES.subline}</span>
          </motion.h2>

          <div className="mt-[7vh] flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <a
              href={LINKS.email}
              data-cursor="ENTER"
              className="group relative inline-flex items-center gap-5 overflow-hidden rounded-xl border-2 border-forest/15 bg-white/70 px-7 py-6 shadow-sm transition-colors hover:border-forest/40 hover:bg-white"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-forest/5 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <ArrowUpRight
                size={22}
                strokeWidth={2}
                className="relative text-parchment-mist transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-forest"
              />
              <span className="relative font-display font-bold text-[clamp(1.4rem,3.0vmin,2.2rem)] leading-none text-parchment transition-colors group-hover:text-forest">
                {FINAL_LINES.cta}
              </span>
            </a>

            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {SECONDARY.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer noopener" : undefined}
                    data-cursor="OPEN"
                    className="label font-bold border-b-2 border-transparent pb-1 text-parchment-dim transition-colors hover:border-forest/40 hover:text-parchment"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>

      {/* ------------------------------------------------ beat 3: the credits */}
      <div ref={endRef} className="relative overflow-hidden bg-[#070B09]">
        {/* THE END — full-bleed watermark behind the credits */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          style={{ y: markY, scale: markScale, opacity: markOpacity }}
        >
            <span
              className="whitespace-nowrap font-display font-bold leading-[0.78] tracking-[-0.03em] text-transparent"
              style={{
                fontSize: "clamp(5rem,29.7vmin,22rem)",
                WebkitTextStroke: "2px rgba(255,255,255,0.03)",
              }}
            >
              AJ&apos;s Movie
            </span>
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(56,102,65,0.15)_0%,transparent_80%)]"
        />

        <div className="relative z-10 px-4 py-[12vh] sm:px-8 sm:py-[16vh]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="label font-bold text-white/40">A SKETCHBOOK BY</p>
              <p className="mt-[2.5vh] font-display font-bold text-[clamp(2.2rem,6.1vmin,4.5rem)] leading-none text-white [text-shadow:0_4px_16px_rgba(0,0,0,0.8)]">
                {PROFILE.name}
              </p>
              <p className="label font-bold mt-[2.5vh] text-sunset-glow">{PROFILE.title.toUpperCase()}</p>
            </div>

            {/* the credit roll */}
            <dl className="mx-auto mt-[10vh] grid max-w-3xl grid-cols-1 gap-x-12 sm:grid-cols-2">
              {CREDITS.map((c, i) => (
                <motion.div
                  key={c.role}
                  className="flex items-baseline justify-between gap-6 border-b border-white/10 py-3.5"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE_OUT }}
                >
                  <dt className="label font-bold shrink-0 text-white/40">{c.role}</dt>
                  <dd className="break-words text-right font-display font-bold text-lg text-white">
                    {c.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
            
            <p className="mt-[5vh] text-center text-[13px] font-bold leading-relaxed text-white/40">
              {EDUCATION.degree} · {EDUCATION.date}
            </p>

            {/* the sign-off */}
            <div className="mt-[12vh] text-center">
              <motion.div
                initial={false}
                animate={{ opacity: showReplay ? 1 : 0, y: showReplay ? 0 : 10 }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                className="flex justify-center mb-[4vh]"
              >
                <button
                  type="button"
                  onClick={onReplay}
                  data-cursor="REPLAY"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 shadow-lg transition-colors hover:border-sunset/50 hover:bg-sunset/15"
                  tabIndex={showReplay ? 0 : -1}
                  aria-hidden={!showReplay}
                >
                  <RotateCcw
                    size={14}
                    strokeWidth={2}
                    className="text-white/70 transition-all duration-500 group-hover:-rotate-180 group-hover:text-white"
                  />
                  <span className="label font-bold text-white/70 transition-colors group-hover:text-white text-[11px]">
                    REPLAY
                  </span>
                </button>
              </motion.div>

              <motion.h2
                className="font-display font-bold text-[clamp(2.6rem,10.8vmin,8rem)] leading-none tracking-[0.14em] text-white [text-shadow:0_4px_16px_rgba(0,0,0,0.8)]"
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.14em" }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: reduced ? 0 : 1.6, ease: EASE_OUT }}
                onViewportEnter={() =>
                  window.setTimeout(() => setShowReplay(true), reduced ? 0 : 1800)
                }
              >
                THE END
              </motion.h2>

              <span aria-hidden className="mx-auto mt-[5vh] block h-[2px] w-full max-w-xs rounded-full bg-white/10" />
              <p className="label font-bold mt-[3vh] text-white/40">© 2026 · ANIMATOR&rsquo;S SKETCHBOOK</p>
            </div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
