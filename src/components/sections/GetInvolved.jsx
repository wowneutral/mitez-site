import Reveal from '../Reveal.jsx';
import { TALLY } from '../../config/forms.js';
import RiseText from '../RiseText.jsx';

// Each card opens its Tally form directly — one click from the homepage
// to the thing you actually fill in, no intermediate page.
//
// These used to be mailto: links, which is why testers reported that none
// of the buttons in this section worked: a mailto: only does anything if
// the visitor's device has a mail client registered as the handler, so on
// a desktop browser signed into webmail, clicking one is silently
// ignored. No error, no feedback, nothing — on the site's main call to
// action.
//
// The /get-involved page is no longer a duplicate of this section: it now
// embeds the forms inline rather than repeating these four cards, so the
// two serve different purposes even though both reach the same forms.
const CARDS = [
  {
    title: 'Learn something',
    copy: 'Tell us what you are stuck on. No cost, no age limit, no wrong subject.',
    cta: 'Ask for help',
    href: `https://tally.so/r/${TALLY.learn}`,
  },
  {
    title: 'Teach something',
    copy: 'Know a skill well enough to walk someone through it? That is enough.',
    cta: 'Become a mentor',
    href: `https://tally.so/r/${TALLY.mentor}`,
  },
  {
    title: 'Schools, libraries & organizations',
    copy: 'Send people our way, or get free help with your site and materials.',
    cta: 'Partner with us',
    href: `https://tally.so/r/${TALLY.partner}`,
  },
  {
    title: 'Donors & sponsors',
    copy: 'Keep every part of this free for the people using it.',
    cta: 'Support the work',
    href: `https://tally.so/r/${TALLY.donate}`,
  },
];

export default function GetInvolved() {
  return (
    <section className="section involved" id="get-involved">
      <div className="wrap">
        <p className="section-label">Get Involved</p>
        <RiseText as="h2">Come learn, come teach, or help us reach more people.</RiseText>
        <div className="involved-grid involved-preview">
          {CARDS.map((c, i) => (
            <Reveal
              as="a"
              variant={i % 2 === 0 ? 'left' : 'right'}
              delay={i * 0.1}
              key={c.title}
              className="involved-card"
              href={c.href}
              target="_blank"
              rel="noreferrer"
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
