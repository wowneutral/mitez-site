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
      // ~1.1s to settle. Shorter feels like nothing was done; longer and
      // the page starts feeling sluggish and disconnected from the wheel.
      duration: 1.1,
      // Exponential ease-out: fast pickup, long tail. This curve is the
      // actual "feel" — it is what makes the stop read as deceleration
      // rather than as an ending.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
