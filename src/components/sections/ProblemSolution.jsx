import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's Problem ("The Gap") and Solution
// ("The Response") sections — carried over, not newly generated.
const PROBLEMS = [
  {
    title: 'Scattered.',
    copy: 'A tool here, a video there, a stranger for the rest. Nothing connects.',
  },
  {
    title: 'Luck, not a system.',
    copy: 'Whether you find someone who actually knows the thing is chance.',
  },
  {
    title: 'Priced out.',
    copy: 'Real help sits behind a cost that rules out the people who need it most.',
  },
];

// These are explanatory, not navigational — so they are no longer links.
//
// They used to jump to #how-it-works, #who-we-serve and #get-involved.
// After Get Involved moved up the page, cards 01/02/03 pointed at the
// 5th, 4th and 3rd sections respectively: clicking them in order sent you
// UP the page each time. Repointing them would have kept the other
// problem — every click pushed another entry into browser history, so
// getting back to where you were reading took several presses of Back.
// The action people actually want is the Get Involved block immediately
// below this one.
const SOLUTIONS = [
  {
    num: '01',
    title: 'Mentorship for any skill',
    copy: 'Work through it with someone who already knows how.',
  },
  {
    num: '02',
    title: 'Support for those who teach and lead',
    copy: 'Hands-on help for educators and organizations doing the work.',
  },
  {
    num: '03',
    title: 'Resources in your community',
    copy: 'Help that shows up where people already are.',
  },
];

export default function ProblemSolution() {
  return (
    <>
      <section className="section problem">
        <div className="wrap problem-grid">
          <div className="problem-left">
            <p className="section-label">The Gap</p>
            <TextAnimate as="h2" by="word" animation="slideRight" duration={0.7}>
              Wanting to learn is easy. Finding someone to teach you is not.
            </TextAnimate>
            {/* Shortened, and the "knowing the right person" clause cut —
                that was the third appearance of the same idea on one
                page. The three cards to the right already make the point
                concretely; the lede does not need to pre-summarise them. */}
            <p className="lede">
              Most people quit long before they stop caring.
            </p>
          </div>
          <div className="problem-list">
            {PROBLEMS.map((p, i) => (
              <Reveal as="div" variant="right" delay={i * 0.15} key={p.title} className="problem-item">
                <h3>{p.title}</h3>
                <p>{p.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section solution">
        <div className="wrap">
          <div className="solution-head">
            <p className="section-label">The Response</p>
            {/* "One place…" belongs here and only here — the homepage
                intro used to open with the same sentence. */}
            <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
              One place, whatever you came to learn.
            </TextAnimate>
            <p className="lede">
              One point of contact instead of ten.
            </p>
          </div>
          <div className="sol-cards">
            {SOLUTIONS.map((s, i) => (
              <Reveal as="div" variant="up" delay={i * 0.12} key={s.num} className="sol-card">
                <span className="sol-num" aria-hidden="true">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
