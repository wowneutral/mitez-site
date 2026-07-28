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
          {'Make It Easy exists so that learning\nsomething new never depends on\nwho you already know.'}
        </TextAnimate>
        <Reveal variant="scale" className="mission-rule" delay={0.5} duration={0.9} />
      </div>
    </section>
  );
}
