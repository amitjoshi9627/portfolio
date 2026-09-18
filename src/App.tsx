import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AcademyLeader } from "./components/chrome/AcademyLeader";
import { Atmosphere } from "./components/chrome/Atmosphere";
import { CursorLayer } from "./components/chrome/CursorLayer";
import { FilmOverlay } from "./components/chrome/FilmOverlay";
import { FilmReelNavigator } from "./components/chrome/FilmReelNavigator";
import { NavBar } from "./components/chrome/NavBar";
import { ParallaxLayers } from "./components/chrome/ParallaxLayers";
import { RewindOverlay } from "./components/chrome/RewindOverlay";
import { SceneCut } from "./components/ui/Primitives";
import { SCENES } from "./data/projectData";
import { useActiveScene } from "./hooks/useActiveScene";
import { useEnvironment } from "./hooks/useEnvironment";
import { useHardCut } from "./hooks/useHardCut";
import { jumpToTop, scrollToId, useSmoothScroll } from "./hooks/useSmoothScroll";
import { ROUTE_MAP } from "./lib/routing";
import { shutter, startAmbience, stopAmbience } from "./lib/ambience";
import { Scene01Opening } from "./scenes/Scene01Opening";
import { Scene02Director } from "./scenes/Scene02Director";
import { Scene03Script } from "./scenes/Scene03Script";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";

const Scene04RawFootage = lazy(() => import("./scenes/Scene04RawFootage").then((m) => ({ default: m.Scene04RawFootage })));
const Scene05Edit = lazy(() => import("./scenes/Scene05Edit").then((m) => ({ default: m.Scene05Edit })));
const Scene06System = lazy(() => import("./scenes/Scene06System").then((m) => ({ default: m.Scene06System })));
const Scene07BehindTheScenes = lazy(() => import("./scenes/Scene07BehindTheScenes").then((m) => ({ default: m.Scene07BehindTheScenes })));
const Scene08Life = lazy(() => import("./scenes/Scene08Life").then((m) => ({ default: m.Scene08Life })));
const Scene09FinalCut = lazy(() => import("./scenes/Scene09FinalCut").then((m) => ({ default: m.Scene09FinalCut })));

export default function App() {
  const { reduced, mobile, compact, touch, lowPower } = useEnvironment();
  const [soundOn, setSoundOn] = useState(true); // Sound ON by default
  const [ready, setReady] = useState(false);
  const [rewinding, setRewinding] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useSmoothScroll(!reduced && !touch);

  const sceneIds = useMemo(() => SCENES.map((s) => s.id), []);
  const activeScene = useActiveScene(sceneIds);

  // Handle hard cut navigation from the film reel
  const handleHardCut = useCallback(() => {
    if (soundRef.current) shutter(0.07);
  }, []);
  useHardCut(reduced, handleHardCut);

  const handleLeaderDone = useCallback(() => {
    if (document.readyState === "complete") {
      setReady(true);
    } else {
      window.addEventListener("load", () => setReady(true), { once: true });
    }
  }, []);

  /* Handle initial URL routing and browser Back/Forward navigation */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    
    const handleRoute = (immediate = false) => {
      const path = window.location.pathname;
      const targetId = ROUTE_MAP[path];
      
      if (targetId && targetId !== "opening") {
        setTimeout(() => {
          scrollToId(targetId, { immediate });
        }, 100);
      } else if (path === "/" || path === "/home" || path === "/hero") {
        window.scrollTo(0, 0);
      }
    };

    // On initial load, jump instantly
    handleRoute(true);

    // When user clicks browser Back or Forward button, scroll them smoothly
    const onPopState = () => handleRoute(false);
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* Hold the audience in their seat until the leader has run. */
  useEffect(() => {
    if (ready) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ready]);

  // Autoplay handler
  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted && soundOn) {
        startAmbience();
        setHasInteracted(true);
      }
    };

    // Background eager preloading of lazy chunks for seamless cinematic scroll
    const preload = () => {
      import("./scenes/Scene04RawFootage");
      import("./scenes/Scene05Edit");
      import("./scenes/Scene06System");
      import("./scenes/Scene07BehindTheScenes");
      import("./scenes/Scene08Life");
      import("./scenes/Scene09FinalCut");
    };
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(preload);
      } else {
        setTimeout(preload, 1500);
      }
    }

    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("scroll", startAudio, { once: true, passive: true });
    window.addEventListener("keydown", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("scroll", startAudio);
      window.removeEventListener("keydown", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, [hasInteracted, soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      if (on) stopAmbience();
      else startAmbience();
      return !on;
    });
  }, []);

  useEffect(() => () => stopAmbience(), []);

  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;
  const handleCut = useCallback(() => {
    if (soundRef.current) shutter();
  }, []);

  const handleReplay = useCallback(() => {
    if (reduced) {
      jumpToTop();
      return;
    }
    setRewinding(true);
    if (soundRef.current) shutter(0.06);
    window.setTimeout(jumpToTop, 760);
    window.setTimeout(() => setRewinding(false), 1500);
  }, [reduced]);

  return (
    <>
      <a
        href="#edit"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink-950"
      >
        Skip the film — go to the work
      </a>

      <ParallaxLayers reduced={reduced} lowPower={lowPower} />
      <Atmosphere reduced={reduced} lowPower={lowPower} />
      <FilmOverlay animateGrain={!reduced && !lowPower} />
      <CursorLayer enabled={!touch && !mobile} />
      {ready && <FilmReelNavigator activeScene={activeScene} reduced={reduced} />}

      <NavBar activeScene={activeScene} soundOn={soundOn} onToggleSound={toggleSound} />

      <main className="relative z-10">
        <Scene01Opening reduced={reduced} ready={ready} />
        <Scene02Director reduced={reduced} />
        <SceneCut label="DISSOLVE TO — THE SCRIPT" />
        <Scene03Script reduced={reduced} />
        
        <ErrorBoundary>
          <Suspense 
            fallback={
              <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-ink-950">
                <div className="flex flex-col items-center gap-4">
                  <span className="font-display text-4xl font-bold tracking-widest text-[#FFB703] animate-pulse">AJ</span>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">Loading Reel...</span>
                </div>
              </div>
            }
          >
            <SceneCut label="CUT TO — RAW FOOTAGE" />
            <Scene04RawFootage reduced={reduced} lowPower={lowPower} mobile={mobile} />
            <SceneCut label="CUT TO — THE EDIT" />
            <Scene05Edit reduced={reduced} mobile={compact} onCut={handleCut} />
            <SceneCut label="PULL BACK — THE SYSTEM" />
            <Scene06System reduced={reduced} />
            <SceneCut label="CUT TO — BEHIND THE SCENES" />
            <Scene07BehindTheScenes />
            <SceneCut label="WIDEN TO — THE LIFE BETWEEN FRAMES" />
            <Scene08Life reduced={reduced} mobile={mobile} touch={touch} />
            <SceneCut label="FADE TO — FINAL CUT" />
            <Scene09FinalCut reduced={reduced} onReplay={handleReplay} />
          </Suspense>
        </ErrorBoundary>
      </main>

      <RewindOverlay active={rewinding} />
      <AcademyLeader reduced={reduced} onDone={handleLeaderDone} />
    </>
  );
}
