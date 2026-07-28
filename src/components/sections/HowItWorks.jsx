import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's "How It Works" section.
const STEPS = [
  {
    num: '01',
    title: 'Tell us what you want to learn',
    copy: 'A subject, a skill, a project, or a problem. Anything counts.',
  },
  {
    num: '02',
    title: 'Connect',
    copy: 'We match you with someone who already knows it — a person, not a chatbot.',
  },
  {
    num: '03',
    title: 'Work through it together',
    copy: 'Sessions focus on your next step, not a generic curriculum.',
  },
  {
    num: '04',
    title: 'Keep going',
    copy: 'Come once, or stay for the whole thing. Either way it stays free.',
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

  return (
    <section className="section how" id="how-it-works" ref={sectionRef}>
      <div className="wrap how-grid">
        <div className="how-left">
          <p className="section-label">The Process</p>
          <TextAnimate as="h2" by="word" animation="slideLeft" duration={0.7}>
            A clearer path from stuck to supported.
          </TextAnimate>
          <div className="how-progress-track">
            <motion.div className="how-progress-fill" style={{ height: lineHeight }} />
          </div>
        </div>
        <div className="how-rows">
          {STEPS.map((step, i) => (
            <Reveal as="div" variant="right" delay={i * 0.1} key={step.num} className="how-row">
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
