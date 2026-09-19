import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PROJECTS } from "../data/projectData";
import { EASE_OUT } from "../lib/motion";
import { scrollToY } from "../hooks/useSmoothScroll";
import { ProjectPanel } from "../components/project/ProjectPanel";
import { SceneSection, Slate } from "../components/ui/Primitives";

interface Props {
  reduced: boolean;
  mobile: boolean;
  onCut?: () => void;
}

/**
 * SCENE 05 — THE ANIMATION DESK
 * Vertical scroll drives a horizontal storyboard timeline. One project owns the
 * frame; its neighbours sit just outside it, dimmed and out of focus.
 */
export function Scene05Edit({ reduced, mobile, onCut }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const n = PROJECTS.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Piecewise plateau mapping: gives each project a magnetic "hook" plateau
  // so fast scrolling doesn't slide continuously, creating distinct sectional feels.
  const { inputMap, outputMap } = useMemo(() => {
    const inputs: number[] = [0];
    const outputs: number[] = [0];

    const startFrac = 0.04;
    const endFrac = 0.96;
    const totalSpan = endFrac - startFrac;
    const slotSpan = totalSpan / (n - 1);
    const dwellRatio = 0.44; // 44% of each project's scroll distance is a locked hook

    for (let i = 0; i < n - 1; i++) {
      const segStart = startFrac + i * slotSpan;
      const segDwellEnd = segStart + slotSpan * dwellRatio;

      inputs.push(segStart);
      outputs.push(i);

      inputs.push(segDwellEnd);
      outputs.push(i);
    }

    inputs.push(endFrac);
    outputs.push(n - 1);

    inputs.push(1);
    outputs.push(n - 1);

    return { inputMap: inputs, outputMap: outputs };
  }, [n]);

  const raw = useTransform(scrollYProgress, inputMap, outputMap, { clamp: true });
  const smooth = useSpring(raw, { stiffness: 85, damping: 24, mass: 0.45 });
  /** Panels are slightly narrower than the frame so the next cut peeks in. */
  const x = useTransform(smooth, (v) => `${-v * 92}vw`);
  const playhead = useTransform(smooth, (v) => `${(v / (n - 1)) * 100}%`);

  const [active, setActive] = useState(0);
  const [openNote, setOpenNote] = useState<string | null>(null);

  useMotionValueEvent(smooth, "change", (v) => {
    const r = Math.max(0, Math.min(n - 1, Math.round(v)));
    setActive((prev) => (prev === r ? prev : r));
  });

  /** Kept in a ref so a sound-toggle never re-fires the cut. */
  const cutRef = useRef(onCut);
  cutRef.current = onCut;
  const isFirstMount = useRef(true);

  useEffect(() => {
    setOpenNote(null);
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    cutRef.current?.();
  }, [active]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const docTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    const slotSpan = (0.96 - 0.04) / (n - 1);
    const frac = 0.04 + i * slotSpan + slotSpan * 0.15; // Land inside the magnetic hook plateau
    scrollToY(docTop + frac * scrollable);
  };

  const toggleNote = (id: string) => setOpenNote((cur) => (cur === id ? null : id));

  /* ------------------------------------------------------------- mobile */
  if (mobile) {
    return (
      <SceneSection id="edit" label="The animation desk — selected work" className="px-0 py-[10vh] bg-ink-mid">
        <div className="px-4">
          <Slate index="05" title="THE EDIT" note="SELECTED WORKS" />
          <h2 className="mt-[3vh] font-display font-bold text-[clamp(1.8rem,5.4vmin,4rem)] leading-[0.95] text-parchment">
            THE GALLERY
          </h2>
          <p className="mt-[2vh] max-w-sm text-[clamp(14px,1.5vmin,16px)] font-medium leading-relaxed text-parchment-dim">
            Six pieces. Three crafted at work, three sketched after hours.
          </p>
        </div>

        <div className="mt-[5vh] divide-y-2 divide-forest/10">
          {PROJECTS.map((p, i) => (
            <div key={p.id}>
              {i === 3 ? <PersonalDivider /> : null}
              <ProjectPanel
                project={p}
                isActive
                renderVisual
                mobile
                reduced={reduced}
                noteOpen={openNote === p.id}
                onToggleNote={() => toggleNote(p.id)}
              />
            </div>
          ))}
        </div>
      </SceneSection>
    );
  }

  /* ------------------------------------------------------------ desktop */
  return (
    <SceneSection id="edit" label="The animation desk — selected work" className="h-[400vh] md:h-[500vh] lg:h-[660vh] bg-[#fdfbf7]">
      <div ref={ref} className="absolute inset-0">
        <div className="sticky top-0 h-[100svh] overflow-hidden [@media(max-height:750px)]:overflow-y-auto [@media(max-height:750px)]:pt-20">
          {/* the strip */}
          <motion.div
            className="flex h-full pl-[4vw]"
            style={{ x, width: `${n * 92 + 8}vw`, willChange: "transform" }}
          >
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                aria-hidden={i !== active}
                className={`h-full w-[92vw] shrink-0 border-r-2 border-forest/5 pt-[4svh] sm:pt-[5svh] pb-[9vh] sm:pb-[11vh] ${
                  i !== active ? "pointer-events-none" : ""
                }`}
              >
                <ProjectPanel
                  project={p}
                  isActive={i === active}
                  renderVisual={Math.abs(i - active) <= 1}
                  mobile={false}
                  reduced={reduced}
                  noteOpen={openNote === p.id}
                  onToggleNote={() => toggleNote(p.id)}
                />
              </div>
            ))}
          </motion.div>

          {/* editing timeline / scrubber */}
          <div className="absolute inset-x-0 bottom-[3vh] sm:bottom-[4vh] z-20 px-6 sm:px-12">
            {/* tone shift into the personal cuts */}
            <motion.div
              className="pointer-events-none mb-[1.5vh] flex items-center justify-end gap-[1.5vh]"
              animate={{ opacity: active >= 3 ? 1 : 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <span className="label text-parchment-dim">THE WORLDS I PAINT AFTER HOURS</span>
              <span className="label text-sunset font-bold">PERSONAL SKETCHES</span>
            </motion.div>

            <div className="relative">
              <div className="h-0.5 w-full bg-forest/10 rounded-full" />
              <motion.div
                className="absolute -top-1 h-3 w-1.5 rounded-full bg-sunset shadow-sm"
                style={{ left: playhead, transform: "translateX(-50%)" }}
              />
              <ul className="mt-[2vh] flex items-start justify-between gap-2">
                {PROJECTS.map((p, i) => (
                  <li key={p.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      data-cursor="SCRUB"
                      className="group w-full text-left"
                      aria-current={i === active ? "true" : undefined}
                    >
                      <span
                        className="label block truncate transition-colors font-bold"
                        style={{ color: i === active ? p.accent : "rgba(44,53,57,0.3)" }}
                      >
                        {p.index} {p.title.toUpperCase()}
                      </span>
                      <span
                        className="mt-2 block h-[3px] w-full origin-left transition-transform duration-500 rounded-full"
                        style={{
                          background: i === active ? p.accent : "rgba(126,184,108,0.15)",
                          transform: i === active ? "scaleY(1.5)" : "scaleY(1)",
                        }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}

function PersonalDivider() {
  return (
    <div className="border-y-2 border-forest/10 bg-[radial-gradient(ellipse_at_center,rgba(245,215,110,0.1)_0%,transparent_100%)] px-4 py-[5vh]">
      <span className="label text-sunset font-bold">SCENE CHANGE</span>
      <h3 className="mt-[1.5vh] font-display font-bold text-[clamp(1.6rem,3.5vmin,2.6rem)] leading-[1] text-parchment">
        The worlds I paint after hours
      </h3>
      <p className="mt-[1.5vh] text-[clamp(14px,1.5vmin,16px)] font-medium leading-relaxed text-parchment-dim">
        Personal work. A different color palette, same dedication.
      </p>
    </div>
  );
}
