/**
 * SCENE 08 — THE LIFE BETWEEN FRAMES
 * -----------------------------------------------------------------------------
 * This file is the drop-in point for personal media. Nothing here claims a
 * destination, a trip, a hobby or a credit — the captions are neutral and the
 * artwork below is clearly-labelled placeholder painting.
 *
 * TO ADD YOUR OWN MEDIA
 *   1. Drop files into `src/assets/life/` (they are inlined at build time).
 *   2. `import myFrame from "../assets/life/my-frame.jpg";`
 *   3. Set `src: myFrame` on a slot below, and write a real `caption`.
 *   4. For video, set `kind: "video"`, `src: myClip`, and `poster: myPoster`.
 * Empty slots render as neutral, labelled placeholders — never broken images.
 */

import horizon from "../assets/photos/sketchbook1photo1.jpg";
import road from "../assets/photos/sketchbook1photo2.jpg";
import grid from "../assets/media-grid.jpg";

import sketchbookPhoto3 from "../assets/photos/sketchbook1photo3.jpg";
import sketchbookPhoto4 from "../assets/photos/sketchbook1photo4.jpg";
import sketchbookPhoto5 from "../assets/photos/sketchbook1photo5.jpg";
import sketchbookPhoto6 from "../assets/photos/sketchbook1photo6.jpg";
import sketchbookPhoto16 from "../assets/photos/sketchbook1photo26.jpg";
import v1 from "../assets/videos/sketchbook_1_clip.mp4";

import sketchbook2Photo2 from "../assets/photos/sketchbook1photo23.jpg";
import sketchbook2Photo3 from "../assets/photos/sketchbook2photo3.jpg";
import sketchbook2Photo4 from "../assets/photos/sketchbook2photo4.jpg";
import sketchbook2Photo5 from "../assets/photos/sketchbook2photo5.jpg";
import sketchbook2Photo6 from "../assets/photos/sketchbook2photo6.jpg";

import sketchbookPhoto13 from "../assets/photos/sketchbook1photo20.jpg";
import sketchbookPhoto14 from "../assets/photos/sketchbook1photo14.jpg";
import sketchbookPhoto15 from "../assets/photos/sketchbook1photo25.jpg";

import sketchbook3photo7 from "../assets/photos/sketchbook1photo24.jpg";

export type MediaKind = "image" | "video";

export interface MediaSlot {
  id: string;
  kind: MediaKind;
  /** Leave undefined to render an "ADD MEDIA" placeholder. */
  src?: string;
  /** Required for video — shown before the clip loads. */
  poster?: string;
  /** Meaningful alt text. Describe the frame, don't invent a place. */
  alt: string;
  /** Optional short line shown under the frame. */
  caption?: string;
  /** Where this asset should live once you have it. */
  path: string;
  /**
   * Crops a tile out of the shared placeholder painting so the layouts read
   * as distinct frames until real photographs replace them. 0-indexed 4x4.
   */
  tile?: { col: number; row: number };
}

/** Backdrop paintings for each chapter. Replace freely. */
export const CHAPTER_ART = {
  road,
  horizon,
  grid,
};


export const TRAVEL_FRAMES: MediaSlot[] = [
  {
    id: "travel-01",
    kind: "image",
    src: sketchbookPhoto3,
    alt: "Mountain landscape",
    caption: "The High Passes",
    path: "src/assets/photos/sketchbook1photo3.jpg",
  },
  {
    id: "travel-02",
    kind: "image",
    src: sketchbookPhoto4,
    alt: "Satisified Soul",
    caption: "Satisified Soul",
    path: "src/assets/photos/sketchbook1photo4.jpg",
  },
  {
    id: "travel-03",
    kind: "image",
    src: sketchbookPhoto16,
    alt: "Key Monastery",
    caption: "Key Monastery",
    path: "src/assets/photos/sketchbook1photo26.jpg",
  },
  {
    id: "travel-04",
    kind: "image",
    src: sketchbookPhoto6,
    alt: "Grass is greener",
    caption: "Grass is greener",
    path: "src/assets/photos/sketchbook1photo6.jpg",
  },
  {
    id: "travel-05",
    kind: "video",
    src: v1,
    alt: "Lake",
    path: "src/assets/videos/sketchbook_1_clip.mp4",
  },
];

/* -------------------------------------------------------- 02 PHOTOGRAPHY */

