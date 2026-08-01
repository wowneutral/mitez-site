import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TextAnimate } from '../components/magicui/text-animate.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

/**
 * Privacy policy, written to be read by a parent rather than a lawyer.
 *
 * Describes only what the site actually does: five Tally forms, a FormSubmit
 * contact form, and no analytics or tracking of any kind at the time of
 * writing. If analytics are added later, the "what we do not do" section
 * below stops being true and has to be updated in the same commit.
 *
 * This is a plain description of practice, not legal advice. MITEZ collects
 * information from people under 18, which carries specific obligations in the
 * US, and someone qualified should confirm what applies before the programme
 * scales.
 */

const COLLECT = [
  {
    k: 'What you type into a form',
    v: 'Your name, an email address, and whatever you tell us about what you want to learn or help with. Nothing more than the form asks for.',
  },
  {
    k: 'Who holds it',
    v: 'Our interest forms run on Tally, and the contact form sends email through FormSubmit. Both are outside services, so your submission passes through them on the way to us.',
  },
  {
    k: 'Where it ends up',
    v: 'In the MITEZ inbox, read by the people who run MITEZ. We do not sell it, share it, or hand it to anyone else.',
  },
  {
    k: 'How long we keep it',
    v: 'As long as we are working with you, and a while after in case you come back. Ask us to delete it and we will, and we will confirm when it is done.',
  },
];

export default function Privacy() {
  return (
    <main className="page">
      <SEO path="/privacy" />
      <PageHeader
        eyebrow="Privacy"
        title="What we collect, and what we do with it."
        lede="Short version: only what you type into a form, only so we can help you, and never sold to anyone."
      />

      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">The whole of it</p>
          <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
            Four things worth knowing.
          </TextAnimate>
          <dl className="faq">
            {COLLECT.map((row, i) => (
              <Reveal as="div" variant="up" delay={i * 0.06} key={row.k} className="faq-item">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">What we do not do</p>
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            No tracking, no ads, no selling.
          </TextAnimate>
          <p className="lede">
            This site runs no analytics and sets no tracking cookies. We do not know who
            you are or what you looked at unless you send us a form and tell us. There is
            no advertising here and there never will be, and nothing you give us is
            passed to anyone for money.
          </p>
        </div>
      </section>

      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">If you are under 18</p>
          <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
            We will want to talk to a parent.
          </TextAnimate>
          <dl className="faq">
            <Reveal as="div" variant="up" className="faq-item">
              <dt>Resources need nothing from you</dt>
              <dd>
                The <Link to="/resources">resources page</Link> is open to anyone at any
                age. No account, no form, no permission, and we do not find out you were
                there.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.04} className="faq-item">
              <dt>A mentor is where consent comes in</dt>
              <dd>
                If you are under 18 and ask to be matched with a mentor, we contact a
                parent or guardian and get their agreement first. That is because it puts
                you in a room with an adult, not because of the subject. It is described
                in full on the <Link to="/safety">safety page</Link>.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.06} className="faq-item">
              <dt>A parent can ask for anything we hold</dt>
              <dd>
                Email us and we will tell you exactly what we have about your child and
                delete it if you want it gone.
              </dd>
            </Reveal>
            <Reveal as="div" variant="up" delay={0.12} className="faq-item">
              <dt>Please do not send more than we need</dt>
              <dd>
                We do not need a home address, a school ID, a date of birth or anything
                medical. If a form seems to be asking for more than makes sense, skip it
                and tell us.
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-lead">
          <p className="section-label">Getting your data back or removed</p>
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Ask, and it is done.
          </TextAnimate>
          <p className="lede">
            Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and ask us to
            show you what we hold, correct it, or delete it. You do not have to give a
            reason. We will do it and confirm back to you.
          </p>
          <p className="lede">
            MITEZ is not yet an incorporated organisation. This page describes how the
            people running it handle your information today, and it will be updated as
            that changes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Anything here you want explained?
          </TextAnimate>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/contact">
              Ask us
            </Link>
            <Link className="btn btn-ghost" to="/safety">
              How we keep sessions safe
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
