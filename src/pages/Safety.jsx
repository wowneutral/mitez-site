import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TextAnimate } from '../components/magicui/text-animate.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

/**
 * Safety page.
 *
 * MITEZ pairs volunteer mentors with students, many of whom are minors, over
 * video. Before this page existed the site said nothing at all about how that
 * is kept safe, which is both the first question a parent asks and the reason
 * a school or library would decline to engage.
 *
 * Every statement here describes what MITEZ actually does today. It does NOT
 * claim background checks, a formal screening process, certifications, an
 * incorporated entity or a seated board, because none of those exist yet. The
 * "not yet" section says so plainly rather than leaving a gap for a reader to
 * fill in optimistically.
 *
 * If the rules below change in practice, this page has to change with them.
 * A safety page that describes something the organization does not actually
 * do is worse than no safety page.
 */

// How a mentor actually reaches a student today.
const MENTOR_STEPS = [
  {
    k: 'They come through someone we know',
    v: 'Every mentor working with MITEZ right now is someone our team knows personally and will vouch for. We are small enough that this is still true of every single one.',
  },
  {
    k: 'We talk to them first',
    v: 'Before a mentor is matched with anyone, someone from MITEZ has spoken with them about what they want to help with and how sessions are expected to run.',
  },
  {
    k: 'They agree to the session rules',
    v: 'The rules further down this page are not suggestions. A mentor who will not work that way does not get matched.',
  },
  {
    k: 'What we do not do yet',
    v: 'We do not run formal background checks, and we are not going to imply otherwise. Vouching by people who know each other is what a group this size can honestly do. Before MITEZ grows past the point where that holds, formal screening has to come first, and this page will say so when it does.',
  },
];

// The rules that apply to every session involving someone under 18.
const SESSION_RULES = [
  {
    n: '01',
    t: 'A parent or guardian says yes first',
    c: 'Nobody under 18 is matched with a mentor until a parent or guardian has been contacted and agreed to it. Not a checkbox — an actual reply from an adult we can reach.',
  },
  {
    n: '02',
    t: 'A parent can always be in the room',
    c: 'Any parent or guardian is welcome to sit in on any session, announced or not. No mentor may ask for that to stop.',
  },
  {
    n: '03',
    t: 'Sessions happen on the link we send',
    c: 'Video calls run on a link MITEZ arranges. Sessions do not move to a mentor’s personal account, a game chat, or anywhere the arrangement is not visible to us.',
  },
  {
    n: '04',
    t: 'No private contact on the side',
    c: 'Mentors do not exchange personal phone numbers, social accounts or direct messages with a student. Anything that needs saying between sessions goes through us.',
  },
  {
    n: '05',
    t: 'Nobody meets in person',
    c: 'The programme is fully remote and that includes the safety side of it. A mentor who suggests meeting in person is reported to us and is done working with MITEZ.',
  },
  {
    n: '06',
    t: 'It stays about the thing being learned',
    c: 'Mentors are there to help with a skill. They are not there to give personal, medical or financial advice, and they do not ask for anything in return.',
  },
];

export default function Safety() {
  return (
    <main className="page">
      <SEO path="/safety" />
      <PageHeader
        eyebrow="Safety"
        title="How we keep this safe, and what we have not built yet."
        lede="MITEZ puts volunteers in front of students, and a lot of those students are under 18. Here is exactly how that works today, including the parts we are still missing."
      />

      {/* The honest framing up front. A parent who reads only this section
          should still come away with an accurate picture. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">The short version</p>
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Small, remote, and answerable to you.
          </TextAnimate>
          <p className="lede">
            We are a small group. That has a real downside, which is that we do not yet
            have the formal safeguarding machinery a large organisation would have. It
            also has an advantage we take seriously: there is no mentor here we cannot
            personally account for, and there is no session you cannot ask about and get
            a straight answer.
          </p>
          <p className="lede">
            If anything on this page is not what you experience, that is a problem we want
            to hear about immediately. The address at the bottom reaches a person.
          </p>
        </div>
      </section>

      {/* Mentor path — the "who are these people" question. */}
      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">Where mentors come from</p>
          <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
            Vouched for, not screened by a system.
          </TextAnimate>
          <dl className="faq">
            {MENTOR_STEPS.map((row, i) => (
              <Reveal as="div" variant="up" delay={i * 0.06} key={row.k} className="faq-item">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* The operating rules. */}
      <section className="section">
        <div className="wrap">
          <div className="solution-head">
            <p className="section-label">Rules for every session with a minor</p>
            <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
              Six rules we do not bend.
            </TextAnimate>
            <p className="lede">
              These apply to every mentor, every time, with no exceptions for someone we
              like or trust. A mentor who breaks one is finished working with MITEZ.
            </p>
          </div>
          <div className="sol-cards">
            {SESSION_RULES.map((r, i) => (
              <Reveal as="div" variant="up" delay={i * 0.07} key={r.n} className="sol-card">
                <p className="sol-num">{r.n}</p>
                <h3>{r.t}</h3>
                <p>{r.c}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What actually happens after a form is submitted — removes the
          "I sent something into a void" feeling and sets a real expectation. */}
      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">After you send a form</p>
          <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
            What happens next, in order.
          </TextAnimate>
          <dl className="faq">
            <Reveal as="div" variant="up" className="faq-item">
              <dt>A person reads it</dt>
              <dd>
                Not an automated system. Someone on our team reads what you wrote and
                works out who would actually be useful to you.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.06} className="faq-item">
              <dt>We reply, usually within a few days</dt>
              <dd>
                We are volunteers, so this is not instant. If a week goes by with nothing,
                assume something went wrong and email us directly rather than waiting.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.12} className="faq-item">
              <dt>If the student is under 18, we contact a parent or guardian</dt>
              <dd>
                Before any match is made. If we cannot reach an adult, we do not proceed.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.18} className="faq-item">
              <dt>Then a first session gets scheduled</dt>
              <dd>
                You will know who the mentor is and what they are helping with before it
                happens. If the match is wrong, say so and we will change it.
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>

      {/* Reporting route. Deliberately the last thing and deliberately blunt. */}
      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">If something is wrong</p>
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Tell us. We would rather hear it early.
          </TextAnimate>
          <p className="lede">
            If a mentor makes someone uncomfortable, contacts a student outside a session,
            or does anything described on this page as not allowed, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and say what happened.
            You do not need to be sure, and you do not need proof. We will take it
            seriously, we will tell you what we did about it, and a mentor can be removed
            the same day.
          </p>
          <p className="lede">
            If a child is in immediate danger, contact local emergency services first. We
            are a small volunteer group and we are not a substitute for that.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Questions before you sign anyone up?
          </TextAnimate>
          <p className="lede">
            Ask them. We would rather answer twenty questions than have you guess.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/contact">
              Ask us something
            </Link>
            <Link className="btn btn-ghost" to="/privacy">
              How we handle your data
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
