import { useEffect, useRef, useState } from 'react';
import { pluckString, isSfxOn, subscribe } from '../lib/sound.js';

/**
 * A row of strings you can play by dragging across them.
 *
 * THE TOY. Every site Seth sent me has one: Resn's raindrops, the sites
 * with a bottom edge that answers the cursor. They have almost nothing
 * in common except that they are useless, and that using them is the
 * moment the visitor stops reading a page and starts touching an object.
 *
 * WHY STRINGS RATHER THAN PARTICLES. Two reasons, and neither is taste.
 *
 * A particle field is a WebGL scene: another canvas, another render
 * loop, another two hundred kilobytes, on a site that already complains
 * about lag. This is fourteen divs and a pointermove listener.
 *
 * And it is the only toy that could belong to THIS site rather than to
 * any site. There is already a synthesiser here, tuned, with a reverb —
 * so a string plucks into the same room the score is playing in, at the
 * same level as the clicks, through the same echo. It is not an effect
 * bolted on; it is the instrument that was already here, given a
 * keyboard.
 *
 * HOW IT AVOIDS BEING EXPENSIVE
 *  - One listener on the container, not fourteen.
 *  - Hit detection is arithmetic on the pointer's x, not
 *    getBoundingClientRect per string per move.
 *  - A string is only re-plucked when the pointer CROSSES it. Moving
 *    along one does nothing, which is both cheaper and correct: you
 *    pluck a string by going across it, not by resting on it.
 *  - The animation is a CSS class the browser owns.
 */

// A pentatonic scale, so there are no wrong notes. Any order, any
// speed, any combination sounds intentional — which is the whole
// difference between an instrument a stranger enjoys for ten seconds
// and one that makes them feel like they broke something.
const NOTES = [
  261.63, 293.66, 329.63, 392.0, 440.0,
  523.25, 587.33, 659.25, 783.99, 880.0,
  1046.5, 1174.66, 1318.51, 1567.98,
];

export default function Strings() {
  const wrap = useRef(null);
  const lastIndex = useRef(-1);
  const [sfx, setSfx] = useState(isSfxOn);

  useEffect(() => subscribe((n) => setSfx(n.sfx)), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;

    const strings = [...el.querySelectorAll('.string')];

    const at = (clientX) => {
      const r = el.getBoundingClientRect();
      const p = (clientX - r.left) / r.width;
      if (p < 0 || p > 1) return -1;
      return Math.min(strings.length - 1, Math.floor(p * strings.length));
    };

    const play = (i) => {
      if (i < 0 || i === lastIndex.current) return;
      lastIndex.current = i;

      const s = strings[i];
      if (!s) return;

      // Restart the animation even if it is already running: dragging
      // back and forth quickly should retrigger, not be ignored.
      s.classList.remove('is-struck');
      // Reading offsetWidth forces the style change to be committed, so
      // re-adding the class starts a new animation rather than being
      // collapsed into no change at all.
      void s.offsetWidth;
      s.classList.add('is-struck');

      pluckString(NOTES[i]);
    };

    const onMove = (e) => play(at(e.clientX));
    const onLeave = () => { lastIndex.current = -1; };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="strings-wrap">
      <div className="strings" ref={wrap} aria-hidden="true">
        {NOTES.map((n, i) => (
          <span className="string" key={n} style={{ '--i': i }}>
            <i />
          </span>
        ))}
      </div>
      {/* Said once, quietly. A toy nobody notices is a waste, and a toy
          with instructions is not a toy — this is the smallest possible
          nudge. */}
      <p className="strings-hint">
        {sfx ? 'Drag across' : 'Drag across — turn effects on to hear it'}
      </p>
    </div>
  );
}
