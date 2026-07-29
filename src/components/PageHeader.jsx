import { TextAnimate } from './magicui/text-animate.jsx';

// Shared header for interior pages so every page opens with identical
// rhythm and spacing — one of the clearest signals of an intentional
// design system versus components assembled per page.
export default function PageHeader({ eyebrow, title, lede }) {
  return (
    <header className="page-head">
      <div className="wrap">
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <TextAnimate as="h1" by="word" animation="slideUp" duration={0.7} className="page-title">
          {title}
        </TextAnimate>
        {lede && (
          <TextAnimate as="p" className="lede" by="line" animation="fadeIn" duration={0.6} delay={0.25}>
            {lede}
          </TextAnimate>
        )}
      </div>
    </header>
  );
}
