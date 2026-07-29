import Reveal from '../Reveal.jsx';

// Real quote, carried over from the live static site's "Founder's Notebook"
// section.
export default function FounderNote() {
  return (
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
          {/* This quote is now the ONLY place on the homepage that makes
              the "shouldn't depend on who you know" argument — it used to
              also appear in the Mission section and the Problem lede.
              Left here because it lands hardest attributed to a person. */}
          <p>
            One city, one promise: make it easier to find someone who will help.
          </p>
          <div className="founder-sign">
            Founder, MITEZ
            <span>Armaan Seth</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
