# MITEZ Relaunch (React + Vite + R3F)

## Setup (run this locally — the sandbox that built this has no npm registry access)

```bash
cd mitez-relaunch
npm install
npm run dev
```

Then open the localhost URL Vite prints (usually `http://localhost:5173`).

## Swapping in the real robot scene

`src/components/Hero.jsx` currently renders a placeholder gold icosahedron so the
hero section, layout, and font work end-to-end. To swap in the actual Spline scene:

1. In Spline, open your **remixed copy** of the file (not the community original —
   you need your own copy to export).
2. **Export → Code Export → react-three-fiber**.
3. Either:
   - Click **Download ZIP** and hand me the folder, or
   - Click **Self-Hosted → Download Assets** to get just the `.glb` + generated
     component, and drop them into `public/models/` and `src/components/`.
4. In `Hero.jsx`, replace `<PlaceholderMark />` with the generated component
   (check its exported name — Spline typically calls it `Scene`).
5. Delete the `PlaceholderMark` function once it's swapped.

## What's built so far

- Vite + React 18 + React Router scaffold
- `@react-three/fiber` + `@react-three/drei` wired up and working
- Hero section with placeholder 3D mark, Chakra Petch headline font
- Brand colors ported from the current static site (`--bg-deep`, `--gold`, etc.)

## What's not built yet

- The rest of the pages (mission, how-it-works, pilot, get-involved, contact,
  free-student-support) — still living in the static site, need porting to
  React components/routes
- Nav, footer, curtain intro, cursor, page-transition system from the current
  site — none of that exists here yet
- The actual robot model (placeholder only, see above)
