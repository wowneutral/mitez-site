import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Momentum scrolling.
 *
 * This is the single biggest difference between a site that feels
 * expensive and one that does not, and it is almost never the effect
 * people point at. Native scroll is instantaneous and weightless: the
 * page is exactly where the wheel says it is, every frame, with no
 * follow-through. Lenis intercepts the wheel and eases the scroll
 * position toward its target instead, so the page carries mass.
 *
 * Everything scroll-linked inherits that for free. The progress line in
 * How It Works, the reveals, the parallax — all of them are driven by
 * scroll position, so smoothing the scroll smooths them too, without a
 * single change to those components.
 *
 * WHY A MODULE SINGLETON, not context: exactly one piece of code outside
 * this file needs the instance (ScrollToTop in App.jsx, which has to tell
 * Lenis to jump on route change rather than fighting it). A context
 * provider for one consumer is ceremony.
 */
let instance = null;

export function getLenis() {
  return instance;
}

/**
 * Lenis is deliberately NOT started when the visitor asks for reduced
 * motion. Hijacking the scroll of someone who gets motion sick is the
 * worst thing on this page, and it is the one effect they cannot avoid
 * by not moving the mouse.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const lenis = new Lenis({
      // 1.6s was too far. There is a line where "heavy" stops reading as
      // expensive and starts reading as broken — the page keeps moving
      // after you have stopped asking it to, and that feels like lag
      // even at a perfect sixty frames a second. Weight has to arrive
      // with the input, not after it. 1.35s keeps the follow-through
      // and gives the wheel back its authority.
      duration: 1.35,
      // Exponential ease-out: fast pickup, long tail. This curve is the
      // actual "feel" — it is what makes the stop read as deceleration
      // rather than as an ending. The exponent sets how long that tail
      // is; 9 rather than 10 keeps a little more energy in the drift.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
      smoothWheel: true,
      // Back to 1. Shortening the wheel notch to 0.85 meant every scroll
      // moved less than the hand expected, which the body reads as the
      // page resisting rather than as pace. Two ways to make something
      // feel slow: move it slowly, or make it under-respond. Only the
      // first one feels cinematic.
      wheelMultiplier: 1,
      // Touch is left alone. Phone scrolling is already momentum-based in
      // the OS, and overriding it fights muscle memory and feels broken.
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    instance = lenis;

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
