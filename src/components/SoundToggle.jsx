import { useEffect, useState } from 'react';
import { toggle, subscribe, isEnabled, play } from '../lib/sound.js';

/**
 * Off / On, sitting in the nav.
 *
 * Immersive Garden puts exactly this at the end of its page and it is
 * the right pattern: state the two options and show which one is live,
 * rather than a speaker icon with a slash whose meaning is ambiguous
 * (is that "sound is muted" or "click to mute"?).
 *
 * The three bars animate only while sound is on, so the control also
 * works as an indicator from across the page.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(isEnabled());

  useEffect(() => subscribe(setOn), []);

  return (
    <button
      type="button"
      className={`sound-toggle${on ? ' is-on' : ''}`}
      onClick={() => toggle()}
      onPointerEnter={() => play('hover')}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-label">Sound {on ? 'on' : 'off'}</span>
    </button>
  );
}
