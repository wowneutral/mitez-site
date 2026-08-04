import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TALLY } from '../config/forms.js';
import RiseText from '../components/RiseText.jsx';

/**
 * The Gainesville / pilot page.
 *
 * Uses only classes that exist in this project's stylesheet. An earlier
 * version of this file was written with .card, .checks, .prose and
 * .caps-sec — those belong to a different codebase and are undefined here,
 * so the panel rendered with no background and the list fell back to
 * browser default bullets.
 *
 * Every claim is one MITEZ can stand behind today. It does NOT say anything
 * is delivered in person, that a partnership exists, that the organization
 * is incorporated, or that a board is seated.
 */

// Honest status. Reuses the SPACE row pattern (.who-list / .who-row), which
// is this site's established way of showing a label-plus-explanation list.
const NOW = [
  {
    k: 'Running now',
    v: 'We are already answering people and helping with what they bring us, one request at a time, informally.',
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

// Intent, not arrangements. Rendered as .reach, a numbered list unique to
// this page.
const REACH = [
  { n: '01', t: 'Nonprofits', c: 'Organizations that need hands more than they need advice.' },
  { n: '02', t: 'Students without resources', c: 'The people for whom paid help was never an option.' },
  { n: '03', t: 'Students with resources', c: 'Who want to go further than their school can take them.' },
  { n: '04', t: 'Organizations with a site problem', c: 'A website or set of materials that is holding them back.' },
  { n: '05', t: 'Libraries and community spaces', c: 'Already trusted by the people we want to reach.' },
  { n: '06', t: 'Universities and colleges', c: 'Students who want to teach as much as they want to learn.' },
];

export default function Gainesville() {
  return (
    <main className="page">
      <SEO path="/gainesville" />
      <PageHeader
        eyebrow="The pilot"
        title="Started in Gainesville. Built to reach past it."
        lede="Free mentorship and hands-on help, run remotely, so where you live is not what decides whether you get it."
      />

      {/* The remote decision. The most important fact about how this works,
          and it appears nowhere else on the site. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">Why remote</p>
          <RiseText as="h2">Distance decides who gets help. So we removed it.</RiseText>
          <p className="lede">
            The Make It Easy program runs completely remote, not because it is
            easier to operate, but because the moment help depends on getting somewhere,
            it stops being equal. A student without a ride. A parent working the hours a
            tutor is free. Someone in a town where nobody knows the thing they are trying
            to learn. Remote puts all of them on the same footing.
          </p>
          <p className="lede">
            Gainesville is where this started and where we are from. It is not a boundary.
            If you found this page from somewhere else, you are still welcome.
          </p>
        </div>
      </section>

      {/* Honest status — the part most organizations leave vague.
          Rendered with the .faq pattern (a definition list) rather than the
          SPACE rows: those show a large single letter per row, which here
          would spell R/L/S/N and read as an acronym that does not exist. */}
      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">Where we actually stand</p>
          <RiseText as="h2">Early, and saying so.</RiseText>
          <dl className="faq">
            {NOW.map((row, i) => (
              <Reveal as="div" variant="up" delay={i * 0.06} key={row.k} className="faq-item">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* What people have actually asked for, framed so it does not read as
          a menu we are limited to. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">What people have asked for</p>
          <RiseText as="h2">Debate and coding got here first.</RiseText>
          <p className="lede">
            Those are what the first people through the door happened to want. They are
            not a list of what we do, the whole point is that there is no list. If
            someone wants to learn it and someone can teach it, that counts. Ask for the
            thing you actually want, not the closest thing on a menu.
          </p>
        </div>
      </section>

      {/* Outreach intent, explicitly not claimed as partnerships. */}
      <section className="section">
        <div className="wrap">
          <div className="solution-head">
            <p className="section-label">Who we are trying to reach</p>
            <RiseText as="h2">The people we are going after next.</RiseText>
            <p className="lede">
              None of these are arrangements yet. This is who we think needs this most,
              and who we are working to get in front of.
            </p>
          </div>
          {/* Its own treatment rather than the bordered card grid, which
              is now used only by the Response section on the homepage.
              Oversized numerals carry the structure so no boxes are needed. */}
          <ol className="reach">
            {REACH.map((r, i) => (
              <Reveal as="li" variant="up" delay={i * 0.07} key={r.n} className="reach-item">
                <span className="reach-num" aria-hidden="true">{r.n}</span>
                <span className="reach-body">
                  <h3>{r.t}</h3>
                  <p>{r.c}</p>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <h2>Small, early, and open.</h2>
          <p className="lede" style={{ marginBottom: 0 }}>
            If you are one of the people above, or you know who we should be
            talking to, that is the most useful thing you could send us right now.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
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
