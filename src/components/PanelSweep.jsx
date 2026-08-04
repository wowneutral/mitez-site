import { useEffect, useRef, useState } from 'react';
import { whoosh } from '../lib/sound.js';
import { registerTransition } from '../lib/transition.js';

/**
 * The page transition.
 *
 * Five panels sweep down, the route changes behind them, and they carry
 * on off the bottom of the screen. A curtain that retreats the way it
 * came reads as an interruption; one that keeps going reads as a move.
 *
 * ORDER IS EVERYTHING, and getting it wrong is what made the first
 * version feel broken. It ran off the route change, so the new page was
 * already on screen before the panels arrived — you saw the page, then a
 * wipe over it, then the page again. Now the navigation is handed in as
 * a callback and fired at COVER_MS, the moment the screen is fully
 * covered, so the swap happens where nobody can see it. That is the only
 * frame it should ever happen in: it is also when the scroll position
 * resets and when a lazy chunk is still arriving, the two ugliest
 * moments in any single-page app.
 */
const COVER_MS = 560;
const HOLD_MS = 90;
const CLEAR_MS = 720;

export default function PanelSweep() {
  const [phase, setPhase] = useState('idle'); // idle | cover | clear
  const timers = useRef([]);

  useEffect(() => {
    const run = (action) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      setPhase('cover');
      whoosh();

      timers.current.push(
        setTimeout(() => {
          // Covered. Safe to change the world.
          action?.();
        }, COVER_MS),
      );
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
      <i /><i /><i /><i /><i />
    </div>
  );
}
