import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { whoosh } from '../lib/sound.js';

/**
 * The quick reveal.
 *
 * The full intro is a threshold, and a threshold you cross more than
 * once is just a toll booth. So it runs once per tab, and every
 * navigation after it gets this instead: the same five panels, moving in
 * the same direction, at roughly a third of the length.
 *
 * WHY THE SAME PANELS. Reusing the intro's exact geometry is what turns
 * two animations into one language. Clicking the logo does not play a
 * different effect, it plays a shorter sentence in the same one, so the
 * site feels like a single object rather than a set of pages with
 * transitions bolted between them.
 *
 * WHAT IT HIDES. The panels cover the screen at the moment the route
 * changes, which is also the moment the scroll position resets and a
 * lazy chunk may still be arriving. Those are the two ugliest frames in
 * any single-page app, and this puts a closed curtain in front of both.
 *
 * The sweep passes THROUGH rather than covering and retreating: panels
 * enter from the top, cover, then continue off the bottom. A curtain
 * that leaves the way it came reads as an interruption; one that keeps
 * going reads as a transition.
 */
const COVER_MS = 620;
const HOLD_MS = 120;
const CLEAR_MS = 760;

export default function PanelSweep() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState('idle'); // idle | cover | clear
  const timers = useRef([]);
  const first = useRef(true);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('cover');
    whoosh();
    timers.current.push(setTimeout(() => setPhase('clear'), COVER_MS + HOLD_MS));
    timers.current.push(
      setTimeout(() => setPhase('idle'), COVER_MS + HOLD_MS + CLEAR_MS),
    );
  }

  // Every route change, but never the first render — mounting is not a
  // navigation, and sweeping on load would collide with the intro.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    run();
    return undefined;
  }, [pathname]);

  // The logo dispatches this. It fires even when the logo is clicked on
  // the page it already points at, where React Router reports no change
  // and the effect above would never run — clicking MITEZ from the
  // homepage should still play the reveal, because from the visitor's
  // side they asked for something and deserve to see it happen.
  useEffect(() => {
    const onSweep = () => run();
    window.addEventListener('mitez:sweep', onSweep);
    return () => {
      window.removeEventListener('mitez:sweep', onSweep);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={`sweep is-${phase}`} aria-hidden="true">
      <i /><i /><i /><i /><i />
    </div>
  );
}

/** Fired by the logo. Kept here so the event name has one home. */
export function triggerSweep() {
  window.dispatchEvent(new CustomEvent('mitez:sweep'));
}
