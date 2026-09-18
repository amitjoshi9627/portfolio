import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShieldAlert, Sparkles, Clock3, Fingerprint } from "lucide-react";
import mediaGrid from "../../assets/media-grid.jpg";
import { SPRING_SOFT } from "../../lib/motion";
import { useSequence } from "../../hooks/useSequence";
import { Chip, FlowNode, IllustrativeTag } from "../ui/Primitives";
import type { VisualProps } from "./ProfessionalVisuals";

/* ------------------------------------------------------------------ 04 SILA */

const SILA_QUERY = "the quiet shots near the water, late light";
const TILES = Array.from({ length: 8 }, (_, i) => i);
const ROUTES = [
  { label: "LEXICAL", sub: "exact terms" },
  { label: "VISUAL", sub: "image meaning" },
  { label: "CONCEPTUAL", sub: "scene meaning" },
];



function useTypewriter(text: string, active: boolean, reduced: boolean) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active || reduced) {
      setOut(active || reduced ? text : "");
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [text, active, reduced]);
  return out;
}

export function SilaVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, 4, 2500, reduced);
  const typed = useTypewriter(SILA_QUERY, active && !rewind, reduced);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="label text-paper/60">LOCAL-FIRST · NO MANUAL TAGS</span>
        <IllustrativeTag />
      </div>

      {/* query bar */}
      <div className="flex items-center gap-3 border border-paper/20 bg-white/40 px-3 py-2.5 shrink-0 rounded-md">
        <Search size={14} strokeWidth={1.4} className="shrink-0 text-amber-dust" />
        <span className="truncate font-mono text-[11px] text-paper/70 sm:text-xs">
          {typed}
          {!reduced && typed.length < SILA_QUERY.length ? (
            <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-amber-dust/80" />
          ) : null}
        </span>
      </div>

      {/* tri-modal search pipeline */}
      <div className="flex flex-col gap-1 shrink-0">
        <div className="grid grid-cols-3 gap-1.5">
          {ROUTES.map((r) => (
            <FlowNode key={r.label} label={r.label} sub={r.sub} active={step >= 1} accent="#C98A3C" />
          ))}
        </div>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 26 }} className="flex flex-col items-center overflow-hidden">
              <div className="w-[1.5px] h-2 bg-amber-dust/40 shrink-0" />
              <div className="whitespace-nowrap text-[8.5px] sm:text-[9.5px] font-bold tracking-widest text-amber-dust bg-amber-dust/10 border border-amber-dust/30 px-3 py-0.5 rounded shrink-0">
                {step === 2 ? "RRF FUSION" : "FUSED → MATCHES"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the archive */}
      <div className="relative grid min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden sm:gap-2">
        {TILES.map((t) => {
          const col = t % 4;
          const row = Math.floor(t / 4);
          const isMatch = t === 6 || t === 7;
          const dim = step >= 2 && !isMatch;
          return (
            <motion.div
              key={t}
              transition={reduced ? { duration: 0 } : SPRING_SOFT}
              className="relative h-full w-full overflow-hidden border"
              style={{
                borderColor: step >= 2 && isMatch ? "rgba(201,138,60,0.9)" : "rgba(0,0,0,0.06)",
              }}
              animate={{ opacity: dim ? 0.22 : 1, filter: dim ? "saturate(0.2)" : "saturate(0.8)" }}
            >
              <div
                className="h-full w-full bg-paper/10"
                style={{
                  backgroundImage: `url(${mediaGrid})`,
                  backgroundSize: "400% 400%",
                  backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%`,
                }}
                role="img"
                aria-label="Media thumbnail from an example archive"
              />
              {step === 2 && isMatch ? (
                <motion.div
                  className="absolute bottom-1 left-1 px-1 py-0.5 text-[7px] sm:text-[8px] font-bold bg-white/80 text-paper/80 backdrop-blur-sm border border-paper/20 rounded-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {t === 6 ? "#2 VISUAL" : "#1 VISUAL"}
                </motion.div>
              ) : null}
            </motion.div>
          );
        })}

        {/* QUALITY SIGNALS Annotation */}
        <div className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-md border border-paper/20 px-1.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
          <span className="text-[7px] sm:text-[8px] font-bold text-paper/70 tracking-wider">QUALITY SIGNALS</span>
          <span className="text-[7.5px] sm:text-[8.5px] text-paper/70 font-serif italic">blur · exposure</span>
        </div>
      </div>

      <div className="flex items-start sm:items-center justify-between shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip accent="#C98A3C" muted={step < 1}>
            MULTIMODAL INGESTION
          </Chip>
          <Chip accent="#C98A3C" muted={step < 1}>
            HYBRID RETRIEVAL
          </Chip>
          <Chip accent="#C98A3C" muted={step < 2}>
            RRF FUSION
          </Chip>
        </div>
        <div className="hidden sm:block label text-[8px] text-paper/50 mt-1 sm:mt-0">
          LOCAL INDEX · SQLITE + LANCEDB
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- 05 VAAK */


export function AudioWaveform({ active = true }: { active?: boolean }) {
  const CHUNKS = 18;
  return (
    <div className="flex h-full w-full items-center justify-center gap-1 sm:gap-1.5 px-2">
      {Array.from({ length: CHUNKS }).map((_, i) => {
        const spoof = SPOOF_SEGMENTS.includes(i);
        return (
          <motion.div
            key={i}
            className="w-2 sm:w-2.5 rounded-full"
            style={{
              height: `${20 + Math.random() * 80}%`,
              backgroundColor: spoof ? "#B33939" : "#386641",
            }}
            animate={
              active
                ? {
                    height: [`${20 + Math.random() * 30}%`, `${60 + Math.random() * 40}%`, `${20 + Math.random() * 30}%`],
                  }
                : {}
            }
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

const SPOOF_SEGMENTS = [5, 6, 7, 8, 12, 13];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const id = window.setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); window.clearInterval(id); }
      else setVal(Math.round(current));
    }, duration / steps);
    return () => window.clearInterval(id);
  }, [active, target, duration]);
  return val;
}

export function VaakVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, 5, 1600, reduced);
  const score = useCountUp(93, step >= 4, 1200);

  const waveHeights = [28, 42, 60, 78, 55, 85, 92, 88, 75, 45, 30, 50, 80, 95, 72, 40, 55, 35];

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="label text-[#C94E35]/80">ACTIVE RESEARCH</span>
        <IllustrativeTag />
      </div>

      {/* Header label */}
      <div className="flex items-center justify-between shrink-0">
        <span className="label text-paper/60 text-[9px] tracking-widest">FORENSIC LISTENING</span>
        <span className="label text-paper/50 text-[8px]">00:12</span>
      </div>

      {/* Waveform + chunk sweep */}
      <div className="relative shrink-0 h-24 sm:h-28 bg-paper/5 border border-paper/20 rounded px-2 flex items-center gap-[2px] overflow-hidden">
        {waveHeights.map((h, i) => {
          const isSuspect = SPOOF_SEGMENTS.includes(i);
          const chunkVisible = step >= 2;
          const highlighted = step >= 3 && isSuspect;
          return (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              animate={{
                height: `${h}%`,
                backgroundColor: highlighted
                  ? "rgba(201,78,53,0.85)"
                  : chunkVisible && isSuspect
                    ? "rgba(201,78,53,0.35)"
                    : "rgba(0,0,0,0.08)",
                scaleY: step >= 1 ? 1 : 0.2,
                opacity: step >= 1 ? 1 : 0,
              }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.025 }}
            />
          );
        })}
        {/* Sweep cursor */}
        {step === 2 && !reduced && (
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] bg-[#C94E35]/60"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.4, ease: "linear" }}
          />
        )}
        {/* Suspicious label */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="absolute bottom-2 left-[27%] flex flex-col items-center"
          >
            <span className="text-[7px] font-bold text-[#C94E35] tracking-wider">↑ SUSPICIOUS</span>
          </motion.div>
        )}
      </div>

      {/* Timeline bar */}
      <div className="flex items-center justify-between shrink-0">
        <span className="font-mono text-[8.5px] text-paper/50">00:00</span>
        <div className="flex-1 mx-2 h-[1px] bg-paper/20" />
        {step >= 3 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[8px] text-[#C94E35]/70 mr-2"
          >
            03.15 – 04.30
          </motion.span>
        )}
        <span className="font-mono text-[8.5px] text-paper/50">00:12</span>
      </div>

      {/* Score area */}
      <div className="flex-1 flex flex-col justify-center gap-2 px-1.5 sm:px-2">
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[7.5px] font-bold tracking-widest text-paper/60 mb-0.5">UTTERANCE SCORE</div>
                <div className="text-[28px] sm:text-[32px] font-display font-bold text-[#C94E35] leading-none">
                  {score}<span className="text-[14px] text-[#C94E35]/60">%</span>
                </div>
                <div className="text-[8px] font-bold tracking-widest text-[#C94E35] mt-0.5">LIKELY SYNTHETIC</div>
              </div>
              <div className="flex flex-col items-end gap-0.5 pb-1">
                <span className="text-[7px] text-paper/50 tracking-wider font-bold">CHUNK EVIDENCE</span>
                {["03.15–03.75", "03.75–04.30"].map((t) => (
                  <span key={t} className="font-mono text-[7.5px] text-[#C94E35]/60">{t}</span>
                ))}
              </div>
            </div>
            {/* Score bar */}
            <div className="h-1.5 w-full bg-paper/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#C94E35]"
                initial={{ width: "0%" }}
                animate={{ width: `${score}%` }}
                transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer chips */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <Chip accent="#C94E35" muted={step < 1}>WAVLM</Chip>
        <Chip accent="#C94E35" muted={step < 2}>CHUNK ANALYSIS</Chip>
        <Chip accent="#C94E35" muted={step < 4}>EER · AUC · minDCF</Chip>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------- 06 FEEDSHIFT */

const SIGNALS = [
  { key: "UNIQUENESS", short: "UNI", icon: Fingerprint },
  { key: "FRESHNESS", short: "FRSH", icon: Clock3 },
  { key: "INTEREST", short: "FIT", icon: Sparkles },
  { key: "QUALITY", short: "QUAL", icon: ShieldAlert },
];

const NUM_POSTS = 9;
const TOP_INDICES = [2, 4, 7];
const SCATTER_COORDS = [
  { top: "2%", left: "2%" },
  { top: "5%", left: "75%" },
  { top: "35%", left: "5%" },
  { top: "75%", left: "5%" },
  { top: "70%", left: "75%" },
  { top: "85%", left: "40%" },
];

const FEED_ITEMS = (() => {
  let scatterCounter = 0;

  // Pre-calculate ranks so Top-K are at the top
  const ranks = Array.from({ length: NUM_POSTS }, (_, i) => i).sort((a, b) => {
    const idxA = TOP_INDICES.indexOf(a);
    const idxB = TOP_INDICES.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a - b;
  });

  return Array.from({ length: NUM_POSTS }, (_, i) => {
    const isTop = TOP_INDICES.includes(i);
    const stackIdx = isTop ? TOP_INDICES.indexOf(i) : -1;
    const rank = ranks.indexOf(i);

    // Streaming (1 Column, Chronological)
    const streamTop = `${(i * (100 / NUM_POSTS)) + 0.8}%`;
    const streamLeft = "10%";
    const streamWidth = "80%";
    const streamHeight = `${(100 / NUM_POSTS) - 1.6}%`;

    // Extraction (3x3 Grid)
    const row = Math.floor(i / 3);
    const col = i % 3;
    const gridTop = `${row * 33.33 + 1.5}%`;
    const gridLeft = `${col * 33.33 + 1.5}%`;
    const gridWidth = "30%";
    const gridHeight = "30%";

    // Ranking (1 Column, Sorted by Score)
    const rankingTop = `${(rank * (100 / NUM_POSTS)) + 0.8}%`;
    const rankingLeft = rank < 3 ? "10%" : "20%"; // indent lower ranks
    const rankingWidth = rank < 3 ? "80%" : "60%";
    const rankingHeight = streamHeight;

    // Personalized (Center Stack + Edge Scatter)
    let pTop, pLeft, pWidth, pHeight, pZ, pRotate;
    if (isTop) {
      pTop = `${15 + (stackIdx * 5)}%`;
      pLeft = `${20 + (stackIdx * 5)}%`;
      pWidth = "55%";
      pHeight = "60%";
      pZ = 10 + stackIdx;
      pRotate = (stackIdx - 1) * 3;
    } else {
      const c = SCATTER_COORDS[scatterCounter++];
      pTop = c.top;
      pLeft = c.left;
      pWidth = "20%";
      pHeight = "20%";
      pZ = 1;
      pRotate = (i % 5) * 15 - 30;
    }

    return {
      id: i,
      isTop,
      stackIdx,
      rank,
      scores: isTop
        ? [0.8 + (i % 3) * 0.05, 0.7 + (i % 2) * 0.1, 0.9, 0.85]
        : [0.2 + (i % 3) * 0.1, 0.3 + (i % 3) * 0.1, 0.1, 0.4 + (i % 2) * 0.1],
      styles: {
        stream: { top: streamTop, left: streamLeft, width: streamWidth, height: streamHeight, zIndex: 1, rotate: 0 },
        grid: { top: gridTop, left: gridLeft, width: gridWidth, height: gridHeight, zIndex: 1, rotate: 0 },
        ranking: { top: rankingTop, left: rankingLeft, width: rankingWidth, height: rankingHeight, zIndex: 5, rotate: 0 },
        personalized: { top: pTop, left: pLeft, width: pWidth, height: pHeight, zIndex: pZ, rotate: pRotate },
      }
    };
  });
})();

export function FeedShiftVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, 4, 3000, reduced);
  const isStreaming = step === 0;
  const isExtraction = step === 1;
  const isRanking = step === 2;
  const isPersonalized = step >= 3;

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <span className="label text-paper/60">
          {isStreaming ? "CHRONOLOGICAL STREAM" : isExtraction ? "SIGNAL EXTRACTION" : isRanking ? "MULTI-SIGNAL RANKING" : "PERSONALIZED INTENT"}
        </span>
        <IllustrativeTag />
      </div>

      {/* Main Visual Box */}
      <div className="relative flex-1 overflow-hidden border border-paper/20 bg-paper/5 rounded-xl shadow-inner backdrop-blur-sm">
        <div className="absolute inset-0 p-2 sm:p-4">
          {FEED_ITEMS.map((item) => {
            const styleState = isStreaming ? 'stream' : isExtraction ? 'grid' : isRanking ? 'ranking' : 'personalized';
            const currentStyle = item.styles[styleState];

            return (
              <motion.div
                key={item.id}
                layout={!reduced}
                transition={reduced ? { duration: 0 } : SPRING_SOFT}
                className="absolute border overflow-hidden bg-white/60 shadow-sm"
                style={{
                  ...currentStyle,
                  borderRadius: (isPersonalized || isRanking) && item.isTop ? 12 : 6,
                }}
                animate={{
                  opacity: isPersonalized && !item.isTop ? 0.3 : isRanking && !item.isTop ? 0.6 : 1,
                  filter: isPersonalized && !item.isTop ? "blur(3px)" : "blur(0px)",
                  backgroundColor: (isPersonalized || isRanking) && item.isTop ? "rgba(107,127,94,0.15)" : "rgba(255,255,255,0.6)",
                  borderColor: (isPersonalized || isRanking) && item.isTop ? "rgba(107,127,94,0.4)" : "rgba(0,0,0,0.06)",
                  backdropFilter: isPersonalized && item.isTop ? "blur(8px)" : "none",
                }}
              >
                {/* Feed Content Placeholder */}
                <motion.div
                  className="absolute inset-0 p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2"
                  animate={{ opacity: isExtraction ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-paper/10 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 mt-0.5">
                    <div className="h-1 bg-paper/20 w-3/4 rounded-full" />
                    <div className="h-1 bg-paper/10 w-1/2 rounded-full" />
                    {(isPersonalized || isRanking) && item.isTop && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + item.stackIdx * 0.1 }}
                        className="mt-1.5 sm:mt-2 text-[7px] sm:text-[7.5px] font-bold tracking-widest text-[#6B7F5E] flex items-center gap-1 truncate"
                      >
                        <Sparkles size={8} className="shrink-0" /> <span className="truncate">MATCH</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Rank Badge during ranking */}
                  <AnimatePresence>
                    {isRanking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute right-2 top-2 text-[8px] font-mono font-bold text-paper/50"
                      >
                        #{item.rank + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Extraction Signals */}
                <AnimatePresence>
                  {isExtraction && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.scores.map((score, si) => (
                          <div
                            key={si}
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                            style={{
                              backgroundColor: si === 3 ? "#B4462F" : "#6B7F5E",
                              opacity: 0.2 + (score * 0.8)
                            }}
                          />
                        ))}
                      </div>
                      {item.isTop && (
                        <div className="w-4 h-0.5 bg-[#6B7F5E]/60 rounded-full mt-0.5" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Scanline Effect during Extraction */}
        <AnimatePresence>
          {isExtraction && !reduced && (
            <motion.div
              className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#C98A3C]/10 to-[#C98A3C]/30 z-50 pointer-events-none border-b border-[#C98A3C]/40"
              initial={{ top: "-30%" }}
              animate={{ top: "130%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0">
        {SIGNALS.map((s) => (
          <span
            key={s.key}
            className="label flex items-center gap-1.5"
            style={{ color: s.key === "QUALITY" ? "#B4462F" : "#6B7F5E" }}
          >
            <s.icon size={11} strokeWidth={1.6} />
            {s.key}
          </span>
        ))}
        <AnimatePresence>
          {step >= 3 && (
            <motion.span
              key="relevance-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="label text-[#6B7F5E] ml-auto shrink-0"
            >
              RELEVANCE OVER RECENCY
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
