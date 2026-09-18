# DIRECTOR'S CUT — Amit Joshi, Senior AI/ML Engineer

An interactive, cinematic portfolio built as one continuous film: eight scenes,
six project "cuts", and a lighting model that moves the page from night → dawn →
daylight → sunset → night as you scroll.

> I don't just build models. I design systems, experiments and experiences around
> difficult problems.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the build
```

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (theme tokens declared in `src/index.css` via `@theme`)
- **Framer Motion** — every animation; no other animation library
- **Lenis** — smooth scrolling (auto-disabled for touch and reduced-motion users)
- **lucide-react** — icons
- No WebGL / Three.js. Everything is DOM, CSS, SVG and transforms.

## Structure

```
src/
  App.tsx                       scene orchestration + global chrome
  index.css                     design tokens, film grain, paper texture, utilities
  data/projectData.ts           SINGLE SOURCE OF TRUTH (resume facts only)
  data/lifeData.ts              Scene 08 media slots — drop your photos/clips here
  lib/
    motion.ts                   shared easings + Framer Motion variants
    ambience.ts                 WebAudio projector tone + shutter (opt-in, default OFF)
  hooks/
    useEnvironment.ts           reduced-motion / mobile / touch / low-power flags
    useSmoothScroll.ts          Lenis lifecycle + scrollToId / scrollToY helpers
    useActiveScene.ts           IntersectionObserver scene tracking (SCENE 03 / 08)
    useSequence.ts              stepped, looping visual sequencer (pauses off-screen)
  components/
    chrome/AcademyLeader.tsx    3·2·1 film countdown shown while the site loads
    chrome/RewindOverlay.tsx    tape-rewind treatment played on REPLAY
    chrome/Atmosphere.tsx       scroll-driven lighting states + hand-painted world
    chrome/FilmOverlay.tsx      grain, vignette, letterbox
    chrome/CursorLayer.tsx      custom cursor (VIEW / NOTE / SCRUB / ENTER …)
    chrome/NavBar.tsx           AJ mark, MENU, scene readout, SKIP THE FILM
    ui/Primitives.tsx           slate, annotation, flow node, chip, film frame
    project/ProjectPanel.tsx    one project "cut" + director's note (rewind)
    visuals/*.tsx               per-project animated architecture diagrams
    life/MediaFrame.tsx         image / video / "add media" placeholder slot
  scenes/Scene01…Scene09.tsx    the film
```

## The scenes

| — | Academy leader | ~3s film countdown (3 · 2 · 1) with sweep hand and punch, then picture start |
| 01 | Opening credits | Black frame, title card, scroll dollies the camera *through* the type |
| 02 | The director | Editorial statement, "6 years", technical areas pinned to a board |
| 03 | The script | Scroll constructs the engineering approach, stage by stage |
| 04 | Raw footage | Scattered fragments organise themselves → FIND THE SIGNAL. |
| 05 | The edit | Vertical scroll drives a horizontal editing timeline of six projects |
| 06 | The system | The projects collapse into one spine: data → … → user (hard pull-back) |
| 07 | Behind the scenes | The set with the lights on, production history, education |
| 08 | The life between frames | Four reels — road → camera → film → imagination |
| 09 | Final cut | Frames fade, credits roll, THE END, REPLAY ↻ |

### Scene 08 — adding your own media

`src/data/lifeData.ts` is the only file you need to touch. Every frame in the
travel, photography, filmmaking and curiosity reels is a `MediaSlot`:

```ts
import myFrame from "../assets/life/my-frame.jpg";

{ id: "travel-04", kind: "image", src: myFrame, alt: "…", path: "…" }
```

- Drop files into `src/assets/life/` — the build inlines them, so nothing
  depends on an external URL.
- A slot with no `src` renders a labelled **ADD MEDIA** placeholder showing the
  path it expects. It never renders a broken image.
- `kind: "video"` renders a lazy, muted, `preload="none"` clip behind its poster.
- `CURIOSITY_TILES` is an open array — add or remove entries and the collage
  relays itself out. Tiles make no claim until you write a `note`.
- The painted images currently in those slots are placeholder artwork, captioned
  as such, and invent no destination or trip.

## Content policy

Everything in `src/data/projectData.ts` comes from the resume. No employers,
metrics, clients, outcomes or capabilities were invented:

- Only **ROI Engine** carries metrics ($500M+, 20+ markets, 3 engineers, 12wk → <4wk).
- **Sila**, **Retrival** and **FeedShift** carry no metrics at all.
- **Retrival** is spelled exactly that way and is labelled `IN DEVELOPMENT`.
- Every animated architecture diagram is tagged **ILLUSTRATIVE VISUAL** — it
  explains the described architecture, it is not real output data.
- Director's notes are explicitly framed as *engineering reasoning*, not as
  historical project claims.

### One thing to fill in

`LINKS` at the bottom of `src/data/projectData.ts` holds placeholder targets for
GitHub, LinkedIn, email and the resume PDF. Replace them with the real ones (and
drop the PDF into `public/`) before shipping.

## Accessibility & performance

- Semantic landmarks, `sr-only` skip link, focus-visible outlines, labelled controls.
- `prefers-reduced-motion`: Lenis off, grain frozen, camera moves neutralised,
  visual sequences jump to their final, fully-constructed state.
- All content is readable without a single animation running.
- Only `transform`, `opacity`, `clip-path` and `filter` are animated.
- Project visuals mount only for the active cut (± 1) and pause when off-screen.
- Fixed aspect-ratio media boxes, so there are no layout shifts.
- Custom cursor and hover-only affordances are disabled on touch devices; the
  editing timeline becomes a vertical, touch-friendly stack on mobile.

## Sound

Off by default. The toggle in the header starts a synthesised projector room
tone (WebAudio — no audio files, no autoplay) plus a shutter tick on scene cuts.
Nothing in the site depends on sound.
