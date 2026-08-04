import { lazy } from 'react';

/**
 * lazy(), but it survives a deploy.
 *
 * THE BUG THIS FIXES, which is almost certainly the "sometimes pages
 * don't load and then back stops working" one.
 *
 * Every route on this site is code-split, so opening /about fetches
 * assets/About-<hash>.js. The hash changes whenever that code changes.
 * Now suppose a visitor is holding an HTML document from before a deploy
 * — which was happening for real, because documents were being cached
 * for a week (see public/_headers). That HTML names chunk filenames that
 * no longer exist on the server.
 *
 * Click a link and the dynamic import 404s. The import rejects, the
 * Suspense boundary above it has no error handling, and React unmounts
 * the entire tree. The page goes blank, nothing responds, and the back
 * button appears broken because there is no application left to respond
 * to it. Intermittent, because it only happens to documents that
 * straddle a deploy.
 *
 * THE FIX. A failed chunk import almost always means "your HTML is
 * older than the server", and the cure for that is a reload: it fetches
 * the current document, which names the chunks that actually exist.
 *
 * Guarded by a session flag so a genuine, permanent failure — offline,
 * a blocked domain, a corrupt build — cannot become a reload loop. One
 * retry, then the error is allowed through to the boundary, which is
 * honest: better a message than a page that reloads forever.
 */
const RETRY_KEY = 'mitez.chunkRetry';

function hasRetried() {
  try {
    return window.sessionStorage.getItem(RETRY_KEY) === '1';
  } catch {
    return false;
  }
}

function markRetried() {
  try {
    window.sessionStorage.setItem(RETRY_KEY, '1');
  } catch {
    /* storage unavailable; the guard degrades to "never retry" */
  }
}

export function clearRetryFlag() {
  try {
    window.sessionStorage.removeItem(RETRY_KEY);
  } catch {
    /* nothing to clear */
  }
}

export default function lazyWithRetry(factory) {
  return lazy(() =>
    factory().catch((err) => {
      if (!hasRetried()) {
        markRetried();
        window.location.reload();
        // Never resolves: the reload is already under way, and resolving
        // with anything here would render it for the frame before the
        // document is replaced.
        return new Promise(() => {});
      }
      throw err;
    }),
  );
}
