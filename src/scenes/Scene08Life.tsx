import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import {
  CHAPTER_ART,
  CURIOSITY_TILES,
  FILM_CLIPS,
  LIFE_CHAPTERS,
  PHOTO_FRAMES,
  TRAVEL_FRAMES,
  type MediaSlot,
} from "../data/lifeData";
import { EASE_OUT } from "../lib/motion";
import { MediaFrame } from "../components/life/MediaFrame";
import { SceneSection } from "../components/ui/Primitives";

interface Props {
  reduced: boolean;
  mobile: boolean;
  touch: boolean;
}

type Open = (slot: MediaSlot) => void;

/* ------------------------------------------------------------ chapter head */

function ChapterHead({
  index,
  kicker,
  heading,
  accent,
  statement,
  className = "",
}: {
  index: string;
  kicker: string;
  heading: string;
  accent: string;
  statement?: string;
  className?: string;
}) {
  const getDarkerColor = (idx: string, defaultAccent: string) => {
    switch (idx) {
      case "01": return "#8B4513"; // rich saddle brown
      case "02": return "#1F3E5A"; // deep slate navy
      case "03": return "#8B2513"; // deep rust red
      case "04": return "#3B5234"; // deep forest moss
      default: return defaultAccent;
    }
  };
  const titleColor = getDarkerColor(index, accent);

  return (
    <div className={className}>
      <div className="flex items-center gap-3 drop-shadow-sm">
        <span className="label font-bold tracking-wider" style={{ color: titleColor }}>
          SKETCHBOOK {index}
        </span>
        <span className="h-[2px] w-8 rounded-full" style={{ background: titleColor, opacity: 0.7 }} />
        <span className="label font-bold text-parchment tracking-wider">{kicker}</span>
      </div>
      <h3 className="mt-[2vh] font-display font-bold text-[clamp(1.8rem,7vmin,5rem)] leading-[0.92] tracking-[-0.02em] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
        {heading}
      </h3>
      {statement && (
        <p className="mt-[1.5vh] ml-[10%] sm:ml-[20%] lg:ml-[25%] max-w-xl font-display text-[clamp(0.85rem,2.2vmin,1.15rem)] text-parchment/80 font-semibold">
          {statement}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- 01 TRAVEL */

/** Positions along the road — deterministic, tuned by hand.
 * Spaced earlier (0.10 - 0.42) to leave a generous, calm pause (0.50 - 0.90) for viewing.
 */
const ROAD_MARKS = [
  { x: 8, y: 26, w: 20, at: 0.10 },
  { x: 68, y: 16, w: 22, at: 0.18 },
  { x: 20, y: 62, w: 24, at: 0.26 },
  { x: 62, y: 58, w: 26, at: 0.34 },
  { x: 38, y: 34, w: 22, at: 0.42 },
];

function TravelFrame({
  slot,
  mark,
  p,
  reduced,
  onOpen,
}: {
  slot: MediaSlot;
  mark: (typeof ROAD_MARKS)[number];
  p: MotionValue<number>;
  reduced: boolean;
  onOpen: Open;
}) {
  // Frames fade in promptly as the road arrives, hold at full opacity through the long viewing pause (up to 0.90), and only fade as you scroll down to the next page
  const opacity = useTransform(p, [mark.at - 0.08, mark.at, 0.90, 0.99], [0, 1, 1, 0]);
  /* Frames rush toward the lens and settle completely into place by mark.at + 0.08 */
  const scale = useTransform(p, [mark.at - 0.08, mark.at + 0.08], reduced ? [1, 1] : [0.75, 1.05]);
  const y = useTransform(p, [mark.at - 0.08, mark.at + 0.08], reduced ? ["0%", "0%"] : ["14%", "0%"]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const frameWidth = isMobile ? Math.max(45, mark.w * 1.5) : mark.w;
  const frameX = isMobile ? Math.min(mark.x, 100 - frameWidth - 4) : mark.x;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${frameX}%`,
        top: `${mark.y}%`,
        width: `${frameWidth}%`,
        opacity,
        scale,
        y,
      }}
    >
      <div className="aspect-[4/3] w-full rounded-md shadow-md p-2 bg-white/90">
        <MediaFrame slot={slot} onOpen={onOpen} accent="rgba(44,53,57,0.35)" />
      </div>
    </motion.div>
  );
}

function ChapterTravel({ reduced, onOpen }: { reduced: boolean; onOpen: Open }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const chapter = LIFE_CHAPTERS[0];

  const bgScale = useTransform(scrollYProgress, [0, 0.5], reduced ? [1.05, 1.05] : [1.02, 1.18]);
  const bgY = useTransform(scrollYProgress, [0, 0.5], reduced ? ["0%", "0%"] : ["0%", "-6%"]);
  const lineDraw = useTransform(scrollYProgress, [0.06, 0.44], [0, 1]);
  const mapFade = useTransform(scrollYProgress, [0.90, 0.99], [1, 0]);

  return (
    <div ref={ref} className="relative h-[450vh] sm:h-[650vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink-mid [@media(max-height:750px)]:overflow-y-auto">
        {/* the world */}
        <motion.div className="absolute inset-0" style={{ scale: bgScale, y: bgY }}>
          <img
            src={CHAPTER_ART.road}
            alt="Hand-painted road running toward distant mountains"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/80 via-transparent to-[#fdfbf7]/95" />
        </motion.div>

        {/* map lines linking the frames */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <motion.path
            d="M18 34 C 40 20, 62 18, 79 24 S 40 58, 33 70 S 66 72, 73 66 S 52 46, 49 42"
            fill="none"
            stroke="rgba(44,53,57,0.5)"
            strokeWidth="0.3"
            strokeDasharray="1.2 1.4"
            style={{ pathLength: lineDraw, opacity: mapFade }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* the frames along the road */}
        <div className="absolute inset-0">
          {TRAVEL_FRAMES.map((slot, i) => (
            <TravelFrame
              key={slot.id}
              slot={slot}
              mark={ROAD_MARKS[i % ROAD_MARKS.length]}
              p={scrollYProgress}
              reduced={reduced}
              onOpen={onOpen}
            />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[8svh] px-4 sm:px-8 pl-[6%]"
        >
          <ChapterHead {...chapter} statement={chapter.statement} className="mx-auto max-w-6xl translate-x-2 -translate-y-2" />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- 02 PHOTOGRAPHY */

function ChapterPhotography({
  reduced,
  touch,
  onOpen,
}: {
  reduced: boolean;
  touch: boolean;
  onOpen: Open;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const chapter = LIFE_CHAPTERS[1];

  /* Rack focus: the hero composition sharpens and settles. */
  const heroScale = useTransform(scrollYProgress, [0, 0.5], reduced ? [1, 1] : [1.22, 1]);
  const heroBright = useTransform(scrollYProgress, [0, 0.45], [0.8, 1.1]);
  const heroFilter = useTransform(heroBright, (b) => `brightness(${b}) saturate(${0.4 + b * 0.6})`);
  const stripX = useTransform(scrollYProgress, (v: any) => {
    if (reduced) return "0px";
    const val = v as number;
    const p = Math.max(0, Math.min(1, (val - 0.25) / 0.75));
    if (typeof window === 'undefined') return "0px";
    
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const itemVw = isMobile ? 45 : (isTablet ? 22 : 16);
    const gapPx = 16;
    const itemPx = (itemVw / 100) * window.innerWidth;
    
    const totalWidth = PHOTO_FRAMES.length * itemPx + (PHOTO_FRAMES.length - 1) * gapPx;
    const startX = (window.innerWidth / 2) - (itemPx / 2) - 16;
    const endX = (window.innerWidth / 2) - totalWidth + (itemPx / 2) + 16;
    
    return `${startX + p * (endX - startX)}px`;
  });

  /* Focus ring trailing the cursor. */
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const rx = useSpring(mx, { stiffness: 380, damping: 34, mass: 0.4 });
  const ry = useSpring(my, { stiffness: 380, damping: 34, mass: 0.4 });
  const [ringOn, setRingOn] = useState(false);

  return (
    <div ref={ref} className="relative h-[220vh] sm:h-[360vh]">
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#fdfbf7] [@media(max-height:750px)]:overflow-y-auto"
        onPointerMove={
          touch || reduced
            ? undefined
            : (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
                if (!ringOn) setRingOn(true);
              }
        }
        onPointerLeave={() => setRingOn(false)}
      >
        {/* hero composition */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale, filter: heroFilter }}>
          <img
            src={CHAPTER_ART.horizon}
            alt="Hand-painted warm horizon at golden hour"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/95" />

        {/* viewfinder */}
        <div aria-hidden className="pointer-events-none absolute inset-6 sm:inset-12">
          {[
            "left-0 top-0 border-l-[3px] border-t-[3px]",
            "right-0 top-0 border-r-[3px] border-t-[3px]",
            "left-0 bottom-0 border-l-[3px] border-b-[3px]",
            "right-0 bottom-0 border-r-[3px] border-b-[3px]",
          ].map((c) => (
            <span key={c} className={`absolute h-8 w-8 rounded-sm border-parchment-dim/30 ${c}`} />
          ))}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="border border-parchment-mist/20" />
            ))}
          </div>
          <span className="label font-bold absolute top-2 left-3 sm:-top-5 sm:left-0 text-parchment-dim drop-shadow-xs">f/1.8 · 1/250</span>
          <span className="label font-bold absolute top-2 right-3 sm:-top-5 sm:right-0 text-clay">● REC</span>
        </div>

        {/* focus ring */}
        {!touch && !reduced ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20"
            style={{ x: rx, y: ry, opacity: ringOn ? 1 : 0 }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <div className="relative h-24 w-24">
                <span className="absolute inset-0 rounded-full border border-forest/30" />
                <span className="absolute inset-[30%] rounded-full border-2 border-sunset/70" />
                <span className="absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 rounded-full bg-sunset/70" />
                <span className="absolute bottom-0 left-1/2 h-3 w-[2px] -translate-x-1/2 rounded-full bg-sunset/70" />
                <span className="absolute left-0 top-1/2 h-[2px] w-3 -translate-y-1/2 rounded-full bg-sunset/70" />
                <span className="absolute right-0 top-1/2 h-[2px] w-3 -translate-y-1/2 rounded-full bg-sunset/70" />
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="absolute inset-x-0 top-[18svh] sm:top-[12svh] px-4 sm:px-8">
          <ChapterHead {...chapter} statement={chapter.statement} className="mx-auto max-w-6xl" />
        </div>

        {/* the film strip */}
        <div className="absolute inset-x-0 bottom-[16vh]">
          <div className="sprocket h-2 w-full opacity-10" />
          <motion.ul className="flex gap-4 px-4 py-3 sm:px-8" style={{ x: stripX }}>
            {PHOTO_FRAMES.map((slot, i) => (
              <PhotoFrameItem key={slot.id} slot={slot} i={i} scrollYProgress={scrollYProgress} onOpen={onOpen} total={PHOTO_FRAMES.length} />
            ))}
          </motion.ul>
          <div className="sprocket h-2 w-full opacity-10" />
        </div>

      </div>
    </div>
  );
}

function PhotoFrameItem({ slot, i, scrollYProgress, onOpen, total }: { slot: any, i: number, scrollYProgress: any, onOpen: any, total: number }) {
  // Calculate the peak scroll position where this image is exactly in the center
  const peak = 0.25 + (0.75 / Math.max(1, total - 1)) * i;
  
  // Using function-based transforms bypasses the WAAPI [0,1] offset restriction crash
  const scale = useTransform(scrollYProgress, (v: any) => {
    const val = v as number;
    const dist = Math.abs(val - peak);
    if (dist >= 0.18) return 0.8;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxScale = isMobile ? 1.25 : 1.4;
    return maxScale - ((maxScale - 0.8) * (dist / 0.18));
  });

  const opacity = useTransform(scrollYProgress, (v: any) => {
    const val = v as number;
    const dist = Math.abs(val - peak);
    if (dist >= 0.18) return 0.35;
    return 1 - (0.65 * (dist / 0.18));
  });

  const zIndex = useTransform(scrollYProgress, (v: any) => {
    const val = v as number;
    const dist = Math.abs(val - peak);
    if (dist >= 0.1) return 1;
    return Math.round(20 - (19 * (dist / 0.1)));
  });

  const filter = useTransform(opacity, (o) => `brightness(${o})`);

  return (
    <motion.li 
      className="w-[45vw] shrink-0 sm:w-[22vw] lg:w-[16vw] origin-center"
      style={{ scale, opacity, zIndex, filter }}
    >
      <div className="aspect-[4/3] w-full rounded-md shadow-2xl p-1.5 bg-white transition-shadow duration-500 hover:shadow-3xl">
        <MediaFrame slot={slot} onOpen={onOpen} />
      </div>
    </motion.li>
  );
}

/* --------------------------------------------------------- 03 FILMMAKING */

function ChapterFilmmaking({ reduced, onOpen }: { reduced: boolean; onOpen: Open }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const chapter = LIFE_CHAPTERS[2];

  const heroVariants: any = {
    initial: (idx: number) => {
      switch (idx) {
        case 0: return { opacity: 0, scale: 1.04, filter: "blur(0px)", x: 0 };
        case 1: return { opacity: 0, x: 40, scale: 1, filter: "blur(0px)" };
        case 2: return { opacity: 0, scale: 0.9, filter: "blur(8px)", x: 0 };
        case 3: return { opacity: 0, scale: 1, filter: "blur(0px)", x: 0 };
        default: return { opacity: 0 };
      }
    },
    animate: (idx: number) => {
      switch (idx) {
        case 0: return { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, transition: { duration: reduced ? 0 : 0.8, ease: EASE_OUT } };
        case 1: return { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition: { duration: reduced ? 0 : 0.6, ease: EASE_OUT } };
        case 2: return { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, transition: { duration: reduced ? 0 : 0.5, ease: EASE_OUT } };
        case 3: return { opacity: 1, scale: 1.03, filter: "blur(0px)", x: 0, transition: { duration: reduced ? 0 : 4, ease: "linear" } };
        default: return { opacity: 1 };
      }
    },
    exit: (idx: number) => {
      switch (idx) {
        case 0: return { opacity: 0, transition: { duration: 0.3 } };
        case 1: return { opacity: 0, x: -40, transition: { duration: 0.3 } };
        case 2: return { opacity: 0, transition: { duration: 0.3 } };
        case 3: return { opacity: 0, transition: { duration: 0.3 } };
        default: return { opacity: 0 };
      }
    }
  };

  const [assembled, setAssembled] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.max(0, Math.min(FILM_CLIPS.length, Math.floor(((v - 0.12) / 0.5) * FILM_CLIPS.length) + 1));
    setAssembled((prev) => (prev === next ? prev : next));
  });

  const playhead = useTransform(scrollYProgress, [0.12, 0.62], ["0%", "100%"]);
  const monitorClip = FILM_CLIPS[Math.max(0, Math.min(FILM_CLIPS.length - 1, assembled - 1))];

  return (
    <div ref={ref} className="relative h-[250vh] sm:h-[380vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 sm:px-8 bg-ink-mid pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:justify-start [@media(max-height:750px)]:pt-[12svh] [@media(max-height:750px)]:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_20%,rgba(226,139,123,0.1),transparent_60%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl">
          <ChapterHead {...chapter} />

          <div className="mt-[4vh] grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* the monitor */}
            <div className="relative rounded-xl border-2 border-forest/10 bg-white/70 p-2.5 shadow-sm">
              <div className="relative aspect-video w-full overflow-hidden rounded-md bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={monitorClip.id}
                    className="absolute inset-0"
                    custom={Math.max(0, assembled - 1)}
                    variants={heroVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <MediaFrame slot={monitorClip} accent="transparent" />
                  </motion.div>
                </AnimatePresence>
                <span className="label font-bold absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-black shadow-sm backdrop-blur-sm">
                  {monitorClip.track}
                </span>
                <span className="label font-bold absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-black shadow-sm backdrop-blur-sm">
                  {assembled}/{FILM_CLIPS.length}
                </span>
              </div>
              <div className="mt-4 flex justify-center h-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={monitorClip.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="font-display font-medium italic text-[clamp(0.95rem,1.8vmin,1.1rem)] uppercase first-letter:text-[1.4em] text-parchment drop-shadow-sm text-center"
                  >
                    {monitorClip.director}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* storyboard column */}
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-2">
              {FILM_CLIPS.map((clip, i) => (
                <motion.li
                  key={clip.id}
                  animate={{
                    opacity: assembled > i ? 1 : 0.5,
                    y: reduced ? 0 : assembled > i ? 0 : 12,
                    filter: monitorClip.track === "DETAIL" && assembled - 1 !== i ? "blur(2px)" : "blur(0px)"
                  }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <div className="aspect-[4/3] w-full rounded-md shadow-sm p-1.5 bg-white transition-all duration-500"
                       style={{ borderColor: assembled - 1 === i ? "rgba(226,139,123,0.5)" : "transparent", borderWidth: assembled - 1 === i ? "2px" : "0px" }}>
                    <MediaFrame slot={clip} onOpen={onOpen} />
                  </div>
                  <span className={`label font-bold mt-2 block transition-colors duration-500 ${
                    assembled - 1 === i ? "text-sunset" : "text-parchment-mist"
                  }`}>
                    {clip.track} — <span className="italic font-normal">{clip.poetic}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* the timeline */}
          <div className="mt-[4vh]">
            <div className="flex items-center justify-between">
              <span className="label font-bold text-parchment-mist">SEQUENCE 01 — THE CUT</span>
              <span className="label font-bold text-parchment-mist/50">04 FRAMES</span>
            </div>

            <div className="relative mt-2.5 h-16 rounded-lg border-2 border-forest/10 bg-white/60 p-1.5 shadow-inner">
              <div className="flex h-full gap-1">
                {FILM_CLIPS.map((clip, i) => (
                  <motion.div
                    key={clip.id}
                    className="relative h-full overflow-hidden rounded-[4px] border-2"
                    style={{
                      flexGrow: clip.length,
                      flexBasis: 0,
                      borderColor: assembled > i ? "rgba(126,184,108,0.4)" : "rgba(126,184,108,0.1)",
                      background: assembled > i ? "rgba(126,184,108,0.15)" : "transparent",
                    }}
                    initial={false}
                    animate={{ x: reduced ? 0 : assembled > i ? 0 : 26, opacity: assembled > i ? 1 : 0.3 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  >
                    <span className="sprocket absolute inset-x-0 top-0 h-1.5 opacity-10" />
                    <span className="label font-bold absolute bottom-1 left-1.5 text-[8px] text-parchment-mist">
                      {clip.track}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-[2px] bg-sunset z-10 shadow-[0_0_8px_rgba(226,139,123,0.6)]"
                style={{ left: playhead }}
              >
                <span className="absolute -top-2 left-1/2 h-4 w-3 -translate-x-1/2 rounded-[2px] bg-sunset shadow-md flex items-center justify-center">
                  <span className="h-2 w-[1px] bg-white/60" />
                </span>
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- 04 CURIOSITY */

const TILT = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2, -2, 1.6];

function ChapterCuriosity() {
  const chapter = LIFE_CHAPTERS[3];

  return (
    <div className="relative h-[150vh] bg-[#fdfbf7]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 sm:px-8 pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:justify-start [@media(max-height:750px)]:pt-[12svh] [@media(max-height:750px)]:pb-24">
        <div className="mx-auto w-full max-w-6xl py-[6vh]">
        <ChapterHead {...chapter} />

        <p className="mt-[3vh] max-w-md text-[15px] font-medium leading-relaxed text-parchment-dim">
          An open sketchbook. It is meant to keep changing.
        </p>

        <ul className="mt-[6vh] grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {CURIOSITY_TILES.map((tile, i) => (
            <motion.li
              key={tile.id}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILT[i % TILT.length] }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, delay: (i % 4) * 0.07, ease: EASE_OUT }}
              whileHover={{ rotate: 0, scale: 1.03 }}
            >
              <div className="group flex aspect-[4/3] flex-col justify-between rounded-xl border border-forest/10 bg-white/80 p-4 shadow-sm paper-texture transition-all duration-300 hover:border-sunset/30 hover:shadow-md">
                <div className="flex items-start justify-between">
                  {tile.icon ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/5 text-forest transition-colors duration-300 group-hover:bg-sunset/10 group-hover:text-sunset ring-1 ring-inset ring-forest/10 group-hover:ring-sunset/20">
                      <tile.icon size={24} strokeWidth={1.5} />
                    </div>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-forest mt-1.5" />
                  )}
                  <span className="label font-bold text-[10px] text-parchment-mist mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                {tile.media ? (
                  <div className="my-2 min-h-0 flex-1">
                    <MediaFrame slot={tile.media} />
                  </div>
                ) : null}
                <div>
                  <span className="block font-display font-bold text-lg leading-tight text-parchment">
                    {tile.label}
                  </span>
                  {tile.note ? (
                    <span className="mt-1 block text-[12px] font-medium leading-snug text-parchment-dim">
                      {tile.note}
                    </span>
                  ) : (
                    <span className="sprocket mt-2 block h-1.5 opacity-10" />
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <p className="hand mt-[5vh] text-[20px] font-bold text-sunset">
          more sketches to come
        </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- lightbox */

function Lightbox({ slot, onClose }: { slot: MediaSlot | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Play sound by default in expanded view

  useEffect(() => {
    if (!slot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [slot, onClose]);

  // Reset state when opening a new slot
  useEffect(() => {
    if (slot && slot.kind === "video") {
      setIsPlaying(true);
      setIsMuted(false);
    }
  }, [slot]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      {slot ? (
        <motion.div
          className="fixed inset-0 z-[145] flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={slot.alt}
        >
          {/* Darker, cinematic blur backdrop */}
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/90 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close media"
            tabIndex={-1}
          />
          <motion.figure
            className="relative inline-block rounded-xl bg-transparent overflow-hidden ring-1 ring-white/10 shadow-2xl"
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div className="relative flex items-center justify-center group">
              {slot.kind === "video" ? (
                <>
                  <video
                    ref={videoRef}
                    className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
                    src={slot.src}
                    poster={slot.poster}
                    autoPlay
                    loop
                    playsInline
                    onClick={togglePlay}
                    muted={isMuted} // Controlled by state
                  />
                  {/* Cinematic Video Controls */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-between rounded-b-xl">
                    <div className="flex gap-4">
                      <button 
                        onClick={togglePlay}
                        className="text-white hover:text-sunset transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md"
                      >
                        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                      </button>
                      <button 
                        onClick={toggleMute}
                        className="text-white hover:text-sunset transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md"
                      >
                        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={slot.src}
                  alt={slot.alt}
                  className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
                />
              )}
              
              {/* Floating Close Button */}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-sunset transition-colors bg-black/40 hover:bg-black/60 p-2.5 rounded-full backdrop-blur-md z-10"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>
            
            {/* Clean title overlay */}
            {slot.caption && (
              <figcaption className="absolute top-6 inset-x-0 flex justify-center pointer-events-none">
                <div className="rounded-full border border-white/20 bg-black/40 px-5 py-1.5 backdrop-blur-md shadow-lg">
                  <h3 className="font-display font-bold tracking-wide text-[clamp(0.9rem,2vmin,1.2rem)] text-white/95">
                    {slot.caption}
                  </h3>
                </div>
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------ the collapse */

const COLLAPSE_POS = [
  { x: -42, y: -30 },
  { x: 42, y: -30 },
  { x: -42, y: 30 },
  { x: 42, y: 30 },
];

function CollapseFrame({
  chapter,
  pos,
  converge,
  reduced,
}: {
  chapter: (typeof LIFE_CHAPTERS)[number];
  pos: { x: number; y: number };
  converge: MotionValue<number>;
  reduced: boolean;
}) {
  const x = useTransform(converge, (v) => (reduced ? "0%" : `${pos.x * v}%`));
  const y = useTransform(converge, (v) => (reduced ? "0%" : `${pos.y * v}%`));
  const opacity = useTransform(converge, [0, 1], [0.25, 1]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[40%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 bg-white/70 shadow-sm"
      style={{ x, y, opacity, borderColor: `${chapter.accent}40` }}
    >
      <span className="label font-bold absolute bottom-1.5 left-2 text-[8px] text-parchment-mist">
        {chapter.kicker}
      </span>
    </motion.div>
  );
}

function Collapse({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const converge = useTransform(scrollYProgress, [0.05, 0.55], [1, 0]);
  const frame = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const text = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);

  return (
    <div ref={ref} className="relative h-[180vh] sm:h-[240vh] bg-ink-mid">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6 pt-[8svh] [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:items-start [@media(max-height:750px)]:pt-[12svh] [@media(max-height:750px)]:pb-24">
        <div className="relative h-[46vh] w-full max-w-3xl">
          {LIFE_CHAPTERS.map((c, i) => (
            <CollapseFrame
              key={c.id}
              chapter={c}
              pos={COLLAPSE_POS[i % COLLAPSE_POS.length]}
              converge={converge}
              reduced={reduced}
            />
          ))}

          {/* the single frame everything folds into */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[40%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-forest/20 shadow-md bg-white"
            style={{ opacity: frame }}
          >
            <span className="sprocket absolute inset-x-0 top-0 h-2 opacity-10" />
            <span className="sprocket absolute inset-x-0 bottom-0 h-2 opacity-10" />
          </motion.div>

          <motion.p
            className="absolute inset-x-0 top-[calc(50%+18vh)] text-center font-display font-bold text-[clamp(1.3rem,4.1vmin,3rem)] leading-tight tracking-[0.04em] text-parchment"
            style={{ opacity: text }}
          >
            CREATE. EXPLORE. NOTICE. REPEAT.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ scene */

/**
 * SCENE 08 — THE LIFE BETWEEN SKETCHES
 * The camera leaves the studio. Four reels — road, camera, animation desk, imagination —
 * then all four fold back into a single frame and hand off to the credits.
 */
export function Scene08Life({ reduced, mobile, touch }: Props) {
  const [open, setOpen] = useState<MediaSlot | null>(null);

  return (
    <SceneSection id="life" label="The life between frames" className="relative bg-[#fdfbf7]">
      {/* the studio widens out */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center justify-center px-4 sm:px-8">
          <motion.div
            className="mx-auto w-full max-w-4xl text-center"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <span className="label font-bold text-forest">SCENE 08 · EXT. — DAY</span>
            <h2 className="mt-[3vh] font-display font-bold text-[clamp(2.4rem,8.8vmin,6.5rem)] leading-[0.94] tracking-[-0.02em] text-parchment [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
              THE LIFE
              <br />
              BETWEEN SKETCHES
            </h2>
            <p className="mt-[3.5vh] font-display font-bold text-[clamp(1.1rem,2.7vmin,2rem)] text-parchment-dim">
              The things that keep me curious.
            </p>
            <p className="mt-[2.5vh] text-[15px] font-medium leading-relaxed text-parchment-mist">
              Travel. Photography. Filmmaking. Experiences worth painting.
            </p>
            
            <motion.div 
              className="mx-auto mt-[8vh] flex flex-col items-center justify-center gap-3 opacity-60"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="label font-bold text-[9px] tracking-widest text-parchment-mist">SCROLL</span>
              <div className="h-16 w-[2px] bg-gradient-to-b from-forest/30 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ChapterTravel reduced={reduced} onOpen={setOpen} />
      <ChapterPhotography reduced={reduced} touch={touch || mobile} onOpen={setOpen} />
      <ChapterFilmmaking reduced={reduced} onOpen={setOpen} />
      <ChapterCuriosity />
      <Collapse reduced={reduced} />

      <Lightbox slot={open} onClose={() => setOpen(null)} />
    </SceneSection>
  );
}
