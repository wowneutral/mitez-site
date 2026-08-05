import { Suspense, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextAnimate } from './magicui/text-animate.jsx';
import RiseText from './RiseText.jsx';
import lazyWithRetry from '../lib/lazyWithRetry.js';

// Lazy, so three.js and the Spline loader are their own chunk rather
// than sitting in the bundle every route has to download first.
const HeroScene = lazyWithRetry(() => import('./HeroScene.jsx'));

// Lighting is deliberately minimal (see IntroLights) — the robot uses
// Spline's own layered materials, which carry their own light/specular/
// matcap layers and need very little external light. Strong lights or an
// HDRI environment wash the dark body out to silver.
//
// Hero copy is deliberately specific, not generic AI-marketing filler —
// no "unlock," "empower," "seamless," "revolutionize." It says what MITEZ
// actually does (free tutoring/mentorship, Gainesville, before kids fall
// behind) instead of vague uplift language.
/**
 * Runs the render loop only while the element is on screen.
 *
 * The hero sits at the top of the homepage, so once a visitor scrolls into
 * the content the canvas was still animating a robot nobody could see, on
 * every frame, forever.
 */
function useOnScreen(ref) {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  // A BACKGROUNDED TAB IS NOT AN ON-SCREEN ONE.
  //
  // IntersectionObserver answers "is this element inside the viewport",
  // and switching to another tab does not change that answer — the hero
  // is still intersecting a viewport nobody is looking at. So the render
  // loop kept running against a robot on a screen that was showing
  // something else entirely.
  //
  // Browsers do throttle requestAnimationFrame in hidden tabs, which is
  // why this was never catastrophic, but throttled is not stopped and
  // the throttle is not guaranteed for WebGL. Someone who leaves this
  // open in a background tab should not be paying for it in battery.
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onChange = () => setTabVisible(!document.hidden);
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return onScreen && tabVisible;
}

/**
 * Is this a phone?
 *
 * Read once, not on resize. Rotating a handset should not tear down a
 * WebGL context, and nobody drags a desktop window narrow enough to
 * matter and then expects the 3D to vanish.
 */
function isHandset() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 760px)').matches
    || window.matchMedia('(pointer: coarse) and (max-width: 900px)').matches;
}

export default function Hero({ onReady, started = false }) {
  const canvasWrap = useRef(null);
  const active = useOnScreen(canvasWrap);
  const [handset] = useState(isHandset);

  // NO ROBOT ON A PHONE, and this is the right call rather than a
  // retreat. The scene was drawn and framed for a wide viewport: on a
  // narrow one it is cropped to a slice of a torso, rendered at 1x into
  // a small canvas so the edges alias badly, and the face lands outside
  // the frame — which is why it had no eyes. A pixelated, decapitated,
  // half-visible robot is worse than no robot.
  //
  // It is also the single largest thing a phone downloads and the
  // heaviest thing it runs: skipping it means the 2MB three.js chunk is
  // never fetched at all on mobile, not merely deferred.
  //
  // The Preloader waits on a ready signal that used to come from inside
  // the scene. With no scene there is nothing to wait for, so say so
  // immediately rather than leaving the intro to time out after nine
  // seconds — which is what a phone was doing.
  useEffect(() => {
    if (handset) onReady?.();
  }, [handset, onReady]);

  return (
    <section className="hero">
      <div className="hero-canvas" ref={canvasWrap}>
        {/* No fallback: the hero's copy is the important thing and it is
            already on screen. A spinner behind the headline would be
            drawing attention to the one part that has not arrived. */}
        {!handset && (
          <Suspense fallback={null}>
            <HeroScene onReady={onReady} active={active} />
          </Suspense>
        )}
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      {/* Wrapped in the same .wrap container every other section uses — the
          hero text was previously positioned with its own ad-hoc
          padding-left, which landed at a different edge than .wrap's
          centered-max-width math. That mismatch was the actual cause of the
          "floating, no alignment" look: hero copy and the section below it
          started at two different x-positions. */}
      {/* Text delays retimed to land after the (now longer, ~3s) camera
          reveal instead of racing in while the dolly is still moving —
          eyebrow arrives as the lights finish fading up, title mid-dolly,
          lede and actions as the camera settles into its final frame. */}
      <div className="wrap">
      {/* Keyed on the intro. Crossing the threshold remounts this block,
          which restarts the copy's entrance so it plays as the panels
          lift rather than having finished behind them. The text is
          rendered in both states, so nothing is hidden from a crawler
          that never presses Enter. */}
      <div className="hero-content" key={started ? 'entered' : 'initial'}>
        <TextAnimate
          as="p"
          className="eyebrow"
          by="character"
          animation="fadeIn"
          duration={0.5}
          delay={0.9}
        >
          THE FUTURE OF EDUCATION
        </TextAnimate>

        <RiseText as="h1" className="hero-title" delay={1.5}>Learning something new shouldn&rsquo;t be this hard.</RiseText>

        <TextAnimate
          as="p"
          className="lede"
          by="line"
          animation="fadeIn"
          duration={0.7}
          delay={2.3}
        >
          MITEZ connects you with people who will teach you what you actually want to know, whatever the skill, whoever you are. Free.
        </TextAnimate>

        {/* Real routes, not same-page anchors.
            These used to jump to #get-involved and #how-it-works, which
            catapulted a first-time visitor several screens down the
            homepage, past everything explaining what MITEZ is — and left
            them with no obvious way back but scrolling. Sending them to
            the dedicated pages instead means the destination is a whole
            page about that subject, and Back returns them here. */}
        <div className="hero-actions hero-actions-reveal">
          <Link className="btn btn-primary" to="/get-involved">
              Get Involved
            </Link>
          <Link className="btn btn-ghost" to="/how-it-works">
              How It Works
            </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
