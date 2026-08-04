import { Suspense, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import Scene from './Scene.jsx';
import { TextAnimate } from './magicui/text-animate.jsx';
import RiseText from './RiseText.jsx';
import Magnetic from './Magnetic.jsx';

// Target intensities for the hero's three lights — used both as the
// steady-state value and as the fade-up target below.
// Dialed way down from [0.25, 1.1, 0.3] — with the Spline materials
// restored (they carry their own internal light/specular/matcap layers),
// strong external lights wash the dark body out to silver. These are just
// enough to shape the form, not relight it.
const LIGHT_TARGETS = [0.06, 0.22, 0.07]
const LIGHT_FADE_DURATION = 1.1 // seconds

// Lights used to be on at full intensity from the very first frame, so the
// robot was already fully lit the instant the page painted — no sense of
// the scene "arriving." This ramps all three lights up from black over
// about a second, like stage lights coming up at the start of a reveal,
// timed to land right around when the camera's hold beat ends and the
// dolly starts moving.
function IntroLights() {
  const a = useRef()
  const d1 = useRef()
  const d2 = useRef()
  const elapsed = useRef(0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (done.current) return
    elapsed.current += delta
    const p = Math.min(elapsed.current / LIGHT_FADE_DURATION, 1)
    const eased = 1 - Math.pow(1 - p, 2) // ease-out quad — quick rise, gentle settle
    if (a.current) a.current.intensity = LIGHT_TARGETS[0] * eased
    if (d1.current) d1.current.intensity = LIGHT_TARGETS[1] * eased
    if (d2.current) d2.current.intensity = LIGHT_TARGETS[2] * eased
    if (p >= 1) done.current = true
  })

  return (
    <>
      {/* castShadow removed deliberately — the Spline loader globally
          monkeypatches three.js's shadow shader chunks with its own
          soft-shadow code (vogelDiskSample etc.), which fails to compile
          when combined with standard three materials like the
          MeshPhysicalMaterials now used on the robot (see Scene.jsx).
          With no shadow-casting lights, the broken shadow chunks never
          enter any shader, so everything compiles and renders. There's no
          floor in this scene, so shadows were contributing nothing
          visible anyway. */}
      <ambientLight ref={a} intensity={0} />
      <directionalLight ref={d1} position={[300, 500, 400]} intensity={0} />
      <directionalLight ref={d2} position={[-400, 200, -200]} intensity={0} />
    </>
  )
}

// Lighting is deliberately minimal (see IntroLights) — the robot uses
// Spline's own layered materials, which carry their own light/specular/
// matcap layers and need very little external light. Strong lights or an
// HDRI environment wash the dark body out to silver.
//
// Hero copy is deliberately specific, not generic AI-marketing filler —
// no "unlock," "empower," "seamless," "revolutionize." It says what MITEZ
// actually does (free tutoring/mentorship, Gainesville, before kids fall
// behind) instead of vague uplift language.
// Renders only once Suspense has resolved (i.e. after useSpline finished
// streaming the scene), so mounting it is a reliable "the 3D hero is
// actually on screen now" signal for the Preloader.
function ReadySignal({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

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

export default function Hero({ onReady }) {
  const canvasWrap = useRef(null);
  const active = useOnScreen(canvasWrap);

  return (
    <section className="hero">
      <div className="hero-canvas" ref={canvasWrap}>
        <Canvas
          /* Two performance caps that were missing.
             dpr: the canvas was rendering at the device's full pixel ratio,
             which on a 3x phone is nine times the pixels of a 1x render, for
             a scene that is decorative. Capped at 1.5.
             frameloop: the robot's arms drift continuously, so this cannot
             use demand rendering, but there is no reason to run the loop
             while the hero is scrolled off screen. */
          dpr={[1, 1.5]}
          frameloop={active ? 'always' : 'never'}
          gl={{ powerPreference: 'high-performance', antialias: true }}
          camera={{
            position: [-600, 220, 350],
            fov: 34,
            near: 70,
            far: 100000,
          }}
        >
          <IntroLights />
          <Suspense fallback={null}>
            <Scene />
            <ReadySignal onReady={onReady} />
            {/* Environment removed. The robot uses Spline's own materials,
                which are self-lit through their internal layer stacks
                (light + specular + matcap layers) — exactly how Spline's
                preview renders them as near-black with soft highlights.
                The studio HDRI was flooding those layers with white light,
                which is what made the whole robot read silver instead of
                the reference's dark look. */}
          </Suspense>
        </Canvas>
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
      <div className="hero-content">
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
          <Magnetic>
            <Link className="btn btn-primary" to="/get-involved">
              Get Involved
            </Link>
          </Magnetic>
          <Magnetic>
            <Link className="btn btn-ghost" to="/how-it-works">
              How It Works
            </Link>
          </Magnetic>
        </div>
      </div>
      </div>
    </section>
  );
}
