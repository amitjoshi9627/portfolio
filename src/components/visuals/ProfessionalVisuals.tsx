import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { EASE_OUT } from "../../lib/motion";
import { useSequence } from "../../hooks/useSequence";
import { Chip, FlowNode, IllustrativeTag } from "../ui/Primitives";

export interface VisualProps {
  active: boolean;
  reduced: boolean;
  /** True while the director's note is open — the scene holds and desaturates. */
  rewind: boolean;
}

const W = 600;
const H = 190;

function seriesPath(
  fn: (t: number) => number,
  samples = 64,
  amp = 1,
): string {
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const y = H / 2 - fn(t) * (H / 2 - 14) * amp;
    pts.push(`${((t * W) | 0)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const noise = (t: number) => Math.sin(t * 47.3) * 0.16 + Math.sin(t * 23.1) * 0.11;
const truth = (t: number) => Math.sin(t * Math.PI * 1.6) * 0.42 + t * 0.22 - 0.1;

const OBSERVED = seriesPath((t) => truth(t) + noise(t));
const ESTIMATE = seriesPath((t) => truth(t));
const BAND_HI = seriesPath((t) => truth(t) + 0.13);
const BAND_LO = seriesPath((t) => truth(t) - 0.13);

/* ------------------------------------------------------------ 01 ROI ENGINE */

export function RoiEngineVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, 4, 1100, reduced);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="label text-paper/35">STATE ESTIMATION · 20+ MARKETS</span>
        <IllustrativeTag className="shrink-0" />
      </div>

      <div className="relative flex-1 border border-paper/12 bg-ink-950/45 p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="A noisy observed marketing signal with a smoothed state estimate and an uncertainty band."
        >
          <defs>
            <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D9822B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D9822B" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              y1={H * g}
              x2={W}
              y2={H * g}
              stroke="rgba(245,241,232,0.07)"
              strokeWidth="1"
            />
          ))}

          {/* uncertainty band */}
          <motion.path
            d={`${BAND_HI} L${W},${H} L0,${H} Z`}
            fill="url(#band)"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.path
            d={BAND_LO}
            fill="none"
            stroke="#D9822B"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* observed, noisy */}
          <motion.path
            d={OBSERVED}
            fill="none"
            stroke="rgba(245,241,232,0.65)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step >= 1 ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: EASE_OUT }}
          />

          {/* filtered state estimate */}
          <motion.path
            d={ESTIMATE}
            fill="none"
            stroke="#D9822B"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step >= 2 ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.3, ease: EASE_OUT }}
          />
        </svg>

        <div className="pointer-events-none absolute inset-x-3 bottom-2 flex flex-wrap gap-x-4 gap-y-1 sm:inset-x-4 drop-shadow-sm">
          <span className="label text-paper/35">— OBSERVED</span>
          <span className="label" style={{ color: "#FAD7A1" }}>— ESTIMATED STATE</span>
          <span className="label" style={{ color: "rgba(250, 215, 161, 0.75)" }}>··· UNCERTAINTY</span>
        </div>
      </div>

      {/* architecture strip */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2 sm:grid-cols-4 shrink-0">
        <FlowNode
          label="MARKET SIGNALS"
          sub="media · seasonality · base"
          active={step >= 1}
          accent="#D9822B"
        />
        <FlowNode label="UNIFIED PIPELINE" sub="one path per market" active={step >= 2} accent="#D9822B" />
        <FlowNode label="KALMAN FILTER" sub="state-space update" active={step >= 3} accent="#D9822B" />
        <FlowNode label="MARKET ROI" sub="spend decisions" active={step >= 4} accent="#D9822B" />
      </div>

      <div className="flex items-center gap-2">
        <span className="label shrink-0 text-paper/30">MARKETS</span>
        <div className="flex flex-1 flex-wrap gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-4 bg-paper/15"
              animate={{
                backgroundColor:
                  step >= 4 || i < step * 2 ? "rgba(217,130,43,0.85)" : "rgba(245,241,232,0.15)",
              }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            />
          ))}
          <span className="label ml-1 text-paper/30">20+</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 02 LUMA */

const LUMA_STEPS = [
  { label: "ASK", sub: "Natural-language question" },
  { label: "UNDERSTAND", sub: "Intent · channel · period · metric" },
  { label: "ANALYZE", sub: "Retrieve and compute the relevant data" },
  { label: "VISUALIZE", sub: "Surface the change and supporting signal" },
  { label: "EXPLAIN", sub: "LLM turns analysis into answer" },
];

export function LumaVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, LUMA_STEPS.length, 1200, reduced);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2.5 sm:gap-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0">
        <span className="label text-paper/35 text-[9.5px] sm:text-[10.5px]">LUMA · ANALYTICS COPILOT</span>
        <IllustrativeTag />
      </div>

      {/* Main Content: Workspace + Pipeline */}
      <div className="flex flex-1 min-h-0 flex-col sm:flex-row gap-2.5 sm:gap-3.5">
        {/* Workspace Card */}
        <div className="flex-[3] min-w-0 relative flex flex-col justify-between rounded-lg border border-paper/15 bg-white/5 p-2.5 sm:p-3.5 overflow-hidden">
          {/* 01 ASK & 02 UNDERSTAND */}
          <div className="flex flex-col gap-1 sm:gap-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="label text-moss text-[9.5px] sm:text-[10px] font-bold tracking-wider">ASK LUMA</span>
              {step >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sunset shadow-[0_0_8px_rgba(217,130,43,0.8)] animate-pulse" />
                  <span className="label text-[9px] text-paper/40 font-bold">LIVE</span>
                </motion.div>
              )}
            </div>
            
            <div className="text-[12.5px] sm:text-[13.5px] leading-snug text-paper/90 font-medium font-serif italic min-h-[18px]">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: reduced ? 0 : 0.8, ease: "linear" }}
                  >
                    "Why did TV ROI fall last year?"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chips */}
            <div className="flex gap-1 min-h-[20px] pt-0.5">
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                    className="flex flex-wrap gap-1"
                  >
                    <Chip accent="#7C95A6">TV</Chip>
                    <Chip accent="#7C95A6">2024</Chip>
                    <Chip accent="#7C95A6">ROI</Chip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 03 & 04 ANALYZE & VISUALIZE */}
          <div className="border-t border-paper/10 pt-1.5 sm:pt-2 shrink-0">
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.4 }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="label text-[9px] text-paper/40">TV ROI</span>
                      {step >= 4 && (
                        <motion.div 
                          initial={{ opacity: 0, x: -4 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="text-sunset text-[16px] sm:text-[18px] font-display font-bold leading-none mt-0.5"
                        >
                          -18% YoY
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="h-6 w-20 sm:h-7 sm:w-24 relative overflow-hidden flex-shrink-0">
                      <svg viewBox="0 0 100 40" className="w-full h-full absolute inset-0 overflow-visible">
                        <motion.path 
                          d="M0,15 C20,15 25,5 45,5 C55,5 60,35 100,35" 
                          fill="none" 
                          stroke="rgba(245,241,232,0.15)" 
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT }}
                        />
                        {step >= 4 && (
                          <motion.path 
                            d="M45,5 C55,5 60,35 100,35" 
                            fill="none" 
                            stroke="#D9822B" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: reduced ? 0 : 0.6, ease: EASE_OUT }}
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                  
                  {step >= 4 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex flex-wrap gap-2 sm:gap-2.5 label text-[8.5px] sm:text-[9.5px] text-paper/40"
                    >
                      <span className="text-moss font-semibold">↑ Spend</span>
                      <span className="text-sunset font-semibold">↓ Contribution</span>
                      <span className="text-sunset font-semibold">↓ Efficiency</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 05 EXPLAIN (Chatbot answer bubble) */}
          <div className="border-t border-paper/10 pt-1.5 sm:pt-2 shrink-0">
            <AnimatePresence>
              {step >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.4 }}
                  className="rounded bg-paper/[0.04] p-1.5 sm:p-2 border border-paper/10"
                >
                  <div className="flex items-start gap-1.5">
                    <span className="label shrink-0 rounded bg-moss/20 px-1 py-0.5 text-[8.5px] font-bold text-moss">
                      LUMA
                    </span>
                    <p className="text-[11px] sm:text-[11.5px] leading-snug text-paper/90 font-sans">
                      TV ROI declined 18% as spend increased while contribution softened in H2.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pipeline Column */}
        <div className="flex-[2] min-w-0 flex flex-col justify-between py-0.5">
          {LUMA_STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-col">
              <div
                className={`relative min-w-0 border px-2 py-1 sm:px-2.5 sm:py-1.5 transition-all duration-300 rounded ${
                  step >= i + 1
                    ? "border-[#7C95A6]/70 bg-[#7C95A6]/15 shadow-sm"
                    : "border-paper/10 bg-transparent"
                }`}
              >
                <div
                  className="label text-[9px] sm:text-[9.5px] font-bold tracking-wider transition-colors duration-300"
                  style={{ color: step >= i + 1 ? "#7C95A6" : "rgba(245,241,232,0.4)" }}
                >
                  {s.label}
                </div>
                <div className="mt-0.5 text-[8.5px] sm:text-[9.5px] leading-tight text-paper/50">
                  {s.sub}
                </div>
              </div>
              {i < LUMA_STEPS.length - 1 ? (
                <div className="flex justify-center py-0.5">
                  <div
                    className="w-[1.5px] h-1.5 transition-colors duration-300"
                    style={{
                      backgroundColor: step >= i + 2 ? "#7C95A6" : "rgba(245,241,232,0.12)",
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between shrink-0 pt-0.5">
        <span className="label text-paper/35 text-[9px] sm:text-[10px]">
          EXPLAINED FROM MMM OUTPUT
        </span>
        <span className="label text-moss/70 text-[8.5px] sm:text-[9.5px]">
          COMPUTED BEFORE EXPLANATION
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- 03 SPOOL */

const SPOOL_STEPS = [
  { label: "FORMULATE", sub: "Extract variables · objective · constraints" },
  { label: "CRITIQUE", sub: "Check structure · feasibility · consistency" },
  { label: "REFINE", sub: "Correct gaps and ambiguities" },
  { label: "REVIEW", sub: "Human approval or revision" },
  { label: "GENERATE", sub: "Produce executable solver code" },
  { label: "VALIDATE", sub: "Check code before execution" },
  { label: "EXECUTE", sub: "Run against supplied data" },
];

export function SpoolVisual({ active, reduced, rewind }: VisualProps) {
  const step = useSequence(active && !rewind, SPOOL_STEPS.length, 1200, reduced);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2.5 sm:gap-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0">
        <span className="label text-paper/35 text-[9.5px] sm:text-[10.5px]">AI WORKFLOW · HUMAN CHECKPOINT</span>
        <IllustrativeTag />
      </div>

      {/* Main Content: Workspace + Pipeline */}
      <div className="flex flex-1 min-h-0 flex-col sm:flex-row gap-2.5 sm:gap-3.5">
        
        {/* Workspace Card (Mockup) */}
        <div className="flex-[3] min-w-0 relative">
          <AnimatePresence mode="wait">
            {step < 5 ? (
              <motion.div
                key="formulation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.4 }}
                className="absolute inset-0 flex flex-col p-2.5 sm:p-3 bg-white/5 border border-paper/15 rounded-lg justify-center gap-2 sm:gap-2.5"
              >
                <div className="flex flex-col gap-0.5">
                   <div className="text-[8.5px] sm:text-[9px] text-paper/40 font-bold tracking-wider">BUSINESS CONSTRAINT</div>
                   <div className="text-[11.5px] sm:text-[12.5px] text-paper/90 font-serif italic leading-tight">
                     "Allocate inventory across 12 warehouses while minimizing transport cost."
                   </div>
                </div>
                
                <AnimatePresence>
                  {step >= 1 && (
                    <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{duration: reduced ? 0 : 0.3}} className="flex flex-col gap-0.5">
                       <div className="text-[8.5px] sm:text-[9px] text-paper/40 font-bold tracking-wider">FORMULATION</div>
                       <div className="text-[10px] sm:text-[11px] font-mono text-paper/70 leading-tight">
                         x[w,p] ∈ ℝ≥0<br/>
                         minimize Σ cost[w,p] x[w,p]
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                   <AnimatePresence>
                     {step >= 2 && (
                        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration: reduced ? 0 : 0.3}} className="flex items-center gap-1 bg-moss/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-moss/30">
                           <span className="text-[8px] sm:text-[9px] font-mono text-moss font-bold">
                             {step === 3 ? "↺ REFINING" : "AI CRITIQUE"}
                           </span>
                           {step !== 3 && <Check className="w-2.5 h-2.5 text-moss" />}
                        </motion.div>
                     )}
                   </AnimatePresence>
                   
                   <AnimatePresence>
                     {step >= 4 && (
                        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration: reduced ? 0 : 0.3}} className="flex items-center gap-1 bg-sunset/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-sunset/30">
                           <span className="text-[8px] sm:text-[9px] font-mono text-sunset font-bold">HUMAN APPROVAL</span>
                           <Check className="w-2.5 h-2.5 text-sunset" />
                        </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.4 }}
                className="absolute inset-0 flex flex-col p-2.5 sm:p-3 bg-white/5 border border-paper/15 rounded-lg font-mono overflow-hidden"
              >
                <div className="text-[9px] sm:text-[10px] text-paper/50 mb-1.5 flex items-center justify-between shrink-0">
                  <span>solver.py</span>
                  <AnimatePresence>
                    {step >= 7 && (
                      <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{duration: reduced ? 0 : 0.3}} className="text-moss font-bold text-[8.5px] tracking-wider">
                        ✓ EXECUTABLE
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <pre className="text-[10px] sm:text-[11px] text-paper/80 leading-relaxed overflow-hidden">
                  <span className="text-moss">def</span> <span className="text-blue-400/80">build_model</span>():<br/>
                  {"  "}objective(...)<br/>
                  {"  "}constraints(...)<br/>
                  {"  "}<span className="text-moss">return</span> solve(...)
                </pre>
                
                <AnimatePresence>
                  {step >= 7 && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} transition={{duration: reduced ? 0 : 0.4}} className="mt-4 bg-white/10 border border-paper/10 rounded p-1.5 sm:p-2">
                       <div className="text-[8px] sm:text-[9px] text-moss font-bold tracking-wider mb-0.5">STATUS: OPTIMAL</div>
                       <div className="flex gap-4 text-[8px] sm:text-[9px] font-mono text-paper/60">
                         <span>x[1,A] = 450.0</span>
                         <span>x[2,B] = 120.0</span>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-auto pt-2 flex items-center gap-2">
                   <AnimatePresence>
                     {step >= 6 && (
                        <motion.div initial={{opacity:0, x:-5}} animate={{opacity:1, x:0}} transition={{duration: reduced ? 0 : 0.3}} className="flex items-center gap-1 bg-moss/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-moss/30">
                           <span className="text-[8px] sm:text-[9px] text-moss font-bold">✓ VALIDATED</span>
                        </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pipeline Column */}
        <div className="flex-[2] min-w-0 flex flex-col justify-between py-0.5">
          {SPOOL_STEPS.map((s, i) => {
            const isHuman = s.label === "REVIEW";
            const isActive = step >= i + 1;
            return (
              <div key={s.label} className="flex flex-col">
                <div
                  className={`relative min-w-0 border px-1.5 py-[3px] sm:px-2 sm:py-1 transition-all duration-300 rounded ${
                    isActive
                      ? (isHuman ? "border-sunset/70 bg-sunset/15 shadow-sm" : "border-[#6B7F5E]/70 bg-[#6B7F5E]/15 shadow-sm")
                      : "border-paper/10 bg-transparent"
                  }`}
                >
                  <div
                    className="label text-[8.5px] sm:text-[9px] font-bold tracking-wider transition-colors duration-300"
                    style={{ color: isActive ? (isHuman ? "#D9822B" : "#6B7F5E") : "rgba(245,241,232,0.4)" }}
                  >
                    {s.label}
                  </div>
                  <div className="text-[7.5px] sm:text-[8px] leading-tight text-paper/50 truncate">
                    {s.sub}
                  </div>
                </div>
                {i < SPOOL_STEPS.length - 1 ? (
                  <div className="flex justify-center py-[1px]">
                    <div
                      className="w-[1.5px] h-1.5 transition-colors duration-300"
                      style={{
                        backgroundColor: step >= i + 2 ? (SPOOL_STEPS[i + 1]?.label === "REVIEW" ? "#D9822B" : "#6B7F5E") : "rgba(245,241,232,0.12)",
                      }}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
