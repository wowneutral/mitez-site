import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import SEO from './components/SEO.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import GetInvolvedPage from './pages/GetInvolvedPage.jsx';
import Contact from './pages/Contact.jsx';

// Without this, navigating between routes keeps the previous scroll
// position — you click "Contact" and land halfway down the page.
// Anchors (#learn) are left alone so in-page jumps still work.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
