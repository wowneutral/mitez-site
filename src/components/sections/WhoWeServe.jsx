import Reveal from '../Reveal.jsx';
import RiseText from '../RiseText.jsx';

// SPACE — the original acronym, kept. Copy widened past tutoring so each
// row covers any skill rather than only coursework, but deliberately left
// short and without example lists (naming subjects makes the offering read
// as limited to them).
// Copy deliberately trimmed to one short line each. As a five-row list
// this is scanned, not read — long sentences here were a large part of
// the "lots of words" problem.
const ROWS = [
  {
    letter: 'S',
    role: 'Students',
    copy: 'Somewhere to ask, without having to be confident first.',
  },
  {
    letter: 'P',
    role: 'Parents',
    copy: 'Real help for your family. No cost, no waitlist.',
  },
  {
    letter: 'A',
    role: 'Advisors',
    copy: 'Experienced voices who mentor, shape the model, and keep it grounded.',
  },
  {
    letter: 'C',
    role: 'Communities',
    copy: 'Support your community can reach, wherever people already are.',
  },
  {
    letter: 'E',
    role: 'Educators & organizations',
    copy: 'Extra hands for the people already doing the work.',
  },
];

export default function WhoWeServe() {
  return (
    <section className="section who" id="who-we-serve">
      <div className="wrap">
        <p className="section-label">Who MITEZ Serves</p>
        <RiseText as="h2">Anyone with something they want to learn, or teach.</RiseText>
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
