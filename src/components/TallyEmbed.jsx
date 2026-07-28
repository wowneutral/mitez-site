import { useEffect, useRef, useState } from 'react';

const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js';

/**
 * Inline Tally embed.
 *
 * formId is the short code from the form's share URL — for
 * https://tally.so/r/zxvjdg the id is "zxvjdg". All ids live in
 * src/config/forms.js so there is one place to change them.
 *
 * Uses Tally's own embed script with `data-tally-src` rather than a plain
 * iframe `src`. That matters: the script listens for height messages from
 * the form and grows the iframe to fit. Without it the iframe stays at
 * whatever fixed height it was given and long forms are simply cut off
 * mid-question, which is exactly what happened on the first pass here.
 */
export default function TallyEmbed({ formId, title = 'Form' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const frameRef = useRef(null);

  const configured = formId && !formId.startsWith('REPLACE_');

  useEffect(() => {
    if (!configured) return undefined;

    const load = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
        return;
      }
      // Script present but not ready yet, or blocked — fall back to
      // setting src directly so the form still renders (just without
      // auto-resize).
      document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((el) => {
        el.src = el.dataset.tallySrc;
      });
    };

    let script = document.querySelector(`script[src="${TALLY_SCRIPT}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = TALLY_SCRIPT;
      script.async = true;
      script.onload = load;
      script.onerror = () => setFailed(true);
      document.body.appendChild(script);
    } else {
      load();
    }

    const timeout = setTimeout(() => setFailed((f) => (loaded ? f : true)), 10000);
    return () => clearTimeout(timeout);
  }, [configured, loaded]);

  if (!configured) {
    return (
      <div className="tally-placeholder">
        <p>
          This form is not connected yet. Add its Tally ID in{' '}
          <code>src/config/forms.js</code> and it will appear here.
        </p>
      </div>
    );
  }

  // hideTitle: the page already has a heading above the form.
  // transparentBackground: lets the site's own background show through.
  // dynamicHeight: enables the auto-resize handled by the script above.
  const src = `https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

  return (
    <div className="tally-wrap">
      {!loaded && !failed && (
        <div className="tally-loading" role="status">
          <span className="tally-loading-bar" />
          <span className="sr-only">Loading form</span>
        </div>
      )}

      <iframe
        ref={frameRef}
        data-tally-src={src}
        title={title}
        width="100%"
        height="320"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'tally-frame is-loaded' : 'tally-frame'}
      />

      {failed && !loaded && (
        <p className="tally-fallback">
          Having trouble loading the form?{' '}
          <a href={`https://tally.so/r/${formId}`} target="_blank" rel="noreferrer">
            Open it in a new tab
          </a>
          .
        </p>
      )}
    </div>
  );
}
