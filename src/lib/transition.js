/**
 * Route transitions, in the right order.
 *
 * THE BUG THIS FIXES. The sweep was driven by a route change, which
 * means React had already swapped the page by the time the panels
 * started moving. So every navigation went: new page appears, panels
 * cover it, panels leave, new page appears again. The transition was
 * playing after the thing it was supposed to hide, which is why it read
 * as a stutter rather than as a transition.
 *
 * The order has to be cover, THEN change, THEN reveal. That requires
 * intercepting the click before the router acts on it, so this holds the
 * navigation as a callback and runs it at the moment the screen is
 * covered.
 *
 * If no sweep is mounted — reduced motion, an error boundary, anything —
 * the action runs immediately and navigation still works. A transition
 * layer must never be the thing standing between someone and the page
 * they asked for.
 */
let impl = null;

export function registerTransition(fn) {
  impl = fn;
  return () => {
    if (impl === fn) impl = null;
  };
}

export function transitionTo(action) {
  if (typeof impl === 'function') impl(action);
  else action();
}
