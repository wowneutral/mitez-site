import SEO from './SEO.jsx';
import PageHeader from './PageHeader.jsx';
import Footer from './Footer.jsx';

/**
 * Shared shell for the two legal documents.
 *
 * They are numbered-clause documents rather than marketing pages, so they
 * deliberately skip the scroll-reveal animation used everywhere else: a
 * clause that fades in as you scroll is harder to scan, and someone reading
 * terms is scanning. Content is passed as an array of sections so both pages
 * share one structure and one set of styles.
 */
export default function LegalDoc({ path, eyebrow, title, lede, updated, sections }) {
  return (
    <main className="page">
      <SEO path={path} />
      <PageHeader eyebrow={eyebrow} title={title} lede={lede} />

      <section className="section">
        <div className="wrap legal">
          <p className="legal-updated">Last updated: {updated}</p>

          <nav className="legal-toc" aria-label="Contents">
            <p className="section-label">Contents</p>
            <ol>
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#s${i + 1}`}>{s.h}</a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s, i) => (
            <section className="legal-sec" id={`s${i + 1}`} key={s.h}>
              <h2>
                <span className="legal-num">{i + 1}.</span> {s.h}
              </h2>
              {s.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j}>
                    {b.map((li, k) => (
                      <li key={k}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j}>{b}</p>
                ),
              )}
            </section>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
