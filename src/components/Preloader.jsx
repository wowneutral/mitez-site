import { useEffect, useRef, useState } from 'react';
import {
  toggleMusic, toggleSfx, isMusicOn, isSfxOn, subscribe, click, setScene, startAudio,
} from '../lib/sound.js';
import { markEntered, shouldPlayIntro } from '../lib/session.js';
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
 * SOUND IS ON BY DEFAULT, AND SWITCHED HERE. Both controls sit top
 * right, above the way in, reading as on from the first frame — and
 * "Best with sound on" sits under the button. Nothing actually makes a
 * noise until Enter is pressed, because no browser permits it before a
 * gesture, so the sequence is: see that sound is on, see it recommended,
 * choose to press the button anyway. Nobody is ambushed by a site that
 * told them what it was going to do and waited to be let in.
 *
 * Anyone who would rather not can turn either off before entering, and
 * both switches live in the nav afterwards.
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
  // ONCE PER PAGE LOAD, not once per mount.
  //
  // Home is a route, so clicking the logo from another page remounts it
  // — and the intro was running again every time, with the room tone
  // restarting over the pads. Now it plays on a real load of the
  // homepage and never on a navigation to it; the panel sweep already
  // covers that journey, which is what a logo click should feel like.
  const skip = useRef(!shouldPlayIntro());

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
    // THE UNLOCK. This is the only gesture a browser will accept as
    // permission to make noise, so everything audio has to happen from
    // inside this handler. Order matters: unlock first, so the click
    // below is the first thing you hear rather than the first thing
    // that is silently dropped.
    startAudio();
    // The click fires before anything moves, so the sound belongs to the
    // press rather than to the animation that follows it.
    click();
    setEntering(true);

    // THE ROOM TONE GETS TO BE HEARD. This used to call setScene('site')
    // on the same line as startAudio, so the intro's score began and was
    // immediately crossfaded into the pads — the piece written for this
    // screen never actually played on the way in. Holding the change
    // until the overlay is most of the way out means you hear the room
    // tone through the exit, and the pads arrive on the homepage.
    setTimeout(() => setScene('site'), 800);
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


      <div className="intro-way-in">
        <button
          type="button"
          ref={enterRef}
          className="intro-enter"
          onClick={handleEnter}
          disabled={!complete}
        >
          Click to enter
        </button>

        {/* Said plainly, under the way in, where it is read at the moment
            it is actionable. Both switches are already on and sit above
            this — so it is a recommendation about how to listen, not a
            request for permission we have not asked for. */}
        <p className={`intro-phones${snd.music || snd.sfx ? '' : ' is-muted'}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {/* Headband and two cups. Stroked, no fill, so it sits at the
                same visual weight as the type beside it. */}
            <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
            <path d="M4 14h2.2a1 1 0 0 1 1 1v3.2a1 1 0 0 1-1 1H5.4A1.4 1.4 0 0 1 4 17.8V14Z" />
            <path d="M20 14h-2.2a1 1 0 0 0-1 1v3.2a1 1 0 0 0 1 1h.8a1.4 1.4 0 0 0 1.4-1.4V14Z" />
          </svg>
          Best with sound on
        </p>
      </div>

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
