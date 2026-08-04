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

import { readSound, writeSound, readTrack, writeTrack } from './session.js';

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
let track = readTrack();
let playing = null; // { name, gain, stop() }

const listeners = new Set();

// The score is the room: present, never in front. The effects sit over
// it. Both numbers were arrived at by ear rather than by rule.
const MUSIC_LEVEL = 0.2;
const SFX_LEVEL = 1.6;
const DUCK_LEVEL = 0.07;

const CROSSFADE_S = 2.2;

// How long the score takes to reach full after it is switched on.
//
// This was six seconds, on the idea that music should seem to have been
// playing before you turned it on. That is true when someone flips the
// switch halfway down a page — and completely wrong at the intro, which
// only lasts a second or two: the room tone was still inaudible when the
// panels lifted, so the intro appeared to have no music at all. Two
// seconds still arrives rather than starts, and is actually heard.
const MUSIC_RAMP_S = 2;

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

/**
 * The reason there was no sound on an iPhone.
 *
 * Two iOS behaviours, neither of which shows up on a desktop:
 *
 *  1. Web Audio output is filed under the "ambient" audio session, which
 *     the physical mute switch silences. A phone in silent mode — which
 *     is most phones, most of the time — plays nothing at all, with no
 *     error and no clue as to why. Playing a silent looping <audio>
 *     element promotes the page to the "playback" session, and the Web
 *     Audio graph goes with it.
 *  2. The context can be created suspended and only truly starts inside
 *     a gesture, so this has to be called from the same handler as
 *     everything else.
 *
 * The clip is a 0.05s silent WAV built here rather than fetched: it is
 * about a hundred bytes, and a file for this would be a request, a cache
 * entry and a thing to lose.
 *
 * If any of it fails the site simply carries on quietly, which is the
 * same outcome as not trying.
 */
let silentEl = null;

