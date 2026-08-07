import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import RiseText from '../RiseText.jsx';
import { readSpectrum, spectrumBins } from '../../lib/sound.js';

/**
 * Scroll moments, from the tester.
 *
 * ONE FILE ON PURPOSE. These arrived together as an experiment and should
 * be able to leave together. Split across six files, someone removes four
 * and leaves two orphaned, which is how a site ends up with one
 * unexplained animation nobody remembers agreeing to.
 *
 * THEY ARE NOT ALL ON THE HOMEPAGE. Each is imported by the page whose
 * argument it supports. A moment on the wrong page is decoration.
 */

/**
 * Progress across a window defined by where the element's TOP sits in the
 * viewport. 0 when top is at `start` of viewport height, 1 when it reaches
 * `end`.
 *
 * WHY THIS REPLACED THE OLD VERSION. The old one measured the element's
 * CENTRE against the viewport centre, which for a tall section meant the
 * animation had already finished before the section was the thing you
 * were looking at. You scrolled down to a diagram that had drawn itself
 * somewhere off screen. Reading the top instead ties the animation to the
 * act of arriving, and the defaults below run it from "just entering" to
 * "sitting comfortably in frame".
 *
 * It also guarantees the end state is reachable. The old maths could
 * asymptote and leave a counter stuck at 2 instead of 0 no matter how far
 * you scrolled, because the target was a moving centre it never quite hit.
 */
function useProgress(ref, start = 0.82, end = 0.34) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(1); return undefined; }
    let raf; let alive = true;
    const tick = () => {
      if (!alive) return;
      const el = ref.current;
      if (el) {
        const h = window.innerHeight;
        const top = el.getBoundingClientRect().top;
        const next = Math.max(0, Math.min(1, (h * start - top) / (h * (start - end))));
        setP((prev) => (Math.abs(prev - next) > 0.004 ? next : prev));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [ref, start, end]);
  return p;
}

/* ------------------------------------------------------------------ 06 */
const STOPS = [
  { x: 60, label: 'You', sub: 'stuck on something', r: 10 },
  { x: 380, label: 'You ask', sub: 'one sentence, no form', r: 7 },
  { x: 700, label: 'A mentor', sub: 'who already knows it', r: 10 },
  { x: 1020, label: 'You can do it', sub: 'the thing you gave up on', r: 10 },
];

