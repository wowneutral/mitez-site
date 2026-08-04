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
 * Freeze and release the page.
 *
 * body { overflow: hidden } does NOT stop this site scrolling, which is
 * exactly the bug behind being able to scroll behind the intro overlay.
 * Lenis drives scroll itself through window.scrollTo on an animation
 * loop, and that loop does not care what overflow says — it keeps
 * setting a position the browser is happy to honour. The overlay was
 * fixed, so it stayed put while the entire site slid around underneath
 * it.
 *
 * Both are needed: lenis.stop() for the smooth path, and overflow for
 * reduced-motion visitors where Lenis was never started.
 */
export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  instance?.start();
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
      /**
       * LERP, NOT DURATION — and the difference is the whole reason this
       * now feels fluid rather than merely slow.
       *
       * With `duration`, every wheel event starts a fresh easing curve
       * toward a new target. Scroll continuously and you are restarting
       * that curve several times a second, so the motion is really a
       * series of overlapping tweens: it accelerates, gets interrupted,
       * accelerates again. That is what made 1.6s read as lag rather
       * than as weight — the page was always mid-tween, never simply
       * moving.
       *
       * `lerp` blends toward the target by a fixed fraction every frame
       * instead. There is no curve to restart: a new wheel event just
       * moves the target, and the page keeps travelling with the same
       * continuous ease it already had. Motion begins on the very first
       * frame after your input — so it stays responsive — but approaches
       * slowly and never quite snaps to a stop. That combination,
       * immediate response with a long approach, is what people are
       * describing when they call a scroll expensive.
       *
       * 0.07 is deliberately at the slow end. Studio sites sit around
       * 0.075 to 0.1; below about 0.05 the page starts drifting after
       * you have stopped asking it to, which reads as broken.
       */
      lerp: 0.07,

      smoothWheel: true,

      // Slightly under 1, which is affordable now. Under a duration
      // tween a short notch felt like resistance because the motion was
      // already lagging the input; under a lerp the response is
      // immediate, so a shorter notch just reads as a longer, calmer
      // travel.
      wheelMultiplier: 0.9,

      // Touch is left alone. A phone's scrolling is already momentum
      // based in the OS, and overriding it fights muscle memory.
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
