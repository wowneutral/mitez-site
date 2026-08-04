/**
 * A generative ambient score, synthesised in the browser.
 *
 * THE PREVIOUS VERSION WAS WRONG and it is worth writing down why, so it
 * does not get rebuilt. It was a set of UI sound effects: a tick on every
 * hover, a note on every heading. That is interface feedback, and
 * interface feedback on a page you scroll continuously turns into a
 * rattle — a high tick every time the pointer crosses a link is actively
 * irritating, and it makes the page feel cheap rather than considered.
 *
 * What the studio sites actually do is play MUSIC. A slow, quiet,
 * unresolved chord bed that sits under everything and never reacts to
 * anything. It has no relationship to what you click. Its whole job is to
 * make the room feel occupied.
 *
 * So: no hover sound, no per-section sound. One chord progression that
 * plays forever without repeating exactly, and one soft note on a real
 * click, because a click is a decision and deserves acknowledgement.
 *
 * HOW IT IS BUILT
 * Four chords in A minor, each held eight seconds and crossfaded rather
 * than cut, so there is no attack to notice. Every note is two detuned
 * triangle waves through a heavy lowpass, then a plate-ish reverb built
 * from generated noise. Voices are picked so the top note moves by a
 * step or stays put between chords, which is why it sounds composed
 * rather than random.
 *
 * Nothing is downloaded: no audio files, no library. The whole score is
 * about a dozen oscillators over its lifetime.
 *
 * The preference is per session and deliberately not persisted. The
 * Privacy Policy says this site stores nothing about you, and quietly
 * writing to localStorage would make that untrue for a convenience
 * nobody asked for.
 */

import { soundWasOn, rememberSound } from './session.js';

let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let wet = null;
let scheduler = null;
let chordIndex = 0;
let enabled = false;
const listeners = new Set();

// A minor, unresolved on purpose. It never lands on a tonic chord in
// root position, so the ear keeps waiting and the loop point disappears.
// Frequencies are held directly rather than computed from note names —
// fewer moving parts, and the exact tuning is part of the sound.
const CHORDS = [
  [110.0, 164.81, 261.63, 329.63], // Am add9-ish
  [87.31, 130.81, 246.94, 329.63], // Fmaj7
  [130.81, 196.0, 246.94, 329.63], // Cmaj7
  [98.0, 146.83, 246.94, 293.66], // Gsus
];

const CHORD_MS = 8000;

// The score was too loud, which is a specific failure rather than a
// preference: ambient music that you actively notice has stopped being
// atmosphere and started being content, and it competes with the thing
// the visitor came to read. This sits it under everything.
const MUSIC_LEVEL = 0.2;
const DUCK_LEVEL = 0.07;

/**
 * Pull the score down for a moment so an interface sound can be heard
 * over it, then bring it back. This is what broadcast does under a voice
 * and it is the reason the click reads as a response rather than as
 * another layer of noise. The recovery is slow (1.2s) so the music
 * swells back rather than snapping.
 */
function duck() {
  if (!ctx || !musicBus) return;
  const now = ctx.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(DUCK_LEVEL, now + 0.06);
  musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + 1.2);
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Two buses, because a single output makes the score and the interface
  // fight each other. The music sat at the same level as the click, so
  // the click had nowhere to be heard from — it was not too quiet, it was
  // buried. Splitting them means the score can be pulled down for a
  // moment whenever the interface needs to say something.
  musicBus = ctx.createGain();
  musicBus.gain.value = MUSIC_LEVEL;
  musicBus.connect(master);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 1.6;
  sfxBus.connect(master);

  // Reverb from a generated impulse: exponentially decaying noise. This
  // is what stops the pad sounding like a synth in a vacuum — the tail
  // is most of why it reads as "music" rather than "a tone".
  const convolver = ctx.createConvolver();
  const len = ctx.sampleRate * 3.2;
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c += 1) {
    const channel = impulse.getChannelData(c);
    for (let i = 0; i < len; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  convolver.buffer = impulse;

  wet = ctx.createGain();
  wet.gain.value = 0.5;
  convolver.connect(wet);
  wet.connect(master);

  ctx.__convolver = convolver;
  return ctx;
}

/**
 * One sustained voice. Attack and release are measured in seconds, not
 * milliseconds — a four-second fade in is what makes a note arrive
 * without an edge, and an edge is the thing the ear locks onto.
 */
function pad(freq, holdMs) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const attack = 3.2;
  const hold = holdMs / 1000;
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

  // Two oscillators a few cents apart. Identical pitches are a test
  // tone; detuned ones beat slowly against each other and read as an
  // instrument with a body.
  const a = ctx.createOscillator();
  const b = ctx.createOscillator();
  a.type = 'triangle';
  b.type = 'triangle';
  a.frequency.value = freq;
  b.frequency.value = freq * 1.0023;

  a.connect(filter);
  b.connect(filter);
  filter.connect(gain);
  gain.connect(musicBus);
  if (ctx.__convolver) gain.connect(ctx.__convolver);

  a.start(now);
  b.start(now);
  a.stop(now + hold + release + 0.2);
  b.stop(now + hold + release + 0.2);
}

