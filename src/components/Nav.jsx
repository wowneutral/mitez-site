import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import SoundToggle from './SoundToggle.jsx';
import { transitionTo } from '../lib/transition.js';

const LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/gainesville', label: 'Gainesville' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu on navigation, otherwise it stays open over the
  // new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Hidden on the way down, back on the way up.
  //
  // Reading is downward, so scrolling down is a request for more page and
  // a fixed bar sitting over it is in the way. Scrolling up is almost
  // always a request to go somewhere, which is when navigation should be
  // there — so the bar arrives exactly when it is wanted and is absent
  // the rest of the time. It also hands roughly seventy pixels back to
  // the content on a phone, which is where that matters most.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY || document.body.scrollTop;
      setScrolled(y > 8);
      // The threshold stops a trackpad's jitter from flickering the bar,
      // and it always shows again near the top regardless of direction.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 220);
        last = y;
      }
    };
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
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="wrap nav-inner">
        {/* The logo always plays the reveal, including when it is
            clicked from the homepage. React Router reports no change in
            that case and the route effect would never fire, but the
            visitor asked for something and should see it happen. */}
        <Link
          to="/"
          className="nav-logo"
          aria-label="MITEZ home"
          onClick={(e) => {
            // Only handled here when already home: the router reports no
            // change, so App's interceptor lets it through and nothing
            // would happen at all. Everywhere else the interceptor has
            // it, and adding a second trigger would play the sweep twice.
            if (pathname !== '/') return;
            e.preventDefault();
            transitionTo(() => {});
          }}
        >
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

        {/* Outside .nav-links on purpose: that element is display:none
            below 820px, so the sound controls were unreachable on a
            phone entirely. They live in their own group beside the menu
            button and stay visible at every width. */}
        <div className="nav-right">
          <SoundToggle />

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
