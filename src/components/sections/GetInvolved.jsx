import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's "Get Involved" section.
const CARDS = [
  {
    title: 'Learn something',
    copy: 'Tell us what you are stuck on. No cost, no age limit, no wrong subject.',
    cta: 'Ask for help',
    href: 'mailto:hello@mitez.org?subject=I%20want%20to%20learn%20something',
  },
  {
    title: 'Teach something',
    copy: 'Know a skill well enough to walk someone through it? That is enough.',
    cta: 'Become a mentor',
    href: 'mailto:hello@mitez.org?subject=I%20want%20to%20mentor',
  },
  {
    title: 'Schools, libraries & organizations',
    copy: 'Host a workshop, send people our way, or get free help with your site.',
    cta: 'Partner with us',
    href: 'mailto:hello@mitez.org?subject=Partnership',
  },
  {
    title: 'Donors & sponsors',
    copy: 'Keep every part of this free for the people using it.',
    cta: 'Support the work',
    href: 'mailto:hello@mitez.org?subject=Supporting%20MITEZ',
  },
];

export default function GetInvolved() {
  return (
    <section className="section involved" id="get-involved">
      <div className="wrap">
        <p className="section-label">Get Involved</p>
        <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
          Come learn, come teach, or help us reach more people.
        </TextAnimate>
        <div className="involved-grid">
          {CARDS.map((c, i) => (
            <Reveal
              as="a"
              variant={i % 2 === 0 ? 'left' : 'right'}
              delay={i * 0.1}
              key={c.title}
              className="involved-card"
              href={c.href}
            >
              <div>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
              </div>
              <span className="involved-cta">
                {c.cta} <span>&rarr;</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
