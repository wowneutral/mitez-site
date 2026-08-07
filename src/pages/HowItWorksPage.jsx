import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { Network, MarginNote } from '../components/sections/Moments.jsx';

const STEPS = [
  {
    num: '01',
    title: 'Tell us what you want to learn',
    copy: 'A subject, a skill, a project, or a problem. Anything counts.',
  },
  {
    num: '02',
    title: 'Connect',
    copy: 'We match you with someone who already knows it, a person, not a chatbot.',
  },
  {
    num: '03',
    title: 'Work through it together',
    copy: 'Sessions focus on your next step, not a generic curriculum.',
  },
  {
    num: '04',
    title: 'Keep going',
    copy: 'Come once, or stay for the whole thing. Either way it stays free.',
  },
];

const FAQ = [
  {
    q: 'What can I ask about?',
    a: 'Anything you want to learn. There is no fixed list of subjects.',
  },
  {
    q: 'Who is this for?',
    a: 'Students, adults, parents, educators, and organizations. There is no age limit.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing.',
  },
  {
    q: 'Do I have to be in Gainesville?',
    a: 'No. The program runs fully remote, so where you live does not decide whether you can take part. Gainesville is where we started, not a requirement.',
  },
  {
    q: 'How long does it take to hear back?',
    a: 'Usually a few days.',
  },
];

export default function HowItWorksPage() {
  // Same scroll-tied progress line as the homepage's How It Works
  // section — reused here rather than the old single narrow column,
  // which left most of the row empty on anything wider than a phone.
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <main className="page" id="main">
      <SEO
        title="How It Works"
        description="Tell us what you want to learn, get matched with someone who knows it, and work through it together, free, with no fixed subject list."
        path="/how-it-works"
      />
      <PageHeader
        eyebrow="How It Works"
        title="From stuck to supported."
        lede="Four steps, no paperwork."
      />

      <section className="section how" ref={sectionRef}>
        <div className="wrap how-grid">
          <div className="how-left">
            <p className="section-label">The Process</p>
            <h2>Simple on purpose.</h2>
            <div className="how-progress-track">
              <motion.div className="how-progress-fill" style={{ height: lineHeight }} />
            </div>
          </div>
          <div className="how-rows">
            {STEPS.map((s, i) => (
              <Reveal as="div" variant="right" delay={i * 0.1} key={s.num} className="how-row">
                <span className="num" aria-hidden="true">{s.num}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-sec">
        <div className="wrap">
          <p className="section-label">Common questions</p>
          <dl className="faq">
            {FAQ.map((f, i) => (
              <Reveal as="div" variant="up" delay={i * 0.06} key={f.q} className="faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <h2>Ready when you are.</h2>
          <Link className="btn btn-primary" to="/get-involved">
            Get started
          </Link>
        </div>
      </section>

      {/* Both of these belong on this page rather than the homepage.
          Network is a diagram of the process, and this is the process
          page. MarginNote annotates "not a chatbot", which is a promise
          this page makes and the homepage only implies. */}
      <Network />
      <MarginNote />
      <Footer />
    </main>
  );
}