function playChord() {
  const chord = CHORDS[chordIndex % CHORDS.length];
  chordIndex += 1;
  chord.forEach((freq, i) => {
    // Voices enter fractionally apart rather than together, which is the
    // difference between a chord and a block of sound.
    setTimeout(() => pad(freq, CHORD_MS), i * 260);
  });
}

function startScore() {
  if (scheduler) return;
  playChord();
  // Chords overlap: the next one starts before the last has released.
  scheduler = setInterval(playChord, CHORD_MS - 1200);
}

function stopScore() {
  if (!scheduler) return;
  clearInterval(scheduler);
  scheduler = null;
}

/**
 * The only interactive sound left, and only on a real click. Low, short,
 * and quiet: an acknowledgement, not an alert. Nothing fires on hover,
 * on scroll, or on a section coming into view.
 */
export function click() {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(196, now);
  // A small downward glide. A flat pitch reads as a beep; a falling one
  // reads as an object settling.
  osc.frequency.exponentialRampToValueAtTime(174.61, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  duck();
  osc.connect(gain);
  gain.connect(sfxBus);
  if (ctx.__convolver) gain.connect(ctx.__convolver);
  osc.start(now);
  osc.stop(now + 0.45);
}

/**
 * A wipe. Filtered noise swept downward in pitch, which is what a
 * physical thing moving past you actually sounds like.
 *
 * This is the sound effect the score was missing. Music alone makes a
 * room; it does not make an event. When five panels sweep off the screen
 * in silence the biggest move on the site has no weight, and the ear
 * notices the absence even when the eye does not.
 */
export function whoosh() {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const dur = 1.1;

  const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  // The sweep is the whole effect. A static band of noise is a hiss; one
  // that falls from 1.8kHz to 180Hz is something passing.
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.13, now + 0.14);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  duck();
  src.connect(filter);
  filter.connect(gain);
  gain.connect(sfxBus);
  if (ctx.__convolver) gain.connect(ctx.__convolver);
  src.start(now);
  src.stop(now + dur);
}

/**
 * Pointer entering a real control. Deliberately low, short and quiet —
 * the version that got scrapped was a 1180Hz ping, which is the register
 * a smoke alarm uses and about as welcome. This sits under the music
 * rather than on top of it, and only fires on buttons and calls to
 * action, never on nav links or headings.
 */
export function hover() {
  if (!enabled || !ctx) return;
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

export function isEnabled() {
  return enabled;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Turn the score on directly, rather than flipping whatever the current
 * state is. The intro uses this: clicking ENTER must always start the
 * music, never stop it.
 */
export function enable() {
  if (enabled) return true;
  return toggle();
}

export function toggle() {
  enabled = !enabled;

  if (enabled) {
    const c = ensureContext();
    if (!c) {
      enabled = false;
    } else {
      // Browsers hold the context suspended until a user gesture. The
      // toggle click IS that gesture, which is the other reason sound
      // could never be on by default.
      if (c.state === 'suspended') c.resume();
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(master.gain.value, c.currentTime);
      // Six seconds to reach full. The music should seem to have been
      // playing before you turned it on.
      master.gain.linearRampToValueAtTime(1, c.currentTime + 6);
      startScore();
    }
  } else if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.6);
    setTimeout(stopScore, 1700);
  }

  rememberSound(enabled);
  listeners.forEach((fn) => fn(enabled));
  return enabled;
}

/**
 * Bring the music back after a reload.
 *
 * A refresh destroys the audio context, and no browser will let a fresh
 * page start audio on its own — so "the music should not stop when I
 * refresh" cannot be honoured literally. What can be honoured: if this
 * tab had sound on, wait silently for the next thing the visitor does
 * and resume on that. In practice the music returns on the first scroll
 * or click, a second or two in, with nothing to click and no second
 * ENTER screen.
 *
 * The listeners are once-only and passive, and they remove themselves
 * whichever one fires.
 */
export function resumeIfPreviouslyOn() {
  if (!soundWasOn() || enabled) return () => {};

  const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  const start = () => {
    events.forEach((e) => window.removeEventListener(e, start));
    if (!enabled) toggle();
  };
  events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));

  return () => events.forEach((e) => window.removeEventListener(e, start));
}
