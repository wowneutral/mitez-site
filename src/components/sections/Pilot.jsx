import { motion } from 'motion/react';
import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy + real figures from the live static site's Pilot ("Gainesville
// — Launch Moment") section.
const DATA = [
  { label: 'Status', value: 'Preparing' },
  { label: 'Based In', value: 'Gainesville, Florida' },
  { label: 'Open To', value: 'Students, Adults & Organizations' },
  { label: 'Subjects', value: 'No Fixed List' },
  { label: 'Network', value: 'Schools, Libraries & Local Partners' },
];

export default function Pilot() {
  return (
    <section className="pilot" id="pilot">
      <div className="pilot-bg" aria-hidden="true">GAINESVILLE</div>
      <div className="pilot-meta pilot-meta-left">GAINESVILLE, FLORIDA<br />29.6516° N, 82.3248° W</div>
      <div className="pilot-meta pilot-meta-right">LOCAL PILOT<br />BUILT TO SCALE</div>
      <div className="wrap pilot-inner">
        <p className="section-label pilot-label">The Pilot</p>
        <TextAnimate as="h2" by="line" animation="slideDown" duration={0.8} className="pilot-title">
          {'Rooted in Gainesville.\nOpen to anyone who asks.'}
        </TextAnimate>
        {/* Ethos section: this is where the site earns belief by being
            specific — a real city, real partners, in person. Kept short
            so the specifics carry it rather than the adjectives. */}
        <p className="lede pilot-lede">
          Close enough to show up in person. Where we started, not where we stop.
        </p>
        <div className="pilot-data">
          {DATA.map((d, i) => (
            <Reveal as="div" variant="up" delay={i * 0.08} key={d.label} className="pilot-datum">
              <span>{d.label}</span>
              {d.value}
            </Reveal>
          ))}
        </div>
        <div className="pilot-readiness">
          <span>Launch Readiness</span>
          <div className="readiness-track">
            <motion.div
              className="readiness-fill"
              initial={{ width: '0%' }}
              whileInView={{ width: '62%' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
