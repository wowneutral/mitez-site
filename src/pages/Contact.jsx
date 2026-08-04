import SEO from '../components/SEO.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

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
          <ContactForm />

          <aside className="contact-aside">
            <div className="contact-block">
              <h3>Email</h3>
              <p>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
            <div className="contact-block">
              <h3>Where we are</h3>
              <p>Gainesville, Florida</p>
            </div>
            <div className="contact-block">
              <h3>Response time</h3>
              <p>Usually within a few days.</p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
