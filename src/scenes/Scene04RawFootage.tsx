import { useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";

import { SceneSection, Slate } from "../components/ui/Primitives";

const KINDS = ["paper", "strip", "frame", "dot"] as const;
type Kind = (typeof KINDS)[number];

const ARCHIVE_LABELS = [
  "DATA",
  "DOCUMENTS",
  "QUERIES",
  "FEATURES",
  "SIGNALS",
  "EMBEDDINGS",
  "MODELS",
];

/** Deterministic pseudo-random so the scatter is identical on every render. */
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function FragmentBody({ kind, signal }: { kind: Kind; signal: boolean }) {
  if (kind === "paper") {
    return (
      <div className="paper-texture h-full w-full px-2 py-2 opacity-90 shadow-sm border border-forest/5">
        <span className="mb-1 block h-[2px] w-2/3 rounded-full bg-forest/30" />
        <span className="mb-1 block h-[2px] w-full rounded-full bg-forest/20" />
        <span className="mb-1 block h-[2px] w-4/5 rounded-full bg-forest/20" />
        <span className="block h-[2px] w-1/2 rounded-full bg-forest/15" />
      </div>
    );
  }
  if (kind === "strip") {
    return (
      <div className="flex h-full w-full flex-col justify-between border border-forest/10 bg-white/70 shadow-sm">
        <div className="sprocket h-1.5 w-full opacity-30" />
        <div className="mx-2 h-1/2 bg-gradient-to-br from-forest/5 to-transparent" />
        <div className="sprocket h-1.5 w-full opacity-30" />
      </div>
    );
  }
  if (kind === "frame") {
    return (
      <div
        className="h-full w-full border bg-gradient-to-br from-sky-fade/10 to-transparent"
        style={{ borderColor: signal ? "rgba(226,139,123,0.9)" : "rgba(126,184,108,0.2)" }}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: signal ? "#e28b7b" : "rgba(135,206,235,0.4)" }}
      />
    </div>
  );
}

function Fragment({
  i,
  p,
  cols,
  rows,
  signal,
  still,
}: {
  i: number;
  p: MotionValue<number>;
  cols: number;
  rows: number;
  signal: boolean;
  still: boolean;
}) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const kind = KINDS[i % KINDS.length];

  const start = 0.03 + (i % 7) * 0.008;
  const end = 0.20 + (i % 5) * 0.012;

  const sx = (seeded(i, 1) - 0.5) * 120;
  const sy = (seeded(i, 2) - 0.5) * 120;
  const sr = (seeded(i, 3) - 0.5) * 90;

  const x = useTransform(p, [start, end], [`${sx}%`, "0%"]);
  const y = useTransform(p, [start, end], [`${sy}%`, "0%"]);
  const rotate = useTransform(p, [start, end], [sr, signal ? 0 : sr * 0.06]);
  const scale = useTransform(p, [start, end], [0.72, 1]);
  const opacity = useTransform(
    p,
    [0, 0.04, 0.50, 0.60],
    [0, 0.9, 0.9, 0],
    { clamp: true }
  );

  const style = still
    ? { left: `${(col / cols) * 100}%`, top: `${(row / rows) * 100}%` }
    : { left: `${(col / cols) * 100}%`, top: `${(row / rows) * 100}%`, x, y, rotate, scale, opacity };

  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{
        width: `${100 / cols - 2}%`,
        height: `${100 / rows - 6}%`,
        ...style,
      }}
    >
      <FragmentBody kind={kind} signal={signal} />
    </motion.div>
  );
}

/**
 * SCENE 04 — RAW SKETCHES
 * The archive: everything a system ingests, scattered, then pulled into order
 * by the scroll — until one fragment is the one that matters.
 */
