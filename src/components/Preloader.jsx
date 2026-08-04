import { useEffect, useRef, useState } from 'react';
import { hasEntered, markEntered } from '../lib/session.js';
import { lockScroll, unlockScroll } from '../lib/smoothScroll.js';

/**
 * The intro, rebuilt on what Immersive Garden actually does.
 *
 * WHAT THE REFERENCE ACTUALLY IS. Not a gate. Their loading state IS the
 * homepage, held in a pre-state: the logo sits in the bottom left,
 * exactly where it will still be once the page has loaded, a hairline
 * draws across to the right of it, and small grey text in the middle of
 * the screen offers to enable sound. Then the content simply arrives
 * around all of it. Nothing moves out of the way, because nothing was
 * ever in the way. That is the "it blends into the hero" quality — there
 * is no handoff to design, because there is no seam.
 *
 * WHAT I HAD BUILT INSTEAD was a threshold: a full screen with a big
 * dial you had to press to be let in. Three problems, all of them
 * consequences of that one decision.
 *
 *  - The dial filled solid black on HOVER, so it looked pressed before
 *    it was pressed, and looked broken when you moved the pointer away.
 *  - It demanded a click to see a website, which the reference never
 *    does, and no charity site should.
 *  - It was a foreground object over an empty field, which is why no
 *    amount of redrawing the circle ever fixed how it looked.
 *
 * So it is gone. The wordmark sits where the nav's wordmark sits, the
 * progress line draws beside it, sound is offered rather than demanded,
 * and when the scene is ready the whole overlay dissolves in 800ms onto
 * a hero already in motion.
 *
 * Sound is still a click, because every browser requires a gesture
 * before audio — but it is now an offer in passing rather than a
 * turnstile. Ignore it and the site opens anyway.
 */
const MIN_MS = 1400;
const MAX_MS = 9000;
const FADE_MS = 800;

export default function Preloader({ ready, onEnter }) {
  const skip = useRef(false); // was hasEntered() — see note below

  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unmounted, setUnmounted] = useState(skip.current);

  // Returning within the same tab: no intro at all.
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

  useEffect(() => {
    if (skip.current) return undefined;
    let frame;
    const tick = () => {
      setProgress((p) => {
        const ceiling = loaded ? 1 : 0.9;
        const next = p + (ceiling - p) * (loaded ? 0.16 : 0.03);
        return next > 0.995 ? 1 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loaded]);

  const complete = progress >= 1;

  // Dissolve once the line has visibly arrived, not the instant the
  // scene reports ready. A progress indicator that vanishes before it
  // finishes is the one thing a progress indicator must never do.
  useEffect(() => {
    if (!complete) return undefined;
    markEntered();
    onEnter?.();
    const t = setTimeout(() => setUnmounted(true), FADE_MS);
    return () => clearTimeout(t);
  }, [complete, onEnter]);

  // THE SCROLL BUG. body { overflow: hidden } does nothing here: Lenis
  // drives the scroll position itself on an animation loop and happily
  // keeps going, so the whole site slid around behind a fixed overlay.
  // Lenis has to be told to stop.
  useEffect(() => {
    if (skip.current || complete) return undefined;
    lockScroll();
    return unlockScroll;
  }, [complete]);

  if (unmounted) return null;

  return (
    <div className={`intro${complete ? ' is-done' : ''}`} role="status" aria-label="Loading MITEZ">
      {/* Nothing else. The sound offer used to live here and only
          survived as long as the overlay did, which is why it could not
          be clicked — it now sits at app level and waits. */}
      <div className="intro-foot">
        <span className="intro-mark">MITEZ</span>
        {/* The hairline, drawing to the right of the wordmark. The whole
            progress indicator, and it takes two pixels. */}
        <span className="intro-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </div>
  );
}
