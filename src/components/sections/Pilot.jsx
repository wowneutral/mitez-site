import { Link } from 'react-router-dom';
import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy + real figures from the live static site's Pilot ("Gainesville
// — Launch Moment") section.
const DATA = [
  { label: 'Status', value: 'Preparing' },
  { label: 'Based In', value: 'Gainesville, Florida' },
  { label: 'Open To', value: 'Students, Adults & Organizations' },
  { label: 'Subjects', value: 'No Fixed List' },
  { label: 'Format', value: 'Fully Remote' },
];

export default function Pilot() {
  return (
    <section className="pilot" id="pilot">
      <div className="pilot-bg" aria-hidden="true">GAINESVILLE</div>
      <div className="pilot-meta pilot-meta-left">GAINESVILLE, FLORIDA<br />29.6516° N, 82.3248° W</div>
      <div className="pilot-meta pilot-meta-right">LOCAL PILOT<br />BUILT TO SCALE</div>
      <div className="wrap pilot-inner">
        <p className="section-label pilot-label">The Pilot</p>
        <TextAnimate as="h2" by="line" animation="slideDown" duration={0.8} className="pilot-title">
          {'Rooted in Gainesville.\nOpen to anyone who asks.'}
        </TextAnimate>
        {/* Ethos section. Deliberately does NOT claim in-person delivery or
            an existing partner network — the program runs fully remote and
            no partnerships are signed yet. Detail lives on /gainesville so
            this stays a pointer rather than a second copy of it. */}
        <p className="lede pilot-lede">
          Where we started, not where we stop.
        </p>
        <div className="pilot-data">
          {DATA.map((d, i) => (
            <Reveal as="div" variant="up" delay={i * 0.08} key={d.label} className="pilot-datum">
              <span>{d.label}</span>
              {d.value}
            </Reveal>
          ))}
        </div>
        {/* The readiness bar was invented — 62% of what, measured how? It
            implied a tracked launch metric that does not exist. Replaced
            with a link to the page that says plainly where things stand. */}
        <div className="pilot-readiness">
          <Link className="btn btn-ghost" to="/gainesville">
            Where the pilot actually stands <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
