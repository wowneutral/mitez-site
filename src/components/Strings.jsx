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
  const [sfx, setSfx] = useState(isSfxOn);

  useEffect(() => subscribe((n) => setSfx(n.sfx)), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;

    const strings = [...el.querySelectorAll('.string')];
    let prevX = null;
    let rect = null;

    // Cached, and refreshed on resize rather than on every move: reading
    // a rect during pointermove forces layout, which is the difference
    // between a toy and a stutter.
    const measure = () => { rect = el.getBoundingClientRect(); };
    measure();

    const pluck = (i) => {
      const s = strings[i];
      if (!s) return;
      s.classList.remove('is-struck');
      void s.offsetWidth; // commit the removal so the animation restarts
      s.classList.add('is-struck');
      pluckString(NOTES[i]);
    };

    const onMove = (e) => {
      if (!rect) return;
      const x = e.clientX - rect.left;

      if (prevX === null) { prevX = x; return; }
      // Ignore the jitter of a resting hand. Without this the pointer
      // trembles across a line and retriggers it.
      if (Math.abs(x - prevX) < 2) return;

      const lo = Math.min(prevX, x);
      const hi = Math.max(prevX, x);
      const w = rect.width / strings.length;

      // A string is plucked when the pointer CROSSES it — when the line
      // itself falls between where the pointer was and where it now is.
      //
      // The previous version fired when the pointer entered a column,
      // which is a different and much twitchier thing: a column is a
      // wide invisible box, so notes fired while nothing visible had
      // been touched, and a small movement near a boundary rang the
      // same note repeatedly. Now the trigger is the line you can see,
      // and moving between two lines is silent — which is what a string
      // does.
      //
      // Sweeping fast crosses several at once and plays all of them, in
      // the order they were crossed, which is exactly right.
      const first = Math.ceil((lo - w / 2) / w);
      const last = Math.floor((hi - w / 2) / w);
      const forward = x > prevX;

      const hits = [];
      for (let i = Math.max(0, first); i <= Math.min(strings.length - 1, last); i += 1) hits.push(i);
      if (!forward) hits.reverse();
      hits.forEach(pluck);

      prevX = x;
    };

    const onLeave = () => { prevX = null; };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
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
