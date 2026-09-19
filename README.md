# Amit Joshi — Portfolio

An interactive, cinematic portfolio built as one continuous scrolling experience, showcasing my work as a Senior AI/ML Engineer.

## Tech Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- **Framer Motion** (Animations)
- **Lenis** (Smooth Scrolling)
- **lucide-react** (Icons)

## Local Development

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/App.tsx` — Main application and scene orchestration.
- `src/data/projectData.ts` — Core data for resume and project cuts.
- `src/data/lifeData.ts` — Configuration for photography and video reels.
- `src/scenes/` — Individual React components for each scrollable scene.
- `src/components/` — Shared UI components, layout tools, and visual effects.

## Performance & Accessibility

- **No WebGL/Three.js**: Built entirely with DOM, CSS, SVG, and transforms.
- **Accessibility**: Full support for semantic landmarks and `prefers-reduced-motion` (animations freeze and camera moves are neutralized).
- **Responsive**: Touch-friendly layouts on mobile devices.
- **Media Optimization**: Lazy-loaded images and videos to ensure fast initial render times.
