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
          <p>
            We started in one city with one promise: whatever you are trying to
            learn, make it easier to find someone who will help you do it.
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
