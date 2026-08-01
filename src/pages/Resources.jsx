import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TextAnimate } from '../components/magicui/text-animate.jsx';
import { TALLY } from '../config/forms.js';

/**
 * Resources.
 *
 * The point of this page is that it is ungated. Someone who wants two days
 * of help with one topic should not have to wait on a guardian consent
 * exchange to get started — consent exists to protect a student from being
 * put in front of an adult, and nothing on this page involves an adult.
 *
 * So: no form, no sign-up, no data collected, nothing to submit. Every item
 * is a link to a free public resource run by somebody else.
 *
 * IMPORTANT: these are not partnerships and must never be described as such.
 * MITEZ has no relationship with any organisation listed here — these are
 * simply free things that exist, collected in one place. Do not add anything
 * that requires payment, or that requires an account to be useful.
 */

const GROUPS = [
  {
    label: 'Debate',
    note: 'One of the two things people asked us for first.',
    items: [
      {
        t: 'NSDA resources',
        u: 'https://www.speechanddebate.org/resources/',
        c: 'Topic analysis, guides and materials from the National Speech & Debate Association.',
      },
      {
        t: 'Tabroom',
        u: 'https://www.tabroom.com/',
        c: 'Where tournaments are posted and entries are run. Free to make an account and browse.',
      },
      {
        t: 'openCaselist',
        u: 'https://opencaselist.com/',
        c: 'Public case and evidence archive that competitive circuits publish to.',
      },
    ],
  },
  {
    label: 'Coding',
    note: 'The other one. Start here if you have never written a line.',
    items: [
      {
        t: 'freeCodeCamp',
        u: 'https://www.freecodecamp.org/',
        c: 'Full curriculum, free, no paywall. Web development through to data analysis.',
      },
      {
        t: 'CS50',
        u: 'https://cs50.harvard.edu/x/',
        c: "Harvard's introduction to computer science, free to audit. Hard, and worth it.",
      },
      {
        t: 'The Odin Project',
        u: 'https://www.theodinproject.com/',
        c: 'Project-driven path into web development. You build things rather than watch videos.',
      },
      {
        t: 'Scratch',
        u: 'https://scratch.mit.edu/',
        c: 'From MIT. The easiest first step if you are younger or brand new.',
      },
    ],
  },
  {
    label: 'School subjects',
    note: 'Maths, science, history, test prep.',
    items: [
      {
        t: 'Khan Academy',
        u: 'https://www.khanacademy.org/',
        c: 'Free lessons and practice across most school subjects, plus SAT prep.',
      },
      {
        t: 'OpenStax',
        u: 'https://openstax.org/',
        c: 'Free, properly peer-reviewed textbooks you can read online or download.',
      },
      {
        t: 'MIT OpenCourseWare',
        u: 'https://ocw.mit.edu/',
        c: 'Actual MIT course materials, free. Useful when school has stopped stretching you.',
      },
    ],
  },
  {
    label: 'Languages and reading',
    note: 'Free, and genuinely free rather than a trial.',
    items: [
      {
        t: 'Duolingo',
        u: 'https://www.duolingo.com/',
        c: 'Language practice in short daily pieces.',
      },
      {
        t: 'Project Gutenberg',
        u: 'https://www.gutenberg.org/',
        c: 'Tens of thousands of books whose copyright has expired, free to download.',
      },
    ],
  },
];

export default function Resources() {
  return (
    <main className="page">
      <SEO path="/resources" />
      <PageHeader
        eyebrow="Resources"
        title="Start now, without waiting on anyone."
        lede="If you want to learn one thing quickly, you should not have to wait for us. Everything here is free, open to anyone, and needs nothing from you — no account with us, no form, no permission."
      />

      {/* The distinction that makes this page exist. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">Two different things</p>
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Resources are open. Mentorship is matched.
          </TextAnimate>
          <p className="lede">
            This page is a list of free things other people made, collected in one place.
            Nobody has to approve you and we do not need to know who you are. Open a link
            and go.
          </p>
          <p className="lede">
            Working with a mentor is different, because that puts you in a room with an
            adult. If you are under 18 that needs a parent or guardian to agree first, and
            we explain exactly why in our{' '}
            <Link to="/terms">Terms</Link>. It is not a hurdle we invented — it is the
            part that keeps this safe.
          </p>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section className="section" key={g.label}>
          <div className="wrap">
            <div className="solution-head">
              <p className="section-label">{g.label}</p>
              <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
                {g.note}
              </TextAnimate>
            </div>
            <div className="involved-grid">
              {g.items.map((item, i) => (
                <Reveal
                  as="a"
                  variant={i % 2 === 0 ? 'left' : 'right'}
                  delay={i * 0.07}
                  key={item.t}
                  className="involved-card"
                  href={item.u}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div>
                    <h3>{item.t}</h3>
                    <p>{item.c}</p>
                  </div>
                  <span className="involved-cta">
                    Open <span>&rarr;</span>
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Honest footnote about what these links are and are not. */}
      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">About this list</p>
          <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
            Worth saying plainly.
          </TextAnimate>
          <dl className="faq">
            <Reveal as="div" variant="up" className="faq-item">
              <dt>None of these are ours</dt>
              <dd>
                We did not make any of it and we are not partnered with any of them. These
                are free things that already exist, put in one place so you do not have to
                go looking.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.06} className="faq-item">
              <dt>We do not control what is on them</dt>
              <dd>
                They are other people&rsquo;s websites with their own rules and their own
                privacy policies. Some will ask you to make an account with them, which is
                between you and them, not us.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.12} className="faq-item">
              <dt>Tell us what is missing</dt>
              <dd>
                If you needed something and could not find it here, that is useful to know.
                Say so and we will add it.
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Got stuck, or want someone to work through it with you?
          </TextAnimate>
          <p className="lede">
            That is the part we do. Tell us what you are trying to learn and we will find
            you a person. If you are under 18 we will ask for a parent or guardian first.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={`https://tally.so/r/${TALLY.learn}`}
              target="_blank"
              rel="noreferrer"
            >
              Ask for a mentor
            </a>
            <Link className="btn btn-ghost" to="/terms">
              How that works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
