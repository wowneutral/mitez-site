import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import RiseText from '../RiseText.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's "How It Works" section.
const STEPS = [
  {
    num: '01',
    title: 'Tell us what you want to learn',
    copy: 'A subject, a skill, a project, a problem. Anything counts.',
  },
  {
    num: '02',
    title: 'Connect',
    copy: 'A person who already knows it. Not a chatbot.',
  },
  {
    num: '03',
    title: 'Work through it together',
    copy: 'Your next step, not a generic curriculum.',
  },
  {
    num: '04',
    title: 'Keep going',
    copy: 'Once, or for as long as you want. Still free.',
  },
];

// Signature "epic" scroll animation for this section: a vertical progress
// line that physically draws itself as you scroll through the four steps,
// tied directly to scroll position (not a timer) via useScroll's target +
// offset tracking against this section specifically.
export default function HowItWorks() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // The progress line already tracked scroll, but the steps beside it did
  // not: all four sat at full strength the whole way down, so the line
  // was measuring a journey nothing else acknowledged. Now the same
  // scroll value picks which step is current, and the others recede.
  // This is the "information gets revealed as you go" feel — the section
  // is paced by the reader rather than delivered all at once.
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(Math.floor(p * STEPS.length), STEPS.length - 1);
    setActive(next < 0 ? 0 : next);
  });

  return (
    <section className="section how" id="how-it-works" ref={sectionRef}>
      <div className="wrap how-grid">
        <div className="how-left">
          <p className="section-label">The Process</p>
          <RiseText as="h2">A clearer path from stuck to supported.</RiseText>
          <div className="how-progress-track">
            <motion.div className="how-progress-fill" style={{ height: lineHeight }} />
          </div>
        </div>
        <div className="how-rows">
          {STEPS.map((step, i) => (
            <Reveal
              as="div"
              variant="right"
              delay={i * 0.1}
              key={step.num}
              className={`how-row${i === active ? ' is-current' : ''}`}
            >
              <span className="num" aria-hidden="true">{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
