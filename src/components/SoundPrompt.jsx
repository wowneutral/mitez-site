import { useEffect, useState } from 'react';
import { toggle, subscribe, isEnabled } from '../lib/sound.js';

/**
 * "Click to enable sound", in the middle of the page.
 *
 * WHY IT LIVES HERE AND NOT IN THE INTRO. It was inside the loading
 * overlay, which meant it existed for about a second and a half and then
 * dissolved — you could see it, but by the time you reached for it the
 * intro had already done its thing and taken it with it. An offer you
 * cannot accept is worse than no offer.
 *
 * Look at the reference again and it is obvious: their prompt is still
 * sitting in the middle of the screen on the fully loaded homepage, over
 * the hero, after everything has arrived. It is not part of the loader
 * at all. It waits, indefinitely, until you either take it or start
 * scrolling past it.
 *
 * So this is mounted at the app level, above the page and below the
 * intro, and it stays until sound is turned on. Once it is on, it fades
 * out for good — the nav toggle owns the setting from then on, and two
 * controls for one thing on screen at once is clutter.
 *
 * It also disappears once someone scrolls a screen's worth. At that
 * point they have chosen to read rather than to listen, and a floating
 * prompt over the middle of the copy stops being an offer and starts
 * being an obstruction.
 */
export default function SoundPrompt() {
  const [on, setOn] = useState(isEnabled());
  const [scrolledAway, setScrolledAway] = useState(false);

  useEffect(() => subscribe(setOn), []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setScrolledAway(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hidden = on || scrolledAway;

  return (
    <div className={`sound-prompt${hidden ? ' is-hidden' : ''}`}>
      <button type="button" className="sound-prompt-btn" onClick={() => toggle()}>
        Click to enable sound
      </button>
    </div>
  );
}
