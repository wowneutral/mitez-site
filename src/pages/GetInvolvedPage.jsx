import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TALLY } from '../config/forms.js';

// Link out to Tally rather than embed. The embed put Tally's own cover
// image / avatar (set in their dashboard, not ours) directly into the
// page, and there is no way to hide it from the embed URL or from our
// CSS since it renders inside Tally's own iframe. Buttons keep the page
// looking like the rest of the site and still take one click to reach
// the actual form.
const BLOCKS = [
  {
    id: 'learn',
    label: '01',
    title: 'Learn something',
    copy: 'Tell us what you want to figure out. We find someone who knows it.',
    formId: TALLY.learn,
  },
  {
    id: 'mentor',
    label: '02',
    title: 'Teach something',
    copy: 'Know a skill well enough to walk someone through it? That is enough.',
    formId: TALLY.mentor,
  },
  {
    id: 'partner',
    label: '03',
    title: 'Partner with us',
    copy: 'Schools, libraries, and organizations — host a session or send people our way.',
    formId: TALLY.partner,
  },
  {
    id: 'donate',
    label: '04',
    title: 'Support the work',
    copy: 'Help keep every part of this free for the people using it.',
    formId: TALLY.donate,
  },
];

export default function GetInvolvedPage() {
  return (
    <main className="page">
      <SEO
        title="Get Involved"
        description="Learn something, teach something, partner as a school or organization, or support the work — every way to get involved with MITEZ is free."
        path="/get-involved"
      />
      <PageHeader
        eyebrow="Get Involved"
        title="Come learn, come teach, or help us reach further."
        lede="Pick whichever fits. Every one is free — each opens a short form in a new tab."
      />

      <section className="section">
        <div className="wrap">
          <div className="involved-grid">
            {BLOCKS.map((b, i) => (
              <Reveal
                as="a"
                variant={i % 2 === 0 ? 'left' : 'right'}
                delay={i * 0.08}
                key={b.id}
                className="involved-card"
                href={`https://tally.so/r/${b.formId}`}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <p className="section-label">{b.label}</p>
                  <h3>{b.title}</h3>
                  <p>{b.copy}</p>
                </div>
                <span className="involved-cta">
                  Open form <span>&rarr;</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
