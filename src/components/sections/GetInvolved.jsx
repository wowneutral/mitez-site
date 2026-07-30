import { Link } from 'react-router-dom';
import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Each card deep-links to its own form on /get-involved.
//
// Two problems fixed at once. These were mailto: links, which is why
// testers reported that none of the buttons here worked — a mailto: only
// does anything if the visitor's device has a mail client configured as
// the handler, so on a desktop browser signed into webmail, clicking one
// is silently ignored. And the /get-involved page used to repeat these
// same four cards, which testers also flagged. Now this section
// summarises, and the page is where you actually fill something in.
const CARDS = [
  {
    title: 'Learn something',
    copy: 'Tell us what you are stuck on. No cost, no age limit, no wrong subject.',
    cta: 'Ask for help',
    to: '/get-involved#learn',
  },
  {
    title: 'Teach something',
    copy: 'Know a skill well enough to walk someone through it? That is enough.',
    cta: 'Become a mentor',
    to: '/get-involved#mentor',
  },
  {
    title: 'Schools, libraries & organizations',
    copy: 'Host a workshop, send people our way, or get free help with your site.',
    cta: 'Partner with us',
    to: '/get-involved#partner',
  },
  {
    title: 'Donors & sponsors',
    copy: 'Keep every part of this free for the people using it.',
    cta: 'Support the work',
    to: '/get-involved#donate',
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
              as="div"
              variant={i % 2 === 0 ? 'left' : 'right'}
              delay={i * 0.1}
              key={c.title}
            >
              <Link className="involved-card" to={c.to}>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                </div>
                <span className="involved-cta">
                  {c.cta} <span>&rarr;</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
