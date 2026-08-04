import RiseText from './RiseText.jsx';
import Parallax from './Parallax.jsx';
import { TextAnimate } from './magicui/text-animate.jsx';

// Shared header for interior pages so every page opens with identical
// rhythm and spacing — one of the clearest signals of an intentional
// design system versus components assembled per page.
//
// The whole block drifts as it scrolls away. The amount is deliberately
// tiny, around six pixels across a full pass, and is meant to be felt
// rather than noticed: a header that separates from the content below it
// by a few pixels gives the page a sense of layers instead of one flat
// plane. Parallax you can actually see is a 2013 template.
export default function PageHeader({ eyebrow, title, lede }) {
  return (
    <header className="page-head">
      <div className="wrap">
        <Parallax speed={0.06}>
          {eyebrow && <p className="section-label">{eyebrow}</p>}
          <RiseText as="h1" className="page-title">
            {title}
          </RiseText>
          {lede && (
            <TextAnimate as="p" className="lede" by="line" animation="fadeIn" duration={0.6} delay={0.25}>
              {lede}
            </TextAnimate>
          )}
        </Parallax>
      </div>
    </header>
  );
}
