/**
 * What this tab already knows.
 *
 * Two facts, both scoped to the tab and both gone the moment it closes:
 * whether the intro has already been crossed, and whether sound was on.
 *
 * WHY THIS EXISTS. Refreshing was replaying the entire entry sequence —
 * counter, ENTER button, panel lift — and killing the music, which is
 * exactly the "hard refresh" feeling. A threshold is only meaningful the
 * first time you cross it. Crossing it again because you hit reload is
 * not ceremony, it is a toll booth.
 *
 * WHY sessionStorage AND NOT A MODULE VARIABLE. A module variable dies
 * with the page, which is precisely the case being fixed. It has to
 * survive a reload and nothing longer.
 *
 * ON THE PRIVACY POLICY. That page says this site sets no tracking
 * cookies and stores nothing about you, and this does not contradict it:
 * two booleans about the state of one browser tab, readable only by this
 * origin, deleted when the tab closes, never sent anywhere and not tied
 * to a person. Worth being deliberate about rather than assuming — the
 * earlier sound work avoided storage entirely for this reason, and this
 * is a narrow, considered exception rather than a change of position.
 *
 * Every access is wrapped: Safari in private mode throws on storage
 * access rather than returning null, and an exception here would take
 * the whole page down over a preference.
 */
const ENTERED = 'mitez.entered';
const MUSIC = 'mitez.music';
const SFX = 'mitez.sfx';

function read(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the site behaves as a first visit, which is
       the safe direction to fail in */
  }
}

export function hasEntered() {
  return read(ENTERED) === '1';
}

export function markEntered() {
  write(ENTERED, '1');
}

/**
 * Music and effects are remembered separately, because they are
 * separate choices. Someone who wants the clicks and not the score
 * should not have to make that choice again on every reload.
 */
export function readSound() {
  // Absent means never chosen, and the default is on — so a first visit
  // and a reload before touching anything both arrive armed. Only an
  // explicit '0' turns something off, which is the difference between
  // "not set" and "set to off".
  return { music: read(MUSIC) !== '0', sfx: read(SFX) !== '0' };
}

export function writeSound({ music, sfx }) {
  write(MUSIC, music ? '1' : '0');
  write(SFX, sfx ? '1' : '0');
}
