import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu on navigation, otherwise it stays open over the
  // new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8 || document.body.scrollTop > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Lock scroll behind the open mobile menu.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link to="/" className="nav-logo" aria-label="MITEZ home">
          MITEZ
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`nav-bars${open ? ' is-open' : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      {/* The links MUST stay wrapped in a single child. The open/close
          animation uses the grid-template-rows 0fr -> 1fr technique,
          which collapses only the rows it declares — one. With the links
          as direct children, link #1 landed in that collapsed row while
          links #2-4 fell into implicit auto-sized rows and stayed fully
          visible with the menu shut, stacked over the page. One wrapper
          means one row, so the whole list collapses together. */}
      <div id="mobile-nav" className={`nav-mobile${open ? ' is-open' : ''}`}>
        <div className="nav-mobile-inner">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-mobile-link${isActive ? ' is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
