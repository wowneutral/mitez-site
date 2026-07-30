import { Link } from 'react-router-dom';
import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';
import { TALLY } from '../../config/forms.js';

// Real copy from the live static site's final CTA section.
export default function FinalCta() {
  return (
    <section className="final">
      <div className="final-bg" aria-hidden="true">
        <span className="final-word">MOMENTUM</span>
      </div>
      <div className="wrap final-inner">
        {/* Was scaleUp, which sprang past its target and bounced. The
            closing line of the page should land, not wobble. */}
        <TextAnimate as="h2" by="line" animation="fadeIn" duration={0.8} className="final-title">
          {'Everyone is one conversation away\nfrom the thing they gave up on.'}
        </TextAnimate>
        <p className="lede">
          Learn something, teach something, bring us to your community, or help
          keep it free.
        </p>
        {/* Each button now goes somewhere different and real.
            Three of these pointed at the same #get-involved anchor — and
            since Get Involved moved above this section, clicking any of
            them scrolled the visitor back UP the page they had just
            finished reading. The fourth was a mailto:, which does nothing
            at all on a machine with no mail client configured. */}
        <Reveal as="div" variant="up" delay={0.2} className="final-actions">
          <a className="btn btn-primary" href={`https://tally.so/r/${TALLY.learn}`} target="_blank" rel="noreferrer">Learn Something</a>
          <a className="btn btn-ghost" href={`https://tally.so/r/${TALLY.mentor}`} target="_blank" rel="noreferrer">Become a Mentor</a>
          <a className="btn btn-ghost" href={`https://tally.so/r/${TALLY.partner}`} target="_blank" rel="noreferrer">Partner With Us</a>
          <Link className="btn btn-ghost" to="/contact">Contact MITEZ</Link>
        </Reveal>
        <p className="final-signature">Gainesville, Florida — 2026</p>
        <div className="final-divider" />
        <p className="final-tagline">Free. No limit on what counts as learning.</p>
      </div>
    </section>
  );
}
