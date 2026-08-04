/**
 * Sound: two scores, two independent switches, one crossfade.
 *
 * WHAT PLAYS WHERE
 *   intro — "room tone": filtered noise moving slowly with a high
 *           shimmer that surfaces every so often. Barely music. It is
 *           presence rather than melody, which is what a held screen
 *           wants: something to occupy the room while nothing is
 *           happening yet.
 *   site  — "pads": four chords in A minor, eight seconds each,
 *           crossfaded so no note ever visibly starts.
 *
 * They are crossfaded rather than cut. Room tone falls away over two
 * seconds while the first chord is already three seconds into its
 * attack, so the change happens underneath the panels rather than at
 * them. A cut between two ambiences is far more noticeable than either
 * ambience — the ear tracks change, not content.
 *
 * MUSIC AND EFFECTS ARE SEPARATE, and that is a real distinction rather
 * than a settings-page convention. They do opposite jobs: the score is
 * the room, and the effects are things happening in it. Someone might
 * want the clicks and the page sweeps and no music at all, or music
 * while they read and nothing snapping at them. One switch for both
 * forces a choice nobody actually holds.
 *
 * The effects bus sits ABOVE the music, not under it, because things
 * happening should be louder than the room they happen in. Both feed a
 * generated convolution reverb, which is where the echo comes from.
 *
 * Everything is synthesised at the moment it plays. No audio files, no
 * library, nothing downloaded.
 */

import { readSound, writeSound } from './session.js';

let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let convolver = null;

// ON BY DEFAULT — but read this before changing it.
//
// No browser will start audio before a user gesture, so "on by default"
// cannot mean "playing on arrival"; nothing is allowed to make a sound
// until someone clicks something. What it means here is ARMED: both
// switches read as on from the first frame, the intro says the site is
// best with sound, and the Enter click is the gesture that unlocks the
// context and starts everything at once.
//
// That is also why this is not the reckless version of the setting. The
// only way in is a button, and the state of both switches is visible
// above it before it is pressed — so nobody is ambushed, they are told
// what will happen and then choose to do it.
let musicOn = true;
let sfxOn = true;

// Whether a gesture has actually unlocked the audio context yet. Before
// that, the switches are intent only.
let started = false;
let scene = 'intro';
let playing = null; // { name, gain, stop() }

const listeners = new Set();

// The score is the room: present, never in front. The effects sit over
// it. Both numbers were arrived at by ear rather than by rule.
const MUSIC_LEVEL = 0.2;
const SFX_LEVEL = 1.6;
const DUCK_LEVEL = 0.07;

const CROSSFADE_S = 2.2;

