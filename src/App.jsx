import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import SEO from './components/SEO.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
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
const Resources = lazy(() => import('./pages/Resources.jsx'));
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
    if (hash) {
      const id = hash.slice(1);
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
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
  return (
    <>
      <ScrollToTop />
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
          <Route path="/resources" element={<Resources />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