function unlockIOS() {
  if (silentEl) return;
  try {
    const rate = 8000;
    const frames = Math.floor(rate * 0.05);
    const bytes = 44 + frames * 2;
    const buf = new ArrayBuffer(bytes);
    const view = new DataView(buf);
    const str = (off, t) => [...t].forEach((ch, i) => view.setUint8(off + i, ch.charCodeAt(0)));
    str(0, 'RIFF');
    view.setUint32(4, bytes - 8, true);
    str(8, 'WAVEfmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    str(36, 'data');
    view.setUint32(40, frames * 2, true);

    const blob = new Blob([buf], { type: 'audio/wav' });
    silentEl = new Audio(URL.createObjectURL(blob));
    silentEl.loop = true;
    silentEl.volume = 0.001;
    silentEl.setAttribute('playsinline', '');
    const p = silentEl.play();
    if (p && p.catch) p.catch(() => {});
  } catch {
    silentEl = null;
  }
}

function notify() {
  listeners.forEach((fn) => fn({ music: musicOn, sfx: sfxOn, track }));
}

/* ---------------------------- scores ------------------------------ */

/** Room tone. Filtered noise, moving slowly, plus an occasional shimmer. */
function startRoomTone() {
  const now = ctx.currentTime;
  const out = ctx.createGain();
  // 1.6s, not 4s. Layered under the bus ramp above, a slow fade here was
  // the second half of why the intro was silent.
  out.gain.setValueAtTime(0.0001, now);
  out.gain.linearRampToValueAtTime(1, now + 1.6);
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

/**
 * A chordal score. Everything except the notes and the tone is shared,
 * so adding another one is a table of frequencies rather than another
 * copy of the scheduling, the envelopes and the voice building.
 */
function startChords({ chords, holdMs, peak, attack, release, cutoff, detune, spread, gap }) {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
  out.connect(musicBus);
  out.connect(convolver);

  let index = 0;
  const timers = [];

  const voice = (freq) => {
    const now = ctx.currentTime;
    const hold = holdMs / 1000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.setValueAtTime(peak, now + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + hold + release);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = 0.4;

    // Identical pitches are a test tone. A few cents apart, they beat
    // against each other and read as an instrument with a body.
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = 'triangle';
    b.type = 'triangle';
    a.frequency.value = freq;
    b.frequency.value = freq * (1 + detune);

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
    const notes = chords[index % chords.length];
    index += 1;
    // Voices enter fractionally apart. Together they are a block of
    // sound; staggered they are a chord.
    notes.forEach((f, i) => timers.push(setTimeout(() => voice(f), i * spread)));
  };

  chord();
  const loop = setInterval(chord, gap);

  return {
    gain: out,
    stop() {
      clearInterval(loop);
      timers.forEach(clearTimeout);
    },
  };
}

/* ------------------------------------------------------------------
 * THE SITE SCORES
 *
 * Four of them, switchable from the nav, because a piece of music you
 * cannot change is the one part of an ambient site that gets tiring
 * fastest — and taste in this is genuinely personal. They are ordered
 * from most to least melodic.
 *
 * All four share startChords or a small builder of their own, so the
 * cost of a fifth is a table of frequencies rather than another copy of
 * the scheduling and envelope code.
 * ------------------------------------------------------------------ */

/** Drift — A minor, unresolved. Low and wistful. The original. */
function startPads() {
  return startChords({
    chords: [
      [110.0, 164.81, 261.63, 329.63], // Am add9-ish
      [87.31, 130.81, 246.94, 329.63], // Fmaj7
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
      [98.0, 146.83, 246.94, 293.66], // Gsus
    ],
    holdMs: 8000, peak: 0.03, attack: 3.2, release: 4.5,
    cutoff: 900, detune: 0.0023, spread: 260, gap: 6800,
  });
}

/** Bloom — the same idea in major, higher, with the filter open. */
function startBloom() {
  return startChords({
    chords: [
      [130.81, 196.0, 293.66, 392.0], // C add9
      [174.61, 261.63, 329.63, 493.88], // Fmaj7 #11-ish
      [146.83, 220.0, 329.63, 440.0], // Dm9
      [196.0, 293.66, 392.0, 587.33], // G add9
    ],
    holdMs: 9000, peak: 0.026, attack: 4, release: 5.5,
    cutoff: 1600, detune: 0.0016, spread: 340, gap: 7600,
  });
}

/** Deep — two notes a fifth apart and a filter that breathes. */
function startDrone() {
  const now = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.linearRampToValueAtTime(1, now + 4);
  out.connect(musicBus);
  out.connect(convolver);

  const body = ctx.createGain();
  body.gain.value = 0.05;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 260;
  filter.Q.value = 2.5;

  // Forty seconds a cycle. Slow enough that you never catch it moving,
  // which is the difference between a drone and a siren.
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.025;
  lfoGain.gain.value = 170;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const oscs = [55, 82.5, 110].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i === 2 ? 'sine' : 'sawtooth';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = i === 2 ? 0.25 : 0.5;
    o.connect(g);
    g.connect(filter);
    o.start(now);
    return o;
  });

  filter.connect(body);
  body.connect(out);
  lfo.start(now);

  return {
    gain: out,
    stop() {
      try {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}

/** Keys — single pentatonic notes, struck at random, long decay. */
function startKeys() {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
  out.connect(musicBus);
  out.connect(convolver);

  const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const timers = [];

  const pluck = () => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = NOTES[Math.floor(Math.random() * NOTES.length)];

    // The filter closing as the note decays is what makes it read as
    // struck rather than switched on.
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 2.6);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 3.6);

    // Irregular spacing. An even pulse becomes a metronome, and a
    // metronome is impossible to stop hearing.
    timers.push(setTimeout(pluck, 1500 + Math.random() * 2200));
  };

  pluck();

  return {
    gain: out,
    stop() {
      timers.forEach(clearTimeout);
    },
  };
}

/** Dusk — Dorian, mid-register, slower than Drift and less sad than it. */
function startDusk() {
  return startChords({
    chords: [
      [146.83, 220.0, 261.63, 392.0], // Dm11-ish
      [110.0, 164.81, 246.94, 329.63], // Am7
      [130.81, 196.0, 233.08, 349.23], // Cm/B♭ colour
      [98.0, 146.83, 220.0, 293.66], // Gsus2
    ],
    holdMs: 10000, peak: 0.028, attack: 4.5, release: 6,
    cutoff: 1150, detune: 0.002, spread: 420, gap: 8400,
  });
}

/**
 * Static — the intro's room tone, offered as a site score.
 *
 * Not laziness: it is the least melodic thing here, and for anyone who
 * finds chords distracting while reading it is the only option that is
 * genuinely furniture. Built by the same function the intro uses, so
 * there is one implementation rather than a copy that drifts.
 */
