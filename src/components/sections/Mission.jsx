import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy, carried over from the live static site's Mission section
// (index.html) — not newly generated.
export default function Mission() {
  return (
    <section className="mission" id="mission">
      <span className="mission-word" aria-hidden="true">ACCESS</span>
      <div className="wrap mission-inner">
        <TextAnimate
          as="h2"
          className="mission-kinetic"
          by="line"
          animation="slideUp"
          duration={0.7}
        >
          {/* Was "…never depends on who you already know" — the same
              point the Founder's Note quote makes at the bottom of the
              page, and the Problem lede made in between. That idea now
              appears once, in the founder quote, where it carries more
              weight coming from a person. This section does the job
              nothing else was doing: saying plainly what MITEZ is. */}
          {'Make It Easy means exactly that.\nYou ask. We find someone who knows.\nIt costs nothing.'}
        </TextAnimate>
        <Reveal variant="scale" className="mission-rule" delay={0.5} duration={0.9} />
      </div>
    </section>
  );
}
