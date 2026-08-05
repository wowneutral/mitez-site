import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

/**
 * Contact.
 *
 * THE ONLY PAGE WHERE A VISITOR DOES SOMETHING. Every other page on this
 * site is read; this one is used. That makes it the page where polish is
 * least decorative and most likely to change whether someone actually
 * gets help — and it was, until this pass, the plainest page here: a
 * heading, a default form, and three lines of text, on a site whose
 * homepage has an intro sequence and a 3D hero.
 *
 * The gap mattered more than another homepage effect would have.
 * Somebody arriving on this page from a shared link had no way of
 * knowing the rest of the site was considered, and the moment they were
 * being asked for effort was the moment the site stopped making any.
 */
const ASIDE = [
  { k: 'Email', v: null },
  { k: 'Where we are', v: 'Gainesville, Florida' },
  { k: 'Response time', v: 'Usually within a few days.' },
];

export default function Contact() {
  return (
    <main className="page" id="main">
      <SEO
        title="Contact"
        description="Questions, ideas, or something you want to learn, get in touch with MITEZ. We read everything and usually reply within a few days."
        path="/contact"
      />
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        lede="Questions, ideas, or something you want to learn. We read everything."
      />

      <section className="section">
        <div className="wrap contact-grid">
          {/* The form arrives from the left and the details from the
              right, a beat later. Not decoration: it puts the thing you
              came to do on screen first and lets the reference
              information settle in behind it, rather than presenting
              both at once and making you choose. */}
          <Reveal variant="left" amount={0.15}>
            <ContactForm />
          </Reveal>

          <aside className="contact-aside">
            {ASIDE.map((row, i) => (
              <Reveal
                as="div"
                variant="right"
                delay={0.12 + i * 0.08}
                amount={0.4}
                key={row.k}
                className="contact-block"
              >
                <h3>{row.k}</h3>
                <p>
                  {row.v ?? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}
                </p>
              </Reveal>
            ))}
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
