import { useRef } from 'react';

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
 * THE CHEAP PART. Five elements, no frame loop, no state — the pointer
 * event writes a transform and the browser does the rest. Rects are read
 * once per pointer event rather than per letter per frame, which is the
 * difference between this and the version that would show up in a
 * profile.
 *
 * The transition is switched off while pushing and back on when
 * releasing: easing a value that is already being updated every event
 * makes it feel like syrup, but easing the return is what makes it
 * spring rather than snap.
 */
export default function RepelWord({ word = 'MITEZ', radius = 170, strength = 58 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;

    for (const letter of el.children) {
      const r = letter.getBoundingClientRect();
      const dx = r.left + r.width / 2 - e.clientX;
      const dy = r.top + r.height / 2 - e.clientY;
      const d = Math.hypot(dx, dy) || 1;
      const push = d < radius ? (1 - d / radius) * strength : 0;

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
