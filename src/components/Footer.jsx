import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-top">
        <div>
          <div className="footer-logo">MITEZ</div>
          <p className="footer-mission">
            Making it easy to learn anything, free mentorship for anyone who
            asks.
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col footer-col-site">
            <h4>Site</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/gainesville">Gainesville</Link></li>
              <li><Link to="/get-involved">Get Involved</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@mitez.org">hello@mitez.org</a></li>
              <li>Gainesville, Florida</li>
            </ul>
          </div>
          {/* Deliberately inert: a span, not a link or a button, because there
              is nothing to click yet. MITEZ is not incorporated, so it cannot
              properly hold donated money, and the copy says the programme
              rather than the mentors: mentors are volunteers, and the Terms
              forbid them accepting anything of value from a student. */}
          <div className="footer-col">
            <h4>Support</h4>
            <div className="coffee">
              <span className="coffee-cup" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" />
                  <path d="M17 10.5h1.6a2.4 2.4 0 0 1 0 4.8H17" />
                  <path d="M7.5 5.6c.5-.7.4-1.4 0-2.1M11 5.6c.5-.7.4-1.4 0-2.1M14.5 5.6c.5-.7.4-1.4 0-2.1" />
                </svg>
              </span>
              <span className="coffee-text">
                <b>Buy the programme a coffee</b>
                <span className="coffee-soon">Coming soon</span>
              </span>
            </div>
            <p className="coffee-note">
              Not open yet. When it is, it will cover running costs, not payments
              to mentors, who volunteer.
            </p>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>&copy; 2026 MITEZ / Make It Easy</span>
        <span>Gainesville, Florida</span>
      </div>
    </footer>
  );
}
