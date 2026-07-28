import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's final CTA section.
export default function FinalCta() {
  return (
    <section className="final">
      <div className="final-bg" aria-hidden="true">
        <span className="final-word">MOMENTUM</span>
      </div>
      <div className="wrap final-inner">
        <TextAnimate as="h2" by="line" animation="scaleUp" duration={0.7} className="final-title">
          {'Everyone is one conversation away\nfrom the thing they gave up on.'}
        </TextAnimate>
        <p className="lede">
          Learn something, teach something, bring us to your community, or help
          keep it free.
        </p>
        <Reveal as="div" variant="up" delay={0.2} className="final-actions">
          <a className="btn btn-primary" href="#get-involved">Learn Something</a>
          <a className="btn btn-ghost" href="#get-involved">Become a Mentor</a>
          <a className="btn btn-ghost" href="#get-involved">Partner With Us</a>
          <a className="btn btn-ghost" href="mailto:hello@mitez.org">Contact MITEZ</a>
        </Reveal>
        <p className="final-signature">Gainesville, Florida — 2026</p>
        <div className="final-divider" />
        <p className="final-tagline">Free. No limit on what counts as learning.</p>
      </div>
    </section>
  );
}
