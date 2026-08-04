import { Component } from 'react';
import { clearRetryFlag } from '../lib/lazyWithRetry.js';

/**
 * The last line of defence.
 *
 * React unmounts the whole tree when a render throws and nothing catches
 * it. Not the failing component — everything. The page goes white, the
 * nav is gone, links do nothing and the back button appears broken
 * because there is no application left to respond to it. That is the
 * worst failure mode a site can have, and until now this one had no
 * protection against it at all: a single bad import or a null reference
 * in any component took the entire site down.
 *
 * It has already happened twice here — once from a missing useEffect
 * import, once from chunk loads failing against stale HTML — and both
 * times the symptom was a blank page rather than anything that pointed
 * at the cause.
 *
 * This is deliberately plain and dependency-free: it has to work when
 * the rest of the app does not, so it uses no hooks, no router, no
 * motion, and inline styles rather than a stylesheet that may itself be
 * the thing that failed to load.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Nothing is sent anywhere — the Privacy Policy says this site
    // collects nothing, and an error reporter would quietly make that
    // untrue. The console is where a developer looks anyway.
    // eslint-disable-next-line no-console
    console.error('[MITEZ] render failed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main
        style={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          padding: '10vh 24px',
          textAlign: 'center',
          fontFamily: "'Chakra Petch', system-ui, sans-serif",
          color: '#16181d',
        }}
      >
        <div style={{ maxWidth: '46ch' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5a5e67' }}>
            Something went wrong
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', margin: '14px 0 16px', lineHeight: 1.1 }}>
            This page did not load properly.
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: '#5a5e67' }}>
            Reloading usually fixes it. If it keeps happening, email{' '}
            <a href="mailto:hello@mitez.org" style={{ color: '#16181d' }}>hello@mitez.org</a>{' '}
            and say what you clicked.
          </p>
          <button
            type="button"
            onClick={() => {
              // Clear the guard so the reload is allowed to try a fresh
              // chunk fetch rather than being treated as the second
              // attempt and refusing.
              clearRetryFlag();
              window.location.reload();
            }}
            style={{
              marginTop: 28,
              padding: '16px 30px',
              border: '1px solid #16181d',
              background: '#16181d',
              color: '#f2f2f2',
              borderRadius: 2,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Reload
          </button>
        </div>
      </main>
    );
  }
}
