import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Scene from './Scene.jsx';

// Half of 60. The robot drifts, breathes and curls an elbow — there is
// nothing in this scene moving fast enough for the missing frames to be
// visible, and a full-viewport WebGL canvas is the most expensive thing
// on the site by a wide margin. Rendering it 30 times a second instead
// of 60 halves that cost outright.
const TARGET_FPS = 30;

// Decay constant for the scroll tilt, solved rather than guessed:
// 1 - e^(-k/60) = 0.06  =>  k = -60 * ln(0.94) ≈ 3.71
// so the motion is identical to the old per-frame 0.06 on a 60Hz screen.
const SETTLE = 3.71;

/**
 * The 3D hero, in its own module so it can be its own chunk.
 *
 * WHY THIS FILE EXISTS. Home was eagerly imported by App, and Home
 * imported this, so three.js, drei and the Spline loader were in the
 * main bundle — about two megabytes, six hundred kilobytes gzipped,
 * downloaded and parsed before ANY page could render. Someone opening a
 * link to the Terms was downloading a 3D engine to read a legal
 * document.
 *
 * Now it is lazy: the hero's copy paints on the first pass and the scene
 * streams in behind it. Nothing about the visitor's experience of the
 * homepage changes except that the words arrive sooner, and every other
 * route stops paying for the robot entirely. Load speed is not separate
 * from feeling expensive — it is most of it.
 */

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


/**
 * The robot answers the scroll.
 *
 * It used to be a decoration that happened to be animated: it did the
 * same thing whether you were reading the hero or halfway down the page.
 * Now the group turns slightly and settles as the hero leaves, so the
 * scene is part of the same gesture as everything else rather than a
 * video playing in the corner.
 *
 * The rotation is small — about seven degrees across a full screen of
 * scroll — because the model was lit and framed for one angle, and
 * turning it far enough to notice is turning it far enough to break
 * that framing.
 *
 * Read straight from window.scrollY inside the frame loop rather than
 * from React state: this runs at 60fps, and routing it through a
 * setState would re-render the tree sixty times a second to move one
 * object.
 */
function ScrollTilt({ children }) {
  const group = useRef();
  const current = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    // Lerp toward the target so a flick of the wheel does not snap the
    // model round; it inherits the same weight the page has.
    //
    // TIED TO TIME, NOT TO FRAMES. This used to ease by a flat 0.06 of
    // the remaining distance every frame, which silently made the
    // animation's speed a function of the monitor: the same scroll
    // settled twice as fast on a 120Hz laptop as on a 60Hz one, and
    // would now have settled half as fast again under the 30fps cap
    // above.
    //
    // The exponential form is the framerate-independent equivalent.
    // SETTLE is chosen so that at 60fps this evaluates to 0.06 — the
    // exact feel that was tuned by eye — and it now holds that feel at
    // any refresh rate. Also self-correcting after a stall: a long delta
    // produces a large step, so returning to a backgrounded tab catches
    // the model up rather than making it crawl to where it should be.
    current.current += (p - current.current) * (1 - Math.exp(-SETTLE * delta));
    group.current.rotation.y = current.current * 0.13;
    group.current.position.y = current.current * -26;
  });

  return <group ref={group}>{children}</group>;
}

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
 * Drives the canvas at TARGET_FPS instead of the display's refresh rate.
 *
 * HOW THIS WORKS, because it is not obvious. r3f has three frameloop
 * modes: 'always' renders every rAF tick, 'never' renders nothing, and
 * 'demand' renders only when something calls invalidate(). There is no
 * built-in fps cap, so the cap is built out of 'demand' — the canvas
 * sits idle and this timer asks it for a frame thirty times a second.
 *
 * useFrame callbacks still run exactly as before, once per rendered
 * frame, with a delta of ~33ms rather than ~16ms. Anything that eased by
 * a fixed amount per frame would therefore move at half speed, which is
 * why ScrollTilt below no longer does that.
 *
 * On a 120Hz display this is a 4x reduction rather than 2x, since
 * 'always' would otherwise chase 120 frames a second for a robot that
 * moves a few degrees over an entire screen of scroll.
 */
function FrameRateCap({ active }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(invalidate, 1000 / TARGET_FPS);
    return () => clearInterval(id);
  }, [active, invalidate]);
  return null;
}


export default function HeroScene({ onReady, active }) {
  // A phone renders the same scene into a quarter of the pixels of a
  // laptop and has a fraction of the GPU to do it with. Capping the
  // pixel ratio at 1 there is invisible at arm's length and roughly
  // halves the fragment work.
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

  return (
    <Canvas
      /* dpr and antialias are the two dials that matter here, and both
         were set too high.

         A full-viewport canvas at 1.5x on a retina display is 2.25x the
         fragments of a 1x render, and multisampling on top of that is
         the single most expensive thing this page asks a GPU to do.
         1.25x with MSAA off is roughly a third of the work, and at this
         size the difference is hard to see on a dark matte model with
         no hard edges against the background. */
      dpr={mobile ? 1 : [1, 1.25]}
      /* 'demand' rather than 'always': FrameRateCap below asks for the
         frames, thirty a second, instead of the browser handing over
         every one it can. 'never' still means never — scrolled past the
         hero, nothing renders at all, which was already right. */
      frameloop={active ? 'demand' : 'never'}
      gl={{ powerPreference: 'high-performance', antialias: false }}
      camera={{ position: [-600, 220, 350], fov: 34, near: 70, far: 100000 }}
    >
      <IntroLights />
      <FrameRateCap active={active} />
      <Suspense fallback={null}>
        <ScrollTilt>
          <Scene />
        </ScrollTilt>
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