function startStatic() {
  return startRoomTone();
}

/**
 * Pulse — a slow low heartbeat under a held chord.
 *
 * The only score here with a beat, and it is deliberately far below
 * anything you would tap to: one every two and a half seconds, which is
 * slower than a resting pulse. Fast enough to notice and too slow to
 * chase, which is the line between rhythm and pressure.
 */
function startPulse() {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
  out.connect(musicBus);
  out.connect(convolver);

  const bed = startChords({
    chords: [[110.0, 164.81, 246.94], [98.0, 146.83, 220.0]],
    holdMs: 12000, peak: 0.022, attack: 5, release: 6,
    cutoff: 700, detune: 0.0018, spread: 500, gap: 11000,
  });
  bed.gain.disconnect();
  bed.gain.connect(out);

  const timers = [];
  const beat = () => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    // A falling pitch, which is what gives it weight rather than click.
    osc.frequency.setValueAtTime(72, now);
    osc.frequency.exponentialRampToValueAtTime(46, now + 0.25);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 1);
    timers.push(setTimeout(beat, 2500));
  };
  timers.push(setTimeout(beat, 400));

  return {
    gain: out,
    stop() {
      timers.forEach(clearTimeout);
      bed.stop();
    },
  };
}

/** Glass — high bells, sparse, over almost nothing. */
function startGlass() {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
  out.connect(musicBus);
  out.connect(convolver);

  const bed = startChords({
    chords: [[110.0, 164.81], [98.0, 146.83]],
    holdMs: 14000, peak: 0.012, attack: 6, release: 7,
    cutoff: 500, detune: 0.0015, spread: 600, gap: 13000,
  });
  bed.gain.disconnect();
  bed.gain.connect(out);

  // Two octaves above where Keys sits, and half as often. Up here a note
  // every couple of seconds would be a smoke alarm.
  const NOTES = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
  const timers = [];

  const bell = () => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = NOTES[Math.floor(Math.random() * NOTES.length)];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.018, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5);
    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 5.2);
    timers.push(setTimeout(bell, 3200 + Math.random() * 4600));
  };
  timers.push(setTimeout(bell, 1200));

  return {
    gain: out,
    stop() {
      timers.forEach(clearTimeout);
      bed.stop();
    },
  };
}

/**
 * Swell an existing score with a slow tremolo.
 *
 * Composed rather than written out: it takes a built score and adds an
 * oscillator to its output gain, so Tide is Bloom breathing rather than
 * a fifth copy of the chord engine. Summing onto an AudioParam that is
 * already being ramped is exactly what they are for.
 */
function withSwell(score, rate, depth) {
  const lfo = ctx.createOscillator();
  const amount = ctx.createGain();
  lfo.frequency.value = rate;
  amount.gain.value = depth;
  lfo.connect(amount);
  amount.connect(score.gain.gain);
  lfo.start();

  const inner = score.stop;
  return {
    gain: score.gain,
    stop() {
      try {
        lfo.stop();
      } catch {
        /* already stopped */
      }
      inner();
    },
  };
}

/** Tide — Bloom, breathing in and out across about twenty seconds. */
function startTide() {
  return withSwell(
    startChords({
      chords: [
        [130.81, 196.0, 293.66, 392.0],
        [174.61, 261.63, 329.63, 493.88],
        [146.83, 220.0, 329.63, 440.0],
        [196.0, 293.66, 392.0, 587.33],
      ],
      holdMs: 11000, peak: 0.03, attack: 5, release: 6,
      cutoff: 1400, detune: 0.0018, spread: 380, gap: 9200,
    }),
    0.05,
    0.35,
  );
}

/** The switchable set, in the order the control cycles through them. */
export const TRACKS = [
  // Ordered so that cycling moves gradually from most melodic to least,
  // rather than lurching between bells and a drone.
  { id: 'drift', label: 'Drift', build: startPads },
  { id: 'bloom', label: 'Bloom', build: startBloom },
  { id: 'dusk', label: 'Dusk', build: startDusk },
  { id: 'tide', label: 'Tide', build: startTide },
  { id: 'keys', label: 'Keys', build: startKeys },
  { id: 'glass', label: 'Glass', build: startGlass },
  { id: 'pulse', label: 'Pulse', build: startPulse },
  { id: 'deep', label: 'Deep', build: startDrone },
  { id: 'static', label: 'Static', build: startStatic },
];

