import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TextAnimate } from '../components/magicui/text-animate.jsx';

const VALUES = [
  {
    num: '01',
    title: 'No subject list',
    copy: 'If someone wants to learn it and someone can teach it, that counts.',
  },
  {
    num: '02',
    title: 'Free, actually',
    copy: 'Not a trial, not a tier. Cost is the barrier we exist to remove.',
  },
  {
    num: '03',
    title: 'People, not portals',
    copy: 'A real person who has done the thing beats another dashboard.',
  },
  {
    num: '04',
    title: 'Show up early',
    copy: 'Help matters most before someone has already given up.',
  },
];

export default function About() {
  return (
    <main className="page">
      <SEO
        title="About"
        description="MITEZ started in Gainesville, Florida with one promise: make it easier to find someone who will help you learn anything, for free. Here's what we hold to and where things stand today."
        path="/about"
      />
      <PageHeader
        eyebrow="About"
        title="Make It Easy."
        lede="One place to learn anything, instead of ten."
      />

      <section className="section">
        <div className="wrap about-lead">
          <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
            Learning something new should not depend on who you already know.
          </TextAnimate>
          <p className="lede">
            Most people give up on a skill long before they lose interest. They give
            up because help was scattered, expensive, or behind a connection they did
            not have. MITEZ exists to close that gap.
          </p>
        </div>
      </section>

      <section className="section about-values">
        <div className="wrap">
          <p className="section-label">What we hold to</p>
          {/* Set as large typographic statements rather than a card grid.
              These are three short declarations, and putting a declaration
              in a bordered box makes it look like a feature bullet. */}
          <div className="manifesto">
            {VALUES.map((v, i) => (
              <Reveal as="div" variant="up" delay={i * 0.08} key={v.num} className="manifesto-item">
                <span className="manifesto-num" aria-hidden="true">{v.num}</span>
                <h3 className="manifesto-term">{v.title}</h3>
                <p className="manifesto-note">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column quote spread — same founder-grid pattern as the
          homepage's Founder's Note, reused here so the quote fills the
          row instead of sitting alone in a narrow centered column. */}
      <section className="section founder">
        <div className="wrap founder-grid">
          <Reveal as="div" variant="left" className="founder-quote-wrap">
            <span className="founder-glyph" aria-hidden="true">&ldquo;</span>
            <p className="founder-quote">
              &ldquo;Nobody should need to be loud, well-connected, or already
              confident to get help with something they want to learn.&rdquo;
            </p>
          </Reveal>
          <Reveal as="div" variant="right" delay={0.15} className="founder-side">
            <p>
              MITEZ started with one promise: whatever you are trying to learn,
              make it easier to find someone who will help you do it.
            </p>
            <div className="founder-sign">
              Armaan Seth
              <span>Founder, MITEZ</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Board / legal status intentionally not claimed anywhere on this
          page — MITEZ is not incorporated yet. This section states where
          things actually stand and can become the real board listing
          later without rewriting the page. */}
      <section className="section about-status">
        <div className="wrap">
          <p className="section-label">Where we are</p>
          <h2>Being built in the open.</h2>
          <p className="lede">
            We are early. The board and formal structure are being put together now,
            and this page will say exactly who is involved once that is real rather
            than planned.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap page-cta">
          <h2>Ready to be part of it?</h2>
          <Link className="btn btn-primary" to="/get-involved">
            Get involved
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
