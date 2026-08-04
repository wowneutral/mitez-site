import { useEffect, useRef, useState } from 'react';
import {
  toggleMusic,
  toggleSfx,
  isMusicOn,
  isSfxOn,
  subscribe,
  click,
  hover,
  setTrack,
  currentTrack,
  TRACKS,
} from '../lib/sound.js';

/**
 * The audio controls in the nav: music, the track list, effects.
 *
 * THE MUSIC CONTROL IS TWO THINGS IN ONE PLACE. Clicking it turns the
 * score off and on. Hovering it opens the list of scores, with the one
 * currently playing marked and named. That pairing is deliberate: the
 * common action (silence) stays a single click, and the rarer one
 * (choosing a different piece) is one hover away rather than buried in a
 * settings panel or requiring nine clicks through a cycle.
 *
 * It replaced a button that cycled to the next track. Cycling is fine
 * for four; with nine it means clicking eight times to hear the one you
 * wanted, with two seconds of crossfade each time, and never being able
 * to see what the options are.
 *
 * OPENING IT: hover for a pointer, focus for a keyboard, tap for touch —
 * where there is no hover at all, so the label toggles the list instead.
 * Closing: leaving, Escape, or choosing something.
 */
export default function SoundToggle() {
  const [snd, setSnd] = useState({ music: isMusicOn(), sfx: isSfxOn() });
  const [tr, setTr] = useState(currentTrack);
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const closeTimer = useRef(0);

  useEffect(() => subscribe((next) => {
    setSnd(next);
    setTr(currentTrack());
  }), []);

  // Escape closes it, which is the one keyboard convention a menu cannot
  // do without.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  // A short grace period on the way out. Without it, the gap between the
  // control and the list is enough to close the menu while the pointer
  // is travelling towards it.
  const hold = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const release = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  const choose = (id) => {
    setTrack(id);
    setTr(currentTrack());
    click();
    // Picking a score while the music is off is a request to hear it.
    if (!isMusicOn()) toggleMusic();
    setOpen(false);
  };

  return (
    <span
      className={`sound-pair${open ? ' is-open' : ''}`}
      ref={wrap}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') hold(); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') release(); }}
      onFocus={hold}
      onBlur={release}
    >
      <span className="sound-music">
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
          {/* The name of what is playing, not the word "Music" — the
              bars already say what this controls, and the label is more
              useful telling you which of the nine you are hearing. */}
          <span className="sound-label">{snd.music ? tr.label : 'Music off'}</span>
        </button>

        {/* Touch has no hover, so the caret is the way in. It is also a
            visible affordance that a list exists at all, which a
            hover-only menu never advertises. */}
        <button
          type="button"
          className="sound-caret"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Choose a track"
        >
          <svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg>
        </button>

        <ul className="track-menu" role="menu" aria-label="Music">
          {TRACKS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={t.id === tr.id}
                className={`track-item${t.id === tr.id ? ' is-current' : ''}`}
                onClick={() => choose(t.id)}
                onPointerEnter={hover}
              >
                <span className="track-dot" aria-hidden="true" />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </span>

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
