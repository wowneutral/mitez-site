import { TextAnimate } from '../magicui/text-animate.jsx';
import Reveal from '../Reveal.jsx';

// Real copy from the live static site's Problem ("The Gap") and Solution
// ("The Response") sections — carried over, not newly generated.
const PROBLEMS = [
  {
    title: 'Scattered.',
    copy: 'One tool for this, another for that, a stranger for the rest. Nothing connects.',
  },
  {
    title: 'Who you know.',
    copy: 'Finding someone who actually knows the thing comes down to luck, not a system.',
  },
  {
    title: 'Priced out.',
    copy: 'Most real help sits behind a cost that rules out the people who need it most.',
  },
];

const SOLUTIONS = [
  {
    num: '01',
    title: 'Mentorship for any skill',
    copy: 'Work through it with someone who already knows how.',
    href: '#how-it-works',
  },
  {
    num: '02',
    title: 'Support for those who teach and lead',
    copy: 'Hands-on help for educators and organizations doing the work.',
    href: '#who-we-serve',
  },
  {
    num: '03',
    title: 'Resources in your community',
    copy: 'Help that shows up where people already are.',
    href: '#get-involved',
  },
];

export default function ProblemSolution() {
  return (
    <>
      <section className="section problem">
        <div className="wrap problem-grid">
          <div className="problem-left">
            <p className="section-label">The Gap</p>
            <TextAnimate as="h2" by="word" animation="fadeIn" duration={0.7}>
              Wanting to learn is easy. Finding someone to teach you is not.
            </TextAnimate>
            <p className="lede">
              Most people quit a skill long before they lose interest — they quit
              because the help was scattered, costly, or locked behind knowing the
              right person.
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
            <TextAnimate as="h2" by="word" animation="slideUp" duration={0.7}>
              One place, whatever you came to learn.
            </TextAnimate>
            <p className="lede">
              MITEZ is being built as a single point of contact for learning and
              mentorship — instead of assembling your own out of strangers,
              subscriptions, and search results.
            </p>
          </div>
          <div className="sol-cards">
            {SOLUTIONS.map((s, i) => (
              <Reveal as="a" variant="up" delay={i * 0.12} key={s.num} className="sol-card" href={s.href}>
                <span className="sol-num" aria-hidden="true">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
                <span className="sol-arrow">&rarr;</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
