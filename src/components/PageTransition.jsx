import { useEffect, useRef, useState } from 'react';
import { whoosh } from '../lib/sound.js';
import { registerTransition } from '../lib/transition.js';

/**
 * The page transition, with no panel.
 *
 * The content itself leaves and the next one arrives. Nothing covers the
 * screen, which is why it is the fastest of the options and why it has
 * to be the most carefully built: with a curtain, any amount of jank
 * during the swap is hidden. Here it is the whole effect.
 *
 * FOUR THINGS MAKE IT SMOOTH RATHER THAN SNAPPY.
 *
 *  1. Only opacity and transform are animated, both compositor
 *     properties, so no layout or paint happens during either half.
 *  2. The route changes at the invisible frame — after the outgoing
 *     content has faded, before the incoming one starts. The scroll
 *     reset lands in the same gap.
 *  3. Out is fast (200ms) and in is slow (520ms). Leaving should be
 *     brisk because nobody wants to watch a page they have finished
 *     with; arriving should be unhurried. Equal halves feel mechanical.
 *  4. The incoming page starts 10px low, not 30. Large travel plus no
 *     covering panel reads as the layout being thrown around.
 *
 * IT NEVER ANIMATES ON FIRST MOUNT, and that is load-bearing rather than
 * tidiness: the homepage's intro overlay lives inside this subtree and
 * is position:fixed. An ancestor with a transform becomes the containing
 * block for fixed descendants, which would tear the overlay off the
 * viewport and scroll it with the page. Transitions only ever run from a
 * click, which cannot happen while the intro is up.
 */
const OUT_MS = 200;
const IN_MS = 520;

export default function PageTransition({ children }) {
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);

  useEffect(() => {
    const run = (action) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      setPhase('out');
      whoosh();

      timers.current.push(
        setTimeout(() => {
          action?.();
          setPhase('in');
        }, OUT_MS),
      );
      timers.current.push(setTimeout(() => setPhase('idle'), OUT_MS + IN_MS));
    };

    const unregister = registerTransition(run);
    return () => {
      unregister();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return <div className={`route-fx is-${phase}`}>{children}</div>;
}
