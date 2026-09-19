import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, X, Film, ArrowRight } from "lucide-react";
import { SCENES, SceneMeta } from "../../data/projectData";
import { scrollToId, scrollToTop } from "../../hooks/useSmoothScroll";
import { EASE_OUT } from "../../lib/motion";
import { shutter } from "../../lib/ambience";
import { syncUrl } from "../../lib/routing";

interface NavBarProps {
  activeScene: string;
  soundOn: boolean;
  onToggleSound: () => void;
}

const SCENE_DESCRIPTIONS: Record<string, string> = {
  opening: "Title sequence & dawn ambience",
  director: "Philosophy, visual résumé & production record",
  script: "Seven-stage development doctrine",
  footage: "Core technical tools & arsenal",
  edit: "Flagship production case studies",
  system: "Full-stack AI architecture map",
  behind: "Studio desk, personal craft & media tools",
  life: "Analog photography & field journals",
  final: "Credits & collaborative contact",
};

export function NavBar({ activeScene, soundOn, onToggleSound }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const [logoFlare, setLogoFlare] = useState(false);
  const [hoveredScene, setHoveredScene] = useState<SceneMeta | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* One-time flare on the AJ logotype */
  useEffect(() => {
    const id = window.setTimeout(() => setLogoFlare(true), 600);
    return () => clearTimeout(id);
  }, []);

  const isLanding = activeScene === "opening";
  const currentSceneMeta = useMemo(() => SCENES.find((s) => s.id === activeScene) || SCENES[0], [activeScene]);
  const activeHover = hoveredScene || currentSceneMeta;

  // Memoize orbital layout geometry (computed once when modal opens)
  const layoutGeometry = useMemo(() => {
    if (!open || typeof window === "undefined") return { radiusX: 375, radiusY: 255 };
    const isMobile = window.innerWidth < 768;
    const isShort = window.innerHeight < 680;
    return {
      radiusX: isMobile ? (isShort ? 80 : 100) : (isShort ? 300 : 375),
      radiusY: isMobile ? (isShort ? 120 : 160) : (isShort ? 190 : 255),
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setHoveredScene(currentSceneMeta);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, currentSceneMeta]);

  const go = (id: string) => {
    if (soundOn) shutter(0.14);
    const targetIdx = SCENES.findIndex((s) => s.id === id);
    const currentIdx = SCENES.findIndex((s) => s.id === activeScene);
    const dist = Math.abs(targetIdx - currentIdx);

    // If jumping multiple scenes away, cut cleanly under the dark frosted canvas
    if (dist >= 2) {
      scrollToId(id, { immediate: true, offset: id === "final" ? (window.innerHeight * 2.2) : 0 });
      window.dispatchEvent(new CustomEvent("hardcut", { detail: { id } }));
    } else {
      // For adjacent scenes, perform a gentle, short glide
      scrollToId(id, { duration: 0.7, offset: id === "final" ? (window.innerHeight * 2.2) : 0 });
    }

    // Update browser history
    syncUrl(id, false);

    // Smoothly dissolve the modal right after repositioning
    window.setTimeout(() => {
      setOpen(false);
    }, 60);
  };

  const btnStyle = isLanding
    ? "border-white/30 bg-black/30 text-white hover:border-white hover:bg-black/50 shadow-md font-bold"
    : "border-forest/20 bg-white/80 text-forest hover:bg-forest hover:text-white hover:border-forest shadow-sm font-bold";

  return (
    <>
      {/* ── TOP NAV RAIL ─────────────────────────────────────────────────── */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] px-4 pt-5 sm:px-8 sm:pt-7">
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={() => {
              if (soundOn) shutter(0.14);
              scrollToTop();
            }}
            data-cursor="TOP"
            className="pointer-events-auto relative text-left group cursor-pointer"
            aria-label="Back to the opening credits"
          >
            <AnimatePresence>
              {logoFlare ? (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -inset-3 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,183,3,0.3) 0%, transparent 70%)",
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 2] }}
                  transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.35, 1] }}
                  onAnimationComplete={() => setLogoFlare(false)}
                />
              ) : null}
            </AnimatePresence>
            <div className="flex flex-col items-start gap-0.5">
              <span
                aria-hidden
                className="block h-[2px] w-6 rounded-full"
                style={{ background: isLanding ? "linear-gradient(to right, rgba(255,255,255,0.7), transparent)" : "linear-gradient(to right, rgba(22,88,59,0.7), transparent)" }}
              />
              <span className={`font-display font-bold text-2xl leading-none tracking-tight transition-colors sm:text-[26px] ${isLanding ? 'text-white group-hover:text-[#FFB703]' : 'text-parchment group-hover:text-forest'}`}>
                AJ
              </span>
              <span
                aria-hidden
                className="block h-[2px] w-6 rounded-full"
                style={{ background: isLanding ? "linear-gradient(to right, rgba(255,255,255,0.7), transparent)" : "linear-gradient(to right, rgba(22,88,59,0.7), transparent)" }}
              />
            </div>
            <span className={`label mt-1.5 block font-bold ${isLanding ? 'text-white/70' : 'text-parchment-dim'}`}>ANIMATOR&rsquo;S DESK</span>
          </button>

          <div className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
            {/* ── EXECUTIVE FAST PATH (DESKTOP) ── */}
            <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border pointer-events-auto backdrop-blur-md transition-all duration-500 shadow-sm ${
              isLanding ? "bg-black/30 border-white/20 shadow-md" : "bg-white/80 border-forest/20"
            }`}>
              {[
                { id: "director", label: "Resume" },
                { id: "edit", label: "Work" },
                { id: "system", label: "Stack" },
              ].map((item) => {
                const isActive = activeScene === item.id;
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={item.id}
                    onClick={() => go(item.id)}
                    data-cursor="JUMP"
                    className={`relative px-4 py-1.5 rounded-full font-display font-bold text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ${
                      isActive
                        ? isLanding
                          ? "bg-[#FFB703] text-ink-deep shadow-[0_0_12px_rgba(255,183,3,0.4)] scale-[1.02]"
                          : "bg-forest text-white shadow-[0_2px_8px_rgba(56,102,65,0.25)] scale-[1.02]"
                        : isLanding
                        ? "text-white/85 hover:text-white hover:bg-white/15"
                        : "text-ink-deep/75 hover:text-ink-deep hover:bg-forest/10"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Subtle Divider for clean differentiation between navigation & utilities */}
            <div className={`hidden md:block h-4 w-[1px] mx-1 sm:mx-1.5 ${isLanding ? "bg-white/25" : "bg-forest/20"}`} />

            {/* ── SOUND TOGGLE ICON-ONLY BUTTON ── */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundOn}
              data-cursor={soundOn ? "MUTE" : "SOUND"}
              className={`group pointer-events-auto flex items-center justify-center h-9 w-9 rounded-full border backdrop-blur-md transition-all duration-300 ${
                isLanding
                  ? "border-white/25 bg-black/30 text-white hover:border-[#FFB703] hover:text-[#FFB703] hover:shadow-[0_0_12px_rgba(255,183,3,0.4)] shadow-sm"
                  : "border-transparent bg-forest/5 text-forest hover:bg-forest/15 hover:scale-105"
              }`}
              aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            >
              {soundOn ? (
                <Volume2 size={16} strokeWidth={2.2} className={`transition-transform group-hover:scale-110 ${isLanding ? "text-white group-hover:text-[#FFB703]" : "text-forest"}`} />
              ) : (
                <VolumeX size={16} strokeWidth={2.2} className={`transition-transform group-hover:scale-110 ${isLanding ? "text-white/70 group-hover:text-[#FFB703]" : "text-forest/70"}`} />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              data-cursor="OPEN"
              aria-expanded={open}
              aria-haspopup="dialog"
              className={`label pointer-events-auto rounded-full border px-5 py-2 backdrop-blur-md transition-all ${btnStyle}`}
            >
              MENU
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── FULLSCREEN ADVANCED STORYBOARD ORBIT MODAL ────────────────── */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[140] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            role="dialog"
            aria-modal="true"
            aria-label="Storyboard Chapter Directory"
            ref={panelRef}
          >
            {/* High-end cinematic dark obsidian frosted canvas with ambient lens glow */}
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#070b09]/90 backdrop-blur-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at center, rgba(212,122,67,0.08) 0%, rgba(56,102,65,0.06) 45%, transparent 75%)",
              }}
            />

            <div className="relative flex h-full flex-col justify-between p-4 sm:p-10 pointer-events-none z-10 overflow-y-auto">
              {/* Header Bar */}
              <div className="flex shrink-0 items-center justify-between pointer-events-auto border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-forest/30 bg-forest/10 text-sunset-glow">
                    <Film size={16} />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/90 uppercase block">
                      CHAPTER DIRECTORY
                    </span>
                    <span className="font-sans text-[10px] text-white/40 tracking-wider block">
                      SELECT A PRODUCTION SCENE TO JUMP
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-cursor="CLOSE"
                  className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-white/70 backdrop-blur-md transition-all duration-300 hover:border-sunset/50 hover:bg-sunset/15 hover:text-white shadow-lg"
                >
                  <span className="font-mono text-xs font-bold tracking-widest">CLOSE</span>
                  <X size={15} strokeWidth={2.5} className="transition-transform group-hover:rotate-90 duration-300" />
                </button>
              </div>

              {/* ── CENTRAL PROJECTOR & ORBITAL CARDS ─────────────────────── */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none min-h-[500px]">
                {/* Center Projector Lens / Preview */}
                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-xs sm:max-w-md pointer-events-none"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
                >
                  {/* Rotating Precision Aperture Rings */}
                  <motion.div
                    className="absolute -inset-12 sm:-inset-16 rounded-full border border-sunset/15 border-dashed"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute -inset-24 sm:-inset-28 rounded-full border border-forest/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-sunset/10 to-forest/10 blur-2xl pointer-events-none" />

                  {/* Active Scene Preview Details */}
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-sunset/30 bg-sunset/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.3em] text-sunset-glow uppercase shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-sunset animate-ping" />
                      SCENE {activeHover.index} / 09
                    </span>
                    <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-[0.05em] mt-4 uppercase [text-shadow:0_4px_16px_rgba(0,0,0,0.8)]">
                      {activeHover.title}
                    </h2>
                    <p className="font-sans text-xs sm:text-sm font-medium text-white/60 mt-3 max-w-xs leading-relaxed">
                      {SCENE_DESCRIPTIONS[activeHover.id] || "Production Reel Section"}
                    </p>
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none min-h-[500px]">
                  {SCENES.map((item, i) => {
                    const total = SCENES.length;
                    const angle = (i * ((Math.PI * 2) / total)) - (Math.PI / 2);
                    
                    const { radiusX, radiusY } = layoutGeometry;
                    const targetX = Math.cos(angle) * radiusX;
                    const targetY = Math.sin(angle) * radiusY;

                    const startX = targetX * 0.6;
                    const startY = targetY * 0.6;

                    const isCurrent = item.id === activeScene;
                    const isHovered = hoveredScene?.id === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => go(item.id)}
                        onMouseEnter={() => setHoveredScene(item)}
                        data-cursor="ENTER"
                        className={`pointer-events-auto absolute group flex flex-col justify-between rounded-xl p-2.5 sm:p-4 text-left border backdrop-blur-2xl w-28 h-20 sm:w-44 sm:h-28 transition-colors duration-200 ${
                          isHovered
                            ? "bg-[#16201b]/95 border-sunset/60 shadow-[0_12px_36px_rgba(212,122,67,0.35)] z-30"
                            : isCurrent
                            ? "bg-[#111a15]/90 border-forest/50 shadow-[0_8px_24px_rgba(56,102,65,0.35)] z-20"
                            : "bg-[#0b120e]/75 border-white/10 hover:border-white/25 hover:bg-[#121c17]/85 z-10"
                        }`}
                        initial={{
                          x: startX,
                          y: startY,
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          x: targetX,
                          y: targetY,
                          opacity: 1,
                          scale: isHovered ? 1.08 : 1,
                        }}
                        whileHover={{
                          scale: 1.08,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        whileTap={{ scale: 0.96 }}
                        exit={{
                          x: startX,
                          y: startY,
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.2, ease: "easeIn" },
                        }}
                        transition={{
                          x: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.02 * i },
                          y: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.02 * i },
                          opacity: { duration: 0.4, delay: 0.02 * i },
                          scale: { duration: 0.2, ease: "easeOut" },
                        }}
                        style={{ willChange: "transform" }}
                      >
                        {/* Film Registration Corner Marks */}
                        <span className="absolute top-1.5 left-1.5 font-mono text-[7px] text-white/20 group-hover:text-sunset/40 transition-colors">
                          +
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 font-mono text-[7px] text-white/20 group-hover:text-sunset/40 transition-colors">
                          +
                        </span>

                        {/* Top Card Bar */}
                        <div className="flex items-center justify-between w-full pointer-events-none">
                          <span
                            className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-widest transition-colors ${
                              isHovered || isCurrent ? "text-sunset-glow" : "text-white/45 group-hover:text-white/80"
                            }`}
                          >
                            SCENE {item.index}
                          </span>
                          {isCurrent ? (
                            <span className="flex h-2 w-2 items-center justify-center">
                              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-forest-light opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-light" />
                            </span>
                          ) : isHovered ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-sunset" />
                          ) : null}
                        </div>

                        {/* Bottom Card Title & Subtitle */}
                        <div className="pointer-events-none mt-1">
                          <span
                            className={`font-display font-bold text-xs sm:text-[13px] leading-tight block uppercase tracking-[0.04em] transition-colors ${
                              isHovered || isCurrent ? "text-white" : "text-white/85 group-hover:text-white"
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="hidden sm:block font-mono text-[8px] text-white/35 tracking-[0.1em] uppercase mt-1 truncate group-hover:text-sunset-glow/70 transition-colors">
                            {SCENE_DESCRIPTIONS[item.id] || "Reel"}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Footer Info Bar with Fast Jumps */}
              <div className="flex shrink-0 items-center justify-between border-t border-white/10 pt-4 pointer-events-auto z-20">
                <div className="flex items-center gap-4 sm:gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => go("final")}
                    data-cursor="CONTACT"
                    className="group flex items-center gap-2 sm:gap-3 rounded-full border border-forest/20 bg-forest/10 px-3 py-1.5 sm:px-4 text-[10px] sm:text-xs font-bold text-sunset-glow tracking-[0.15em] transition-all hover:border-sunset/40 hover:bg-sunset/20 hover:text-white"
                  >
                    <span className="hidden sm:inline">GET IN TOUCH</span>
                    <span className="sm:hidden">CONTACT</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
                <span className="hidden md:inline font-mono text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                  AMIT JOSHI · SENIOR AI/ML ENGINEER
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
