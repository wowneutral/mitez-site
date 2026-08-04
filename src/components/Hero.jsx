import { lazy, Suspense, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextAnimate } from './magicui/text-animate.jsx';
import RiseText from './RiseText.jsx';

// Lazy, so three.js and the Spline loader are their own chunk rather
// than sitting in the bundle every route has to download first.
const HeroScene = lazy(() => import('./HeroScene.jsx'));

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
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

export default function Hero({ onReady, started = false }) {
  const canvasWrap = useRef(null);
  const active = useOnScreen(canvasWrap);

  return (
    <section className="hero">
      <div className="hero-canvas" ref={canvasWrap}>
        {/* No fallback: the hero's copy is the important thing and it is
            already on screen. A spinner behind the headline would be
            drawing attention to the one part that has not arrived. */}
        <Suspense fallback={null}>
          <HeroScene onReady={onReady} active={active} />
        </Suspense>
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
