import { ImagePlus, Film, Play } from "lucide-react";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import type { MediaSlot } from "../../data/lifeData";

interface Props {
  slot: MediaSlot;
  className?: string;
  /** Rounded frames are never used — this only controls the border colour. */
  accent?: string;
  onOpen?: (slot: MediaSlot) => void;
  priority?: boolean;
}

/**
 * Renders a personal-media slot.
 * - image with a `tile` is cropped out of the shared placeholder painting
 * - video renders lazily behind its poster, never autoplaying with sound
 * - an empty slot renders a labelled placeholder showing where the file goes
 */
export function MediaFrame({ slot, className = "", accent, onOpen, priority }: Props) {
  const border = accent ?? "rgba(245,241,232,0.18)";
  const interactive = Boolean(onOpen) && Boolean(slot.src);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { margin: "200px" });

  useEffect(() => {
    if (slot.kind !== "video" || !videoRef.current) return;
    
    // Track the play promise so we don't call pause() while play() is pending (DOMException fix)
    let playPromise: Promise<void> | undefined;

    if (isInView) {
      playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      // Safely pause only if not actively playing
      if (playPromise !== undefined) {
        playPromise.then(() => {
          videoRef.current?.pause();
        }).catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, slot.kind]);

  const inner = () => {
    if (!slot.src) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-paper/20 bg-ink-900/40 p-3 text-center">
          {slot.kind === "video" ? (
            <Film size={16} strokeWidth={1.3} className="text-paper/30" />
          ) : (
            <ImagePlus size={16} strokeWidth={1.3} className="text-paper/30" />
          )}
          <span className="label text-paper/35">ADD {slot.kind === "video" ? "CLIP" : "MEDIA"}</span>
          <span className="hidden font-mono text-[9px] leading-tight text-paper/20 sm:block">
            {slot.path}
          </span>
        </div>
      );
    }

    if (slot.kind === "video") {
      return (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={slot.src}
          poster={slot.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={slot.alt}
        />
      );
    }

    if (slot.tile) {
      return (
        <div className="h-full w-full overflow-hidden relative">
          <img
            src={slot.src}
            alt={slot.alt}
            loading="lazy"
            decoding="async"
            className="absolute max-w-none"
            style={{
              width: "300%",
              height: "300%",
              left: `-${(slot.tile.col / 3) * 300}%`,
              top: `-${(slot.tile.row / 3) * 300}%`,
            }}
          />
        </div>
      );
    }

    return (
      <img
        src={slot.src}
        alt={slot.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  };

  const body = (
    <div
      className={`relative h-full w-full overflow-hidden border bg-ink-950/50 ${className}`}
      style={{ borderColor: border }}
    >
      {inner()}
      {slot.caption ? (
        <span className="label absolute bottom-1.5 left-1.5 bg-black/80 px-2 py-1 text-[7px] sm:text-[8px] text-white/90 rounded-sm">
          {slot.caption}
        </span>
      ) : null}
      {slot.kind === "video" && slot.src && (
        <div className="absolute bottom-1.5 right-1.5 rounded-full bg-black/40 p-1 backdrop-blur-md">
          <Play size={14} className="text-white/80" fill="currentColor" />
        </div>
      )}
    </div>
  );

  if (!interactive) return body;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(slot)}
      data-cursor="VIEW"
      className="block h-full w-full text-left transition-transform duration-500 hover:scale-[1.02]"
      aria-label={`Expand: ${slot.alt}`}
    >
      {body}
    </button>
  );
}
