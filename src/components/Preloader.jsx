import { useEffect, useState } from 'react';

// Full-screen loading state shown on entry/refresh while the 3D hero
// streams in from Spline's CDN. Without this the page painted the copy
// over an empty white canvas for a couple of seconds, then the robot
// popped in — the classic "no loading state" tell.
//
// Three guards on how it leaves:
//  - MIN_MS: stays up briefly even on a warm cache, so it reads as an
//    intentional beat rather than a flash of overlay.
//  - MAX_MS: a hard failsafe. If Spline's CDN is slow or unreachable the
//    scene may never signal ready, and a loader that never leaves is far
//    worse than a missing robot — so it always dismisses itself.
//  - EXIT_MS: matches the CSS transition, so the node is only unmounted
//    after the exit has actually finished playing.
//
// WHY A RING, NOT A BAR AND NOT A NUMBER.
// A horizontal bar filling left to right is the single most generic
// loading graphic there is, and a big percentage counter is the second.
// Both also point sideways, which fights the reveal that follows.
//
// A ring is a shape rather than a readout, and it doubles as the
// geometry of the exit: when it closes, it becomes the aperture the page
// opens through. The overlay is clipped to a circle centred on the ring,
// and that circle expands past the corners of the screen, so the loading
// screen does not fade or slide away — it opens, like a lens, onto a
// hero that has already started moving underneath. One shape, doing the
// waiting and the transition, is what makes it read as directed rather
// than assembled from parts.
const MIN_MS = 1700;
const MAX_MS = 9000;
const EXIT_MS = 1700;

// Geometry for the SVG ring. r is chosen so the stroke sits comfortably
// inside a 120px box at 1.5px width without clipping.
const R = 54;
const CIRC = 2 * Math.PI * R;

export default function Preloader({ ready }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const done = (ready && minElapsed) || timedOut;

  // Real progress, not a timer. It eases toward 92% while the scene is
  // still streaming and only completes once the page actually is ready,
  // so the ring never claims to have finished early.
  useEffect(() => {
    let frame;
    const tick = () => {
      setProgress((p) => {
        const ceiling = done ? 1 : 0.92;
        const next = p + (ceiling - p) * 0.045;
        return next > 0.996 ? 1 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done]);

  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setUnmounted(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [done]);

  // Keep the page from scrolling underneath while the overlay is up.
  // Released as soon as the exit STARTS rather than when it finishes, so
  // an impatient visitor can scroll during the handoff instead of
  // flicking a wheel that does nothing for most of two seconds.
  useEffect(() => {
    if (done) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  if (unmounted) return null;

  return (
    <div
      className={`preloader${done ? ' is-done' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading MITEZ"
    >
      <div className="preloader-inner">
        <div className="preloader-ring" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            {/* Rotated so the stroke starts at twelve o'clock instead of
                three, which is where the eye expects a clock to begin. */}
            <g transform="rotate(-90 60 60)">
              <circle className="preloader-ring-bg" cx="60" cy="60" r={R} />
              <circle
                className="preloader-ring-fg"
                cx="60"
                cy="60"
                r={R}
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
              />
            </g>
          </svg>
          <span className="preloader-word">MITEZ</span>
        </div>
      </div>
    </div>
  );
}
