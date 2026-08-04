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

let ctx = null;
let master = null;
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

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

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
  gain.gain.linearRampToValueAtTime(0.05, now + attack);
  gain.gain.setValueAtTime(0.05, now + hold);
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
  gain.connect(master);
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
  gain.gain.linearRampToValueAtTime(0.06, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  osc.connect(gain);
  gain.connect(master);
  if (ctx.__convolver) gain.connect(ctx.__convolver);
  osc.start(now);
  osc.stop(now + 0.45);
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

  listeners.forEach((fn) => fn(enabled));
  return enabled;
}
