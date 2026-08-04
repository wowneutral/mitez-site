import { useEffect, useRef } from 'react';

/**
 * A ring that expands from wherever you click. Site-wide.
 *
 * NO CUSTOM CURSOR. Replacing the pointer is the usual way sites do
 * this, and it is a bad trade: you lose the arrow that becomes a hand
 * over links and an I-beam over text, which is real information people
 * read without noticing. This adds a response to the click and leaves
 * the cursor exactly as the operating system drew it.
 *
 * WHY IT COSTS NOTHING. One element per click, removed when its
 * animation ends, and the animation is CSS the browser owns — no frame
 * loop, no state, no re-render. The layer is pointer-events: none, so
 * nothing it draws can ever intercept a click meant for the page.
 *
 * Deliberately silent. There is already a note on .btn clicks; adding a
 * second sound to every click anywhere would double up on the controls
 * that matter and put noise on the ones that do not.
 */
export default function ClickRipple() {
  const layer = useRef(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const onDown = (e) => {
      // Primary button only. A right-click is opening a menu, and a
      // ripple under a context menu is just litter.
      if (e.button !== 0) return;

      const ring = document.createElement('span');
      ring.className = 'ripple-ring';
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      el.appendChild(ring);

      // Removed by its own animation ending rather than by a timer, so
      // the two can never disagree about how long it lasts.
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    };

    document.addEventListener('pointerdown', onDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  return <div className="ripple-layer" ref={layer} aria-hidden="true" />;
}
