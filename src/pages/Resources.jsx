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
    label: 'Debate and public speaking',
    note: 'Beyond the obvious tournament sites.',
    items: [
      { t: 'openCaselist', u: 'https://opencaselist.com/',
        c: 'The public case and evidence wiki competitive circuits publish to. Read what real teams are actually running.' },
      { t: 'DebateDrills open evidence', u: 'https://www.debatedrills.com/free-resources',
        c: 'Free drills and briefs, the sort of thing normally locked behind a paid camp.' },
      { t: 'Michigan Debate Institutes archive', u: 'https://openev.debatecoaches.org/',
        c: 'Years of summer camp evidence files, released free. Enormous and underused.' },
      { t: 'Toastmasters Pathways basics', u: 'https://www.toastmasters.org/resources',
        c: 'For speaking rather than competing. Structure for people who freeze up presenting.' },
    ],
  },
  {
    label: 'Making things with code',
    note: 'Skip the tutorial treadmill and build something.',
    items: [
      { t: 'The Odin Project', u: 'https://www.theodinproject.com/',
        c: 'A full path where you build projects instead of watching videos. Free, no account needed to read it.' },
      { t: 'Exercism', u: 'https://exercism.org/',
        c: 'Practice problems in 70 languages with a human mentor who reviews your code, free.' },
      { t: 'Godot', u: 'https://docs.godotengine.org/',
        c: 'Open source game engine. Genuinely free forever, no revenue share, good docs.' },
      { t: 'Nand2Tetris', u: 'https://www.nand2tetris.org/',
        c: 'Build a working computer from logic gates upward. The course that makes computers stop being magic.' },
    ],
  },
  {
    label: 'Art, music and making',
    note: 'The subjects schools cut first.',
    items: [
      { t: 'Blender tutorials', u: 'https://www.blender.org/support/tutorials/',
        c: '3D modelling and animation, professional grade, completely free.' },
      { t: 'MuseScore', u: 'https://musescore.org/',
        c: 'Write and hear sheet music without buying notation software.' },
      { t: 'Drawabox', u: 'https://drawabox.com/',
        c: 'A brutal, effective free drawing course. Fundamentals, not tracing.' },
      { t: 'Learning Music by Ableton', u: 'https://learningmusic.ableton.com/',
        c: 'Interactive introduction to making music in the browser. Nothing to install.' },
    ],
  },
  {
    label: 'Money, work and adult life',
    note: 'The things nobody teaches you on purpose.',
    items: [
      { t: 'FDIC Money Smart for Young People', u: 'https://www.fdic.gov/resources/consumers/money-smart/',
        c: 'Federal government financial literacy curriculum. Dry, accurate, free.' },
      { t: 'Consumer Financial Protection Bureau guides', u: 'https://www.consumerfinance.gov/consumer-tools/',
        c: 'Straight answers on loans, credit and being taken advantage of.' },
      { t: 'Federal Student Aid', u: 'https://studentaid.gov/',
        c: 'The actual source on FAFSA and student loans, not a company selling you something.' },
    ],
  },
  {
    label: 'Science and maths, past school level',
    note: 'For when the textbook stops being enough.',
    items: [
      { t: '3Blue1Brown', u: 'https://www.3blue1brown.com/',
        c: 'Visual explanations of linear algebra and calculus that make the ideas click.' },
      { t: 'Paul\u2019s Online Math Notes', u: 'https://tutorial.math.lamar.edu/',
        c: 'Algebra through differential equations, worked examples throughout.' },
      { t: 'NASA Open Data', u: 'https://data.nasa.gov/',
        c: 'Real datasets to practise on, if you want to analyse something that is not made up.' },
      { t: 'Protein Data Bank', u: 'https://www.rcsb.org/',
        c: 'Every solved protein structure, free. Useful and quietly astonishing.' },
    ],
  },
  {
    label: 'Writing, history and reading',
    note: 'Primary sources beat summaries.',
    items: [
      { t: 'Purdue OWL', u: 'https://owl.purdue.edu/',
        c: 'The writing and citation reference most university courses point at.' },
      { t: 'DPLA', u: 'https://dp.la/',
        c: 'Millions of digitised items from American libraries and archives. Primary sources, free.' },
      { t: 'Standard Ebooks', u: 'https://standardebooks.org/',
        c: 'Public domain books, properly typeset rather than dumped as raw text.' },
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
        lede="If you want to learn one thing quickly, you should not have to wait for us. Everything here is free, open to anyone, and needs nothing from you, no account with us, no form, no permission."
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
            <Link to="/terms">Terms</Link>. It is not a hurdle we invented, it is the
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
            {/* A link list rather than the card grid used on Get Involved.
                Twenty-two big cards would be a wall of boxes, and each of
                these is a link with a source worth showing, so the domain
                sits in the row. */}
            <ul className="res-list">
              {g.items.map((item, i) => (
                <Reveal as="li" variant="up" delay={i * 0.05} key={item.t} className="res-row">
                  <a href={item.u} target="_blank" rel="noreferrer noopener">
                    <span className="res-main">
                      <span className="res-name">{item.t}</span>
                      <span className="res-host">{new URL(item.u).hostname.replace(/^www\./, '')}</span>
                    </span>
                    <span className="res-desc">{item.c}</span>
                    <span className="res-go" aria-hidden="true">&rarr;</span>
                  </a>
                </Reveal>
              ))}
            </ul>
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
