import { useEffect, useRef, useState } from 'react';
import { play } from '../lib/sound.js';

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
// THE HANDOFF. The previous version dissolved, and then the hero began.
// Two events in sequence read as two events. This overlaps them: the
// overlay takes 1.6 seconds to leave, drifting as it goes, while the
// hero underneath is already several hundred milliseconds into its own
// entrance. You never watch a loading screen finish and a page start —
// you see one continuous move that happens to pass through both. That
// overlap is the whole difference between a loader and an opening shot.
const MIN_MS = 1600;
const MAX_MS = 9000;
const EXIT_MS = 1600;

export default function Preloader({ ready }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const [pct, setPct] = useState(0);
  const announced = useRef(false);

  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const done = (ready && minElapsed) || timedOut;

  // A real counter rather than one on a timer. It eases toward 92 while
  // the scene is still streaming and only completes once the page
  // actually is ready, so it never claims to have finished early. The
  // number is the only thing on screen proving the wait is doing
  // something, which is what makes a slow load tolerable rather than
  // suspicious.
  useEffect(() => {
    let frame;
    const tick = () => {
      setPct((p) => {
        const ceiling = done ? 100 : 92;
        const next = p + (ceiling - p) * 0.045;
        return next > 99.6 ? 100 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done]);

  useEffect(() => {
    if (!done) return undefined;
    if (!announced.current) {
      announced.current = true;
      // Silent unless the visitor has already turned sound on.
      play('enter');
    }
    const t = setTimeout(() => setUnmounted(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [done]);

  // Keep the page from scrolling underneath while the overlay is up.
  // Released as soon as the exit STARTS rather than when it finishes, so
  // an impatient visitor can scroll during the handoff instead of
  // flicking a wheel that does nothing for a second and a half.
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
        <div className="preloader-word">MITEZ</div>
        <div className="preloader-track">
          <span className="preloader-fill" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
      <div className="preloader-count" aria-hidden="true">
        {Math.round(pct)}
      </div>
    </div>
  );
}
