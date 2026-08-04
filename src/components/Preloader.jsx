import { useEffect, useRef, useState } from 'react';
import { enable as enableSound } from '../lib/sound.js';

/**
 * The intro.
 *
 * WHY THIS IS AN ENTRY SCREEN AND NOT A LOADING SCREEN.
 * The two previous versions were loading screens: something to look at
 * while you wait, which then gets out of the way. That is why they read
 * as generic no matter what shape was drawn on them — a spinner, a bar
 * and a ring are all the same idea.
 *
 * The studio sites do something structurally different. They make the
 * wait into a threshold you cross deliberately: the site loads, and then
 * it waits for YOU, and the click that begins it also begins the music.
 * That is not decoration, it is the only way the music can exist at all.
 * Every browser blocks audio until a real user gesture, so a site with
 * intro music must have a button, and the button therefore has to be
 * designed rather than apologised for. The entry screen is what turns a
 * technical constraint into the best moment on the page.
 *
 * THE SHAPE OF IT
 *  - Wordmark centred, letters drawing together.
 *  - A progress circle in the bottom left, with the count inside it. It
 *    runs to a genuine 100 and holds there.
 *  - At 100 the circle becomes the ENTER button. The same object that
 *    measured the wait is the one you press: nothing new appears, it
 *    changes state. That is what makes it feel like one designed thing
 *    instead of a loader followed by a prompt.
 *  - Clicking it starts the score and lifts five vertical panels off the
 *    screen in sequence, revealing a hero that is already in motion.
 *    Panels rather than a fade because a fade is one event, and five
 *    staggered panels are a move with a direction.
 *
 * THE SAFETY VALVE
 * An entry screen that requires a click is a wall for anyone who does
 * not click: a parent who opened this on a phone, put it down and came
 * back, or anyone using assistive tech that lands somewhere unexpected.
 * So after 10 seconds sitting at 100 it enters itself, silently. The
 * door opens on its own if nobody opens it.
 */
const MIN_MS = 1400;
const MAX_MS = 9000;
const AUTO_ENTER_MS = 10000;
const EXIT_MS = 1500;

const R = 32;
const CIRC = 2 * Math.PI * R;

export default function Preloader({ ready, onEnter }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entering, setEntering] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const enterRef = useRef(null);

  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const loaded = (ready && minElapsed) || timedOut;

  // Real progress. It eases toward 92 while the Spline scene streams,
  // then runs all the way to a hard 100 once the page actually is ready
  // — and it must be seen to arrive. A progress indicator that stops at
  // 92 and disappears is worse than no indicator, because the one thing
  // it promised is the one thing it did not do.
  useEffect(() => {
    let frame;
    const tick = () => {
      setProgress((p) => {
        const ceiling = loaded ? 100 : 92;
        const next = p + (ceiling - p) * (loaded ? 0.12 : 0.035);
        return next > 99.5 ? 100 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loaded]);

  const complete = progress >= 100;

  // Move focus to the button the moment it becomes one, so the intro can
  // be crossed with a keyboard without hunting for what to press.
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
    // Told once, from here, so the click path and the auto-enter
    // failsafe both announce the crossing the same way.
    onEnter?.();
    const t = setTimeout(() => setUnmounted(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [entering, onEnter]);

  // Nothing scrolls until the threshold is crossed.
  useEffect(() => {
    if (entering) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [entering]);

  function handleEnter() {
    if (entering) return;
    // Order matters: the audio context has to be created inside the
    // handler for the browser to accept the gesture as permission.
    enableSound();
    setEntering(true);
  }

  if (unmounted) return null;

  return (
    <div
      className={`intro${entering ? ' is-entering' : ''}${complete ? ' is-complete' : ''}`}
      role="dialog"
      aria-label="Enter MITEZ"
    >
      {/* The panels ARE the screen. Each lifts on its own delay. */}
      <div className="intro-panels" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>

      <div className="intro-ui">
        <div className="intro-word">MITEZ</div>

        <div className="intro-corner">
          <button
            type="button"
            ref={enterRef}
            className="intro-dial"
            onClick={handleEnter}
            disabled={!complete}
            aria-label={complete ? 'Enter, with sound' : 'Loading'}
          >
            <svg viewBox="0 0 80 80" aria-hidden="true">
              <g transform="rotate(-90 40 40)">
                <circle className="intro-dial-bg" cx="40" cy="40" r={R} />
                <circle
                  className="intro-dial-fg"
                  cx="40"
                  cy="40"
                  r={R}
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - progress / 100)}
                />
              </g>
            </svg>
            <span className="intro-num" aria-hidden="true">{Math.round(progress)}</span>
            <span className="intro-enter" aria-hidden="true">Enter</span>
          </button>

          <p className="intro-hint" aria-hidden="true">
            {complete ? 'Best with sound' : 'Loading'}
          </p>
        </div>
      </div>
    </div>
  );
}
