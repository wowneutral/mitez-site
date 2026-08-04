import { useEffect, useRef, useState } from 'react';
import { enable as enableSound } from '../lib/sound.js';
import { hasEntered, markEntered } from '../lib/session.js';

/**
 * The intro.
 *
 * WHY AN ENTRY SCREEN AND NOT A LOADING SCREEN. A loading screen is
 * something to look at while you wait, which then gets out of the way —
 * a spinner, a bar and a centred ring are all the same idea. This is a
 * threshold instead: the site loads, then it waits for YOU, and the
 * click that crosses it is what starts the music. That is not
 * decoration. Browsers block audio until a real user gesture, so a site
 * with intro music must have a button, which means the button may as
 * well be the best moment on the page.
 *
 * THE COMPOSITION. The previous version put a small wordmark dead centre
 * and a dial in one corner, and it looked like two unrelated objects
 * floating in an empty field, because that is what it was. This is built
 * on the same margin the rest of the site uses, with four anchors:
 *
 *    top left      the wordmark, letters drawing together
 *    centre        the promise, one line, at real size
 *    bottom left   where and what, in small caps
 *    bottom right  the dial: progress, then ENTER
 *
 * Corners hold a composition together the way a frame does. Two floating
 * elements read as unfinished no matter how nicely each one is drawn,
 * and that was the actual problem — not the shape of the circle.
 *
 * ONCE PER TAB. Crossing it again because you pressed reload is a toll
 * booth, so a refresh skips straight through and PanelSweep plays the
 * short version instead.
 */
const MIN_MS = 1500;
const MAX_MS = 9000;
const AUTO_ENTER_MS = 10000;
const EXIT_MS = 1500;

const R = 34;
const CIRC = 2 * Math.PI * R;

export default function Preloader({ ready, onEnter }) {
  // Read once, on mount, so the value cannot change under the component
  // mid-sequence.
  const skip = useRef(hasEntered());

  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entering, setEntering] = useState(false);
  const [unmounted, setUnmounted] = useState(skip.current);
  const enterRef = useRef(null);

  // Returning within the same tab: no gate, no counter, nothing to
  // press. The page is simply there.
  useEffect(() => {
    if (!skip.current) return;
    onEnter?.();
  }, [onEnter]);

  useEffect(() => {
    if (skip.current) return undefined;
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const loaded = (ready && minElapsed) || timedOut;

  // Real progress. It eases toward 92 while the Spline scene streams,
  // then runs hard to a genuine 100 once the page is ready. A progress
  // indicator that stops short and disappears is worse than none at all,
  // because the single thing it promised is the thing it did not do.
  useEffect(() => {
    if (skip.current) return undefined;
    let frame;
    const tick = () => {
      setProgress((p) => {
        const ceiling = loaded ? 100 : 92;
        const next = p + (ceiling - p) * (loaded ? 0.14 : 0.035);
        return next > 99.4 ? 100 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loaded]);

  const complete = progress >= 100;

  useEffect(() => {
    if (complete && !entering) enterRef.current?.focus({ preventScroll: true });
  }, [complete, entering]);

  useEffect(() => {
    if (!complete || entering) return undefined;
    const t = setTimeout(() => setEntering(true), AUTO_ENTER_MS);
    return () => clearTimeout(t);
  }, [complete, entering]);

  useEffect(() => {
    if (!entering) return undefined;
    markEntered();
    onEnter?.();
    const t = setTimeout(() => setUnmounted(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [entering, onEnter]);

  useEffect(() => {
    if (skip.current || entering) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [entering]);

  function handleEnter() {
    if (entering) return;
    // The audio context must be created inside the handler for the
    // browser to accept the gesture as permission.
    enableSound();
    setEntering(true);
  }

  if (unmounted) return null;

  // Snapped to exactly zero at completion rather than left to arithmetic.
  // The ring was ending a few degrees short: the dash offset was
  // computed from a progress value that only asymptotically approached
  // its ceiling, so the last fraction of a percent, invisible in the
  // number, was very visible as a gap in the stroke.
  const dashOffset = complete ? 0 : CIRC * (1 - progress / 100);

  return (
    <div
      className={`intro${entering ? ' is-entering' : ''}${complete ? ' is-complete' : ''}`}
      role="dialog"
      aria-label="Enter MITEZ"
    >
      <div className="intro-panels" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>

      <div className="intro-ui">
        <div className="intro-mark">MITEZ</div>

        <p className="intro-line">
          <span>Free mentorship</span>
          <span>in anything you</span>
          <span>want to learn.</span>
        </p>

        <div className="intro-meta">
          <span>Gainesville, Florida</span>
          <span>Est. 2026</span>
        </div>

        <div className="intro-corner">
          <p className="intro-hint">{complete ? 'Best with sound' : 'Loading'}</p>

          <button
            type="button"
            ref={enterRef}
            className="intro-dial"
            onClick={handleEnter}
            disabled={!complete}
            aria-label={complete ? 'Enter, with sound' : 'Loading'}
          >
            <svg viewBox="0 0 84 84" aria-hidden="true">
              <g transform="rotate(-90 42 42)">
                <circle className="intro-dial-bg" cx="42" cy="42" r={R} />
                <circle
                  className="intro-dial-fg"
                  cx="42"
                  cy="42"
                  r={R}
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                />
              </g>
            </svg>
            <span className="intro-num" aria-hidden="true">{Math.round(progress)}</span>
            <span className="intro-enter" aria-hidden="true">Enter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