export const PHOTO_FRAMES: MediaSlot[] = [
  { id: "photo-01", kind: "image", src: sketchbookPhoto14, alt: "Shining wings", caption: "Shining wings", path: "src/assets/photos/sketchbook1photo14.jpg" },
  { id: "photo-02", kind: "image", src: sketchbook2Photo2, alt: "No Ducks given", caption: "No Ducks given", path: "src/assets/photos/sketchbook1photo23.jpg" },
  { id: "photo-03", kind: "image", src: sketchbook2Photo3, alt: "Glowing Forest", caption: "Glowing Forest", path: "src/assets/photos/sketchbook2photo3.jpg" },
  { id: "photo-04", kind: "image", src: sketchbook2Photo4, alt: "Afternoon Nap", caption: "Afternoon Nap", path: "src/assets/photos/sketchbook2photo4.jpg" },
  { id: "photo-05", kind: "image", src: sketchbook2Photo5, alt: "Evening Aarti", caption: "Evening Aarti", path: "src/assets/photos/sketchbook2photo5.jpg" },
  { id: "photo-06", kind: "image", src: sketchbook2Photo6, alt: "Gue Monastery", caption: "Gue Monastery", path: "src/assets/photos/sketchbook2photo6.jpg" },
];

/* --------------------------------------------------------- 03 FILMMAKING */

export interface ClipSlot extends MediaSlot {
  /** Track label shown on the editing timeline. */
  track: string;
  /** Poetic sub-caption. */
  poetic: string;
  /** Director's decision microcopy. */
  director: string;
  /** Relative length on the timeline, 1–4. */
  length: number;
}

export const FILM_CLIPS: ClipSlot[] = [
  { id: "clip-01", kind: "image", src: sketchbookPhoto13, alt: "Waterfall establishing shot", track: "ESTABLISH", poetic: "Arrive.", director: "Let the place speak first.", length: 3, path: "src/assets/photos/sketchbook1photo20.jpg" },
  { id: "clip-02", kind: "image", src: sketchbookPhoto5, alt: "Dharchula travelling shot", track: "TRAVELLING", poetic: "Roam.", director: "Then give it movement.", length: 4, path: "src/assets/photos/sketchbook1photo5.jpg" },
  { id: "clip-03", kind: "image", src: sketchbook3photo7, alt: "Flowers detail", track: "DETAIL", poetic: "Notice.", director: "Notice what almost disappears.", length: 2, path: "src/assets/photos/sketchbook1photo24.jpg" },
  { id: "clip-04", kind: "image", src: sketchbookPhoto15, alt: "Bijli Mahadev closing shot", track: "CLOSE", poetic: "Linger.", director: "Leave the viewer with something.", length: 3, path: "src/assets/photos/sketchbook1photo25.jpg" },
];

import { Music, FlaskConical, BookOpen, PenTool, Map, Lightbulb, type LucideIcon } from "lucide-react";

export interface CuriosityTile {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Optional — add a line once there is something true to say. */
  note?: string;
  media?: MediaSlot;
}

/**
 * Intentionally open. Add, remove or reorder freely — the collage lays itself
 * out. No claims are made about any of these until a `note` is written.
 */
export const CURIOSITY_TILES: CuriosityTile[] = [
  { id: "cur-music", label: "MUSIC", icon: Music },
  { id: "cur-experiments", label: "EXPERIMENTS", icon: FlaskConical },
  { id: "cur-reading", label: "READING", icon: BookOpen },
  { id: "cur-visual", label: "VISUAL PROJECTS", icon: PenTool },
  { id: "cur-places", label: "NEW PLACES", icon: Map },
  { id: "cur-learning", label: "THINGS I AM LEARNING", icon: Lightbulb },
];

/* ------------------------------------------------------------- CHAPTERS */

export interface LifeChapter {
  id: string;
  index: string;
  kicker: string;
  heading: string;
  statement: string;
  accent: string;
}

export const LIFE_CHAPTERS: LifeChapter[] = [
  {
    id: "travelling",
    index: "01",
    kicker: "TRAVELLING",
    heading: "GO SOMEWHERE.",
    statement: "New places change the way you see familiar ones.",
    accent: "#8B4513",
  },
  {
    id: "photography",
    index: "02",
    kicker: "PHOTOGRAPHY",
    heading: "FIND THE FRAME.",
    statement: "Photography is learning to notice.",
    accent: "#1F3E5A",
  },
  {
    id: "filmmaking",
    index: "03",
    kicker: "FILMMAKING",
    heading: "TELL THE STORY.",
    statement: "A story is what remains between the cuts.",
    accent: "#8B2513",
  },
  {
    id: "curiosity",
    index: "04",
    kicker: "EVERYTHING ELSE",
    heading: "STAY CURIOUS.",
    statement: "The work is the film. Life is the source material.",
    accent: "#3B5234",
  },
];
