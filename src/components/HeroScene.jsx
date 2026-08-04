import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Scene from './Scene.jsx';

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

  useFrame(() => {
    if (!group.current) return;
    const p = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    // Lerp toward the target so a flick of the wheel does not snap the
    // model round; it inherits the same weight the page has.
    current.current += (p - current.current) * 0.06;
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


export default function HeroScene({ onReady, active }) {
  // A phone renders the same scene into a quarter of the pixels of a
  // laptop and has a fraction of the GPU to do it with. Capping the
  // pixel ratio at 1 there is invisible at arm's length and roughly
  // halves the fragment work.
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

  return (
    <Canvas
      dpr={mobile ? 1 : [1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ powerPreference: 'high-performance', antialias: !mobile }}
      camera={{ position: [-600, 220, 350], fov: 34, near: 70, far: 100000 }}
    >
      <IntroLights />
      <Suspense fallback={null}>
        <ScrollTilt>
          <Scene />
        </ScrollTilt>
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
