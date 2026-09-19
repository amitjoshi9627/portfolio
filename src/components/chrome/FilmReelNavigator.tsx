import { motion } from "framer-motion";
import { SCENES } from "../../data/projectData";

interface FilmReelNavigatorProps {
  activeScene: string;
  reduced?: boolean;
}

/**
 * Minimalist Clean Scene Indicator in Bottom-Left Corner
 * Styled according to the Ghibli/Cinematic Studio slate aesthetic.
 */
export function FilmReelNavigator({ activeScene }: FilmReelNavigatorProps) {
  const activeIndex = SCENES.findIndex((s) => s.id === activeScene);
  const activeSceneMeta = SCENES[Math.max(0, activeIndex)] ?? SCENES[0];

  const totalScenes = String(SCENES.length).padStart(2, "0");
  const currentIndex = String(activeIndex >= 0 ? activeIndex + 1 : 1).padStart(2, "0");

  // Hide on the very first landing scene ("opening" / 0)
  if (activeScene === "opening" || activeIndex === 0) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed bottom-6 left-6 z-[130] hidden sm:block"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Thematic Studio Slate Indicator */}
      <div className="flex items-center gap-3.5 rounded-full border border-forest/35 bg-ink-deep/85 px-4 py-2 shadow-[0_8px_28px_rgba(26,36,33,0.35)] backdrop-blur-md">
        {/* Amber recording / active scene lamp */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sunset opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sunset shadow-[0_0_8px_rgba(212,122,67,0.9)]" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-ink-rim/90">
            SCENE {currentIndex}
            <span className="text-parchment-mist/50"> / {totalScenes}</span>
          </span>
        </div>

        <span className="hidden sm:block h-3 w-px bg-forest/30" />

        {/* Film Title Card */}
        <span className="hidden sm:block font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mid">
          {activeSceneMeta.title}
        </span>
      </div>
    </motion.div>
  );
}
