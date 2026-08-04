import { useEffect, useRef, useState } from 'react';
import { whoosh } from '../lib/sound.js';
import { registerTransition } from '../lib/transition.js';

/**
 * The page transition.
 *
 * WHAT CHANGED AND WHY. This was five columns sweeping down one after
 * another, which took about 1.4 seconds and read as exactly what it was:
 * a swish across the whole screen. Slow enough to be in the way of
 * someone who just wanted the next page, and generic enough that it
 * could have been on any site.
 *
 * It is now one panel with a diagonal leading edge, in and out in a bit
 * over half a second.
 *
 * THE DIAGONAL is the whole idea, and it costs nothing. The panel is
 * oversized and rotated a few degrees, so what crosses the screen is a
 * slanted edge rather than a flat horizontal line. A flat edge reads as
 * a blind coming down; a slanted one reads as something passing. Since
 * the rotation is baked into the element, the animation itself is still
 * only a translate — pure compositor work, no repaint, which is how it
 * can be this quick without tearing.
 *
 * IT PASSES THROUGH rather than covering and retreating: in from below,
 * across, and out of the top. A curtain that leaves the way it came is
 * an interruption; one that keeps going is a move.
 *
 * The route still changes at the covered frame, which is the point of
 * the whole thing — that frame also hides the scroll reset and any lazy
 * chunk still arriving, the two ugliest moments in a single-page app.
 */
const COVER_MS = 360;
const HOLD_MS = 60;
const CLEAR_MS = 420;

export default function PanelSweep() {
  const [phase, setPhase] = useState('idle'); // idle | cover | clear
  const timers = useRef([]);

  useEffect(() => {
    const run = (action) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      setPhase('cover');
      whoosh();

      // Covered: safe to change the world.
      timers.current.push(setTimeout(() => action?.(), COVER_MS));
      timers.current.push(setTimeout(() => setPhase('clear'), COVER_MS + HOLD_MS));
      timers.current.push(
        setTimeout(() => setPhase('idle'), COVER_MS + HOLD_MS + CLEAR_MS),
      );
    };

    const unregister = registerTransition(run);
    return () => {
      unregister();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={`sweep is-${phase}`} aria-hidden="true">
      <i />
    </div>
  );
}
