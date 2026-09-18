import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";

/* ---------------------------------------------------------------- section */

export function SceneSection({
  id,
  children,
  className = "",
  label,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative z-10 w-full ${className}`}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ slate */

export function Slate({
  index,
  title,
  note,
  className = "",
}: {
  index: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="label border border-paper/25 px-2 py-1.5 text-paper/70">
        SCENE {index}
      </span>
      <span className="h-px w-6 bg-paper/25" />
      <span className="label text-paper/50">{title}</span>
      {note ? (
        <>
          <span className="hidden h-px w-6 bg-paper/15 sm:block" />
          <span className="label hidden text-paper/30 sm:block">{note}</span>
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- annotation */

export function Annotation({
  children,
  className = "",
  rotate = -2,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={`hand inline-block text-[17px] leading-tight text-amber-dust/85 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- flow bits */

export function FlowNode({
  label,
  sub,
  active = true,
  accent = "#C98A3C",
  className = "",
}: {
  label: string;
  sub?: string;
  active?: boolean;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-w-0 border px-3 py-2.5 transition-colors duration-500 sm:px-4 sm:py-3 ${className}`}
      style={{
        borderColor: active ? `${accent}80` : "rgba(245,241,232,0.14)",
        background: active ? `${accent}12` : "transparent",
      }}
    >
      <div
        className="label transition-colors duration-500 break-words"
        style={{ color: active ? accent : "rgba(245,241,232,0.45)" }}
      >
        {label}
      </div>
      {sub ? (
        <div className="mt-1.5 font-sans text-[11px] leading-snug text-paper/45">{sub}</div>
      ) : null}
    </div>
  );
}

export function Connector({
  vertical = true,
  active = false,
  accent = "#C98A3C",
  length = 24,
}: {
  vertical?: boolean;
  active?: boolean;
  accent?: string;
  length?: number;
}) {
  return (
    <div
      aria-hidden
      className={`relative shrink-0 ${vertical ? "mx-auto w-px" : "h-px"}`}
      style={{
        [vertical ? "height" : "width"]: length,
        background: "rgba(245,241,232,0.16)",
      } as React.CSSProperties}
    >
      <motion.div
        className="absolute inset-0 origin-top"
        style={{ background: accent }}
        initial={false}
        animate={{ scaleY: vertical ? (active ? 1 : 0) : 1, scaleX: vertical ? 1 : active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />
    </div>
  );
}

export function Chip({
  children,
  accent = "#C98A3C",
  muted = false,
}: {
  children: ReactNode;
  accent?: string;
  muted?: boolean;
}) {
  return (
    <span
      className="label inline-block border px-2 py-1.5"
      style={{
        borderColor: muted ? "rgba(245,241,232,0.16)" : `${accent}66`,
        color: muted ? "rgba(245,241,232,0.5)" : accent,
      }}
    >
      {children}
    </span>
  );
}

/** Marks generated visuals as illustrative, never as real project output. */
export function IllustrativeTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`label text-paper/25 ${className}`}
      title="This animation is an illustration of the architecture, not real output data."
    >
      ILLUSTRATIVE VISUAL
    </span>
  );
}

/* ------------------------------------------------------------ scene cut */

/** The editor's transition marker between two scenes. */
export function SceneCut({ label }: { label: string }) {
  return (
    <div aria-hidden className="relative z-10 px-4 py-14 sm:px-8 sm:py-20">
      <motion.div
        className="mx-auto flex max-w-6xl items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <span className="h-px flex-1 bg-paper/12" />
        <span className="label whitespace-nowrap text-paper/30">{label}</span>
        <span className="h-px w-10 bg-paper/12" />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------- film frame */

export function FilmFrame({
  children,
  className = "",
  accent = "rgba(245,241,232,0.16)",
}: {
  children?: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative border bg-ink-900/40 ${className}`}
      style={{ borderColor: accent }}
    >
      <span className="absolute -top-px left-2 h-1.5 w-4 -translate-y-full bg-paper/10" />
      {children}
    </div>
  );
}