export function Scene04RawFootage({
  reduced,
  lowPower,
  mobile,
}: {
  reduced: boolean;
  lowPower: boolean;
  mobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const still = reduced;
  const cols = mobile ? 3 : lowPower || reduced ? 5 : 7;
  const rows = mobile ? 3 : 5;
  const total = cols * rows;
  const signalIndex = Math.floor(total / 2);

  /* 1. First Pause (0.30 - 0.50): The archive is organized, reticle focuses on signal,
     and "Everything in order. Nothing chosen yet." holds calmly. */
  const reticle = useTransform(scrollYProgress, [0.30, 0.35, 0.45, 0.50], [0, 1, 1, 0]);
  const holdLine = useTransform(scrollYProgress, [0.28, 0.33, 0.43, 0.48], [0, 1, 1, 0]);

  /* 2. Transition (0.50 - 0.60): Archive grid and top labels fade out completely to 0. */
  const gridFade = useTransform(scrollYProgress, [0.50, 0.60], [1, 0], { clamp: true });

  /* 3. Full-screen parchment cover rises (0.60 - 0.68) then fades out (0.92 - 1.00) — covers NavBar + any residual elements.
     This is the real fix: a solid background layer above everything except the headline. */
  const bgCover = useTransform(scrollYProgress, [0.60, 0.68, 0.92, 1.0], [0, 1, 1, 0], { clamp: true });

  /* 4. Headline reveals (0.65 - 0.73), holds, then fades out (0.92 - 1.00) with the cover. */
  const headline = useTransform(scrollYProgress, [0.65, 0.73, 0.92, 1.0], [0, 1, 1, 0], { clamp: true });
  const headlineY = useTransform(scrollYProgress, [0.65, 0.73], reduced ? [0, 0] : [20, 0], { clamp: true });
  const headlineScale = useTransform(scrollYProgress, [0.65, 0.73], reduced ? [1, 1] : [0.95, 1], { clamp: true });

  return (
    <SceneSection id="footage" label="Raw footage" className="h-[450vh] sm:h-[550vh] bg-ink-mid">
      <div ref={ref} className="absolute inset-0">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-[14svh] sm:top-[16svh] z-20 px-4 sm:px-8"
            style={{ opacity: gridFade }}
          >
            <Slate index="04" title="RAW FOOTAGE" note="THE ARCHIVE" />
            <ul className="mt-4 flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1 pr-4 sm:pr-0">
              {ARCHIVE_LABELS.map((l) => (
                <li
                  key={l}
                  className="label font-bold text-parchment-mist"
                >
                  {l}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="mask-fade-y absolute inset-x-4 top-[25svh] sm:top-[30svh] bottom-[12vh] sm:inset-x-10">
            {Array.from({ length: total }, (_, i) => (
              <Fragment
                key={i}
                i={i}
                p={scrollYProgress}
                cols={cols}
                rows={rows}
                signal={i === signalIndex}
                still={still}
              />
            ))}
          </div>

          {/* the hold — the archive is in order, nothing has been chosen yet */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[10svh] sm:bottom-[16vh] z-20 flex justify-center px-6"
            style={{ opacity: holdLine }}
          >
            <p className="hand text-center text-xl text-parchment-dim">
              Everything in order. Nothing chosen yet.
            </p>
          </motion.div>

          {/* rack focus onto the one fragment that matters */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[19] flex items-center justify-center"
            style={{ opacity: reticle }}
          >
            <div className="relative h-24 w-32 sm:h-32 sm:w-44">
              {[
                "left-0 top-0 border-l-[3px] border-t-[3px]",
                "right-0 top-0 border-r-[3px] border-t-[3px]",
                "left-0 bottom-0 border-l-[3px] border-b-[3px]",
                "right-0 bottom-0 border-r-[3px] border-b-[3px]",
              ].map((c) => (
                <span key={c} className={`absolute h-5 w-5 rounded-sm border-clay ${c}`} />
              ))}
            </div>
          </motion.div>

          {/* Full-screen parchment cover — sits above NavBar (z-[110]) and everything else.
               This is the authoritative fix: covers ALL fixed/sticky UI so Find the Signal
               gets a completely clean screen with no bleed-through from any other element. */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-ink-mid"
            style={{ opacity: bgCover, zIndex: 150 }}
          />

          {/* Headline — above the cover layer */}
          <motion.div
            className="pointer-events-none fixed inset-0 flex items-center justify-center px-6"
            style={{ opacity: headline, y: headlineY, scale: headlineScale, zIndex: 160 }}
          >
            <div className="max-w-2xl text-center">
              <span className="label mb-5 block text-clay font-bold">RACK FOCUS</span>
              <h2 className="font-display font-bold text-[clamp(2rem,9.5vmin,7rem)] leading-[0.95] tracking-[-0.02em] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                FIND THE SIGNAL.
              </h2>
              <span className="mx-auto mt-7 block h-[3px] w-24 rounded-full bg-clay" />
              <p className="mx-auto mt-6 max-w-md text-[16px] font-medium leading-relaxed text-parchment-dim">
                Everything behind this is raw footage. The work is
                deciding what earns a place in the final cut.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </SceneSection>
  );
}
