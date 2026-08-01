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
          <div className="footer-col">
            <h4>Site</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/gainesville">Gainesville</Link></li>
              <li><Link to="/get-involved">Get Involved</Link></li>
              <li><Link to="/resources">Resources</Link></li>
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
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>&copy; 2026 MITEZ / Make It Easy</span>
        <span>Gainesville, Florida</span>
      </div>
    </footer>
  );
}
