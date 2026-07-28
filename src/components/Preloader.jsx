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
//  - FADE_MS: matches the CSS transition, so the node is only unmounted
//    after the fade has actually finished playing.
// Timings nudged up for a slightly more deliberate, cinematic entrance —
// enough to let the wordmark settle before the page arrives, without
// becoming a wait. MAX_MS raised in step so the failsafe still sits well
// clear of the minimum.
const MIN_MS = 1250;
const MAX_MS = 9000;
const FADE_MS = 900;

export default function Preloader({ ready }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const done = (ready && minElapsed) || timedOut;

  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setUnmounted(true), FADE_MS);
    return () => clearTimeout(t);
  }, [done]);

  // Keep the page from scrolling underneath while the overlay is up.
  useEffect(() => {
    if (unmounted) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [unmounted]);

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
          <span className="preloader-fill" />
        </div>
      </div>
    </div>
  );
}
