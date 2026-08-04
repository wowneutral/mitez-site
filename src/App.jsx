import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import SEO from './components/SEO.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import PanelSweep from './components/PanelSweep.jsx';
import SoundPrompt from './components/SoundPrompt.jsx';
import { useSmoothScroll, getLenis } from './lib/smoothScroll.js';
import { resumeIfPreviouslyOn, hover, click } from './lib/sound.js';
import { transitionTo } from './lib/transition.js';
// Routes are split so a visitor reading the Terms does not download a 3D
// engine. Home stays eagerly imported because it is the common entry point
// and splitting it would only add a round trip before the hero appears;
// everything it pulls in (three, drei, the Spline loader) now lives in
// Home's chunk rather than the shared one.
import Home from './pages/Home.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage.jsx'));
const GetInvolvedPage = lazy(() => import('./pages/GetInvolvedPage.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Gainesville = lazy(() => import('./pages/Gainesville.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));

// Without this, navigating between routes keeps the previous scroll
// position — you click "Contact" and land halfway down the page.
// Anchors (#learn) are left alone so in-page jumps still work.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // With a hash, scroll to that section instead of the top. React
    // Router does NOT do this for you — a browser only honours a hash on
    // a real document load, and client-side navigation isn't one. Without
    // this, /get-involved#mentor loads the page at the top and the
    // visitor has to hunt for the form they clicked.
    //
    // The rAF waits one frame so the destination route has actually
    // rendered; querying for the element during this effect would find
    // nothing on a cross-page navigation.
    // With Lenis running, the browser's own scrolling is being driven by
    // an animation loop. Calling scrollIntoView or window.scrollTo behind
    // its back sets a position Lenis immediately animates away from, so
    // both jumps have to be handed to it instead.
    const lenis = getLenis();

    if (hash) {
      const id = hash.slice(1);
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -20 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(raf);
    }

    if (lenis) {
      // immediate: a route change is a cut, not a scroll. Easing a new
      // page up from the bottom of the last one would be seasickness.
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }
    return undefined;
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <main className="page">
      <SEO title="Page Not Found" path="/404" noindex />
      <div className="wrap notfound">
        <p className="section-label">404</p>
        <h1>That page does not exist.</h1>
        <p className="lede">The link may be out of date, or the page may have moved.</p>
        <Link className="btn btn-primary" to="/">
          Back home
        </Link>
      </div>
      <Footer />
    </main>
  );
}

export default function App() {
  useSmoothScroll();
  const navigate = useNavigate();

  // Navigation, intercepted so the transition can cover BEFORE the route
  // changes. Driving it off the route change instead meant the new page
  // rendered, the panels wiped over it, and it appeared again — the
  // transition running after the thing it existed to hide.
  //
  // Done by delegation rather than by replacing every Link, so it also
  // covers links inside copy, and anything added later, without those
  // components needing to know a transition exists.
  useEffect(() => {
    const onClick = (e) => {
      // Leave alone anything the browser or the visitor means specially:
      // new tabs, downloads, modifier-clicks, middle clicks, external
      // hosts. Hijacking a cmd-click is the fastest way to make a fancy
      // site infuriating.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // In-page anchors keep their smooth scroll; a curtain for a jump
      // within the page you are already reading would be absurd.
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      transitionTo(() => navigate(url.pathname + url.search + url.hash));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  // A reload destroys the audio context and no browser will let a fresh
  // page start audio unprompted, so the music genuinely cannot survive a
  // refresh. What it can do is come back on its own: if this tab had
  // sound on, the next scroll or click resumes it, with nothing to press
  // and no second entry screen.
  useEffect(() => resumeIfPreviouslyOn(), []);

  // Button sounds, by delegation.
  //
  // Two listeners on the document rather than handlers on every button:
  // the previous version attached its own to each control, which meant
  // React state and event wiring per element, and the buttons on this
  // site are created in half a dozen different components. Delegation
  // also means anything added later is covered without being told.
  //
  // Only .btn — real calls to action. Nav links, headings and cards stay
  // silent. Sound on everything is what made the last attempt a rattle.
  useEffect(() => {
    const onOver = (e) => {
      const btn = e.target.closest?.('.btn');
      if (!btn) return;
      // pointerover fires again for every child element inside the
      // button. Ignoring moves that stay within the same control is what
      // stops one hover making three sounds.
      if (btn.contains(e.relatedTarget)) return;
      hover();
    };
    const onClick = (e) => {
      if (e.target.closest?.('.btn')) click();
    };
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('click', onClick, { passive: true });
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <PanelSweep />
      <SoundPrompt />
      <Nav />
      {/* A blank fallback rather than a spinner: these chunks are small and
          a flash of loading UI is worse than a beat of nothing. */}
      <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/gainesville" element={<Gainesville />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
