import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// SPACE — the original acronym, kept. Copy widened past tutoring so each
// row covers any skill rather than only coursework, but deliberately left
// short and without example lists (naming subjects makes the offering read
// as limited to them).
const ROWS = [
  {
    letter: 'S',
    role: 'Students',
    copy: 'A first place to ask about anything — coursework or otherwise — without needing to be loud or already confident.',
  },
  {
    letter: 'P',
    role: 'Parents',
    copy: 'A clearer route to real help for your family, without the cost or the waitlist.',
  },
  {
    letter: 'A',
    role: 'Adults',
    copy: 'The skills nobody sat you down and taught. Learn them now, from someone who knows them.',
  },
  {
    letter: 'C',
    role: 'Communities',
    copy: 'Workshops, resources, and support brought to the places people already gather.',
  },
  {
    letter: 'E',
    role: 'Educators & organizations',
    copy: 'Extra capacity, materials, and hands-on help for the people doing the teaching and leading.',
  },
];

export default function WhoWeServe() {
  return (
    <section className="section who" id="who-we-serve">
      <div className="wrap">
        <p className="section-label">Who MITEZ Serves</p>
        <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
          Anyone with something they want to learn — or teach.
        </TextAnimate>
        <div className="who-list">
          {ROWS.map((row, i) => (
            <Reveal as="div" variant="left" delay={i * 0.08} key={row.letter} className="who-row">
              <span className="who-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="who-letter" aria-hidden="true">{row.letter}</span>
              <span className="role">{row.role}</span>
              <p>{row.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
