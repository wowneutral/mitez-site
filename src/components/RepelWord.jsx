import { useEffect, useRef } from 'react';

/**
 * A word that gets out of the way.
 *
 * Each letter is pushed directly away from the pointer, harder the
 * closer it is, and springs back when you leave. Set large, so it is
 * obviously a thing to play with rather than a heading that has
 * developed a twitch.
 *
 * NOT ON THE LOGO, deliberately. The wordmark in the nav is a
 * navigation control that has to stay exactly where the eye expects it;
 * a logo that runs away from the pointer is a logo that is hard to
 * click. Here it is a full-width block that does nothing else, so
 * moving is the only thing it is for.
 *
 * NEVER READ LAYOUT DURING A POINTER EVENT. The first version of this
 * called getBoundingClientRect on every letter on every pointermove, and
 * the comment here used to claim it did not. Five reads per event is bad
 * on its own — each one forces the browser to compute layout
 * synchronously — but the real cost was the order: it read a letter's
 * rect immediately after writing a transform to its neighbour, so every
 * read invalidated the layout the previous write had just dirtied. Read,
 * write, read, write, forty times a second. That is layout thrashing,
 * and it is the classic way a five-element toy shows up in a profile
 * looking like a 3D scene.
 *
 * The centres are measured once on mount and again on resize, and the
 * pointer handler now only ever writes. Nothing about how it feels
 * changes, because the geometry it needs does not change while the
 * pointer is moving — only the pointer does.
 *
 * Positions are stored in page coordinates (rect + scrollY) rather than
 * viewport coordinates, since a cached viewport rect goes stale the
 * moment the page scrolls, and this sits at the bottom of a long page
 * that is always scrolled when you reach it.
 *
 * The transition is switched off while pushing and back on when
 * releasing: easing a value that is already being updated every event
 * makes it feel like syrup, but easing the return is what makes it
 * spring rather than snap.
 */
export default function RepelWord({ word = 'MITEZ', radius = 170, strength = 58 }) {
  const ref = useRef(null);
  const centres = useRef([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      // Read with no transforms applied, so the cached centre is the
      // letter's resting position rather than wherever it happened to be
      // pushed to when the window was resized.
      const letters = [...el.children];
      letters.forEach((l) => { l.style.transform = ''; });
      centres.current = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        };
      });
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, [word]);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;

    const px = e.clientX + window.scrollX;
    const py = e.clientY + window.scrollY;

    const letters = el.children;
    for (let i = 0; i < letters.length; i += 1) {
      const c = centres.current[i];
      if (!c) continue;

      const dx = c.x - px;
      const dy = c.y - py;
      const d = Math.hypot(dx, dy) || 1;
      const push = d < radius ? (1 - d / radius) * strength : 0;

      const letter = letters[i];
      letter.style.transition = push ? 'none' : '';
      letter.style.transform = push
        ? `translate(${(dx / d) * push}px, ${(dy / d) * push}px)`
        : '';
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const letter of el.children) {
      letter.style.transition = '';
      letter.style.transform = '';
    }
  };

  return (
    <div className="repel-wrap">
      <div
        className="repel"
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={word}
        role="img"
      >
        {[...word].map((c, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${c}-${i}`} aria-hidden="true">{c}</span>
        ))}
      </div>
      <p className="repel-hint">Push it around</p>
    </div>
  );
}
