/**
 * Fixed, non-interactive film treatment: grain and subtle edge lines.
 * Purely decorative — hidden from assistive tech.
 */
export function FilmOverlay({ animateGrain }: { animateGrain: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* subtle grain */}
      <div className="absolute -inset-[10%] overflow-hidden opacity-[0.03]">
        <div
          className={`grain-layer h-full w-full ${animateGrain ? "animate-grain" : ""}`}
        />
      </div>
    </div>
  );
}
