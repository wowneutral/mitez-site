import { useEffect, useRef, useState } from 'react';
import {
  toggleMusic, toggleSfx, isMusicOn, isSfxOn, subscribe, click, setScene,
} from '../lib/sound.js';
import { markEntered } from '../lib/session.js';
import { lockScroll, unlockScroll } from '../lib/smoothScroll.js';

/**
 * The intro. "Baseline", the version we picked.
 *
 * THE LAYOUT. Everything structural sits on one row along the bottom of
 * the screen — wordmark, a hairline that fills, a percentage — with the
 * way in placed centre and nothing else on it. That row
 * is what makes it feel composed rather than assembled: three things
 * sharing a baseline read as one object, where the same three floating
 * in separate corners read as leftovers. It is also the layout
 * Immersive Garden actually uses, which is what we were chasing all
 * along.
 *
 * NO STATEMENT ON IT. An earlier pass set the tagline large on the left,
 * which was filler invented for a mockup rather than copy from the site,
 * and it collided with the hero headline arriving two seconds later. The
 * reference does not do it either: their loading state carries the logo,
 * the line and the sound offer, and nothing else. The words belong to
 * the page, not to the door.
 *
 * WHAT IT ASKS OF YOU. Nothing until it is loaded. Then a small centred
 * "Click to enter", and only then does the site open. That click is
 * doing real work beyond ceremony: browsers refuse to start audio
 * without a user gesture, so it is the moment the score can legally
 * begin.
 *
 * SOUND IS OFF UNTIL ASKED, AND THE ASKING HAPPENS HERE. The toggle sits
 * top right, before the threshold, so the choice is made on a quiet
 * screen rather than discovered after something has already started
 * playing. Default off, always: someone opening this in a classroom or
 * a library should never have to lunge for a mute button. Entering
 * without touching it gets a silent site, and the nav toggle still owns
 * the setting afterwards.
 *
 * The earlier attempts failed for one reason worth remembering — they
 * offered sound inside an overlay that dissolved on its own after a
 * second and a half, so the offer was gone before it could be taken. A
 * choice needs something to hold still while it is being made. The
 * enter button is that.
 */
const MIN_MS = 1500;
const MAX_MS = 9000;
const FADE_MS = 900;


export default function Preloader({ ready, onEnter }) {
  // EVERY LOAD, not once per tab.
  //
  // It was gated on hasEntered() for a while, on the reasoning that a
  // threshold you cross on every reload is a toll booth. That reasoning
  // is sound and it was still the wrong call: the intro is the piece
  // Seth has iterated on hardest, it is the first thing anyone sees, and
  // hiding it from the person building the site — and from anyone who
  // reloads — to save them a second and a half is a trade nobody asked
  // for.
  //
  // MIN_MS keeps it short, and it is the only ceremony on the site.
  // hasEntered() is left in session.js: if a returning-visitor skip ever
  // earns its place, it is one line away.
  const skip = useRef(false);

  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snd, setSnd] = useState({ music: isMusicOn(), sfx: isSfxOn() });
  const [entering, setEntering] = useState(false);
  const [unmounted, setUnmounted] = useState(skip.current);
  const enterRef = useRef(null);

  useEffect(() => subscribe(setSnd), []);

  // Already crossed in this tab: tell the hero to play its entrance and
  // get out of the way.
  useEffect(() => {
    if (!skip.current) return;
    setScene('site');
    onEnter?.();
  }, [onEnter]);

  useEffect(() => {
    if (skip.current) return undefined;
    const a = setTimeout(() => setMinElapsed(true), MIN_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const loaded = (ready && minElapsed) || timedOut;

  // Real progress: eases toward 90 while the Spline scene streams, then
  // runs hard to a genuine 100. It must be seen to arrive — an indicator
  // that stops short and vanishes fails at the one thing it promised.
  useEffect(() => {
    if (skip.current) return undefined;
    let frame;
    const tick = () => {
      setProgress((p) => {
        const ceiling = loaded ? 1 : 0.9;
        const next = p + (ceiling - p) * (loaded ? 0.15 : 0.03);
        return next > 0.995 ? 1 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loaded]);

  const complete = progress >= 1;

  useEffect(() => {
    if (complete && !entering) enterRef.current?.focus({ preventScroll: true });
  }, [complete, entering]);

  useEffect(() => {
    if (!entering) return undefined;
    markEntered();
    onEnter?.();
    const t = setTimeout(() => setUnmounted(true), FADE_MS);
    return () => clearTimeout(t);
  }, [entering, onEnter]);

  // body { overflow: hidden } does nothing on this site: Lenis drives the
  // scroll position itself on an animation loop and carries on
  // regardless, so the page slid around behind the fixed overlay. Lenis
  // has to be told to stop.
  useEffect(() => {
    if (skip.current || entering) return undefined;
    lockScroll();
    return unlockScroll;
  }, [entering]);

  function handleEnter() {
    // The click fires before anything moves, so the sound belongs to the
    // press rather than to the animation that follows it.
    click();
    // Room tone gives way to the pads. Two seconds of crossfade, started
    // now, so the change happens under the panels instead of at them.
    setScene('site');
    setEntering(true);
  }

  if (unmounted) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      className={`intro${complete ? ' is-ready' : ''}${entering ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label="Enter MITEZ"
    >
      {/* Two controls, because they are two different choices. The score
          is the room; the effects are things happening in it. Someone
          might want the clicks and no music, or music and nothing
          snapping at them, and one switch for both forces a choice
          nobody actually holds.

          Toggling is itself the gesture a browser needs before it will
          allow audio, so either one can start the sound. */}
      <div className="intro-audio">
        <button
          type="button"
          className={`intro-snd${snd.music ? ' is-on' : ''}`}
          onClick={() => { toggleMusic(); click(); }}
          aria-pressed={snd.music}
        >
          <span className="intro-snd-bars" aria-hidden="true"><i /><i /><i /></span>
          Music {snd.music ? 'on' : 'off'}
        </button>

        <button
          type="button"
          className={`intro-snd${snd.sfx ? ' is-on' : ''}`}
          onClick={() => toggleSfx()}
          aria-pressed={snd.sfx}
        >
          <span className="intro-snd-dot" aria-hidden="true" />
          Effects {snd.sfx ? 'on' : 'off'}
        </button>
      </div>


      <button
        type="button"
        ref={enterRef}
        className="intro-enter"
        onClick={handleEnter}
        disabled={!complete}
      >
        Click to enter
      </button>

      {/* The row. Everything on one baseline. */}
      <div className="intro-row">
        <span className="intro-mark">MITEZ</span>
        <span className="intro-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="intro-pct" aria-hidden="true">{pct}</span>
      </div>
    </div>
  );
}