/* ------------------------------------------------------------------ */

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0; // raised by startAudio once a gesture unlocks it
  musicBus.connect(master);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0; // ditto
  sfxBus.connect(master);

  // Reverb from an impulse of exponentially decaying noise. This is the
  // echo — it is what stops every sound reading as a synth in a vacuum,
  // and it is doing more for the "cinematic" quality than any of the
  // individual voices are.
  convolver = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 3.4);
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c += 1) {
    const channel = impulse.getChannelData(c);
    for (let i = 0; i < len; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  convolver.buffer = impulse;

  const wet = ctx.createGain();
  wet.gain.value = 0.5;
  convolver.connect(wet);
  wet.connect(master);

  return ctx;
}

function notify() {
  listeners.forEach((fn) => fn({ music: musicOn, sfx: sfxOn }));
}

/* ---------------------------- scores ------------------------------ */

/** Room tone. Filtered noise, moving slowly, plus an occasional shimmer. */
function startRoomTone() {
  const now = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.linearRampToValueAtTime(1, now + 4);
  out.connect(musicBus);
  out.connect(convolver);

  const len = Math.floor(ctx.sampleRate * 4);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 420;
  filter.Q.value = 1.6;

  // A very slow sweep across the noise. Without it this is a hiss; with
  // it, it breathes.
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.035;
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const body = ctx.createGain();
  body.gain.value = 0.16;

  src.connect(filter);
  filter.connect(body);
  body.connect(out);

  src.start(now);
  lfo.start(now);

  const timers = [];
  const shimmer = () => {
    const n = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1046.5 * (Math.random() > 0.5 ? 1 : 1.5);
    g.gain.setValueAtTime(0.0001, n);
    g.gain.linearRampToValueAtTime(0.012, n + 2);
    g.gain.exponentialRampToValueAtTime(0.0001, n + 7);
    osc.connect(g);
    g.connect(out);
    osc.start(n);
    osc.stop(n + 7.2);
    timers.push(setTimeout(shimmer, 6000 + Math.random() * 8000));
  };
  timers.push(setTimeout(shimmer, 3000));

  return {
    name: 'room',
    gain: out,
    stop() {
      timers.forEach(clearTimeout);
      try {
        src.stop();
        lfo.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}

const CHORDS = [
  [110.0, 164.81, 261.63, 329.63], // Am add9-ish
  [87.31, 130.81, 246.94, 329.63], // Fmaj7
  [130.81, 196.0, 246.94, 329.63], // Cmaj7
  [98.0, 146.83, 246.94, 293.66], // Gsus
];
const CHORD_MS = 8000;

/** Pads. Two detuned triangles per note, through a lowpass. */
function startPads() {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
  out.connect(musicBus);
  out.connect(convolver);

  let index = 0;
  const timers = [];

  const voice = (freq) => {
    const now = ctx.currentTime;
    const attack = 3.2;
    const hold = CHORD_MS / 1000;
    const release = 4.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + attack);
    gain.gain.setValueAtTime(0.03, now + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + hold + release);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.4;

    // Identical pitches are a test tone. A few cents apart, they beat
    // against each other and read as an instrument with a body.
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = 'triangle';
    b.type = 'triangle';
    a.frequency.value = freq;
    b.frequency.value = freq * 1.0023;

    a.connect(filter);
    b.connect(filter);
    filter.connect(gain);
    gain.connect(out);

    a.start(now);
    b.start(now);
    a.stop(now + hold + release + 0.2);
    b.stop(now + hold + release + 0.2);
  };

  const chord = () => {
    const notes = CHORDS[index % CHORDS.length];
    index += 1;
    // Voices enter fractionally apart. Together they are a block of
    // sound; staggered they are a chord.
    notes.forEach((f, i) => timers.push(setTimeout(() => voice(f), i * 260)));
  };

  chord();
  const loop = setInterval(chord, CHORD_MS - 1200);

  return {
    name: 'pads',
    gain: out,
    stop() {
      clearInterval(loop);
      timers.forEach(clearTimeout);
    },
  };
}

function build(name) {
  return name === 'pads' ? startPads() : startRoomTone();
}

/**
 * Swap scores without a seam. The outgoing one falls away over two
 * seconds while the incoming one is already rising, so there is never a
 * moment of silence and never a moment of both at full strength.
 */
function crossfadeTo(name) {
  if (!ctx || !musicOn) return;
  if (playing && playing.name === name) return;

  const outgoing = playing;
  playing = build(name);

  if (outgoing) {
    const now = ctx.currentTime;
    outgoing.gain.gain.cancelScheduledValues(now);
    outgoing.gain.gain.setValueAtTime(outgoing.gain.gain.value, now);
    outgoing.gain.gain.linearRampToValueAtTime(0.0001, now + CROSSFADE_S);
    setTimeout(() => outgoing.stop(), CROSSFADE_S * 1000 + 200);
  }
}

/**
 * Which score should be playing. Called with 'site' when the visitor
 * crosses the intro; if music is off it is remembered, so turning music
 * on later starts the right one.
 */
export function setScene(next) {
  scene = next;
  if (musicOn) crossfadeTo(next === 'site' ? 'pads' : 'room');
}

/* ---------------------------- effects ----------------------------- */

function duck() {
  if (!ctx || !musicBus || !musicOn) return;
  const now = ctx.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(DUCK_LEVEL, now + 0.06);
  musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + 1.2);
}

/** A decision. Low, with a small downward glide so it settles. */
export function click() {
  if (!sfxOn || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(196, now);
  osc.frequency.exponentialRampToValueAtTime(174.61, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  osc.connect(gain);
  gain.connect(sfxBus);
  gain.connect(convolver);
  osc.start(now);
  osc.stop(now + 0.45);
  duck();
}

/** Pointer entering a control. Low enough to sit under the music. */
export function hover() {
  if (!sfxOn || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 392;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.055, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  osc.connect(gain);
  gain.connect(sfxBus);
  osc.start(now);
  osc.stop(now + 0.15);
}

/** The page sweep. Noise falling from 1.8kHz to 180Hz: something passing. */
export function whoosh() {
  if (!sfxOn || !ctx) return;
  const now = ctx.currentTime;
  const dur = 1.1;

  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.13, now + 0.14);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(sfxBus);
  gain.connect(convolver);
  src.start(now);
  src.stop(now + dur);
  duck();
}

/* ---------------------------- switches ---------------------------- */

export function isMusicOn() {
  return musicOn;
}

export function isSfxOn() {
  return sfxOn;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function toggleMusic() {
  musicOn = !musicOn;

  // Pressed on the intro, before anything has unlocked audio: record the
  // choice and stop. startAudio() applies it on the way in.
  if (!started) {
    writeSound({ music: musicOn, sfx: sfxOn });
    notify();
    return musicOn;
  }

  const c = ensureContext();
  if (!c) return musicOn;
  if (c.state === 'suspended') c.resume();
  const now = c.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);

  if (musicOn) {
    // Six seconds to full. The music should seem to have been playing
    // before it was switched on.
    musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + 6);
    crossfadeTo(scene === 'site' ? 'pads' : 'room');
  } else {
    musicBus.gain.linearRampToValueAtTime(0, now + 1.6);
    const stopping = playing;
    playing = null;
    if (stopping) setTimeout(() => stopping.stop(), 1700);
  }

  writeSound({ music: musicOn, sfx: sfxOn });
  notify();
  return musicOn;
}

export function toggleSfx() {
  sfxOn = !sfxOn;

  if (!started) {
    writeSound({ music: musicOn, sfx: sfxOn });
    notify();
    return sfxOn;
  }

  const c = ensureContext();
  if (!c) return sfxOn;
  if (c.state === 'suspended') c.resume();
  const now = c.currentTime;
  sfxBus.gain.cancelScheduledValues(now);
  sfxBus.gain.setValueAtTime(sfxBus.gain.value, now);
  sfxBus.gain.linearRampToValueAtTime(sfxOn ? SFX_LEVEL : 0, now + 0.25);

  // Turning effects on demonstrates them immediately. Turning them off
  // does not get a farewell click, which would be an odd thing to hear
  // from a control whose job is to stop making noise.
  if (sfxOn) setTimeout(click, 60);

  writeSound({ music: musicOn, sfx: sfxOn });
  notify();
  return sfxOn;
}

/**
 * Unlock audio. Must be called from inside a user gesture handler —
 * the Enter click, or the first interaction after a reload.
 *
 * This is the moment both switches stop being intent and start being
 * sound. Whatever they were set to on the intro is what begins here, so
 * pressing Enter with both on starts the room tone and arms the effects
 * in the same instant.
 */
export function startAudio() {
  if (started) return;
  const c = ensureContext();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  started = true;

  const now = c.currentTime;

  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(0.0001, now);
  sfxBus.gain.cancelScheduledValues(now);
  sfxBus.gain.setValueAtTime(sfxOn ? SFX_LEVEL : 0, now);

  if (musicOn) {
    // Six seconds to full, so the score seems to have been playing
    // before you arrived rather than starting when you knocked.
    musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + 6);
    crossfadeTo(scene === 'site' ? 'pads' : 'room');
  }
}

/**
 * Bring sound back after a reload.
 *
 * A refresh destroys the audio context, and no browser lets a fresh page
 * start audio unprompted, so this cannot be literal. What it can do:
 * if this tab had sound on, wait silently and resume on whatever the
 * visitor does next — usually a scroll, a second or two in, with
 * nothing to click and no second intro.
 */
export function resumeIfPreviouslyOn() {
  const saved = readSound();
  if (!saved.music && !saved.sfx) {
    musicOn = false;
    sfxOn = false;
    return () => {};
  }

  musicOn = saved.music;
  sfxOn = saved.sfx;

  // TRY IMMEDIATELY FIRST.
  //
  // Refreshing a page that is not the homepage was leaving the site
  // silent: there is no intro there, so there was no Enter click, and
  // the only path back to sound was a gesture listener nobody knew about
  // — you had to click something before the music came back.
  //
  // Chrome and Edge keep a per-origin autoplay score, so a visitor who
  // has already clicked around this site will usually be allowed to
  // resume a context without a fresh gesture. Safari and Firefox will
  // not. So: attempt it, and see whether it actually took.
  const c = ensureContext();
  if (c) {
    const attempt = c.resume?.();
    Promise.resolve(attempt)
      .then(() => {
        if (c.state === 'running') startAudio();
      })
      .catch(() => {
        /* not permitted — the listeners below cover it */
      });
  }

  // The fallback, for the browsers that refused. First scroll, click or
  // key brings it back, which in practice is a second or two later and
  // costs the visitor nothing.
  const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  const start = () => {
    events.forEach((e) => window.removeEventListener(e, start));
    startAudio();
  };
  events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
  return () => events.forEach((e) => window.removeEventListener(e, start));
}
