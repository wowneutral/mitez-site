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
       * 0.09, RAISED FROM 0.07, and the reason is worth stating because
       * it is the most likely answer to "the site feels laggy."
       *
       * Laggy usually means dropped frames. Here it almost certainly
       * did not: nothing on this page is expensive enough per frame to
       * stutter a modern laptop, and the costly things are all gated
       * (the robot stops rendering off screen, the bands are pure
       * translation, the skew was removed). What "laggy" described was
       * LATENCY — the gap between asking the page to move and it
       * arriving where you asked.
       *
       * A lerp of 0.07 closes 7% of the remaining distance per frame,
       * so it takes about 40 frames — two thirds of a second — to cover
       * 95% of a scroll. Every frame of that is perfectly smooth, and it
       * still feels like the page is behind you, because it is. That is
       * the trap in tuning this by feel: slower always looks more
       * expensive in a screen recording and always feels worse under
       * your own hand, because only one of those has your input in it.
       *
       * 0.09 lands the same distance in about 30 frames. Still clearly
       * eased, still carries mass, roughly a quarter less waiting.
       * Studio sites sit around 0.075 to 0.1; below about 0.05 the page
       * keeps drifting after you have stopped asking it to, which reads
       * as broken rather than as smooth.
       */
      lerp: 0.09,

      smoothWheel: true,

      // Back to 1, from 0.9. Shortening the notch does not make the
      // scroll calmer, it makes it take more notches to get anywhere —
      // and since each one restarts the approach, the shortfall
      // compounds into exactly the "I am fighting this page" feeling the
      // lerp change is meant to remove. Weight belongs in how the page
      // travels, not in how little ground it covers.
      wheelMultiplier: 1,

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
