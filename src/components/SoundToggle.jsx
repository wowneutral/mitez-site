import { useEffect, useState } from 'react';
import {
  toggleMusic,
  toggleSfx,
  isMusicOn,
  isSfxOn,
  subscribe,
  click,
  hover,
} from '../lib/sound.js';

/**
 * The pair, in the nav.
 *
 * Two switches rather than one, matching the intro: the score and the
 * interface sounds do opposite jobs and people want them in different
 * combinations. Stating both as words — "Music on", "Effects off" —
 * rather than using a speaker icon, because a crossed-out speaker reads
 * equally as "sound is muted" and "click to mute", and this is the one
 * control where guessing wrong makes noise in a quiet room.
 *
 * Compact by necessity: the nav already carries five links. The music
 * control keeps its three animating bars, since it also works as an
 * indicator from across the page; effects get a single dot.
 */
export default function SoundToggle() {
  const [snd, setSnd] = useState({ music: isMusicOn(), sfx: isSfxOn() });

  useEffect(() => subscribe(setSnd), []);

  return (
    <span className="sound-pair">
      <button
        type="button"
        className={`sound-toggle${snd.music ? ' is-on' : ''}`}
        onClick={() => {
          toggleMusic();
          click();
        }}
        onPointerEnter={hover}
        aria-pressed={snd.music}
        aria-label={snd.music ? 'Turn music off' : 'Turn music on'}
      >
        <span className="sound-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="sound-label">Music</span>
      </button>

      <button
        type="button"
        className={`sound-toggle${snd.sfx ? ' is-on' : ''}`}
        onClick={() => toggleSfx()}
        onPointerEnter={hover}
        aria-pressed={snd.sfx}
        aria-label={snd.sfx ? 'Turn effects off' : 'Turn effects on'}
      >
        <span className="sound-dot" aria-hidden="true" />
        <span className="sound-label">Effects</span>
      </button>
    </span>
  );
}