function build(name) {
  if (name === 'room') return { name, ...startRoomTone() };
  const t = TRACKS.find((x) => x.id === track) || TRACKS[0];
  return { name: 'site', track: t.id, ...t.build() };
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
  if (musicOn) crossfadeTo(next === 'site' ? 'site' : 'room');
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

/**
 * A plucked string, for the toy at the foot of the page.
 *
 * Sharper attack and a much longer tail than anything else here: a
 * struck string is almost all decay, and the decay is what makes it
 * sound plucked rather than switched on. Two detuned saw voices through
 * a filter that closes as it fades, which is the cheapest convincing
 * imitation of a real string losing its high harmonics first.
 *
 * Goes through the effects bus and the reverb, so it lands in the same
 * room as the score and the clicks rather than sounding pasted on. It
 * does NOT duck the music — you may well play a run of these, and a
 * score that flinches every time would be seasick.
 */
export function pluckString(freq) {
  if (!sfxOn || !ctx) return;
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  // Was 0.075, which sat on top of the music rather than in it.
  gain.gain.linearRampToValueAtTime(0.042, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(freq * 6, 7000), now);
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 320), now + 1.6);
  filter.Q.value = 0.7;

  const a = ctx.createOscillator();
  const b = ctx.createOscillator();
  a.type = 'sawtooth';
  b.type = 'sawtooth';
  a.frequency.value = freq;
  b.frequency.value = freq * 1.004;

  a.connect(filter);
  b.connect(filter);
  filter.connect(gain);
  gain.connect(sfxBus);
  gain.connect(convolver);

  a.start(now);
  b.start(now);
  a.stop(now + 2.6);
  b.stop(now + 2.6);
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

/**
 * Move to the next site score.
 *
 * Only ever changes what plays on the site — the intro keeps its room
 * tone, which is written for that screen and lasts a second and a half.
 * Switching while the intro is up records the choice and is heard on the
 * way in.
 *
 * The change is a crossfade like any other, so picking a different track
 * does not cut the music off mid-note.
 */
export function setTrack(id) {
  if (!TRACKS.some((t) => t.id === id) || id === track) return track;
  track = id;
  writeTrack(track);

  if (musicOn && started && scene === 'site') {
    // Force a rebuild: the scene name has not changed, so crossfadeTo
    // would otherwise see no work to do.
    const outgoing = playing;
    playing = build('site');
    if (outgoing) {
      const now = ctx.currentTime;
      outgoing.gain.gain.cancelScheduledValues(now);
      outgoing.gain.gain.setValueAtTime(outgoing.gain.gain.value, now);
      outgoing.gain.gain.linearRampToValueAtTime(0.0001, now + CROSSFADE_S);
      setTimeout(() => outgoing.stop(), CROSSFADE_S * 1000 + 200);
    }
  }

  notify();
  return track;
}

/** Kept for the keyboard: cycling is the sane behaviour for a shortcut. */
export function nextTrack() {
  const i = TRACKS.findIndex((t) => t.id === track);
  return setTrack(TRACKS[(i + 1) % TRACKS.length].id);
}

export function currentTrack() {
  return TRACKS.find((t) => t.id === track) || TRACKS[0];
}

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
    musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + MUSIC_RAMP_S);
    crossfadeTo(scene === 'site' ? 'site' : 'room');
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
  unlockIOS();
  started = true;

  const now = c.currentTime;

  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(0.0001, now);
  sfxBus.gain.cancelScheduledValues(now);
  sfxBus.gain.setValueAtTime(sfxOn ? SFX_LEVEL : 0, now);

  if (musicOn) {
    musicBus.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + MUSIC_RAMP_S);
    crossfadeTo(scene === 'site' ? 'site' : 'room');
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
  //
  // NOT ON TOUCH DEVICES. iOS wants the AudioContext CREATED inside a
  // user gesture, not merely resumed in one — building it here on load
  // and resuming it later at the Enter click leaves some versions
  // permanently silent, with no error. On a phone we skip straight to
  // the listeners below, so the context is constructed inside the first
  // real touch. This is one of the two reasons there was no sound on
  // mobile; the other is the silent switch, handled in unlockIOS.
  const canTryNow = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const c = canTryNow ? ensureContext() : null;
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
