import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TALLY } from '../config/forms.js';

/**
 * The Gainesville / pilot page.
 *
 * Every claim here is one MITEZ can actually stand behind today. In
 * particular this page does NOT say: that anything is delivered in person,
 * that any partnership exists, that the organization is incorporated, or
 * that any board is seated. Those were all either absent or overstated
 * elsewhere on the site and have been corrected.
 *
 * It also deliberately avoids repeating the homepage Pilot band, which is
 * now a short teaser pointing here rather than a second copy of this
 * content.
 */

// What is genuinely true right now, stated plainly.
const NOW = [
  {
    k: 'Running now',
    v: 'We are already answering people and helping with what they bring us — one request at a time, informally.',
  },
  {
    k: 'Lined up',
    v: 'A small number of mentors with real specialties, and students who have already said what they want to work on.',
  },
  {
    k: 'Still needed',
    v: 'More mentors, and more people willing to ask. Both sides of this are small right now.',
  },
  {
    k: 'Not yet',
    v: 'We are not incorporated. Until that is done there is a ceiling on what we can formally take on.',
  },
];

// Who we intend to reach. Framed as intent, because none of these are
// agreements — naming them as partners would be false.
const REACH = [
  'Other nonprofits that need hands more than they need advice',
  'Students without the resources to buy help',
  'Students who have resources and want to go further than their school can take them',
  'Organizations sitting on a website or materials that are holding them back',
  'Libraries and community spaces already trusted by the people we want to reach',
  'Universities and colleges with students who want to teach as much as learn',
];

export default function Gainesville() {
  return (
    <main className="page">
      <SEO path="/gainesville" />
      <PageHeader
        eyebrow="The pilot"
        title="Started in Gainesville. Built to reach past it."
        lede="Free mentorship and hands-on help in Gainesville, Florida — run remotely, so where you live is not the thing that decides whether you get help."
      />

      {/* The remote decision — the single most important fact about how this
          works, and it appears nowhere else on the site. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">Why remote</p>
          <h2>Distance is the first thing that decides who gets help. So we removed it.</h2>
          <p className="lede">
            The Make It Easy program runs completely remote. Not because it is easier to
            operate, but because the moment help depends on getting somewhere, it stops
            being equal. A student without a ride, a parent working through the hours a
            tutor is free, someone in a town with nobody who knows the thing they are
            trying to learn &mdash; remote is what puts all of them on the same footing.
          </p>
          <p className="lede">
            Gainesville is where this started and where we are from. It is not a
            boundary. If you found this page from somewhere else, you are still welcome.
          </p>
        </div>
      </section>

      {/* Honest status. This is the part most organizations leave vague. */}
      <section className="section caps-sec" style={{ borderTop: '1px solid rgba(22,24,29,0.1)' }}>
        <div className="wrap">
          <p className="section-label">Where we actually stand</p>
          <h2>Early, and saying so.</h2>
          <div className="who-list" style={{ marginTop: '18px' }}>
            {NOW.map((row, i) => (
              <Reveal as="div" variant="left" delay={i * 0.08} key={row.k} className="who-row">
                <span className="who-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="role">{row.k}</span>
                <p>{row.v}</p>
              </Reveal>
            ))}
          </div>
          <p className="lede" style={{ marginTop: '26px' }}>
            More on the structure and where it is going is on the{' '}
            <Link to="/about">About page</Link>.
          </p>
        </div>
      </section>

      {/* What people have actually asked for. Deliberately framed so it does
          not read as a menu of subjects we are limited to. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">What people have asked for</p>
          <h2>Debate and coding got here first.</h2>
          <p className="lede">
            Those are the subjects the first people through the door happened to want.
            They are not a list of what we do. The whole point is that there is no list
            &mdash; if someone wants to learn it and someone can teach it, that counts.
            Ask for the thing you actually want, not the closest thing on a menu.
          </p>
        </div>
      </section>

      {/* Outreach intent — explicitly not claimed as partnerships. */}
      <section className="section caps-sec">
        <div className="wrap">
          <p className="section-label">Who we are trying to reach</p>
          <h2>The people we are going after next.</h2>
          <p className="lede">
            None of these are arrangements yet. This is who we think needs this most,
            and who we are working to get in front of.
          </p>
          <div className="card card-static" style={{ marginTop: '22px' }}>
            <ul className="checks" style={{ marginTop: 0 }}>
              {REACH.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <p className="lede" style={{ marginTop: '22px' }}>
            If you are one of them &mdash; or you know who we should be talking to &mdash;
            that is genuinely the most useful thing you could send us right now.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <h2>Small, early, and open.</h2>
          <div className="cta-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a className="btn btn-primary" href={`https://tally.so/r/${TALLY.learn}`} target="_blank" rel="noreferrer">
              Ask for help
            </a>
            <a className="btn btn-ghost" href={`https://tally.so/r/${TALLY.mentor}`} target="_blank" rel="noreferrer">
              Offer to teach
            </a>
            <Link className="btn btn-ghost" to="/contact">
              Point us at someone
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