export function Network() {
  const ref = useRef(null);
  /* A LONG WINDOW ON PURPOSE. It was drawing itself over about half a
     screen of scroll, which meant it was finished almost as soon as it
     arrived. This runs from the moment the section's top enters the
     viewport until well after it has passed centre: roughly one and a
     half screens of scrolling to fill all four stops. You should have to
     travel the line to draw the line. */
  const p = useProgress(ref, 1.0, -0.5);
  return (
    <section className="section moment-net" ref={ref}>
      <div className="wrap">
        <RiseText as="h2">Two introductions. That is the whole distance.</RiseText>
        <svg className="net-svg" viewBox="0 0 1080 190" role="img"
          aria-label="Four stops on a line: you, you ask, a mentor, and you can do it.">
          {STOPS.slice(0, -1).map((s, i) => {
            const next = STOPS[i + 1];
            const len = next.x - s.x;
            /* Each segment gets its own slice of the run, so the line
               draws stop to stop instead of all four at once. */
            const seg = Math.max(0, Math.min(1, (p - i * 0.22) / 0.22));
            return (
              <line key={s.label} x1={s.x} y1={70} x2={next.x} y2={70} className="net-link"
                style={{ strokeDasharray: len, strokeDashoffset: len * (1 - seg), opacity: seg > 0 ? 0.45 : 0 }} />
            );
          })}
          {STOPS.map((s, i) => (
            <g key={s.label} className={`net-stop${p > i * 0.22 ? ' is-on' : ''}`}>
              <circle cx={s.x} cy={70} r={s.r} className="net-node" />
              <text x={s.x} y={116} textAnchor="middle" className="net-label">{s.label}</text>
              <text x={s.x} y={140} textAnchor="middle" className="net-sub">{s.sub}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 02
   The rule is now on the WORD, not under the whole slot.
   A single long border under a fixed box meant the line was the same
   length whatever word was showing, so it read as a form field with text
   dropped into it. Underlining the word itself means the rule is the
   right length by definition and changes as the word changes, with no
   measuring involved for the line at all. The box is still measured, but
   only so the sentence after it does not jump.                          */
const FLAP_WORDS = ['calculus.', 'guitar.', 'welding.', 'debate.', 'Python.',
  'chemistry.', 'essays.', 'your tax return.', 'reading music.', 'anything.'];

export function SplitFlap() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % FLAP_WORDS.length), 1150);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section moment-flap">
      <div className="wrap">
        <p className="flap-line">
          <span>Someone will teach you</span>
          <span className="flap-box">
            {/* THE GHOST IS WHY THE WORD SAT TOO HIGH, and it fixes two
                things at once.

                The box previously had no in flow content at all: the reel
                was absolutely positioned inside it. An inline block with
                no in flow content takes its baseline from its bottom
                margin edge, so the flex row aligned the BOTTOM of the box
                to the text baseline and pushed the word up by most of a
                line. No amount of nudging vertical-align fixes that
                properly, because the box had no baseline to offer.

                A hidden copy of the current word, in flow, gives the box
                a real text baseline to align on and sizes it to exactly
                that word. Which also means no measuring in JavaScript, no
                resize listener, and no chance of the rule and the word
                disagreeing about how wide the word is. */}
            <span className="flap-ghost" aria-hidden="true">{FLAP_WORDS[i]}</span>
            <span className="flap-clip">
              <span className="flap-reel" style={{ transform: `translateY(-${i * 1.16}em)` }}>
                {FLAP_WORDS.map((w) => <span key={w}><u>{w}</u></span>)}
              </span>
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 13
   Bound to the real analyser now. It reads the master tap, so it moves
   with the score AND the click and pluck effects, and it flattens when
   both are switched off rather than miming.                             */
export function Score() {
  const barsRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const BARS = 48;
    const buf = new Uint8Array(Math.max(64, spectrumBins() || 64));
    const heights = new Array(BARS).fill(6);
    let raf; let alive = true; let wasLive = false; let t = 0;

    /* BACK TO THE SYNTHESISED CURVE, AND THIS IS THE RIGHT CALL.
       Driving bar height straight off frequency bins looked broken, and
       it was not a bug: this score is four sustained pads with almost no
       high end, so nearly all the energy sits in the first few bins. A
       faithful spectrum of it IS three tall bars and forty five flat
       ones. Faithful and unreadable.
       So the shape is a layered sine again, which is what looked good,
       and the audio is used for the one thing it should decide: whether
       there is anything to draw at all. Sound off, it goes flat. */
    const tick = () => {
      if (!alive) return;
      t += 0.05;
      const on = readSpectrum(buf);
      if (on !== wasLive) { wasLive = on; setLive(on); }
      /* Overall loudness, not per bin, used only to scale the curve so it
         breathes with the music instead of running at a fixed height. */
      let level = 0;
      if (on) {
        for (let b = 0; b < buf.length; b += 1) level += buf[b];
        level = Math.min(1, (level / buf.length) / 90);
      }
      const els = barsRef.current ? barsRef.current.children : [];
      for (let i = 0; i < els.length; i += 1) {
        const v = Math.sin(t + i * 0.34) * 0.5
          + Math.sin(t * 0.7 + i * 0.11) * 0.32
          + Math.sin(t * 1.9 + i * 0.05) * 0.18;
        const target = on ? 6 + Math.abs(v) * (30 + level * 48) : 6;
        heights[i] += (target - heights[i]) * 0.18;
        els[i].style.height = `${heights[i]}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section moment-score">
      <div className="wrap">
        <div className="score-bars" ref={barsRef} aria-hidden="true">
          {Array.from({ length: 48 }, (_, i) => <i key={i} />)}
        </div>
        <p className="score-cap">
          {live ? 'The score you are hearing, in real time.' : 'Sound is off. Turn it on in the nav.'}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 10
   Arrow redrawn. The head was two strokes at arbitrary angles, so it
   read as a hook rather than an arrowhead. The barbs are now set back
   along the curve's own exit angle, which is what makes an arrow look
   drawn rather than assembled.                                          */
/* MIRRORED. The arrow pointed up and to the RIGHT, into empty space,
   while the sentence it was annotating sat up and to the LEFT. It was a
   perfectly drawn arrow aimed at nothing.
   It now travels from the handwriting up and left, and the barbs are
   solved off the curve's own exit angle at the tip rather than guessed,
   which is what stops an arrowhead reading as a hook. */
const ARC = 'M194 66 C 160 62, 116 44, 68 20';
const HEAD = 'M68 20 l 13 12.5 M68 20 l 17.6 -3.7';

export function MarginNote() {
  const ref = useRef(null);
  const p = useProgress(ref, 0.86, 0.36);
  const arcRef = useRef(null);
  const headRef = useRef(null);
  const [lens, setLens] = useState({ a: 200, h: 60 });

  useLayoutEffect(() => {
    if (arcRef.current && headRef.current) {
      setLens({ a: arcRef.current.getTotalLength(), h: headRef.current.getTotalLength() });
    }
  }, []);

  const arcOn = Math.min(1, p * 1.6);
  const headOn = Math.max(0, Math.min(1, (p - 0.55) * 3.4));

  return (
    <section className="section moment-margin" ref={ref}>
      <div className="wrap">
        <div className="margin-wrap">
          <p className="margin-line">A person who already knows it. Not a chatbot.</p>
          {/* Arrow and note are a flex row under the sentence rather than
              two absolutely positioned elements at hand picked
              percentages. That is why they drifted apart: percentages of
              a container that reflows are not a relationship. In a row
              they keep their spacing at every width, and the arrow's tip
              stays under the end of the line it points at. */}
          <div className="margin-anno">
            <svg className="margin-arrow" viewBox="0 0 200 74" aria-hidden="true">
              <path ref={arcRef} d={ARC}
                style={{ strokeDasharray: lens.a, strokeDashoffset: lens.a * (1 - arcOn) }} />
              <path ref={headRef} d={HEAD}
                style={{ strokeDasharray: lens.h, strokeDashoffset: lens.h * (1 - headOn) }} />
            </svg>
            <span className={`margin-hand${p > 0.78 ? ' is-on' : ''}`}>a real one. we checked.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 07 */
export function Tally() {
  const [n, setN] = useState(4820);
  const ref = useRef(null);
  const raf = useRef(0);

  function run() {
    cancelAnimationFrame(raf.current);
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / 1600);
      setN(Math.round(4820 * (1 - k) ** 3));
      if (k < 1) raf.current = requestAnimationFrame(step); else setN(0);
    };
    raf.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || !('IntersectionObserver' in window)) { setN(0); return undefined; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); run(); } });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <section className="section moment-tally" ref={ref}>
      <div className="wrap">
        <div className="tally-n">{n.toLocaleString()}</div>
        <div className="tally-l">dollars, ever, from anyone we help</div>
        <button type="button" className="tally-replay" onClick={run}>Play again</button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 14
   It was stopping at 2 miles because the old progress never quite
   reached 1. The window based version lands exactly on 0, well before
   the bottom of the page, which is the whole gag.                       */
export function ZeroDistance() {
  const ref = useRef(null);
  const p = useProgress(ref, 0.88, 0.42);
  const miles = Math.round(1240 * (1 - p));
  return (
    <section className="section moment-zero" ref={ref}>
      <div className="wrap">
        <div className="zero-read">
          <span>{miles.toLocaleString()}</span>
          <span className="zero-unit">miles</span>
        </div>
        <div className="zero-track" aria-hidden="true">
          <span className="zero-pin" style={{ left: `${p * 50}%` }} />
          <span className="zero-pin" style={{ left: `${100 - p * 50}%` }} />
        </div>
        <p className="zero-cap">between you and someone who can help</p>
      </div>
    </section>
  );
}
