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
    note: 'The tools circuit debaters actually use, not the ones schools hand out.',
    items: [
      { t: 'openCaselist', u: 'https://opencaselist.com/',
        c: 'The wiki where competitive circuits publish their cases and evidence. Read what real teams are running before you meet them.' },
      { t: 'Haku', u: 'https://haku.cards/',
        c: 'Card search across 3.5 million cards indexed from openCaselist, 2013 onward, filterable by topic, school, tournament and tag.' },
      { t: 'Equality in Forensics', u: 'https://www.equalityinforensics.org/',
        c: 'Student-run and free: resource centres for circuit LD, PF, Congress, Worlds and extemp, plus free coaching.' },
      { t: 'Kritikal Discussions', u: 'https://kritikaldiscussions.com/',
        c: 'Free lectures and camps on kritiks, theory and framework, the material otherwise taught at expensive camps.' },
      { t: 'Kankee Briefs', u: 'https://www.kankeebriefs.org/',
        c: 'Free LD briefs released about two weeks after each topic drops. Every brief ever published is in an open Drive folder.' },
      { t: 'Isegora Briefs', u: 'https://isegorabriefs.org/',
        c: 'Open-source prep and the Evidence Vault: impact defence, impact turns, K answers and phil responses, no paywall.' },
      { t: 'DebateDrills open resources', u: 'https://www.debatedrills.com/free-resources',
        c: 'Free drills and briefs from a paid outfit, worth taking because it is the same material.' },
      { t: 'Open Evidence Project', u: 'https://openev.debatecoaches.org/',
        c: 'Every major summer institute releases its camp files here at the end of the season. Enormous, and free.' },
      { t: 'Circuitdebater', u: 'https://ld.circuitdebater.org/',
        c: 'Community wiki explaining kritiks, theory, tricks and framework in plain terms. Start here if the jargon is the barrier.' },
    ],
  },
  {
    label: 'Get help with schoolwork',
    note: 'Live help and structured practice.',
    items: [
      { t: 'Schoolhouse.world', u: 'https://schoolhouse.world/',
        c: 'Free live tutoring from trained student tutors. Scheduled classes, SAT bootcamps and drop-in help sessions.' },
      { t: 'Khan Academy', u: 'https://www.khanacademy.org/',
        c: 'Short lessons, practice and quizzes across maths, science, history, economics and AP, with progress tracking.' },
      { t: 'CK-12', u: 'https://www.ck12.org/',
        c: 'Free digital textbooks, videos and interactive practice for middle and high school maths and science.' },
    ],
  },
  {
    label: 'Writing, research and textbooks',
    note: 'Reference you can cite rather than guess at.',
    items: [
      { t: 'Purdue Online Writing Lab', u: 'https://owl.purdue.edu/owl/index.html',
        c: 'MLA and APA citation, the writing process, grammar, plagiarism, resumes and application writing.' },
      { t: 'OpenStax', u: 'https://openstax.org/subjects',
        c: 'Free peer-reviewed textbooks for high school, AP and college across maths, sciences, humanities and business.' },
      { t: 'GCFGlobal', u: 'https://edu.gcfglobal.org/',
        c: 'Beginner lessons in Excel, Word, email, internet safety and job preparation. Practical rather than academic.' },
    ],
  },
  {
    label: 'Maths and science tools',
    note: 'Things to work with, not just read.',
    items: [
      { t: 'Desmos', u: 'https://www.desmos.com/calculator',
        c: 'Graphing, scientific, geometry and 3D calculators in the browser. Nothing to install.' },
      { t: 'GeoGebra', u: 'https://www.geogebra.org/',
        c: 'Geometry, algebra, calculus and statistics with interactive constructions for grades 4 to 12.' },
      { t: 'Science Buddies', u: 'https://www.sciencebuddies.org/',
        c: 'Over 1,200 project ideas filterable by grade, cost and time, plus the scientific method explained properly.' },
      { t: 'NASA Learning Resources', u: 'https://www.nasa.gov/learning-resources/',
        c: 'Student activities, challenges and internships tied to real missions.' },
    ],
  },
  {
    label: 'Coding and technology',
    note: 'From first block to first certification.',
    items: [
      { t: 'Scratch', u: 'https://scratch.mit.edu/',
        c: 'From MIT. Build stories, animations and games with visual blocks. The easiest possible start.' },
      { t: 'Code.org', u: 'https://code.org/en-US/students',
        c: 'Self-paced K to 12 courses across programming, problem solving, internet safety and AI literacy.' },
      { t: 'freeCodeCamp', u: 'https://www.freecodecamp.org/learn/',
        c: 'Structured lessons, real projects and free certifications in web development and data.' },
    ],
  },
  {
    label: 'College, scholarships and careers',
    note: 'Including the Florida-specific ones nobody tells you about.',
    items: [
      { t: 'BigFuture', u: 'https://bigfuture.collegeboard.org/',
        c: 'Build a college list, compare schools, explore majors and search thousands of scholarships.' },
      { t: 'FAFSA', u: 'https://studentaid.gov/h/apply-for-aid/fafsa',
        c: 'The official federal aid application. It is free, and this is the real site rather than one charging you.' },
      { t: 'FloridaShines', u: 'https://www.floridashines.org/',
        c: 'Compare Florida schools and programs, plan transfers, and use the state Xello career system.' },
      { t: 'Florida Bright Futures', u: 'https://www.fldoe.org/finance/financial-aid-scholarships/',
        c: 'Official information on Bright Futures, CTE funding and Florida student financial assistance.' },
      { t: 'My Next Move', u: 'https://www.mynextmove.org/',
        c: 'A free interest assessment and 900+ careers by industry, training required and outlook.' },
    ],
  },
  {
    label: 'Gainesville and Alachua County',
    note: 'Free, local, and staffed by people.',
    items: [
      { t: 'Alachua County Library student resources', u: 'https://www.aclib.us/kids',
        c: 'Homework help, research databases, STEM kits, computers, internet access and study space.' },
      { t: 'Library Partnership Resource Center', u: 'https://www.aclib.us/library-partnership-branch',
        c: 'In-person K to 12 academic help, literacy support, study rooms and job assistance. Availability varies, so call before going.' },
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
