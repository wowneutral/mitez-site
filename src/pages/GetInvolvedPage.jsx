import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TallyEmbed from '../components/TallyEmbed.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { TALLY } from '../config/forms.js';

// This page is now the ONE place the forms live.
//
// Testers pointed out that it previously showed the same four cards as
// the homepage section, linking out to the same four Tally forms — so
// clicking "Get Involved" in the nav landed you on a near-identical view
// of what you had just scrolled past, for no added value. Now the
// homepage cards summarise and link here, and here is where you actually
// fill something in. Each block has an id so those cards can deep-link
// straight to the relevant form.
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
        lede="Pick whichever fits. Every one is free."
      />

      {BLOCKS.map((b) => (
        <section className="section involved-block" id={b.id} key={b.id}>
          <div className="wrap">
            <Reveal as="div" variant="up">
              <p className="section-label">{b.label}</p>
              <h2>{b.title}</h2>
              <p className="lede">{b.copy}</p>
            </Reveal>
            <TallyEmbed formId={b.formId} title={b.title} />
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}
