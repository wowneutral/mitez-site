import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's "Get Involved" section.
const CARDS = [
  {
    title: 'Learn something',
    copy: 'Tell us what you are trying to figure out and we will find someone who knows it. No cost, no age limit, no wrong subject.',
    cta: 'Ask for help',
    href: 'mailto:hello@mitez.org?subject=I%20want%20to%20learn%20something',
  },
  {
    title: 'Teach something',
    copy: 'If you know a skill well enough to walk someone through it, that is enough. Mentor once or regularly.',
    cta: 'Become a mentor',
    href: 'mailto:hello@mitez.org?subject=I%20want%20to%20mentor',
  },
  {
    title: 'Schools, libraries & organizations',
    copy: 'Host a workshop, refer people to us, or get free help with your website and materials.',
    cta: 'Partner with us',
    href: 'mailto:hello@mitez.org?subject=Partnership',
  },
  {
    title: 'Donors & sponsors',
    copy: 'Fund the infrastructure that keeps every one of these free for the people using them.',
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
